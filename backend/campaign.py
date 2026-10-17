import os
import re
import csv
import io
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

load_dotenv()

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
STATES = ["novo", "contactado", "avaliacao", "proposta", "cliente", "sem_resposta", "nao_convertido", "arquivado"]

router = APIRouter(prefix="/api")


def now():
    return datetime.now(timezone.utc)


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode("utf-8"), h.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": now() + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": now() + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_session_cookies(response: Response, user_id: str, email: str):
    response.set_cookie("access_token", create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", create_refresh_token(user_id), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


async def get_current_user(request: Request, db) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user or not user.get("active", True):
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


_admin_ready = {"flag": False}


async def ensure_admin(db):
    if _admin_ready["flag"]:
        return
    email = os.environ.get("ADMIN_EMAIL", "admin@mognuscompany.com").lower()
    pw = os.environ.get("ADMIN_PASSWORD", "Mognus#2026-Cozinhas")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "email": email, "password_hash": hash_password(pw), "name": "Administração",
            "role": "admin", "active": True, "created_at": now(),
        })
    elif not verify_password(pw, existing["password_hash"]):
        await db.users.update_one({"_id": existing["_id"]}, {"$set": {"password_hash": hash_password(pw)}})
    _admin_ready["flag"] = True


# ---------------- Public campaign endpoints ----------------

class LeadIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=6, max_length=30)
    email: str = Field(max_length=160)
    location: str = Field(default="", max_length=120)
    model: str = Field(default="", max_length=80)
    message: str = Field(default="", max_length=2000)
    language: str = Field(default="pt", max_length=5)
    consent: bool = False
    marketing: bool = False
    source: str = Field(default="", max_length=300)
    session_id: str = Field(default="", max_length=64)
    website: str = Field(default="", max_length=120)


class VisitIn(BaseModel):
    session_id: str = Field(max_length=64)
    language: str = Field(default="pt", max_length=5)
    utm_source: str = Field(default="", max_length=120)
    utm_medium: str = Field(default="", max_length=120)
    utm_campaign: str = Field(default="", max_length=120)
    referrer: str = Field(default="", max_length=300)


class ModelViewIn(BaseModel):
    model: str = Field(max_length=80)
    session_id: str = Field(default="", max_length=64)


@router.post("/campaign/lead")
async def create_lead(payload: LeadIn, request: Request):
    db = request.app.state.db
    if payload.website:
        return {"ok": True}
    if not EMAIL_RE.match(payload.email):
        raise HTTPException(status_code=422, detail="E-mail inválido")
    ip = client_ip(request)
    hour_ago = now() - timedelta(hours=1)
    if await db.campaign_leads.count_documents({"ip": ip, "created_at": {"$gte": hour_ago}}) >= 5:
        raise HTTPException(status_code=429, detail="Too many requests")
    doc = payload.model_dump()
    doc.pop("website")
    doc.update({"state": "novo", "notes": [], "ip": ip, "created_at": now()})
    await db.campaign_leads.insert_one(doc)
    return {"ok": True}


@router.post("/campaign/visit")
async def create_visit(payload: VisitIn, request: Request):
    db = request.app.state.db
    doc = payload.model_dump()
    doc.update({"created_at": now()})
    await db.campaign_visits.insert_one(doc)
    return {"ok": True}


@router.post("/campaign/model-view")
async def create_model_view(payload: ModelViewIn, request: Request):
    db = request.app.state.db
    doc = payload.model_dump()
    doc.update({"created_at": now()})
    await db.model_views.insert_one(doc)
    return {"ok": True}


# ---------------- Auth ----------------

class LoginIn(BaseModel):
    email: str
    password: str


@router.post("/auth/login")
async def login(payload: LoginIn, request: Request, response: Response):
    db = request.app.state.db
    await ensure_admin(db)
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email})
    identifier = f"{client_ip(request)}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until") and attempt["locked_until"] > now():
        raise HTTPException(status_code=429, detail="Conta temporariamente bloqueada. Tente mais tarde.")
    if not user or not verify_password(payload.password, user["password_hash"]):
        count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"count": count, "updated_at": now()}
        if count >= 5:
            update["locked_until"] = now() + timedelta(minutes=15)
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_session_cookies(response, str(user["_id"]), user["email"])
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "admin")}


@router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@router.get("/auth/me")
async def me(request: Request):
    return await get_current_user(request, request.app.state.db)


@router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await request.app.state.db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user or not user.get("active", True):
            raise HTTPException(status_code=401, detail="User not found")
        set_session_cookies(response, str(user["_id"]), user["email"])
        return {"ok": True}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class ForgotIn(BaseModel):
    email: str


@router.post("/auth/forgot-password")
async def forgot_password(payload: ForgotIn, request: Request):
    db = request.app.state.db
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_reset_tokens.insert_one({
            "token": token, "user_id": str(user["_id"]),
            "expires_at": now() + timedelta(hours=1), "used": False,
        })
        print(f"[AUTH] Reset link para {email}: /cozinha/admin/reset?token={token}")
    return {"ok": True}


class ResetIn(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


@router.post("/auth/reset-password")
async def reset_password(payload: ResetIn, request: Request):
    db = request.app.state.db
    doc = await db.password_reset_tokens.find_one({"token": payload.token, "used": False, "expires_at": {"$gt": now()}})
    if not doc:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")
    await db.users.update_one({"_id": ObjectId(doc["user_id"])}, {"$set": {"password_hash": hash_password(payload.new_password)}})
    await db.password_reset_tokens.update_one({"_id": doc["_id"]}, {"$set": {"used": True}})
    return {"ok": True}


# ---------------- Admin: leads / CRM ----------------

class LeadPatch(BaseModel):
    state: Optional[str] = None
    note: Optional[str] = None


@router.get("/admin/leads")
async def list_leads(request: Request, state: Optional[str] = None, model: Optional[str] = None,
                     lang: Optional[str] = None, q: Optional[str] = None):
    await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    query = {}
    if state:
        query["state"] = state
    if model:
        query["model"] = model
    if lang:
        query["language"] = lang
    if q:
        rx = {"$regex": re.escape(q), "$options": "i"}
        query["$or"] = [{"name": rx}, {"email": rx}, {"phone": rx}, {"location": rx}]
    docs = await db.campaign_leads.find(query).sort("created_at", -1).to_list(1000)
    for d in docs:
        d["_id"] = str(d["_id"])
        d.pop("ip", None)
    return docs


@router.patch("/admin/leads/{lead_id}")
async def patch_lead(lead_id: str, payload: LeadPatch, request: Request):
    user = await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    update = {}
    if payload.state:
        if payload.state not in STATES:
            raise HTTPException(status_code=422, detail="Estado inválido")
        update["state"] = payload.state
    if payload.note:
        update["notes"] = {
            "$push": {"notes": {"text": payload.note[:1000], "by": user.get("email", ""), "at": now()}}
        }
    if not update:
        raise HTTPException(status_code=422, detail="Nada para atualizar")
    set_doc = {k: v for k, v in update.items() if k != "notes"}
    if "notes" in update:
        await db.campaign_leads.update_one({"_id": ObjectId(lead_id)}, {"$push": update["notes"]})
    if set_doc:
        await db.campaign_leads.update_one({"_id": ObjectId(lead_id)}, {"$set": set_doc})
    return {"ok": True}


@router.get("/admin/leads/export")
async def export_leads(request: Request, state: Optional[str] = None):
    await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    query = {"state": state} if state else {}
    docs = await db.campaign_leads.find(query).sort("created_at", -1).to_list(2000)
    buffer = io.StringIO()
    writer = csv.writer(buffer, delimiter=";")
    writer.writerow(["Data", "Nome", "Telefone", "E-mail", "Localidade", "Modelo", "Idioma", "Estado", "Origem", "Mensagem", "Consentimento"])
    for d in docs:
        created = d.get("created_at")
        created = created.strftime("%Y-%m-%d %H:%M") if isinstance(created, datetime) else ""
        writer.writerow([created, d.get("name", ""), d.get("phone", ""), d.get("email", ""), d.get("location", ""),
                         d.get("model", ""), d.get("language", ""), d.get("state", ""), d.get("source", ""),
                         (d.get("message", "") or "").replace("\n", " "), "sim" if d.get("consent") else "não"])
    buffer.seek(0)
    return StreamingResponse(iter([buffer.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=mognus_leads.csv"})


# ---------------- Admin: metrics ----------------

@router.get("/admin/metrics")
async def metrics(request: Request, days: int = 14, model: Optional[str] = None,
                  lang: Optional[str] = None, source: Optional[str] = None):
    await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    since = now() - timedelta(days=days)

    visit_query = {"created_at": {"$gte": since}}
    if lang:
        visit_query["language"] = lang
    if source:
        visit_query["utm_source"] = source
    visits_total = await db.campaign_visits.count_documents(visit_query)
    visits_unique = len(await db.campaign_visits.distinct("session_id", visit_query))

    lead_query = {"created_at": {"$gte": since}}
    if model:
        lead_query["model"] = model
    if lang:
        lead_query["language"] = lang
    if source:
        lead_query["source"] = source
    leads_total = await db.campaign_leads.count_documents(lead_query)
    conversion = round(100 * leads_total / visits_total, 1) if visits_total else 0.0

    by_day = []
    for i in range(days - 1, -1, -1):
        day_start = (now() - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        day_visits = await db.campaign_visits.count_documents({**visit_query, "created_at": {"$gte": day_start, "$lt": day_end}})
        day_leads = await db.campaign_leads.count_documents({**lead_query, "created_at": {"$gte": day_start, "$lt": day_end}})
        by_day.append({"date": day_start.strftime("%d/%m"), "visits": day_visits, "leads": day_leads})

    views_pipeline = [{"$match": {"created_at": {"$gte": since}}}, {"$group": {"_id": "$model", "views": {"$sum": 1}}}]
    views_by_model = {doc["_id"]: doc["views"] async for doc in db.model_views.aggregate(views_pipeline)}
    leads_pipeline = [{"$match": lead_query}, {"$group": {"_id": "$model", "leads": {"$sum": 1}}}]
    leads_by_model = {doc["_id"]: doc["leads"] async for doc in db.campaign_leads.aggregate(leads_pipeline)}
    models = sorted(set(list(views_by_model.keys()) + list(leads_by_model.keys())))
    by_model = [{"model": m or "—", "views": views_by_model.get(m, 0), "leads": leads_by_model.get(m, 0)} for m in models]
    by_model.sort(key=lambda x: -(x["views"] + x["leads"]))

    by_state = [{"state": d["_id"] or "novo", "count": d["count"]} async for d in db.campaign_leads.aggregate([{"$match": lead_query}, {"$group": {"_id": "$state", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}])]
    by_source = [{"source": d["_id"] or "direto", "count": d["count"]} async for d in db.campaign_leads.aggregate([{"$match": lead_query}, {"$group": {"_id": "$source", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}])]
    langs_leads = {d["_id"] or "pt": d["count"] async for d in db.campaign_leads.aggregate([{"$match": lead_query}, {"$group": {"_id": "$language", "count": {"$sum": 1}}}])}

    return {
        "visits_total": visits_total, "visits_unique": visits_unique, "leads_total": leads_total,
        "conversion": conversion, "by_day": by_day, "by_model": by_model,
        "by_language": [{"lang": k, "count": v} for k, v in sorted(langs_leads.items(), key=lambda kv: -kv[1])],
        "by_state": by_state, "by_source": by_source,
    }


# ---------------- Admin: users ----------------

class UserIn(BaseModel):
    email: str
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=2, max_length=120)


@router.get("/admin/users")
async def list_users(request: Request):
    await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    docs = []
    async for d in db.users.find({}, {"password_hash": 0}).sort("created_at", 1):
        d["_id"] = str(d["_id"])
        docs.append(d)
    return docs


@router.post("/admin/users")
async def create_user(payload: UserIn, request: Request):
    await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    email = payload.email.strip().lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=422, detail="E-mail inválido")
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="E-mail já existe")
    await db.users.insert_one({"email": email, "password_hash": hash_password(payload.password),
                               "name": payload.name, "role": "admin", "active": True, "created_at": now()})
    return {"ok": True}


@router.delete("/admin/users/{user_id}")
async def revoke_user(user_id: str, request: Request):
    current = await get_current_user(request, request.app.state.db)
    db = request.app.state.db
    if current["id"] == user_id:
        raise HTTPException(status_code=422, detail="Não pode revogar a sua própria conta")
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"active": False}})
    return {"ok": True}

import json
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated, List, Optional

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, Field

load_dotenv()
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
SEED_FILE = Path(__file__).parent / "seed" / "products.json"


def to_str(v):
    return str(v) if isinstance(v, ObjectId) else v


PyObjectId = Annotated[str, BeforeValidator(to_str)]


class BaseDocument(BaseModel):
    model_config = {"populate_by_name": True}

    @classmethod
    def from_mongo(cls, doc):
        data = dict(doc)
        data["id"] = str(data.pop("_id", None))
        return cls(**data)


class Product(BaseDocument):
    id: Optional[PyObjectId] = None
    slug: str
    name: str
    subtitle: str = ""
    category: str
    category_key: str
    price_eur: float
    price_from: bool = False
    description: str = ""
    materials: List[str] = Field(default_factory=list)
    badge: Optional[str] = None
    image: str
    macro_image: Optional[str] = None
    order: int = 0


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(MONGO_URL)
    app.state.db = client[DB_NAME]
    await app.state.db.products.create_index("slug", unique=True)
    if await app.state.db.products.count_documents({}) == 0:
        products = json.loads(SEED_FILE.read_text(encoding="utf-8"))
        await app.state.db.products.insert_many(products)
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")


@router.get("/")
async def root():
    return {"message": "MOGNU'S — API online"}


@router.get("/products", response_model=List[Product])
async def list_products(collection: Optional[str] = Query(None)):
    query = {"category_key": collection} if collection else {}
    docs = await app.state.db.products.find(query).sort("order", 1).to_list(500)
    return [Product.from_mongo(d) for d in docs]


@router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await app.state.db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return Product.from_mongo(doc)


from campaign import router as campaign_router

app.include_router(router)
app.include_router(campaign_router)

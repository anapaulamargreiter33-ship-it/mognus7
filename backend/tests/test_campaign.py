"""Tests for MOGNU'S campaign backend (public lead endpoint + admin CRM)."""
import os
import time
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mognus-moveis.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@mognuscompany.com"
ADMIN_PASSWORD = "Mognus#2026-Cozinhas"

TEST_MARKER = f"TEST_{int(time.time())}"


# ---------------- Public campaign lead ----------------
def test_lead_create_with_marketing():
    payload = {
        "name": f"{TEST_MARKER} Rebuild",
        "email": f"test_{int(time.time())}@mognus.test",
        "phone": "+351912345678",
        "location": "Loulé",
        "model": "Natural",
        "message": "Teste reconstrução automatizado",
        "language": "pt",
        "consent": True,
        "marketing": True,
        "source": "test",
        "session_id": "s_pytest_rebuild",
    }
    r = requests.post(f"{BASE_URL}/api/campaign/lead", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    assert r.json().get("ok") is True


def test_lead_invalid_email():
    r = requests.post(f"{BASE_URL}/api/campaign/lead", json={
        "name": "Fulano", "email": "notanemail", "phone": "+351912345678",
        "consent": True,
    }, timeout=10)
    assert r.status_code == 422


def test_lead_honeypot_silently_ok():
    r = requests.post(f"{BASE_URL}/api/campaign/lead", json={
        "name": "Spam", "email": "spam@spam.com", "phone": "+351912345678",
        "consent": True, "website": "http://spam.com"
    }, timeout=10)
    assert r.status_code == 200


# ---------------- Admin auth + leads list ----------------
def _login():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=10)
    assert r.status_code == 200, r.text
    return s


def test_admin_login_and_me():
    s = _login()
    r = s.get(f"{BASE_URL}/api/auth/me", timeout=10)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_admin_login_wrong_password():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
    assert r.status_code in (401, 429)


def test_admin_leads_list_contains_marketing_lead():
    s = _login()
    # Submit a fresh lead to ensure present
    name = f"{TEST_MARKER} ListCheck"
    requests.post(f"{BASE_URL}/api/campaign/lead", json={
        "name": name, "email": f"listcheck_{int(time.time())}@mognus.test",
        "phone": "+351912345679", "location": "Loulé", "model": "Natural",
        "consent": True, "marketing": True, "language": "pt",
    }, timeout=10)
    r = s.get(f"{BASE_URL}/api/admin/leads", timeout=15)
    assert r.status_code == 200
    leads = r.json()
    assert isinstance(leads, list)
    match = [l for l in leads if l.get("name") == name]
    assert match, f"Lead {name} not found in list"
    lead = match[0]
    assert lead.get("state") == "novo"
    assert lead.get("marketing") is True
    # Mongo _id should be stringified, not include ObjectId raw
    assert isinstance(lead.get("_id"), str)
    # IP must not leak
    assert "ip" not in lead


def test_admin_leads_requires_auth():
    r = requests.get(f"{BASE_URL}/api/admin/leads", timeout=10)
    assert r.status_code == 401


def test_admin_metrics():
    s = _login()
    r = s.get(f"{BASE_URL}/api/admin/metrics", timeout=15)
    assert r.status_code == 200
    data = r.json()
    for k in ("visits_total", "leads_total", "conversion", "by_day", "by_model", "by_state"):
        assert k in data

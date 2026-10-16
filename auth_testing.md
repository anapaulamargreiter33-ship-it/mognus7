# Auth Testing Playbook — MOGNU'S Cozinhas (admin)

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, indexes exist on users.email (unique), login_attempts.identifier, password_reset_tokens.expires_at (TTL).

## Step 2: API Testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@mognuscompany.com","password":"Mognus#2026-Cozinhas"}'
cat cookies.txt
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login should return the user object and set `access_token` + `refresh_token` cookies. The `/me` call should return the same user using those cookies.

## Step 3: Campaign public endpoints
```
curl -X POST http://localhost:8001/api/campaign/visit -H "Content-Type: application/json" -d '{"session_id":"test-1","language":"pt","utm_source":"instagram"}'
curl -X POST http://localhost/api/campaign/model-view -H "Content-Type: application/json" -d '{"model":"Natural","session_id":"test-1"}'   # use localhost:8001
curl -X POST http://localhost:8001/api/campaign/lead -H "Content-Type: application/json" -d '{"name":"Teste Demo","phone":"+351900000000","email":"teste@exemplo.pt","location":"Loulé","model":"Natural","message":"Demo","language":"pt","consent":false,"source":"instagram","session_id":"test-1"}'
```

## Step 4: Admin CRM + metrics (with cookies)
```
curl -b cookies.txt http://localhost:8001/api/admin/leads
curl -b cookies.txt "http://localhost:8001/api/admin/metrics?days=14"
curl -b cookies.txt http://localhost:8001/api/admin/leads/export
```

## Step 5: Brute force
5 wrong passwords for the same IP:e-mail → 429 lockout for 15 minutes.

## Admin credentials (test)
See /app/memory/test_credentials.md — admin@mognuscompany.com / Mognus#2026-Cozinhas

# Local Test Checklist: Auth + Cloudflare R2 Upload

Use this checklist to verify the production auth fix and R2 upload flow in local development.

## 1) Prepare environment files

Create or update these files:

- apps/api/.env
- apps/web/.env.local

API env example:

```env
DATABASE_URL="postgresql://duongbo:duongbo_secret@localhost:5432/duongbo_db?schema=public"
JWT_SECRET="local_jwt_secret"
JWT_EXPIRES_IN="7d"

ADMIN_EMAIL="admin@duongbo.com"
ADMIN_PASSWORD="Admin@123456"

PORT=4000
APP_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"

R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket"
R2_PUBLIC_URL="https://your-public-domain.example.com"
```

Web env example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-public-domain.example.com
```

## 2) Install and boot dependencies

Run from repository root:

```bash
pnpm install
docker compose up -d --wait
pnpm db:generate
pnpm db:push
```

## 3) Verify idempotent seed behavior

Run this twice. Both runs must succeed.

```bash
pnpm --filter api exec prisma db seed
pnpm --filter api exec prisma db seed
```

Expected:

- No duplicate key error.
- Admin account is created on first run and safely updated on next runs.

## 4) Start API and Web

Open terminal 1:

```bash
pnpm --filter api dev
```

Open terminal 2:

```bash
pnpm --filter web dev
```

## 5) Test login endpoint directly (PowerShell)

```powershell
$body = @{ email = "admin@duongbo.com"; password = "Admin@123456" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/auth/login" -ContentType "application/json" -Body $body
```

Expected:

- Response contains access_token and user object.

## 6) Test upload/list/delete flow with provided script

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-media-upload.ps1 -ApiBaseUrl "http://localhost:4000" -FilePath "D:\path\to\sample.jpg"
```

Optional cleanup:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-media-upload.ps1 -ApiBaseUrl "http://localhost:4000" -FilePath "D:\path\to\sample.jpg" -DeleteAfterUpload
```

Expected:

- Upload succeeds.
- Returned media.url starts with your R2_PUBLIC_URL.
- GET /media includes uploaded item.

## 7) Quick CORS verification

Check API env:

- CORS_ORIGIN equals your web URL (for local: http://localhost:3000).

Browser verification:

- Open web app at http://localhost:3000.
- Perform login.
- If you can log in and call protected endpoints without CORS errors, CORS is correct.

## 8) Quick JWT verification

Check API env:

- JWT_SECRET is set and not empty.

Runtime verification:

- Login returns access_token.
- Use token on a protected endpoint (for example GET /media).
- Request succeeds with Authorization: Bearer <token>.

## 9) Common failure fixes

Login fails (401):

- Confirm ADMIN_EMAIL and ADMIN_PASSWORD values.
- Rerun seed: pnpm --filter api exec prisma db seed.

CORS error in browser:

- Ensure CORS_ORIGIN exactly matches web origin.
- Restart API after env changes.

Upload fails:

- Recheck all R2_* values.
- Confirm bucket exists and key has PutObject/DeleteObject permissions.

Prisma type/build errors:

- Run pnpm db:generate again.

## 10) Done criteria

Local test is complete when all are true:

- Login works with expected admin credentials.
- Running seed repeatedly does not fail.
- Media upload stores public R2 URL.
- Frontend can render uploaded image URL.

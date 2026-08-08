# Cloudflare R2 Image Upload Setup

This document explains how to run and test the new image upload flow after migrating from local uploads to Cloudflare R2.

## Summary of the migration

- Backend upload storage moved from local disk to Cloudflare R2 (S3-compatible).
- API now stores only public image URLs in PostgreSQL.
- Next.js image config now accepts R2 domains.
- Upload endpoint contract is unchanged:
  - POST /media/upload
  - GET /media
  - DELETE /media/:id

## Files changed

- apps/api/src/media/media.service.ts
- apps/api/src/media/media.module.ts
- apps/api/src/media/media.controller.ts
- apps/api/src/app.module.ts
- apps/api/src/main.ts
- apps/api/.env.example
- apps/web/next.config.ts
- scripts/test-media-upload.ps1

## Required environment variables

Set these in the API environment:

- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME
- R2_PUBLIC_URL

Example:

```env
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="duongbo-media"
R2_PUBLIC_URL="https://media.example.com"
```

Notes:

- R2_PUBLIC_URL should be the final public HTTPS base URL for objects.
- Trailing slashes are handled by the service, but prefer a clean URL without trailing slash.

## Next.js image domain configuration

The frontend now supports:

- *.r2.dev
- custom public domain from NEXT_PUBLIC_R2_PUBLIC_URL (or R2_PUBLIC_URL)

If using a custom CDN/domain, set in web environment:

```env
NEXT_PUBLIC_R2_PUBLIC_URL="https://media.example.com"
```

## Fresh machine setup checklist

Run from repo root:

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm --filter api dev
pnpm --filter web dev
```

If your database is not running yet, start it first (for example via docker compose).

## Smoke test upload flow (PowerShell)

A ready script is provided:

- scripts/test-media-upload.ps1

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-media-upload.ps1 -ApiBaseUrl "http://localhost:4000" -FilePath "D:\path\to\sample.jpg"
```

Optional cleanup (delete uploaded item after test):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-media-upload.ps1 -ApiBaseUrl "http://localhost:4000" -FilePath "D:\path\to\sample.jpg" -DeleteAfterUpload
```

Default login used by script:

- email: admin@duongbo.com
- password: Admin@123456

## Expected result

After upload:

- API returns a media record with a full HTTPS URL.
- URL starts with R2_PUBLIC_URL.
- Opening the URL in browser should return the file.
- Frontend Next Image should render the remote URL without host errors.

## Troubleshooting

### Error: Missing required environment variables

Cause:

- One or more R2 variables are not set.

Fix:

- Set all required R2 variables in API environment.
- Restart API server.

### Upload fails with BadRequestException

Cause:

- Invalid credentials, bucket mismatch, or invalid public URL.

Fix:

- Recheck R2_ACCOUNT_ID, keys, bucket name, and R2_PUBLIC_URL.
- Ensure access key has write permission for the bucket.

### Frontend image blocked by Next.js

Cause:

- Domain not included in remotePatterns or env missing.

Fix:

- Set NEXT_PUBLIC_R2_PUBLIC_URL.
- Restart Next.js server after env/config change.

### Build error related to PrismaClient

Cause:

- Prisma client not generated yet on that machine.

Fix:

```bash
pnpm db:generate
```

## Security notes

- Never expose R2_SECRET_ACCESS_KEY in frontend code.
- Keep R2 credentials only in backend environment variables.
- Keep media endpoints protected by JWT as currently implemented.

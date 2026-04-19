# Setup & Run Guide

Complete guide to set up, run, and develop the Đường Bộ Bình Định web application.

---

## Quick Start (New Machine)

If you just want to get everything running fast:

```bash
# 1. Install prerequisites: Node.js ≥ 20, pnpm ≥ 10.33, Docker Desktop
# 2. Clone the repo, then:

docker compose up -d          # Start PostgreSQL + pgAdmin
pnpm setup                    # Install deps, copy .env files, push DB schema
pnpm dev                      # Start API + Web dev servers
```

That's it. API runs at http://localhost:4000, Web at http://localhost:3000.

---

## Prerequisites

| Tool        | Version  | Required | Notes                              |
| ----------- | -------- | -------- | ---------------------------------- |
| Node.js     | ≥ 20     | ✅       | LTS recommended                    |
| pnpm        | ≥ 10.33  | ✅       | `npm install -g pnpm@10`          |
| Docker      | Latest   | ✅       | For running Postgres + pgAdmin     |
| Git         | Latest   | ✅       | Version control                    |

> **No need to install PostgreSQL natively** — Docker handles it.

---

## Step-by-Step Setup

### 1. Start the Database

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on port `5432` (user: `duongbo`, password: `duongbo_secret`, db: `duongbo_db`)
- **pgAdmin** on port `5050` (login: `admin@duongbo.com` / `admin`)

Wait until the health check passes (~5 seconds):

```bash
docker compose ps
```

You should see `duongbo_db` with status **healthy**.

> **⚠ If you previously ran Docker with different credentials**, the old volume retains old passwords.
> Fix: `docker compose down -v` then `docker compose up -d` (Warning: destroys existing data).

### 2. Run the Setup Script

From the project root:

```bash
pnpm setup
```

This automatically:
1. Copies `apps/api/.env.example` → `apps/api/.env` (if missing)
2. Copies `apps/web/.env.example` → `apps/web/.env.local` (if missing)
3. Runs `pnpm install` to install all dependencies
4. Generates the Prisma Client
5. Pushes the database schema to PostgreSQL

### 3. (Alternative) Manual Setup

If you prefer to do it step by step:

```bash
# Install dependencies
pnpm install

# Copy env files (skip if they already exist)
# On macOS/Linux:
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# On Windows (cmd):
# copy apps\api\.env.example apps\api\.env
# copy apps\web\.env.example apps\web\.env.local
# On Windows (PowerShell):
# Copy-Item apps/api/.env.example apps/api/.env
# Copy-Item apps/web/.env.example apps/web/.env.local

# Generate Prisma Client and push schema
cd apps/api
pnpm exec prisma generate
pnpm exec prisma db push
cd ../..
```

### 4. Environment Variables

#### Backend (`apps/api/.env`) — created from `.env.example`:

```env
DATABASE_URL="postgresql://duongbo:duongbo_secret@localhost:5432/duongbo_db?schema=public"
JWT_SECRET="duongbo_jwt_secret_change_in_production"
JWT_EXPIRES_IN="7d"
PORT=4000
APP_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=10485760
```

#### Frontend (`apps/web/.env.local`) — created from `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> These values match the Docker Compose defaults. Only change them if you modified `docker-compose.yml`.

---

## 5. Running the Application

### Development Mode (All Services)

From project root:

```bash
pnpm dev
```

This starts both API and web in parallel:
- **API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/api/docs
- **Web**: http://localhost:3000

### Run Services Individually

```bash
# API only (either works)
cd apps/api
pnpm dev
# or: pnpm start:dev

# Web only
cd apps/web
pnpm dev
```

### Production Build

```bash
# Build all
pnpm build

# Or individually
cd apps/api && pnpm build     # Outputs to dist/
cd apps/web && pnpm build     # Outputs to .next/
```

### Start Production

```bash
# API
cd apps/api && pnpm start:prod    # runs node dist/main

# Web
cd apps/web && pnpm start         # runs next start
```

---

## 6. First-Time Setup After Starting

### Admin Account (Auto-Seeded)

The API automatically creates an admin account on first startup:

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@duongbo.com`     |
| Password | `Admin@123456`          |
| Role     | `SUPER_ADMIN`           |

### Login via Swagger

1. Open http://localhost:4000/api/docs
2. Click `POST /auth/login` → Try it out
3. Enter: `{"email": "admin@duongbo.com", "password": "Admin@123456"}`
4. Copy the `access_token` from the response
5. Click the **Authorize** button (top right) → paste the token
6. Now you can use all protected endpoints

### Upload Content Workflow

1. **Upload images** via `POST /media/upload` (multipart form, field: `file`)
   - Returns `{url: "/uploads/uuid.ext"}`
2. **Create content** using the uploaded image URLs:
   - Banners → `POST /banners` with `{image: "/uploads/uuid.jpg", ...}`
   - News → `POST /news` with `{thumbnail: "/uploads/uuid.jpg", ...}`
   - Products → `POST /products` with `{images: ["/uploads/uuid.jpg"], ...}`
   - Projects → `POST /projects` with `{images: ["/uploads/uuid.jpg"], ...}`
   - Partners → `POST /partners` with `{logo: "/uploads/uuid.png", ...}`
   - Services → `POST /services` with `{image: "/uploads/uuid.jpg", ...}`

### Priority Content to Add

| Order | Module          | What to add                                                    |
| ----- | --------------- | -------------------------------------------------------------- |
| 1     | **Banners**     | Homepage slider images (image, titleVi/En, link, order)        |
| 2     | **Services**    | 4-6 core services with descriptions and images                 |
| 3     | **News Categories** | e.g. "Dự án", "Công trình", "Nội bộ", "Sự kiện"          |
| 4     | **News**        | Articles with title, content, thumbnail, category              |
| 5     | **Products**    | Products with title, description, images, category             |
| 6     | **Projects**    | Projects with title, description, location, status, images     |
| 7     | **Partners**    | Partner name + logo + optional website                         |
| 8     | **Jobs**        | Recruitment posts with requirements, location, deadline        |
| 9     | **Settings**    | Site-wide config (phone, email, slogan, etc.)                  |

---

## 7. Available Scripts

### Root (monorepo)

| Script           | Command               | Description                       |
| ---------------- | --------------------- | --------------------------------- |
| `pnpm setup`     | Setup script           | First-time setup (env, deps, DB) |
| `pnpm dev`       | Parallel dev servers   | Start API + Web simultaneously   |
| `pnpm build`     | Build all              | Build API + Web for production   |
| `pnpm lint`      | Lint all               | Run ESLint across all apps       |
| `pnpm format`    | Prettier               | Format all TS/JS/CSS/JSON/MD     |
| `pnpm db:push`   | Prisma DB push         | Sync schema → database           |
| `pnpm db:generate`| Prisma generate       | Regenerate Prisma Client         |
| `pnpm db:studio` | Prisma Studio          | Open Prisma Studio GUI           |
| `pnpm db:reset`  | Reset database          | Destroy volume + recreate + push |

### API (`apps/api`)

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Development mode with hot-reload     |
| `pnpm start:dev`    | Alias for dev                        |
| `pnpm start:debug`  | Debug mode with Node.js inspector    |
| `pnpm build`        | Compile TypeScript to `dist/`        |
| `pnpm start:prod`   | Run compiled production build        |
| `pnpm test`         | Run unit tests                       |
| `pnpm test:e2e`     | Run end-to-end tests                 |
| `pnpm lint`         | ESLint with auto-fix                 |

### Web (`apps/web`)

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `pnpm dev`      | Next.js dev server (port 3000)       |
| `pnpm build`    | Production build to `.next/`         |
| `pnpm start`    | Start production server              |
| `pnpm lint`     | ESLint check                         |

### Prisma (from `apps/api`)

| Command                            | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `pnpm exec prisma db push`              | Sync schema → database (no migrations)   |
| `pnpm exec prisma migrate dev --name x` | Create migration + apply                 |
| `pnpm exec prisma migrate deploy`       | Apply pending migrations (production)    |
| `pnpm exec prisma generate`             | Regenerate Prisma Client                 |
| `pnpm exec prisma studio`               | Open Prisma Studio GUI (port 5555)       |

---

## 8. Ports Reference

| Service      | Port | URL                                  |
| ------------ | ---- | ------------------------------------ |
| Web (Next.js)| 3000 | http://localhost:3000                |
| API (NestJS) | 4000 | http://localhost:4000                |
| Swagger Docs | 4000 | http://localhost:4000/api/docs       |
| PostgreSQL   | 5432 | `postgresql://localhost:5432`        |
| pgAdmin      | 5050 | http://localhost:5050                |
| Prisma Studio| 5555 | http://localhost:5555                |

---

## 9. Troubleshooting

### "Authentication failed" / P1000 error

This is the **most common issue** on first setup. It happens because PostgreSQL only sets the user/password when the Docker volume is first created. If you ever ran Docker with different credentials, the old password is baked into the volume.

**Quick fix (one command):**
```bash
pnpm db:reset
```

**Manual fix:**
```bash
docker compose down -v        # Remove volumes (⚠ destroys DB data!)
docker compose up -d          # Recreate with correct credentials
# Wait ~10 seconds for Postgres to start
pnpm db:push                  # Push schema again
```

**Other checks:**
- Verify `apps/api/.env` exists — it's gitignored and won't exist on a fresh clone. Run `pnpm setup` to create it from `.env.example`
- Verify `DATABASE_URL` in `apps/api/.env` matches the credentials in `docker-compose.yml`:
  - User: `duongbo`, Password: `duongbo_secret`, DB: `duongbo_db`

### "Cannot connect to database"
- Ensure Docker is running: `docker compose ps` should show `duongbo_db` as **healthy**
- Wait a few seconds after `docker compose up -d` for the health check to pass
- Verify `DATABASE_URL` in `apps/api/.env` matches your setup
- Test connection: `pnpm db:push`

### "CORS error" in browser
- Check `FRONTEND_URL` in `apps/api/.env` matches your web app URL
- Default: `http://localhost:3000`

### "Module not found" errors
- Run `pnpm install` from project root
- Run `pnpm db:generate` to regenerate Prisma Client

### API starts but pages show no data
- Frontend uses **mock data fallback** when API returns empty
- Add content via Swagger UI or admin panel
- Once real data exists, mocks are automatically bypassed

### Port already in use
- Check what's using the port: `netstat -ano | findstr :4000`
- Kill the process or change the port in `apps/api/.env`

### Prisma 7 Notes
- `datasource` block in `schema.prisma` has **no `url` property** (Prisma 7 change)
- Connection URL is configured in `prisma.config.ts` (reads from `DATABASE_URL` env var)
- `PrismaService` passes `datasourceUrl` via constructor

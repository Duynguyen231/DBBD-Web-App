# Đường Bộ Bình Định — Corporate Website

A bilingual (Vietnamese/English) corporate website for **Công ty CP Quản lý & Xây dựng Đường Bộ Bình Định** (Binh Dinh Road Management & Construction JSC), built as a **TypeScript monorepo** with pnpm workspaces.

---

## Tech Stack

| Layer    | Stack                                                         |
| -------- | ------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, next-intl, TanStack Query |
| Backend  | NestJS 11, Prisma 7, PostgreSQL 16, Passport JWT, Swagger    |
| Shared   | `@duongbo/types` package with shared interfaces/enums        |
| Infra    | Docker Compose (Postgres 16 + pgAdmin)                       |

---

## Monorepo Layout

| Path             | Purpose                  | Port |
| ---------------- | ------------------------ | ---- |
| `apps/api`       | NestJS REST API          | 4000 |
| `apps/web`       | Next.js frontend         | 3000 |
| `packages/types` | Shared TypeScript types  | —    |

---

## Backend API (`apps/api`)

13 feature modules following **Controller → Service → DTO** pattern:

| Module       | Public Endpoints                                    | Protected Endpoints          |
| ------------ | --------------------------------------------------- | ---------------------------- |
| **Auth**     | `POST /auth/login`                                  | `GET /auth/profile`          |
| **News**     | `GET /news`, `GET /news/:slug`, `GET /news/categories` | CRUD for news + categories |
| **Projects** | `GET /projects`, `GET /projects/:slug`              | CRUD                         |
| **Services** | `GET /services`                                     | CRUD                         |
| **Products** | `GET /products`, `GET /products/:slug`              | CRUD                         |
| **Jobs**     | `GET /jobs`, `GET /jobs/:slug`                      | CRUD                         |
| **Banners**  | `GET /banners`                                      | CRUD                         |
| **Partners** | `GET /partners`                                     | CRUD                         |
| **Contact**  | `POST /contact`                                     | `GET`, `DELETE`, mark as read |
| **Media**    | —                                                   | Upload, list, delete files   |
| **Settings** | `GET /settings`                                     | `POST /settings` (upsert)   |

### Key Architecture

- **Authentication**: JWT via Passport.js, bcryptjs password hashing, token expiry `7d`
- **Authorization**: `@Roles('ADMIN', 'SUPER_ADMIN')` decorator + `RolesGuard`
- **Validation**: Global `ValidationPipe` with whitelist/transform/forbidNonWhitelisted
- **File uploads**: Multer disk storage, UUID filenames, max 10MB, served from `/uploads`
- **Swagger docs**: `/api/docs` with Bearer auth scheme
- **Auto-seed**: Creates `admin@duongbo.com` / `Admin@123456` on first startup
- **Database**: 13+ Prisma models, all content models have bilingual Vi/En fields

---

## Frontend Web (`apps/web`)

### Public Site — locale-based routing via `[locale]` segment

| Route                              | Page                                          |
| ---------------------------------- | --------------------------------------------- |
| `/[locale]`                        | Homepage (hero slider, stats, services, etc.) |
| `/[locale]/gioi-thieu/*`           | About (history, mission, org structure, leadership) |
| `/[locale]/linh-vuc-hoat-dong`     | Services                                      |
| `/[locale]/san-pham`               | Products                                      |
| `/[locale]/cong-trinh`             | Projects                                      |
| `/[locale]/tin-tuc`                | News                                          |
| `/[locale]/tuyen-dung`             | Recruitment                                   |
| `/[locale]/lien-he`                | Contact                                       |

### Admin Panel — separate from i18n routing (`/admin/*`)

- Dashboard with stats (news, projects, jobs, unread contacts)
- Full CRUD pages for all content types
- Media library, Settings management
- Client-side JWT auth via `AdminAuthProvider` context

### Key Architecture

- **i18n**: next-intl with `vi` (default) and `en`, namespaced JSON message files
- **Middleware**: next-intl middleware handles locale detection, excludes `/admin/*`
- **API client**: Axios instance with auto-JWT interceptor from `localStorage`
- **Data fetching**: Server-side `fetch()` with ISR (60s revalidate) for public pages; TanStack Query for admin
- **Styling**: Tailwind CSS 4 with brand blue (`#1d4ed8`), Inter font, lucide-react icons
- **Components**: Header (sticky + dropdowns + mobile menu), Footer, HeroSlider, StatsSection, AdminSidebar

---

## Database Schema (13+ Models)

`User`, `News`, `NewsCategory`, `Project`, `Service`, `Product`, `Job`, `Banner`, `Partner`, `ContactSubmission`, `Media`, `SiteSetting`

### Enums

- `UserRole`: ADMIN, SUPER_ADMIN
- `ProjectStatus`: ONGOING, COMPLETED, UPCOMING
- `JobStatus`: OPEN, CLOSED

---

## Environment Variables

| App | Variable               | Default                                                              |
| --- | ---------------------- | -------------------------------------------------------------------- |
| API | `DATABASE_URL`         | `postgresql://duongbo:duongbo_secret@localhost:5432/duongbo_db`      |
| API | `JWT_SECRET`           | `duongbo_jwt_secret_change_in_production`                            |
| API | `PORT`                 | `4000`                                                               |
| Web | `NEXT_PUBLIC_API_URL`  | `http://localhost:4000`                                              |
| Web | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000`                                              |

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start database
docker compose up -d

# Run migrations
cd apps/api && npx prisma migrate dev --name init

# Run all apps (from root)
pnpm dev

# Run individually
cd apps/api && pnpm start:dev   # Backend
cd apps/web && pnpm dev         # Frontend
```

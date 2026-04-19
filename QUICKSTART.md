# 🚀 Quick Start Guide

## Prerequisites

- **Node.js** ≥ 20 (Download: https://nodejs.org/)
- **pnpm** ≥ 10.33 (Install: `npm install -g pnpm@10`)
- **Docker Desktop** (Download: https://www.docker.com/products/docker-desktop/)

## 3-Step Setup

### 1️⃣ Install & Setup

```bash
# Clone repository
git clone <your-repo-url> duongbo
cd duongbo

# Run automated setup (installs deps, creates .env, starts DB, pushes schema)
pnpm setup
```

**What `pnpm setup` does:**
- ✅ Installs all dependencies
- ✅ Copies `.env.example` → `.env` files
- ✅ Starts PostgreSQL via Docker
- ✅ Generates Prisma client
- ✅ Pushes database schema
- ✅ Creates default admin user

### 2️⃣ Start Development

```bash
# Start both API and Web servers
pnpm dev
```

### 3️⃣ Access Application

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:4000/api/docs
- **pgAdmin**: http://localhost:5050

---

## Default Admin Credentials

| Field    | Value              |
| -------- | ------------------ |
| Email    | admin@duongbo.com  |
| Password | Admin@123456       |

⚠️ **Change password immediately after first login!**

---

## Manual Setup (if `pnpm setup` fails)

```bash
# 1. Install dependencies
pnpm install

# 2. Start database
docker compose up -d

# 3. Create environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Setup database
cd apps/api
npx prisma generate
npx prisma db push
cd ../..

# 5. Start development servers
pnpm dev
```

---

## Common Commands

```bash
# Development
pnpm dev              # Start both API + Web
pnpm build            # Build for production
pnpm lint             # Run linters

# Database
pnpm db:push          # Push schema changes
pnpm db:generate      # Generate Prisma client
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database (⚠️ deletes data)

# Individual apps
cd apps/api && pnpm dev       # API only
cd apps/web && pnpm dev       # Web only
```

---

## Project Structure

```
duongbo/
├── apps/
│   ├── api/                  # NestJS Backend (port 4000)
│   │   ├── src/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── uploads/          # User uploaded files
│   │   └── .env              # API environment variables
│   │
│   └── web/                  # Next.js Frontend (port 3000)
│       ├── src/
│       │   ├── app/          # Pages & routes
│       │   ├── components/   # React components
│       │   └── lib/          # Utilities
│       ├── public/
│       │   └── images/       # Static images
│       └── .env.local        # Web environment variables
│
├── packages/
│   └── types/                # Shared TypeScript types
│
├── docker-compose.yml        # PostgreSQL + pgAdmin
├── package.json              # Root workspace config
└── pnpm-workspace.yaml       # pnpm monorepo config
```

---

## Troubleshooting

### Docker not starting

```bash
# Check Docker is running
docker ps

# Restart Docker containers
docker compose down
docker compose up -d
```

### Database connection error

```bash
# Check database is healthy
docker compose ps

# View logs
docker compose logs postgres

# Reset database (⚠️ deletes all data)
pnpm db:reset
```

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 4000
npx kill-port 4000
```

### Build errors

```bash
# Clean install
rm -rf node_modules apps/*/node_modules
pnpm install

# Clear Next.js cache
rm -rf apps/web/.next

# Regenerate Prisma client
cd apps/api
npx prisma generate
```

---

## Testing the Application

### ✅ Frontend Pages

Visit these URLs to verify everything works:

- http://localhost:3000 → Homepage with hero slider
- http://localhost:3000/vi/gioi-thieu → About page with company gallery
- http://localhost:3000/vi/linh-vuc-hoat-dong → Services (4 items)
- http://localhost:3000/vi/san-pham → Products (2 items)
- http://localhost:3000/vi/cong-trinh → Projects
- http://localhost:3000/vi/tin-tuc → News
- http://localhost:3000/vi/lien-he → Contact form
- http://localhost:3000/admin → Admin panel (login required)

### ✅ Backend API

- http://localhost:4000/api/docs → Swagger documentation
- http://localhost:4000/news → Get all news
- http://localhost:4000/projects → Get all projects
- http://localhost:4000/services → Get all services

### ✅ Database

```bash
# Open Prisma Studio (visual database editor)
pnpm db:studio
```

Or use pgAdmin:
- URL: http://localhost:5050
- Email: admin@duongbo.com
- Password: admin

---

## Recent Updates

### Latest Changes (April 2026)

1. ✅ **Hero Slider**: Added company logo next to "Xây dựng công trình cầu đường chuyên nghiệp"
2. ✅ **Working Hours**: Updated to "Thứ 2 – 7: 7:30 – 17:00" (Monday-Saturday)
3. ✅ **Company Gallery**: Added 7 images to About page:
   - Trạm trộn Bình Đê (featured large)
   - Hội trường công ty
   - Phòng họp giao ban
   - Thành tích & Giải thưởng
   - Phòng kế toán
   - Ban lãnh đạo
   - Bằng khen & Chứng nhận
4. ✅ **Products Page**: Reduced to 2 products only
5. ✅ **Services**: Added "Quản lí, bảo trì cao tốc"
6. ✅ **Company Profile**: Updated company type text

---

## Next Steps

1. **Customize Content**
   - Login to admin panel: http://localhost:3000/admin
   - Add real news, projects, and products
   - Upload company images
   - Update site settings

2. **Prepare for Deployment**
   - Read `DEPLOYMENT.md` for deployment options
   - Change default admin password
   - Generate secure JWT_SECRET
   - Configure production environment variables

3. **Development**
   - Modify pages in `apps/web/src/app/[locale]/`
   - Update API endpoints in `apps/api/src/`
   - Add new database models in `apps/api/prisma/schema.prisma`

---

## Support

- **Documentation**: See `README.md` and `DEPLOYMENT.md`
- **API Docs**: http://localhost:4000/api/docs
- **Database Schema**: `apps/api/prisma/schema.prisma`

---

**Happy Coding! 🎉**

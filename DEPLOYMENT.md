# Deployment Guide - Đường Bộ Bình Định

## 📋 Pre-Deployment Checklist

### ✅ Local Development Verification

Before deploying, ensure everything works locally:

```bash
# 1. Clean install
pnpm install

# 2. Start database
docker compose up -d

# 3. Setup database
cd apps/api
npx prisma generate
npx prisma db push
cd ../..

# 4. Run both servers
pnpm dev

# 5. Test all pages
- http://localhost:3000 (Homepage)
- http://localhost:3000/vi/gioi-thieu (About + Gallery)
- http://localhost:3000/vi/linh-vuc-hoat-dong (Services)
- http://localhost:3000/vi/san-pham (Products)
- http://localhost:3000/vi/cong-trinh (Projects)
- http://localhost:3000/vi/tin-tuc (News)
- http://localhost:3000/vi/lien-he (Contact)
- http://localhost:4000/api/docs (API Swagger)

# 6. Test build
pnpm build
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Best for:** Quick deployment with minimal DevOps

#### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/web`
     - **Build Command**: `cd ../.. && pnpm install && cd apps/web && pnpm build`
     - **Output Directory**: `.next`
     - **Install Command**: `pnpm install`

3. **Environment Variables** (Vercel Dashboard)
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

#### Backend (Railway)

1. **Create PostgreSQL Database**
   - Go to [railway.app](https://railway.app)
   - Create new project → Add PostgreSQL
   - Copy `DATABASE_URL` from variables

2. **Deploy API**
   - Add new service → Deploy from GitHub repo
   - Configure:
     - **Root Directory**: `apps/api`
     - **Build Command**: `cd ../.. && pnpm install && cd apps/api && pnpm build`
     - **Start Command**: `node dist/main.js`

3. **Environment Variables** (Railway Dashboard)
   ```
   DATABASE_URL=<from-railway-postgres>
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=7d
   PORT=4000
   APP_URL=https://your-api-domain.railway.app
   FRONTEND_URL=https://your-domain.vercel.app
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Run Prisma Migrations**
   ```bash
   # In Railway service settings, add one-time command:
   npx prisma generate && npx prisma db push
   ```

---

### Option 2: VPS (Ubuntu Server)

**Best for:** Full control, cost-effective for production

#### Server Requirements
- Ubuntu 22.04 LTS
- 2GB RAM minimum (4GB recommended)
- 20GB storage
- Node.js 20+, pnpm, PostgreSQL 16, Nginx

#### Setup Steps

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install pnpm
   npm install -g pnpm@10

   # Install PostgreSQL 16
   sudo apt install -y postgresql postgresql-contrib

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2 (process manager)
   npm install -g pm2
   ```

2. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE duongbo_db;
   CREATE USER duongbo WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE duongbo_db TO duongbo;
   \q
   ```

3. **Clone & Setup Project**
   ```bash
   cd /var/www
   git clone <your-repo-url> duongbo
   cd duongbo
   pnpm install
   ```

4. **Configure Environment**
   ```bash
   # API
   cp apps/api/.env.example apps/api/.env
   nano apps/api/.env
   ```
   Update:
   ```
   DATABASE_URL="postgresql://duongbo:your_secure_password@localhost:5432/duongbo_db?schema=public"
   JWT_SECRET="<generate-with-openssl-rand-base64-32>"
   APP_URL="https://api.yourdomain.com"
   FRONTEND_URL="https://yourdomain.com"
   ```

   ```bash
   # Web
   cp apps/web/.env.example apps/web/.env.local
   nano apps/web/.env.local
   ```
   Update:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

5. **Setup Database**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   cd ../..
   ```

6. **Build Applications**
   ```bash
   pnpm build
   ```

7. **Setup PM2**
   ```bash
   # API
   pm2 start apps/api/dist/main.js --name duongbo-api

   # Web
   cd apps/web
   pm2 start npm --name duongbo-web -- start
   cd ../..

   # Save PM2 config
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/duongbo
   ```

   ```nginx
   # API Server
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /uploads {
           alias /var/www/duongbo/apps/api/uploads;
           expires 30d;
           add_header Cache-Control "public, immutable";
       }
   }

   # Web Server
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/duongbo /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
   ```

10. **Setup Firewall**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

---

### Option 3: Docker Deployment

**Best for:** Containerized deployment, Kubernetes, cloud platforms

1. **Create Dockerfiles**

   `apps/api/Dockerfile`:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   RUN npm install -g pnpm@10
   COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
   COPY apps/api/package.json ./apps/api/
   COPY packages/types/package.json ./packages/types/
   RUN pnpm install --frozen-lockfile
   COPY . .
   RUN cd apps/api && pnpm build

   FROM node:20-alpine
   WORKDIR /app
   RUN npm install -g pnpm@10
   COPY --from=builder /app/apps/api/dist ./dist
   COPY --from=builder /app/apps/api/package.json ./
   COPY --from=builder /app/apps/api/prisma ./prisma
   COPY --from=builder /app/node_modules ./node_modules
   RUN npx prisma generate
   EXPOSE 4000
   CMD ["node", "dist/main.js"]
   ```

   `apps/web/Dockerfile`:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   RUN npm install -g pnpm@10
   COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
   COPY apps/web/package.json ./apps/web/
   COPY packages/types/package.json ./packages/types/
   RUN pnpm install --frozen-lockfile
   COPY . .
   RUN cd apps/web && pnpm build

   FROM node:20-alpine
   WORKDIR /app
   RUN npm install -g pnpm@10
   COPY --from=builder /app/apps/web/.next ./.next
   COPY --from=builder /app/apps/web/public ./public
   COPY --from=builder /app/apps/web/package.json ./
   COPY --from=builder /app/node_modules ./node_modules
   EXPOSE 3000
   CMD ["pnpm", "start"]
   ```

2. **Production docker-compose.yml**
   ```yaml
   services:
     postgres:
       image: postgres:16-alpine
       environment:
         POSTGRES_USER: duongbo
         POSTGRES_PASSWORD: ${DB_PASSWORD}
         POSTGRES_DB: duongbo_db
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped

     api:
       build:
         context: .
         dockerfile: apps/api/Dockerfile
       environment:
         DATABASE_URL: postgresql://duongbo:${DB_PASSWORD}@postgres:5432/duongbo_db
         JWT_SECRET: ${JWT_SECRET}
         FRONTEND_URL: ${FRONTEND_URL}
       ports:
         - "4000:4000"
       depends_on:
         - postgres
       restart: unless-stopped

     web:
       build:
         context: .
         dockerfile: apps/web/Dockerfile
       environment:
         NEXT_PUBLIC_API_URL: ${API_URL}
       ports:
         - "3000:3000"
       depends_on:
         - api
       restart: unless-stopped

   volumes:
     postgres_data:
   ```

---

## 🔒 Security Checklist

- [ ] Change default admin password (`admin@duongbo.com` / `Admin@123456`)
- [ ] Generate strong JWT_SECRET: `openssl rand -base64 32`
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS to only allow your frontend domain
- [ ] Set secure environment variables (never commit .env files)
- [ ] Enable rate limiting on API endpoints
- [ ] Setup database backups
- [ ] Configure firewall rules
- [ ] Keep dependencies updated: `pnpm update`

---

## 📊 Post-Deployment

### Monitoring

```bash
# PM2 monitoring
pm2 monit
pm2 logs duongbo-api
pm2 logs duongbo-web

# Check processes
pm2 status

# Restart services
pm2 restart duongbo-api
pm2 restart duongbo-web
```

### Database Backup

```bash
# Backup
pg_dump -U duongbo duongbo_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U duongbo duongbo_db < backup_20260409.sql
```

### Update Deployment

```bash
cd /var/www/duongbo
git pull
pnpm install
pnpm build
pm2 restart all
```

---

## 🐛 Troubleshooting

### API not connecting to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U duongbo -d duongbo_db -h localhost

# Check DATABASE_URL in .env
cat apps/api/.env | grep DATABASE_URL
```

### Images not loading
```bash
# Check uploads directory permissions
ls -la apps/api/uploads/
sudo chown -R $USER:$USER apps/api/uploads/

# Check Nginx static file serving
curl http://localhost:4000/uploads/test.jpg
```

### CORS errors
- Update `FRONTEND_URL` in `apps/api/.env`
- Check `apps/api/src/main.ts` CORS configuration
- Restart API: `pm2 restart duongbo-api`

### Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules apps/*/node_modules apps/*/.next apps/*/dist
pnpm install
pnpm build
```

---

## 📞 Support

For issues or questions:
- Check logs: `pm2 logs`
- Review API docs: `http://your-domain/api/docs`
- Check database: `npx prisma studio`

---

## ✅ Final Verification

After deployment, test:

1. ✅ Homepage loads with hero slider and company logo
2. ✅ About page shows company gallery (7 images)
3. ✅ Services page displays all services including "Quản lí, bảo trì cao tốc"
4. ✅ Products page shows only 2 products: "Bê tông nhựa nóng" and "Đá xây dựng các loại"
5. ✅ Footer displays working hours: "Thứ 2 – 7: 7:30 – 17:00"
6. ✅ Contact form submits successfully
7. ✅ Admin panel accessible at `/admin`
8. ✅ API Swagger docs accessible
9. ✅ Both Vietnamese and English languages work
10. ✅ All images load correctly

---

## 🎯 Mock Data & Production Content

### How Mock Data Works

**Mock data is fallback-only** - it displays when the database is empty:

```typescript
// Example from page.tsx
const displayProjects = projects?.data && projects.data.length > 0 
  ? projects.data  // ← Real data from API/Database
  : MOCK_PROJECTS  // ← Fallback mock data (only if DB empty)
```

### Mock Data Locations

All mock data uses real company images from `/images/`:

| Page | Mock Data | Images Used |
|------|-----------|-------------|
| **Homepage** | News articles | `1-Họp giao ban.JPG`, `1-Hội trường công ty.JPG`, etc. |
| **About** | Featured projects | `1-Trạm trộn Bình Đê.png`, `1-TRẠM TRỘN BÌNH ĐÊ.png`, etc. |
| **Services** | 5 services | Construction site and office images |
| **Products** | 2 products | Mixing station images |
| **Partners** | 8 logos | `petrolimex_logo.jpg` (all 8) |

### Production Content Management

**After deployment:**

1. **Login to Admin Panel**
   ```
   URL: https://yourdomain.com/admin
   Email: admin@duongbo.com
   Password: Admin@123456
   ```
   **⚠️ CHANGE PASSWORD IMMEDIATELY!**

2. **Add Real Content**
   - Upload actual project images
   - Add real partner logos
   - Create news articles
   - Update services/products

3. **Mock Data Behavior**
   - **0 items in DB** → Shows mock data
   - **1+ items in DB** → Shows real data, mock hidden
   - **Delete all items** → Mock data reappears as fallback

### Admin Panel Features

Full CRUD operations available:

| Section | URL | Operations |
|---------|-----|------------|
| **Partners** | `/admin/partners` | ✅ Create, Update, Delete, Upload logos |
| **Projects** | `/admin/projects` | ✅ Create, Update, Delete, Upload images |
| **Services** | `/admin/services` | ✅ Create, Update, Delete, Upload images |
| **Products** | `/admin/products` | ✅ Create, Update, Delete, Upload images |
| **News** | `/admin/news` | ✅ Create, Update, Delete, Upload images |
| **Banners** | `/admin/banners` | ✅ Create, Update, Delete, Upload images |

---

## 💰 Recommended Production Setup (Budget-Friendly)

### Option A: Railway + Vercel (Easiest) - ~$10-15/month

**Best for:** Quick deployment, auto-scaling, minimal DevOps

| Component | Platform | Cost | Setup Time |
|-----------|----------|------|------------|
| Database | Railway PostgreSQL | $5/month | 5 min |
| Backend API | Railway | $5/month | 10 min |
| Frontend | Vercel | Free | 5 min |
| Domain | Namecheap | $1-2/month | 5 min |
| SSL | Let's Encrypt (auto) | Free | Auto |
| **Total** | | **~$11-12/month** | **~25 min** |

**Steps:**

1. **Railway (Database + API)**
   - Sign up at railway.app
   - Create PostgreSQL database → Copy `DATABASE_URL`
   - Deploy API from GitHub → Set env vars
   - Auto-deploys on git push ✅

2. **Vercel (Frontend)**
   - Sign up at vercel.com
   - Import GitHub repo → Select `apps/web`
   - Set `NEXT_PUBLIC_API_URL` to Railway API URL
   - Auto-deploys on git push ✅

3. **Domain Setup**
   - Buy domain at Namecheap
   - Point to Vercel (frontend)
   - Add subdomain `api.yourdomain.com` → Railway

---

### Option B: VPS (Full Control) - ~$5-12/month

**Best for:** Cost-effective, full control, learning

| Component | Platform | Cost | Setup Time |
|-----------|----------|------|------------|
| VPS Server | DigitalOcean/Hetzner | $5-12/month | 30-60 min |
| Domain | Namecheap | $1-2/month | 5 min |
| SSL | Let's Encrypt | Free | 10 min |
| **Total** | | **~$6-14/month** | **~45-75 min** |

**Recommended VPS Providers:**
- **Hetzner** - €4.5/month (2GB RAM, 40GB SSD) - Best value
- **DigitalOcean** - $6/month (1GB RAM, 25GB SSD)
- **Vultr** - $6/month (1GB RAM, 25GB SSD)
- **Linode** - $5/month (1GB RAM, 25GB SSD)

---

### Option C: Docker + Cloud (Scalable) - ~$15-30/month

**Best for:** Containerized apps, Kubernetes, enterprise

- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## 🚀 Quick Start: Railway + Vercel (Recommended)

### Step 1: Deploy Database (Railway)

```bash
# 1. Go to railway.app → Sign up with GitHub
# 2. New Project → Provision PostgreSQL
# 3. Copy DATABASE_URL from Variables tab
```

### Step 2: Deploy API (Railway)

```bash
# 1. Same project → New Service → GitHub Repo
# 2. Select your repo → Root Directory: apps/api
# 3. Add environment variables:
```

**Railway Environment Variables:**
```env
DATABASE_URL=<paste-from-postgres-service>
JWT_SECRET=<generate-with: openssl rand -base64 32>
JWT_EXPIRES_IN=7d
PORT=4000
FRONTEND_URL=https://your-domain.vercel.app
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

**Settings:**
- Build Command: `cd ../.. && pnpm install && cd apps/api && pnpm build`
- Start Command: `npx prisma generate && npx prisma db push && node dist/main.js`
- Watch Paths: `apps/api/**`

### Step 3: Deploy Frontend (Vercel)

```bash
# 1. Go to vercel.com → Import Project
# 2. Select GitHub repo
# 3. Configure:
```

**Vercel Settings:**
- Framework Preset: **Next.js**
- Root Directory: **apps/web**
- Build Command: `cd ../.. && pnpm install && cd apps/web && pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Vercel Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### Step 4: Custom Domain (Optional)

**Railway API:**
- Settings → Networking → Generate Domain
- Or add custom domain: `api.yourdomain.com`

**Vercel Frontend:**
- Settings → Domains → Add `yourdomain.com`
- Update DNS records as instructed

### Step 5: First Login

```bash
# 1. Visit: https://your-domain.vercel.app/admin
# 2. Login:
#    Email: admin@duongbo.com
#    Password: Admin@123456
# 3. CHANGE PASSWORD IMMEDIATELY!
# 4. Start adding real content
```

---

## 📦 Environment Variables Reference

### Backend (API) - Required

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secure-random-string-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV=production

# CORS & URLs
APP_URL="https://api.yourdomain.com"
FRONTEND_URL="https://yourdomain.com"

# File Upload
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=10485760
```

### Frontend (Web) - Required

```env
# API Connection
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"

# Site URL (for SEO, sitemap)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

---

## 🔐 Security Best Practices

### Before Going Live

1. **Change Default Credentials**
   ```bash
   # Login to admin panel
   # Go to Settings → Change Password
   # Use strong password (min 12 chars, mixed case, numbers, symbols)
   ```

2. **Generate Strong JWT Secret**
   ```bash
   openssl rand -base64 32
   # Copy output to JWT_SECRET env var
   ```

3. **Secure Database**
   ```bash
   # Use strong password
   # Enable SSL connection
   # Restrict IP access (if VPS)
   ```

4. **Enable HTTPS**
   - Vercel/Railway: Auto-enabled ✅
   - VPS: Use Let's Encrypt (see guide above)

5. **Configure CORS**
   ```typescript
   // apps/api/src/main.ts
   app.enableCors({
     origin: process.env.FRONTEND_URL, // Only your domain
     credentials: true,
   });
   ```

6. **Rate Limiting** (Already configured ✅)
   ```typescript
   // apps/api/src/main.ts
   // 100 requests per 15 minutes per IP
   ```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# API Health
curl https://api.yourdomain.com/api/health

# Frontend
curl https://yourdomain.com

# Database (if VPS)
sudo systemctl status postgresql
```

### Logs

**Railway:**
- Dashboard → Service → Logs tab
- Real-time streaming
- Search and filter

**Vercel:**
- Dashboard → Project → Logs
- Function logs
- Build logs

**VPS (PM2):**
```bash
pm2 logs duongbo-api
pm2 logs duongbo-web
pm2 monit
```

### Backups

**Database (Railway):**
- Automatic daily backups ✅
- Manual backup: Dashboard → Database → Backups

**Database (VPS):**
```bash
# Daily backup script
pg_dump -U duongbo duongbo_db > /backups/db_$(date +%Y%m%d).sql

# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

**Uploads Directory:**
```bash
# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz apps/api/uploads/

# Or use cloud storage (S3, Cloudinary)
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

**Railway:**
- ✅ Auto-enabled
- Push to `main` branch → Auto-deploys

**Vercel:**
- ✅ Auto-enabled
- Push to `main` branch → Auto-deploys
- Preview deployments for PRs

### Manual Deploy

**Railway:**
```bash
# Trigger redeploy from dashboard
# Or use Railway CLI
railway up
```

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**VPS:**
```bash
cd /var/www/duongbo
git pull
pnpm install
pnpm build
pm2 restart all
```

---

## 🎓 Learning Resources

### Platform Documentation
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/faq/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)

### Monitoring Tools (Optional)
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Analytics**: Google Analytics, Plausible
- **Performance**: Vercel Analytics (free)

---

## ✅ Final Verification Checklist

After deployment, verify all features:

### Frontend
- [ ] Homepage loads with hero slider
- [ ] Company logo displays correctly
- [ ] All navigation links work
- [ ] Language switcher (VI/EN) works
- [ ] About page shows 7 gallery images
- [ ] Services page shows 5 services
- [ ] Products page shows 2 products
- [ ] News page displays articles
- [ ] Contact form submits successfully
- [ ] Footer shows correct working hours
- [ ] All images load (no 404s)
- [ ] Mobile responsive design works

### Backend
- [ ] API health endpoint responds
- [ ] Swagger docs accessible at `/api/docs`
- [ ] Admin login works
- [ ] Image upload works
- [ ] CRUD operations work for all entities
- [ ] Database connection stable
- [ ] CORS configured correctly

### Security
- [ ] HTTPS enabled (green padlock)
- [ ] Admin password changed
- [ ] JWT secret is strong and unique
- [ ] Database password is strong
- [ ] Environment variables secured
- [ ] No sensitive data in git repo

### Performance
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 📞 Support & Troubleshooting

### Common Issues

**1. API Connection Failed**
```bash
# Check NEXT_PUBLIC_API_URL in Vercel
# Ensure Railway API is running
# Check CORS settings in API
```

**2. Images Not Loading**
```bash
# Check uploads directory exists
# Verify file permissions (VPS)
# Check Nginx static file config (VPS)
```

**3. Database Connection Error**
```bash
# Verify DATABASE_URL format
# Check database is running
# Test connection: npx prisma studio
```

**4. Build Failures**
```bash
# Check build logs
# Verify all dependencies installed
# Clear cache and rebuild
```

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Production URLs**:
- Frontend: _____________
- API: _____________
- Admin: _____________/admin
- API Docs: _____________/api/docs

**Credentials** (Change immediately!):
- Admin Email: admin@duongbo.com
- Admin Password: Admin@123456

**Next Steps**:
1. [ ] Change admin password
2. [ ] Add real content via admin panel
3. [ ] Configure custom domain
4. [ ] Set up monitoring
5. [ ] Schedule database backups
6. [ ] Test all features
7. [ ] Share with stakeholders

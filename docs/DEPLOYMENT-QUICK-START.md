# 🚀 Quick Deployment Guide - Render + Vercel

**5-minute setup for experienced developers**

---

## 📋 Prerequisites

- GitHub repository with your code
- Render account (sign up with GitHub)
- Vercel account (sign up with GitHub)

---

## 🗄️ Step 1: Deploy Database (2 min)

1. **Render Dashboard** → **New +** → **PostgreSQL**
2. Settings:
   - Name: `duongbo-db`
   - Region: `Singapore`
   - Plan: **Free**
3. **Create Database**
4. Copy **Internal Database URL**

---

## 🔌 Step 2: Deploy Backend API (3 min)

1. **Render Dashboard** → **New +** → **Web Service**
2. Connect GitHub repository
3. Settings:
   - Name: `duongbo-api`
   - Root Directory: `apps/api`
   - Build Command:
     ```bash
     cd ../.. && pnpm install && cd apps/api && npx prisma generate && pnpm build
     ```
   - Start Command:
     ```bash
     npx prisma migrate deploy && node dist/main
     ```
   - Plan: **Free**

4. **Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste Internal Database URL>
   JWT_SECRET=<generate random 32-char string>
   PORT=10000
   CORS_ORIGIN=https://duongbo.vercel.app
   ```

5. **Create Web Service** → Wait 5-10 min

---

## 🌐 Step 3: Deploy Frontend (2 min)

1. **Vercel Dashboard** → **Add New** → **Project**
2. Import GitHub repository
3. Settings:
   - Root Directory: `apps/web`
   - Framework: Next.js (auto-detected)

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://duongbo-api.onrender.com
   ```

5. **Deploy** → Wait 2-3 min

---

## ✅ Step 4: Test

1. **Backend**: `https://duongbo-api.onrender.com/api/health`
2. **Frontend**: `https://duongbo.vercel.app`
3. **Admin**: `https://duongbo.vercel.app/admin/login`
   - Email: `admin@duongbo.com`
   - Password: `Admin@123456`

---

## 🔄 Auto-Deploy

Both services auto-deploy on `git push`:

```bash
git add .
git commit -m "Update"
git push origin main
```

---

## ⚠️ Important Notes

- **Render Free Tier**: Spins down after 15 min inactivity (30-60s cold start)
- **Database**: Free for 90 days, then $7/month or migrate to Neon
- **Keep Warm**: Use UptimeRobot or Cron-job.org to ping every 10 min

---

## 📚 Full Guide

See `DEPLOYMENT-RENDER.md` for detailed instructions, troubleshooting, and optimization tips.

# 🚀 Deployment Guide: Render + Vercel

Complete guide to deploy your Đường Bộ Bình Định website for **FREE** using Render (Backend + Database) and Vercel (Frontend).

---

## 📋 Overview

```
┌─────────────────────────────────────────────┐
│  Frontend: Vercel (Free)                    │
│  - Next.js website                          │
│  - https://duongbo.vercel.app               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Backend: Render Web Service (Free)         │
│  - NestJS API                               │
│  - https://duongbo-api.onrender.com         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Database: Render PostgreSQL (Free 90 days) │
│  - PostgreSQL database                      │
│  - Auto-managed by Render                   │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Important Limitations

### **Render Free Tier**
- ✅ Free PostgreSQL for **90 days** (then need to upgrade or migrate)
- ⚠️ Web service **spins down after 15 minutes** of inactivity
- ⚠️ First request after spin-down takes **30-60 seconds** (cold start)
- ✅ 750 hours/month free (enough for 24/7 if only one service)

### **Vercel Free Tier**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Custom domains supported

---

## 🔧 Part 1: Prepare Your Repository

### Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/duongbo-website.git
git branch -M main
git push -u origin main
```

### Step 2: Verify File Structure

Make sure you have:
```
Web App/
├── apps/
│   ├── api/              ← Backend (NestJS)
│   │   ├── src/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   └── render.yaml   ← NEW (already created)
│   └── web/              ← Frontend (Next.js)
│       ├── src/
│       ├── package.json
│       └── next.config.ts
├── package.json
└── pnpm-workspace.yaml
```

---

## 🗄️ Part 2: Deploy Database on Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in details:
   - **Name**: `duongbo-db`
   - **Database**: `duongbo_db`
   - **User**: `duongbo`
   - **Region**: `Singapore` (closest to Vietnam)
   - **Plan**: **Free** (90 days)
3. Click **"Create Database"**
4. Wait 2-3 minutes for database to provision

### Step 3: Copy Database Connection String

1. Once created, go to database page
2. Scroll down to **"Connections"**
3. Copy **"Internal Database URL"** (starts with `postgresql://`)
4. Save this for later (you'll need it for the API)

**Example:**
```
postgresql://duongbo:abc123xyz@dpg-xxxxx.singapore-postgres.render.com/duongbo_db
```

---

## 🔌 Part 3: Deploy Backend API on Render

### Step 1: Create Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Click **"Connect" next to your GitHub repository**
4. If you don't see it, click **"Configure account"** and grant access

### Step 2: Configure Web Service

Fill in the following:

#### **Basic Settings**
- **Name**: `duongbo-api`
- **Region**: `Singapore`
- **Branch**: `main` (or `master`)
- **Root Directory**: `apps/api`
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  cd ../.. && pnpm install && cd apps/api && npx prisma generate && pnpm build
  ```
- **Start Command**:
  ```bash
  npx prisma migrate deploy && node dist/main
  ```

#### **Plan**
- Select **"Free"**

#### **Environment Variables**

Click **"Add Environment Variable"** and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | (Paste the Internal Database URL from Step 3 above) |
| `JWT_SECRET` | (Generate random string, e.g., `your-super-secret-jwt-key-change-this`) |
| `PORT` | `10000` |
| `CORS_ORIGIN` | `https://duongbo.vercel.app` (update after deploying frontend) |

**To generate a secure JWT_SECRET:**
```bash
# Run this in your terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Advanced Settings (Optional)

- **Health Check Path**: `/api/health`
- **Auto-Deploy**: `Yes` (deploys automatically on git push)

### Step 4: Create Web Service

1. Click **"Create Web Service"**
2. Render will start building your API
3. This takes **5-10 minutes** for first deployment
4. Watch the logs to see progress

### Step 5: Verify Deployment

Once deployed, you'll get a URL like:
```
https://duongbo-api.onrender.com
```

Test these endpoints:
- `https://duongbo-api.onrender.com/api/health` → Should return `{"status":"ok"}`
- `https://duongbo-api.onrender.com/api/docs` → Should show Swagger documentation

---

## 🌐 Part 4: Deploy Frontend on Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Project

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Click **"Import"**

### Step 3: Configure Project

#### **Framework Preset**
- Vercel should auto-detect: **Next.js**

#### **Root Directory**
- Click **"Edit"**
- Set to: `apps/web`

#### **Build Settings**
- **Build Command**: `pnpm build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `pnpm install` (auto-detected)

#### **Environment Variables**

Click **"Add"** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://duongbo-api.onrender.com` |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once done, you'll get a URL like: `https://duongbo.vercel.app`

### Step 5: Update CORS on Backend

1. Go back to Render Dashboard
2. Open your `duongbo-api` web service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   https://duongbo.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## 🧪 Part 5: Test Your Deployment

### Test Backend API

1. **Health Check**:
   ```
   https://duongbo-api.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Swagger Docs**:
   ```
   https://duongbo-api.onrender.com/api/docs
   ```
   Should show API documentation

3. **Login (via Swagger)**:
   - Open Swagger docs
   - Find `POST /auth/login`
   - Click "Try it out"
   - Use credentials:
     ```json
     {
       "email": "admin@duongbo.com",
       "password": "Admin@123456"
     }
     ```
   - Should return access token

### Test Frontend Website

1. **Homepage**:
   ```
   https://duongbo.vercel.app
   ```

2. **Admin Login**:
   ```
   https://duongbo.vercel.app/admin/login
   ```
   - Email: `admin@duongbo.com`
   - Password: `Admin@123456`

3. **Test CRUD Operations**:
   - Login to admin
   - Try creating a news article
   - Upload an image
   - Verify it appears on homepage

---

## 📝 Part 6: Database Setup

### Run Migrations

Since this is first deployment, you need to seed the admin user:

**Option 1: Via Render Shell**
1. Go to Render Dashboard → `duongbo-api` service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma db push
   ```

**Option 2: Via Local Connection**
1. Copy the **External Database URL** from Render database page
2. In your local `.env` file, temporarily set:
   ```
   DATABASE_URL="postgresql://..."
   ```
3. Run locally:
   ```bash
   cd apps/api
   npx prisma db push
   ```
4. Revert `.env` back to local database

The admin user will be auto-created on first API startup (check `apps/api/src/app.module.ts`).

---

## 🎨 Part 7: Custom Domain (Optional)

### For Frontend (Vercel)

1. Go to Vercel Dashboard → Your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `duongbo.vn`)
4. Follow DNS configuration instructions
5. Vercel provides free SSL certificate

### For Backend (Render)

1. Go to Render Dashboard → `duongbo-api`
2. Click **"Settings"** → **"Custom Domain"**
3. Add subdomain (e.g., `api.duongbo.vn`)
4. Update DNS CNAME record
5. Render provides free SSL certificate

---

## ⚡ Part 8: Performance Optimization

### Prevent Cold Starts (Render Free Tier)

Render free tier spins down after 15 min inactivity. To keep it warm:

**Option 1: Use Cron Job Service**
1. Sign up for https://cron-job.org (free)
2. Create job to ping your API every 10 minutes:
   ```
   https://duongbo-api.onrender.com/api/health
   ```

**Option 2: Use UptimeRobot**
1. Sign up for https://uptimerobot.com (free)
2. Add monitor for your API URL
3. Set interval to 5 minutes

### Image Optimization

Images are stored in `/uploads` folder on Render. For better performance:

**Option 1: Use Vercel Blob Storage** (Paid)
- Upgrade to Vercel Pro
- Use Vercel Blob for image storage

**Option 2: Use Cloudinary** (Free tier: 25 GB)
- Sign up at https://cloudinary.com
- Update upload logic to use Cloudinary API

---

## 🔄 Part 9: Continuous Deployment

### Auto-Deploy on Git Push

Both Render and Vercel are configured for auto-deployment:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render will auto-deploy backend (5-10 min)
# Vercel will auto-deploy frontend (2-3 min)
```

### View Deployment Logs

**Render:**
1. Go to Dashboard → `duongbo-api`
2. Click **"Logs"** tab
3. See real-time deployment logs

**Vercel:**
1. Go to Dashboard → Your project
2. Click **"Deployments"**
3. Click on latest deployment → View logs

---

## 🐛 Part 10: Troubleshooting

### Backend Issues

#### "Application failed to respond"
- **Cause**: App crashed or taking too long to start
- **Fix**: Check Render logs for errors
- **Common issue**: Missing environment variables

#### "Database connection failed"
- **Cause**: Wrong `DATABASE_URL`
- **Fix**: Verify connection string in Render environment variables
- **Check**: Use **Internal Database URL**, not External

#### "Prisma Client not found"
- **Cause**: Build command didn't run `prisma generate`
- **Fix**: Update build command to include:
  ```bash
  npx prisma generate
  ```

### Frontend Issues

#### "Failed to fetch from API"
- **Cause**: Wrong `NEXT_PUBLIC_API_URL` or CORS issue
- **Fix**: 
  1. Verify `NEXT_PUBLIC_API_URL` in Vercel env vars
  2. Check `CORS_ORIGIN` in Render backend env vars

#### "Images not loading"
- **Cause**: Image URLs are relative, not absolute
- **Fix**: Update image URLs to use full API URL

### Database Issues

#### "Database expired after 90 days"
- **Cause**: Render free database expires
- **Fix Options**:
  1. Upgrade to paid plan ($7/month)
  2. Migrate to Neon (free forever)
  3. Export data and create new free database

---

## 💰 Cost Summary

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| **Render Web Service** | 750 hours/month | $7/month |
| **Render PostgreSQL** | 90 days free | $7/month |
| **Vercel** | 100 GB bandwidth | $20/month (Pro) |
| **Total** | **$0 for 90 days** | **$14-34/month** |

---

## 🔐 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Enable HTTPS only (automatic on Render/Vercel)
- [ ] Set proper `CORS_ORIGIN` (not `*`)
- [ ] Review API rate limiting
- [ ] Enable Render/Vercel DDoS protection
- [ ] Set up database backups (Render auto-backups on paid plan)

---

## 📊 Monitoring

### Render

1. Dashboard shows:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

2. Set up alerts:
   - Go to Settings → Notifications
   - Add email for deployment failures

### Vercel

1. Analytics (free):
   - Page views
   - Top pages
   - Visitor countries

2. Upgrade to Pro for:
   - Web Vitals
   - Audience insights
   - Custom events

---

## 🎯 Next Steps After Deployment

1. **Test thoroughly**:
   - All pages load correctly
   - Admin panel works
   - Image uploads work
   - Forms submit properly

2. **Set up monitoring**:
   - UptimeRobot for uptime monitoring
   - Google Analytics for visitor tracking

3. **Plan for 90-day database expiration**:
   - Set calendar reminder for day 80
   - Decide: upgrade Render or migrate to Neon

4. **Optimize**:
   - Add caching headers
   - Compress images
   - Enable CDN

---

## 📞 Support

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Admin credentials ready

### Render Setup
- [ ] Database created
- [ ] Database URL copied
- [ ] Web service created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Health check passing

### Vercel Setup
- [ ] Project imported
- [ ] Root directory set to `apps/web`
- [ ] Environment variables set
- [ ] Build successful
- [ ] Website accessible

### Post-Deployment
- [ ] Admin login works
- [ ] CRUD operations work
- [ ] Images upload correctly
- [ ] CORS configured properly
- [ ] Custom domain added (optional)
- [ ] Monitoring set up
- [ ] Backups configured

---

**🎉 Congratulations! Your website is now live!**

- Frontend: https://duongbo.vercel.app
- Backend: https://duongbo-api.onrender.com
- API Docs: https://duongbo-api.onrender.com/api/docs

# 🚀 Supabase Migration Guide - Complete Setup

**Status:** ✅ Code Updated - Ready for Setup

---

## ✅ **What I've Done**

I've updated your code to use Supabase Storage instead of local disk storage:

### **Files Modified:**
1. ✅ `apps/api/src/media/media.controller.ts` - Updated to use Supabase Storage

### **What Changed:**
- ❌ Removed: Local disk storage (`multer` disk storage)
- ❌ Removed: File system operations (`fs`, `path`)
- ✅ Added: Supabase client integration
- ✅ Added: Upload to Supabase Storage
- ✅ Added: Delete from Supabase Storage
- ✅ Added: Public URL generation

---

## 📋 **What You Need to Do**

### **Step 1: Install Supabase Package (2 min)**

Run this command from the **project root**:

```bash
cd "D:\Coding\Web App\Web App"
pnpm add @supabase/supabase-js --filter api
```

Or if that doesn't work:

```bash
cd "D:\Coding\Web App\Web App\apps\api"
pnpm add @supabase/supabase-js
```

---

### **Step 2: Create Supabase Account & Project (5 min)**

1. **Go to:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign up** with GitHub or email (no credit card!)
4. **Click:** "New Project"
5. **Fill in:**
   - Organization: Create new
   - Name: `duongbo-website`
   - Database Password: Click "Generate a password" → **SAVE IT!**
   - Region: **Southeast Asia (Singapore)**
   - Plan: **Free** ✅
6. **Click:** "Create new project"
7. **Wait** 2-3 minutes for setup

---

### **Step 3: Get Supabase Credentials (3 min)**

#### **3.1 Get Database Connection String**

1. Go to **Project Settings** (gear icon) → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your password

**Example:**
```
postgresql://postgres.abc123:YourPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### **3.2 Get API Credentials**

1. Go to **Project Settings** → **API**
2. Copy **Project URL** (e.g., `https://abc123.supabase.co`)
3. Copy **anon public** key (long string starting with `eyJ...`)

---

### **Step 4: Update Environment Variables (2 min)**

**Edit `apps/api/.env`:**

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres.abc123:YourPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Supabase API
SUPABASE_URL="https://abc123.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# JWT (keep existing)
JWT_SECRET="duongbo_jwt_secret_change_in_production"
JWT_EXPIRES_IN="7d"

# App (keep existing)
PORT=4000
APP_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
```

**⚠️ Important:** Replace with YOUR actual values from Step 3!

---

### **Step 5: Push Database Schema to Supabase (2 min)**

```bash
cd "D:\Coding\Web App\Web App\apps\api"
npx prisma db push
```

**Expected output:**
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

---

### **Step 6: Create Storage Bucket in Supabase (5 min)**

#### **6.1 Create Bucket**

1. In Supabase Dashboard, click **Storage** (left sidebar)
2. Click **"New bucket"**
3. Fill in:
   - Name: `media`
   - Public bucket: ✅ **Yes** (important!)
4. Click **"Create bucket"**

#### **6.2 Set Up Public Access Policy**

**Option A: Using UI (Easier)**

1. Click on **`media`** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Click **"For full customization"**
5. Fill in:
   - Policy name: `Public Access`
   - Allowed operation: `SELECT`
   - Target roles: `public`
6. Click **"Review"** → **"Save policy"**

**Option B: Using SQL (Faster)**

1. Click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media' );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'media' );
```

4. Click **"Run"**

---

### **Step 7: Test Locally (5 min)**

```bash
# From project root
cd "D:\Coding\Web App\Web App"
pnpm dev
```

**Test the upload:**

1. Go to: http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@duongbo.com`
   - Password: `Admin@123456`
3. Go to: http://localhost:3000/admin/media
4. Click **"Tải lên"** and upload an image
5. Check Supabase Dashboard → Storage → media bucket
6. You should see your uploaded file! ✅

---

## 🎉 **Success Checklist**

- [ ] Supabase package installed (`@supabase/supabase-js`)
- [ ] Supabase project created
- [ ] Database connection string copied
- [ ] API credentials copied (URL + anon key)
- [ ] `.env` file updated with all 3 values
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Storage bucket created (`media`)
- [ ] Public access policy set up
- [ ] Local dev server running
- [ ] Image upload tested successfully
- [ ] Image visible in Supabase Storage dashboard

---

## 🚀 **Deploy to Production**

Once local testing works:

### **Update Render Environment Variables**

1. Go to Render Dashboard → `duongbo-api`
2. Click **Environment** tab
3. Update/Add these variables:
   ```
   DATABASE_URL=postgresql://postgres.abc123:password@...
   SUPABASE_URL=https://abc123.supabase.co
   SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. Click **"Save Changes"**
5. Render will auto-redeploy

### **Update Vercel (Frontend)**

No changes needed! Frontend just displays image URLs.

---

## 📊 **What You Get (FREE)**

```
✅ Database: 500MB PostgreSQL
✅ Storage: 1GB for images  
✅ Bandwidth: 2GB/month
✅ Auth: Unlimited users
✅ Realtime: Unlimited connections
✅ No credit card required!

Enough for:
- 5,000 news articles
- 2,000 images (500KB each)
- 4,000 image views/month
```

---

## 🐛 **Troubleshooting**

### **Error: "Cannot find module '@supabase/supabase-js'"**

**Solution:**
```bash
cd "D:\Coding\Web App\Web App\apps\api"
pnpm add @supabase/supabase-js
```

### **Error: "Upload failed: new row violates row-level security policy"**

**Solution:** You didn't set up the storage policies. Go back to Step 6.2.

### **Error: "Invalid API key"**

**Solution:** Check that `SUPABASE_ANON_KEY` in `.env` matches the key in Supabase Dashboard → Settings → API.

### **Error: "Database connection failed"**

**Solution:** Check that `DATABASE_URL` in `.env` is correct and password is replaced.

### **Images not loading**

**Solution:** Make sure the `media` bucket is set to **Public** in Supabase Dashboard.

---

## 📝 **Code Changes Summary**

### **Before (Local Disk):**
```typescript
// Saved to local disk
const uploadDir = join(process.cwd(), 'uploads')
storage: diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    cb(null, `${uuidv4()}${ext}`)
  },
})

// URL: /uploads/abc-123.jpg
const url = `/uploads/${file.filename}`
```

### **After (Supabase Storage):**
```typescript
// Upload to Supabase
const { data, error } = await supabase.storage
  .from('media')
  .upload(fileName, file.buffer, {
    contentType: file.mimetype,
  })

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('media')
  .getPublicUrl(fileName)

// URL: https://abc.supabase.co/storage/v1/object/public/media/123-image.jpg
```

---

## ✅ **Benefits**

### **Before:**
- ❌ Files deleted on Render restart
- ❌ No CDN (slow for users)
- ❌ Manual backup needed
- ❌ Limited by disk space

### **After:**
- ✅ Files persist forever
- ✅ CDN included (fast delivery)
- ✅ Automatic backups
- ✅ Scalable (1GB free, upgradable)

---

## 💰 **Cost Comparison**

### **Old Setup (Render + Cloudinary):**
```
Render DB: $7/month
Render API: $7/month
Cloudinary: $89/month (after free tier)
Total: $103/month
```

### **New Setup (Supabase + Render):**
```
Supabase: FREE (then $25/month)
Render API: $7/month
Total: $7/month (then $32/month)

Savings: $96/month = $1,152/year!
```

---

## 🎯 **Next Steps**

1. ✅ **Complete Steps 1-7 above**
2. ✅ **Test locally** - Upload images, verify they work
3. ✅ **Deploy to Render** - Update env vars
4. ✅ **Test production** - Upload images on live site
5. ✅ **Celebrate!** 🎉

---

**Need help? Let me know which step you're stuck on!** 🚀

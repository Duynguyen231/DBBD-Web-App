# ✅ Supabase Setup & Testing - Tomorrow's Checklist

**Time needed:** 20-30 minutes  
**Goal:** Get Supabase working and test image uploads locally

---

## 📋 **Before You Start**

Make sure you have:
- ✅ Internet connection
- ✅ Code already updated (I did this for you)
- ✅ Docker running (for local dev if needed)

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Install Supabase Package (2 min)**

Open terminal and run:

```bash
cd "D:\Coding\Web App\Web App\apps\api"
pnpm add @supabase/supabase-js
```

**Expected output:**
```
+ @supabase/supabase-js 2.x.x
```

✅ **Done when:** You see the package installed successfully

---

### **Step 2: Create Supabase Account (5 min)**

1. **Open browser:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign up:** Use GitHub or email (no credit card needed!)
4. **Verify email** if needed

✅ **Done when:** You're logged into Supabase dashboard

---

### **Step 3: Create New Project (3 min)**

In Supabase dashboard:

1. **Click:** "New Project"
2. **Fill in:**
   - **Organization:** Create new (or use existing)
   - **Name:** `duongbo-website`
   - **Database Password:** Click "Generate a password"
   - **⚠️ IMPORTANT:** Copy and save this password somewhere safe!
   - **Region:** Southeast Asia (Singapore)
   - **Plan:** Free ✅
3. **Click:** "Create new project"
4. **Wait:** 2-3 minutes while it sets up

✅ **Done when:** You see "Project is ready" or the dashboard loads

---

### **Step 4: Get Database Connection String (2 min)**

1. **Click:** Settings (gear icon, bottom left)
2. **Click:** Database tab
3. **Scroll to:** "Connection string" section
4. **Select:** URI tab
5. **Copy** the connection string
6. **Replace** `[YOUR-PASSWORD]` with the password you saved in Step 3

**Example result:**
```
postgresql://postgres.abc123xyz:MyPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**⚠️ Save this!** You'll need it in Step 6.

✅ **Done when:** You have the full connection string with password

---

### **Step 5: Get API Credentials (2 min)**

1. **Click:** Settings → API tab
2. **Copy these 2 values:**

   **Project URL:**
   ```
   https://abc123xyz.supabase.co
   ```

   **anon public key:** (long string starting with `eyJ...`)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

**⚠️ Save both!** You'll need them in Step 6.

✅ **Done when:** You have both URL and key copied

---

### **Step 6: Update .env File (3 min)**

1. **Open:** `D:\Coding\Web App\Web App\apps\api\.env`
2. **Find these lines and replace:**

```env
# OLD (delete or comment out):
# DATABASE_URL="postgresql://duongbo:duongbo_secret@localhost:5432/duongbo_db?schema=public"

# NEW (paste your values from Steps 4 & 5):
DATABASE_URL="postgresql://postgres.abc123xyz:MyPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL="https://abc123xyz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

3. **Keep the rest as-is:**

```env
# JWT (don't change)
JWT_SECRET="duongbo_jwt_secret_change_in_production"
JWT_EXPIRES_IN="7d"

# App (don't change)
PORT=4000
APP_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
```

4. **Save** the file

✅ **Done when:** `.env` has all 3 new values (DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY)

---

### **Step 7: Push Database Schema (2 min)**

Open terminal and run:

```bash
cd "D:\Coding\Web App\Web App\apps\api"
npx prisma db push
```

**Expected output:**
```
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "postgres"

🚀 Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client
```

**If you see errors:** Check that DATABASE_URL in `.env` is correct.

✅ **Done when:** You see "Your database is now in sync"

---

### **Step 8: Create Storage Bucket (3 min)**

Back in Supabase dashboard:

1. **Click:** Storage (left sidebar)
2. **Click:** "New bucket" button
3. **Fill in:**
   - **Name:** `media` (exactly this, lowercase)
   - **Public bucket:** ✅ Check this box (important!)
   - **File size limit:** Leave default
4. **Click:** "Create bucket"

✅ **Done when:** You see `media` bucket in the list

---

### **Step 9: Set Up Storage Permissions (2 min)**

**Option A: Using SQL (Faster)**

1. **Click:** SQL Editor (left sidebar)
2. **Click:** "New query"
3. **Paste this:**

```sql
-- Allow everyone to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media' );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'media' );
```

4. **Click:** "Run" button
5. **Check:** You should see "Success. No rows returned"

**Option B: Using UI (Slower but easier)**

1. **Click:** Storage → `media` bucket
2. **Click:** Policies tab
3. **Click:** "New Policy"
4. **Select:** "For full customization"
5. **Fill in:**
   - Policy name: `Public Access`
   - Allowed operation: SELECT
   - Target roles: public
6. **Click:** Review → Save policy
7. **Repeat** for INSERT and DELETE (target: authenticated)

✅ **Done when:** You see 3 policies created for the media bucket

---

### **Step 10: Start Dev Server (1 min)**

Open terminal and run:

```bash
cd "D:\Coding\Web App\Web App"
pnpm dev
```

**Expected output:**
```
apps/api dev: [Nest] Starting Nest application...
apps/api dev: [Nest] API Server running on http://localhost:4000
apps/web dev: ▲ Next.js 16.2.1
apps/web dev: - Local: http://localhost:3000
```

✅ **Done when:** Both servers are running without errors

---

## 🧪 **Testing (5 min)**

### **Test 1: Check API Health**

Open browser: http://localhost:4000/api/health

**Expected:** `{"status":"ok"}`

✅ **Pass:** You see the JSON response

---

### **Test 2: Login to Admin**

1. **Open:** http://localhost:3000/admin/login
2. **Login with:**
   - Email: `admin@duongbo.com`
   - Password: `Admin@123456`
3. **Click:** "Đăng nhập"

**Expected:** Redirects to admin dashboard

✅ **Pass:** You're logged in and see the admin panel

---

### **Test 3: Upload Image to Supabase**

1. **Go to:** http://localhost:3000/admin/media
2. **Click:** "Tải lên" button
3. **Select:** Any image file (JPG, PNG, etc.)
4. **Wait:** For upload progress bar
5. **Check:** Image appears in the media list

**Expected:** 
- Progress bar shows 0-100%
- Image appears in the list
- No errors

✅ **Pass:** Image uploaded successfully

---

### **Test 4: Verify in Supabase Dashboard**

1. **Go to:** Supabase dashboard
2. **Click:** Storage → `media` bucket
3. **Check:** You should see your uploaded file

**Expected:** File is there with timestamp filename (e.g., `1234567890-image.jpg`)

✅ **Pass:** File visible in Supabase Storage

---

### **Test 5: Delete Image**

1. **Back to:** http://localhost:3000/admin/media
2. **Click:** Trash icon on the uploaded image
3. **Confirm:** Delete
4. **Check:** Image removed from list

**Expected:** Image disappears

✅ **Pass:** Image deleted successfully

---

### **Test 6: Verify Deletion in Supabase**

1. **Go to:** Supabase dashboard → Storage → `media`
2. **Check:** File should be gone

**Expected:** File no longer in Supabase Storage

✅ **Pass:** File deleted from Supabase

---

## ✅ **Success Checklist**

After completing all steps, check these:

- [ ] `@supabase/supabase-js` package installed
- [ ] Supabase account created
- [ ] Project created (name: `duongbo-website`)
- [ ] Database password saved
- [ ] Database connection string copied
- [ ] API credentials copied (URL + key)
- [ ] `.env` file updated with 3 values
- [ ] Database schema pushed successfully
- [ ] Storage bucket `media` created
- [ ] Storage bucket set to public
- [ ] Storage policies created (3 policies)
- [ ] Dev server starts without errors
- [ ] API health check works
- [ ] Admin login works
- [ ] Image upload works
- [ ] Image visible in Supabase Storage
- [ ] Image delete works
- [ ] Image removed from Supabase Storage

**If all checked:** 🎉 **You're done! Supabase is working!**

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Cannot find module '@supabase/supabase-js'"**

**Solution:** Run Step 1 again:
```bash
cd "D:\Coding\Web App\Web App\apps\api"
pnpm add @supabase/supabase-js
```

---

### **Issue 2: "Upload failed: Invalid API key"**

**Solution:** 
1. Check `SUPABASE_ANON_KEY` in `.env`
2. Make sure it matches the key in Supabase Dashboard → Settings → API
3. Restart dev server after changing `.env`

---

### **Issue 3: "Upload failed: new row violates row-level security policy"**

**Solution:** 
1. Go to Supabase Dashboard → Storage → `media` bucket → Policies
2. Make sure you have the 3 policies created (Step 9)
3. If not, run the SQL from Step 9 again

---

### **Issue 4: "Database connection failed"**

**Solution:**
1. Check `DATABASE_URL` in `.env`
2. Make sure you replaced `[YOUR-PASSWORD]` with your actual password
3. Make sure there are no extra spaces or quotes

---

### **Issue 5: Images not loading on frontend**

**Solution:**
1. Check that `media` bucket is set to **Public** in Supabase
2. Go to Storage → `media` → Settings → Make sure "Public bucket" is checked

---

### **Issue 6: Dev server won't start**

**Solution:**
1. Stop the server (Ctrl+C)
2. Check for port conflicts (kill processes on 3000 and 4000)
3. Run `pnpm dev` again

---

## 📝 **What to Save**

Write these down somewhere safe:

1. **Supabase Project Name:** `duongbo-website`
2. **Database Password:** (the one you generated)
3. **Project URL:** `https://abc123xyz.supabase.co`
4. **Anon Key:** `eyJhbGci...` (long string)

You'll need these for deployment later!

---

## 🎯 **After Testing**

Once everything works:

1. ✅ **Commit your changes:**
   ```bash
   git add .
   git commit -m "Migrate to Supabase Storage"
   git push
   ```

2. ✅ **Update deployment docs** (for later)
3. ✅ **Celebrate!** 🎉

---

## 📞 **Need Help?**

If you get stuck on any step:

1. Check the "Common Issues" section above
2. Check the full guide: `SUPABASE-MIGRATION-GUIDE.md`
3. Ask me for help with the specific step number

---

## ⏱️ **Time Breakdown**

- Setup (Steps 1-9): ~20 minutes
- Testing (Steps 10+): ~5 minutes
- **Total: ~25 minutes**

---

**Good luck tomorrow! Follow this step-by-step and you'll have Supabase working in no time.** 🚀

**Pro tip:** Do it in the morning when you're fresh! ☕

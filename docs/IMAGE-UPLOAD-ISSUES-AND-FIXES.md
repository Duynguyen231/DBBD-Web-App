# 🖼️ Image Upload: Issues & Fixes

**Comprehensive analysis of image upload functionality and production deployment issues**

---

## 🔍 Current Implementation Review

### **Backend (`apps/api/src/media/media.controller.ts`)**

```typescript
// Storage: Local disk (uploads folder)
const uploadDir = join(process.cwd(), 'uploads')

// File handling: Multer with disk storage
storage: diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    const ext = extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

// Serving files: Express static
app.use('/uploads', express.static(join(process.cwd(), 'uploads')))
```

### **Frontend (`apps/web/src/lib/utils.ts`)**

```typescript
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return path
  return `${getApiUrl()}${path}`  // e.g., http://localhost:4000/uploads/abc.jpg
}
```

---

## ❌ Critical Issues

### **Issue #1: Ephemeral File System on Render (CRITICAL)**

**Problem:**
- Render uses **ephemeral file system**
- Uploaded files are **deleted on every deployment**
- Files are **lost when service restarts** (every 15 min on free tier)

**Impact:**
- ❌ All uploaded images disappear after restart
- ❌ Website shows broken images
- ❌ Users lose all uploaded content

**Severity:** 🔴 **CRITICAL** - Will break in production

---

### **Issue #2: No File Size Validation on Frontend**

**Problem:**
```typescript
// Backend has 10MB limit
limits: { fileSize: 10 * 1024 * 1024 }

// Frontend has NO validation before upload
const upload = async (files: FileList | null) => {
  // Directly uploads without checking size
  await apiClient.post('/media/upload', fd)
}
```

**Impact:**
- ❌ Users can attempt to upload huge files
- ❌ Upload fails with cryptic error
- ❌ Wastes bandwidth and time

**Severity:** 🟡 **MEDIUM** - Poor UX

---

### **Issue #3: No Upload Progress Indicator**

**Problem:**
```typescript
// No progress tracking
await apiClient.post('/media/upload', fd)
```

**Impact:**
- ❌ User doesn't know if upload is working
- ❌ Large files appear frozen
- ❌ Users may click multiple times

**Severity:** 🟡 **MEDIUM** - Poor UX

---

### **Issue #4: No Error Handling for Failed Uploads**

**Problem:**
```typescript
try {
  for(const file of Array.from(files)) {
    await apiClient.post('/media/upload', fd)
  }
  load()
} finally { setUploading(false) }
// No catch block - errors silently fail
```

**Impact:**
- ❌ Failed uploads show no error message
- ❌ User doesn't know what went wrong
- ❌ Difficult to debug

**Severity:** 🟡 **MEDIUM** - Poor UX

---

### **Issue #5: No Image Optimization**

**Problem:**
- Images uploaded as-is (original size)
- No compression or resizing
- No format conversion (e.g., to WebP)

**Impact:**
- ❌ Large image files slow down website
- ❌ Wastes bandwidth
- ❌ Poor performance on mobile

**Severity:** 🟠 **LOW-MEDIUM** - Performance issue

---

### **Issue #6: CORS Issues in Production**

**Problem:**
```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})
```

**Impact:**
- ⚠️ If `FRONTEND_URL` not set correctly, uploads fail
- ⚠️ CORS errors in browser console
- ⚠️ Images won't load cross-origin

**Severity:** 🟡 **MEDIUM** - Deployment issue

---

### **Issue #7: No Duplicate File Detection**

**Problem:**
- Same file can be uploaded multiple times
- No hash-based deduplication
- Wastes storage space

**Impact:**
- ❌ Storage fills up faster
- ❌ Duplicate files in media library
- ❌ Confusion for users

**Severity:** 🟢 **LOW** - Nice to have

---

### **Issue #8: No Image Metadata**

**Problem:**
- No width/height stored
- No alt text support
- No image dimensions

**Impact:**
- ❌ Layout shift when images load
- ❌ Poor SEO (no alt text)
- ❌ Can't validate aspect ratios

**Severity:** 🟢 **LOW** - Enhancement

---

## 🎯 Recommended Solutions

### **Solution 1: Use Cloud Storage (CRITICAL)**

Replace local disk storage with cloud storage that persists across deployments.

#### **Option A: Cloudinary (Recommended) 🌟**

**Pros:**
- ✅ Free tier: 25 GB storage, 25 GB bandwidth/month
- ✅ Automatic image optimization
- ✅ Automatic format conversion (WebP)
- ✅ Image transformations (resize, crop, etc.)
- ✅ CDN included
- ✅ No deployment issues

**Implementation:**

1. **Install Cloudinary SDK:**
```bash
cd apps/api
pnpm add cloudinary multer-storage-cloudinary
```

2. **Update Media Controller:**
```typescript
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'duongbo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'],
    transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
  },
})

@UseInterceptors(
  FileInterceptor('file', {
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
)
async upload(@UploadedFile() file: Express.Multer.File) {
  const media = await this.prisma.media.create({
    data: {
      filename: file.originalname,
      url: file.path, // Cloudinary URL
      mimeType: file.mimetype,
      size: file.size,
    },
  })
  return media
}
```

3. **Environment Variables:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Update Frontend:**
```typescript
// No changes needed - getImageUrl already handles full URLs
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http')) return path  // ✅ Cloudinary URLs work
  if (path.startsWith('/images/')) return path
  return `${getApiUrl()}${path}`
}
```

---

#### **Option B: AWS S3 (Alternative)**

**Pros:**
- ✅ Free tier: 5 GB storage, 20,000 GET requests/month
- ✅ Highly scalable
- ✅ Industry standard

**Cons:**
- ❌ More complex setup
- ❌ No automatic image optimization
- ❌ Need to set up CloudFront for CDN

**Implementation:**

1. **Install AWS SDK:**
```bash
cd apps/api
pnpm add @aws-sdk/client-s3 multer-s3
```

2. **Update Media Controller:**
```typescript
import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname })
  },
  key: (req, file, cb) => {
    const ext = extname(file.originalname)
    cb(null, `uploads/${uuidv4()}${ext}`)
  },
})
```

---

#### **Option C: Vercel Blob (Simplest)**

**Pros:**
- ✅ Integrated with Vercel
- ✅ Simple setup
- ✅ Free tier: 1 GB storage

**Cons:**
- ❌ Small free tier (1 GB)
- ❌ Requires Vercel account
- ❌ Backend must be on Vercel

**Not recommended for Render deployment**

---

### **Solution 2: Add Frontend Validation**

Add file size and type validation before upload:

```typescript
// apps/web/src/app/admin/media/page.tsx

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']

const upload = async (files: FileList | null) => {
  if (!files?.length) return
  
  // Validate files
  const errors: string[] = []
  for (const file of Array.from(files)) {
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: Kích thước vượt quá 10MB`)
    }
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      errors.push(`${file.name}: Định dạng không được hỗ trợ`)
    }
  }
  
  if (errors.length > 0) {
    alert(errors.join('\n'))
    return
  }
  
  setUploading(true)
  try {
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      await apiClient.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    load()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Lỗi khi tải file lên')
  } finally {
    setUploading(false)
  }
}
```

---

### **Solution 3: Add Upload Progress**

Show progress bar during upload:

```typescript
// apps/web/src/app/admin/media/page.tsx

const [uploadProgress, setUploadProgress] = useState<number>(0)

const upload = async (files: FileList | null) => {
  if (!files?.length) return
  setUploading(true)
  setUploadProgress(0)
  
  try {
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      
      await apiClient.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          )
          setUploadProgress(percentCompleted)
        },
      })
    }
    load()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Lỗi khi tải file lên')
  } finally {
    setUploading(false)
    setUploadProgress(0)
  }
}

// In JSX
{uploading && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg">
      <p className="mb-2">Đang tải lên... {uploadProgress}%</p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  </div>
)}
```

---

### **Solution 4: Fix CORS for Production**

Update CORS configuration to handle multiple origins:

```typescript
// apps/api/src/main.ts

const allowedOrigins = [
  'http://localhost:3000',
  'https://duongbo.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
})
```

---

### **Solution 5: Add Image Optimization (Optional)**

Use Sharp to optimize images before upload:

```bash
cd apps/api
pnpm add sharp
```

```typescript
// apps/api/src/media/media.controller.ts

import * as sharp from 'sharp'

@Post('upload')
async upload(@UploadedFile() file: Express.Multer.File) {
  // Optimize image if it's an image
  if (file.mimetype.startsWith('image/')) {
    const optimizedBuffer = await sharp(file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()
    
    // Upload optimized version to Cloudinary
    // ...
  }
  
  // Continue with upload
}
```

---

## 📋 Implementation Plan

### **Phase 1: Critical Fixes (Must Do Before Production)**

1. ✅ **Migrate to Cloudinary** (2-3 hours)
   - Sign up for Cloudinary
   - Install dependencies
   - Update media controller
   - Add environment variables
   - Test uploads

2. ✅ **Fix CORS** (30 min)
   - Update CORS configuration
   - Test from production frontend

3. ✅ **Add Frontend Validation** (1 hour)
   - File size validation
   - File type validation
   - Error messages

### **Phase 2: UX Improvements (Recommended)**

4. ✅ **Add Upload Progress** (1 hour)
   - Progress bar component
   - Upload percentage display

5. ✅ **Better Error Handling** (30 min)
   - Catch upload errors
   - Display user-friendly messages

### **Phase 3: Enhancements (Optional)**

6. ⭕ **Image Optimization** (2 hours)
   - Add Sharp library
   - Resize large images
   - Convert to WebP

7. ⭕ **Duplicate Detection** (1 hour)
   - Hash-based deduplication
   - Show existing file if duplicate

8. ⭕ **Image Metadata** (1 hour)
   - Store width/height
   - Add alt text field
   - SEO improvements

---

## 🚀 Quick Start: Cloudinary Migration

### **Step 1: Sign Up**

1. Go to https://cloudinary.com
2. Sign up (free tier)
3. Get credentials from Dashboard

### **Step 2: Install Dependencies**

```bash
cd apps/api
pnpm add cloudinary multer-storage-cloudinary
```

### **Step 3: Update Code**

See "Solution 1: Option A" above for full code

### **Step 4: Add Environment Variables**

**Local (`.env`):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Render:**
1. Go to Dashboard → duongbo-api
2. Environment tab
3. Add the 3 variables above

**Vercel:**
No changes needed (frontend just displays URLs)

### **Step 5: Test**

1. Start local dev: `pnpm dev`
2. Upload image via admin panel
3. Verify image appears
4. Check Cloudinary dashboard for uploaded file

---

## 📊 Comparison: Storage Options

| Feature | Local Disk | Cloudinary | AWS S3 | Vercel Blob |
|---------|-----------|------------|--------|-------------|
| **Free Tier** | ∞ (local) | 25 GB | 5 GB | 1 GB |
| **Persists on Render** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Auto Optimization** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **CDN** | ❌ No | ✅ Yes | ⚠️ Extra setup | ✅ Yes |
| **Setup Complexity** | ✅ Easy | ✅ Easy | ⚠️ Medium | ✅ Easy |
| **Cost (after free)** | N/A | $0.04/GB | $0.023/GB | $0.15/GB |
| **Best For** | Local dev | **Production** | Enterprise | Vercel-only |

**Recommendation:** 🌟 **Cloudinary** for production deployment

---

## ✅ Testing Checklist

### **Before Deployment**

- [ ] Upload single image (< 1MB)
- [ ] Upload large image (5-10MB)
- [ ] Upload multiple images at once
- [ ] Upload non-image file (PDF)
- [ ] Try uploading file > 10MB (should fail gracefully)
- [ ] Try uploading unsupported format (should fail gracefully)
- [ ] Delete uploaded image
- [ ] Verify deleted image removed from storage
- [ ] Check image displays on frontend
- [ ] Test on mobile device

### **After Deployment**

- [ ] Upload image from production admin panel
- [ ] Verify image persists after Render restart
- [ ] Check image loads on production website
- [ ] Test CORS (no console errors)
- [ ] Verify Cloudinary dashboard shows uploaded files
- [ ] Test image transformations (if using Cloudinary)

---

## 🐛 Common Issues & Solutions

### **Issue: "Unsupported file type" error**

**Cause:** File type not in allowed list

**Fix:** Update `fileFilter` in media controller:
```typescript
fileFilter: (_, file, cb) => {
  const allowed = /\/(jpg|jpeg|png|gif|webp|svg\+xml|pdf)$/
  if (!file.mimetype.match(allowed)) {
    return cb(new BadRequestException('Unsupported file type'), false)
  }
  cb(null, true)
}
```

### **Issue: Images disappear after deployment**

**Cause:** Using local disk storage on Render

**Fix:** Migrate to Cloudinary (see Solution 1)

### **Issue: CORS error when loading images**

**Cause:** Wrong CORS origin configuration

**Fix:** Add production URL to allowed origins:
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://duongbo.vercel.app'],
  credentials: true,
})
```

### **Issue: Upload hangs/freezes**

**Cause:** Large file, no progress indicator

**Fix:** Add upload progress (see Solution 3)

---

## 📞 Support Resources

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Multer Docs:** https://github.com/expressjs/multer
- **NestJS File Upload:** https://docs.nestjs.com/techniques/file-upload

---

## 💰 Cost Estimation

### **Cloudinary Free Tier**
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

**Estimated usage for small website:**
- 100 images × 500 KB = 50 MB storage
- 1,000 visitors × 10 images × 500 KB = 5 GB bandwidth/month

**Conclusion:** Free tier is sufficient for 6-12 months

### **When to Upgrade**

Upgrade to paid plan ($89/month) when:
- Storage > 25 GB
- Bandwidth > 25 GB/month
- Need advanced features (video, AI)

---

**🎯 Priority: Implement Cloudinary migration BEFORE deploying to production!**

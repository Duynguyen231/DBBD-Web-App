# Project Context & Architecture Documentation

## 📋 Project Overview

**Project Name**: Đường Bộ Bình Định (Binh Dinh Road Construction Company)  
**Type**: Corporate Website with CMS  
**Stack**: Monorepo (pnpm workspace)  
**Version**: 1.0.0  
**Package Manager**: pnpm@10.33.0

---

## 🏗️ Architecture

### Monorepo Structure

```
duong-bo-binh-dinh/
├── apps/
│   ├── api/          # NestJS Backend API
│   ├── web/          # Next.js Frontend
│   └── docs/         # Documentation (unused)
├── packages/
│   └── types/        # Shared TypeScript types
├── scripts/          # Setup & verification scripts
└── docs/             # Project documentation
```

---

## 🔧 Technology Stack

### Backend (API)
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7.5.0
- **Authentication**: JWT (passport-jwt)
- **Validation**: class-validator, class-transformer
- **File Upload**: Multer
- **API Docs**: Swagger (NestJS OpenAPI)
- **Password Hashing**: bcryptjs

### Frontend (Web)
- **Framework**: Next.js 16.2.1 (App Router)
- **React**: 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl 4.8.3
- **State Management**: TanStack React Query 5.95.2
- **Forms**: React Hook Form 7.72.0 + Zod 4.3.6
- **Rich Text Editor**: Tiptap 3.20.5
- **HTTP Client**: Axios 1.13.6
- **Icons**: Lucide React 1.7.0
- **Slider**: Swiper 12.1.3

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 16 (Docker)
- **Linting**: ESLint 9
- **Formatting**: Prettier 3.4.2
- **Testing**: Jest 30.0.0

---

## 📦 Backend Modules

### 1. **Auth Module** (`apps/api/src/auth`)
**Purpose**: User authentication and authorization

**Features**:
- JWT-based authentication
- Local strategy (email/password)
- Admin user seeding on startup
- Password hashing with bcryptjs

**Endpoints**:
- `POST /auth/login` - Admin login
- `POST /auth/register` - User registration (admin only)

**Default Admin**:
```
Email: admin@duongbo.com
Password: Admin@123456
```

---

### 2. **News Module** (`apps/api/src/news`)
**Purpose**: News articles management

**Features**:
- CRUD operations for news articles
- Image upload support
- Slug generation
- Pagination & filtering
- Vietnamese & English content

**Endpoints**:
- `GET /news` - List all news (paginated)
- `GET /news/:slug` - Get news by slug
- `POST /news` - Create news (auth required)
- `PATCH /news/:id` - Update news (auth required)
- `DELETE /news/:id` - Delete news (auth required)

**Database Schema**:
```prisma
model News {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  contentVi   String   @db.Text
  contentEn   String   @db.Text
  image       String?
  category    String?
  tags        String[]
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 3. **Projects Module** (`apps/api/src/projects`)
**Purpose**: Construction projects portfolio

**Features**:
- Project showcase
- Multiple images per project
- Status tracking (ONGOING, COMPLETED, UPCOMING)
- Location information
- Bilingual content

**Endpoints**:
- `GET /projects` - List all projects
- `GET /projects/:slug` - Get project by slug
- `POST /projects` - Create project (auth required)
- `PATCH /projects/:id` - Update project (auth required)
- `DELETE /projects/:id` - Delete project (auth required)

**Database Schema**:
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  location    String?
  status      String   @default("ONGOING")
  images      String[]
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 4. **Services Module** (`apps/api/src/services`)
**Purpose**: Company services/fields of activity

**Features**:
- Service catalog
- Image upload
- Ordering/sorting
- Category management

**Endpoints**:
- `GET /services` - List all services
- `GET /services/:id` - Get service by ID
- `POST /services` - Create service (auth required)
- `PATCH /services/:id` - Update service (auth required)
- `DELETE /services/:id` - Delete service (auth required)

**Database Schema**:
```prisma
model Service {
  id          Int      @id @default(autoincrement())
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  image       String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 5. **Products Module** (`apps/api/src/products`)
**Purpose**: Construction materials/products catalog

**Features**:
- Product listing
- Multiple images per product
- Category filtering
- Pagination

**Endpoints**:
- `GET /products` - List all products
- `GET /products/:slug` - Get product by slug
- `POST /products` - Create product (auth required)
- `PATCH /products/:id` - Update product (auth required)
- `DELETE /products/:id` - Delete product (auth required)

**Database Schema**:
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  category    String?
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 6. **Jobs Module** (`apps/api/src/jobs`)
**Purpose**: Job postings/recruitment

**Features**:
- Job listings
- Application deadline tracking
- Requirements & benefits
- Status management (OPEN, CLOSED)

**Endpoints**:
- `GET /jobs` - List all jobs
- `GET /jobs/:slug` - Get job by slug
- `POST /jobs` - Create job (auth required)
- `PATCH /jobs/:id` - Update job (auth required)
- `DELETE /jobs/:id` - Delete job (auth required)

**Database Schema**:
```prisma
model Job {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  requirements String  @db.Text
  benefits    String   @db.Text
  location    String?
  salary      String?
  deadline    DateTime?
  status      String   @default("OPEN")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 7. **Banners Module** (`apps/api/src/banners`)
**Purpose**: Homepage hero slider banners

**Features**:
- Hero banner management
- Image upload
- Ordering/priority
- Active/inactive status

**Endpoints**:
- `GET /banners` - List all banners
- `POST /banners` - Create banner (auth required)
- `PATCH /banners/:id` - Update banner (auth required)
- `DELETE /banners/:id` - Delete banner (auth required)

**Database Schema**:
```prisma
model Banner {
  id          Int      @id @default(autoincrement())
  titleVi     String
  titleEn     String
  subtitleVi  String?
  subtitleEn  String?
  image       String
  link        String?
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 8. **Partners Module** (`apps/api/src/partners`)
**Purpose**: Partner/client logos management

**Features**:
- Partner logo upload
- Website links
- Ordering
- Logo display on homepage

**Endpoints**:
- `GET /partners` - List all partners
- `POST /partners` - Create partner (auth required)
- `PATCH /partners/:id` - Update partner (auth required)
- `DELETE /partners/:id` - Delete partner (auth required)

**Database Schema**:
```prisma
model Partner {
  id          Int      @id @default(autoincrement())
  name        String
  logo        String
  website     String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 9. **Contact Module** (`apps/api/src/contact`)
**Purpose**: Contact form submissions

**Features**:
- Contact form handling
- Email storage
- Message management
- Read/unread status

**Endpoints**:
- `POST /contact` - Submit contact form
- `GET /contact` - List all messages (auth required)
- `PATCH /contact/:id` - Mark as read (auth required)
- `DELETE /contact/:id` - Delete message (auth required)

**Database Schema**:
```prisma
model Contact {
  id          Int      @id @default(autoincrement())
  name        String
  email       String
  phone       String?
  subject     String?
  message     String   @db.Text
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

---

### 10. **Media Module** (`apps/api/src/media`)
**Purpose**: File upload and media management

**Features**:
- Image upload (multer)
- File validation
- Static file serving
- Upload directory management

**Endpoints**:
- `POST /media/upload` - Upload image (auth required)
- `GET /uploads/:filename` - Serve uploaded file

**Configuration**:
```typescript
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760 (10MB)
Allowed formats: jpg, jpeg, png, gif, webp
```

---

### 11. **Settings Module** (`apps/api/src/settings`)
**Purpose**: Global site settings

**Features**:
- Key-value configuration
- Site-wide settings
- Company information

**Endpoints**:
- `GET /settings` - Get all settings
- `GET /settings/:key` - Get setting by key
- `POST /settings` - Create setting (auth required)
- `PATCH /settings/:key` - Update setting (auth required)

**Database Schema**:
```prisma
model Setting {
  id          Int      @id @default(autoincrement())
  key         String   @unique
  value       String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 12. **Prisma Module** (`apps/api/src/prisma`)
**Purpose**: Database connection and ORM

**Features**:
- Prisma Client singleton
- Connection pooling
- Global module
- Auto-disconnect on shutdown

---

## 🌐 Frontend Pages

### Public Pages

#### 1. **Homepage** (`/`)
**File**: `apps/web/src/app/[locale]/page.tsx`

**Sections**:
- Hero slider (banners)
- About section (company intro + gallery)
- Services showcase
- Featured projects
- Latest news
- Partner logos slider
- Statistics section

**Mock Data**:
- 3 news articles with real company images
- 8 partner logos (all petrolimex_logo.jpg)
- Fallback when API returns empty

---

#### 2. **About Pages** (`/gioi-thieu`)
**Base**: `apps/web/src/app/[locale]/gioi-thieu/page.tsx`

**Sub-pages**:
- `/gioi-thieu` - Main about page with company gallery (7 images)
- `/gioi-thieu/lich-su` - Company history
- `/gioi-thieu/su-menh-tam-nhin` - Mission & vision
- `/gioi-thieu/co-cau-to-chuc` - Organization structure
- `/gioi-thieu/doi-ngu-lanh-dao` - Leadership team
- `/gioi-thieu/ho-so-doanh-nghiep` - Company profile

**Features**:
- Tab navigation between sub-pages
- Featured projects section (6 projects with real images)
- Company gallery (7 images)
- Responsive design

---

#### 3. **Services Page** (`/linh-vuc-hoat-dong`)
**File**: `apps/web/src/app/[locale]/linh-vuc-hoat-dong/page.tsx`

**Features**:
- Service slider component
- 5 services with real company images
- Bilingual content (VI/EN)
- Call-to-action section

**Mock Services**:
1. Xây dựng công trình giao thông
2. Quản lý, bảo trì đường bộ
3. Khai thác và sản xuất vật liệu xây dựng
4. Cho thuê máy móc, thiết bị thi công
5. Quản lí, bảo trì cao tốc

---

#### 4. **Products Page** (`/san-pham`)
**File**: `apps/web/src/app/[locale]/san-pham/page.tsx`

**Features**:
- Product slider
- Category filtering
- Product detail pages
- 2 mock products with real images

**Mock Products**:
1. Bê tông nhựa nóng (Hot Mix Asphalt Concrete)
2. Đá xây dựng các loại (Construction Aggregates)

---

#### 5. **Projects Page** (`/cong-trinh`)
**File**: `apps/web/src/app/[locale]/cong-trinh/page.tsx`

**Features**:
- Project grid/slider
- Status badges (Ongoing, Completed, Upcoming)
- Location information
- Project detail pages (`/cong-trinh/[slug]`)

---

#### 6. **News Page** (`/tin-tuc`)
**File**: `apps/web/src/app/[locale]/tin-tuc/page.tsx`

**Features**:
- News grid layout
- Category filtering
- Pagination
- News detail pages (`/tin-tuc/[slug]`)
- Rich text content display

---

#### 7. **Jobs Page** (`/tuyen-dung`)
**File**: `apps/web/src/app/[locale]/tuyen-dung/page.tsx`

**Features**:
- Job listings
- Status indicators (Open/Closed)
- Deadline display
- Job detail pages (`/tuyen-dung/[slug]`)

---

#### 8. **Contact Page** (`/lien-he`)
**File**: `apps/web/src/app/[locale]/lien-he/page.tsx`

**Features**:
- Contact form with validation
- Company information
- Working hours display
- Google Maps integration (placeholder)
- Form submission to API

**Company Info**:
```
Address: 123 Nguyễn Huệ, TP. Quy Nhơn, Bình Định
Phone: (0256) 3822 123
Email: contact@duongbobinhdinh.vn
Working Hours: Thứ 2 – 7: 7:30 – 17:00
```

---

### Admin Pages

#### 1. **Admin Login** (`/admin/login`)
**File**: `apps/web/src/app/admin/login/page.tsx`

**Features**:
- Email/password authentication
- JWT token storage
- Redirect to dashboard on success

---

#### 2. **Admin Dashboard** (`/admin`)
**File**: `apps/web/src/app/admin/page.tsx`

**Features**:
- Statistics overview
- Quick links to all modules
- Recent activity

---

#### 3. **Admin Modules**

All admin pages follow similar CRUD pattern:

| Module | Path | Features |
|--------|------|----------|
| **News** | `/admin/news` | Create, Edit, Delete, Rich text editor |
| **Projects** | `/admin/projects` | CRUD, Multiple images, Status |
| **Services** | `/admin/services` | CRUD, Image upload, Ordering |
| **Products** | `/admin/products` | CRUD, Multiple images, Categories |
| **Jobs** | `/admin/jobs` | CRUD, Deadline, Status |
| **Banners** | `/admin/banners` | CRUD, Image upload, Ordering |
| **Partners** | `/admin/partners` | CRUD, Logo upload, Ordering |
| **Contacts** | `/admin/contacts` | View, Mark as read, Delete |
| **Media** | `/admin/media` | Upload, View, Delete files |
| **Settings** | `/admin/settings` | Key-value configuration |

---

## 🎨 Components

### Layout Components

#### 1. **Header** (`components/layout/Header.tsx`)
**Features**:
- Responsive navigation
- Language switcher (VI/EN)
- Dropdown menus
- Mobile menu
- Active link highlighting

**Navigation Structure**:
```
- Trang chủ (Home)
- Giới thiệu (About)
  - Lịch sử hình thành
  - Sứ mệnh - Tầm nhìn
  - Cơ cấu tổ chức
  - Đội ngũ lãnh đạo
  - Hồ sơ doanh nghiệp
- Lĩnh vực hoạt động (Services)
- Sản phẩm (Products)
- Công trình (Projects)
- Tin tức (News)
- Tuyển dụng (Jobs)
- Liên hệ (Contact)
```

---

#### 2. **Footer** (`components/layout/Footer.tsx`)
**Features**:
- Company information
- Quick links
- Contact details
- Working hours
- Social media links
- Copyright notice

---

### Home Components

#### 1. **HeroSlider** (`components/home/HeroSlider.tsx`)
**Features**:
- Auto-play slider
- Background images
- Title and subtitle
- Navigation dots
- Transition effects
- 6-second interval

---

#### 2. **PartnerSlider** (`components/home/PartnerSlider.tsx`)
**Features**:
- Partner logo display
- 4 logos per row (2 rows = 8 logos max)
- Pagination if more than 8
- Mock logos fallback (8x petrolimex_logo.jpg)
- Hover effects

---

#### 3. **StatsSection** (`components/home/StatsSection.tsx`)
**Features**:
- Company statistics
- Animated counters
- Icon display
- Responsive grid

**Stats Displayed**:
- Years of experience
- Completed projects
- Team members
- Partners

---

### Feature Components

#### 1. **ServiceSlider** (`components/services/ServiceSlider.tsx`)
**Features**:
- Service card display
- Image with overlay
- Title and description
- Swiper integration

---

#### 2. **ProductSlider** (`components/products/ProductSlider.tsx`)
**Features**:
- Product showcase
- Multiple images
- Category badges
- Detail links

---

#### 3. **ProjectSlider** (`components/projects/ProjectSlider.tsx`)
**Features**:
- Project cards
- Status badges
- Location display
- Image gallery

---

### Admin Components

#### 1. **AdminSidebar** (`components/admin/AdminSidebar.tsx`)
**Features**:
- Navigation menu
- Active link highlighting
- Logout button
- Module icons

---

#### 2. **AdminAuthProvider** (`components/admin/AdminAuthProvider.tsx`)
**Features**:
- Auth context
- Token management
- Protected routes
- Auto-redirect

---

## 🌍 Internationalization

### Configuration
**Package**: next-intl 4.8.3  
**Locales**: `vi` (Vietnamese), `en` (English)  
**Default**: `vi`

### Translation Files
- `apps/web/src/messages/vi.json` - Vietnamese translations
- `apps/web/src/messages/en.json` - English translations

### Usage
```typescript
import { useTranslations } from 'next-intl'

const t = useTranslations('nav')
t('home') // "Trang chủ" or "Home"
```

---

## 🗄️ Database Schema

### Complete Prisma Schema

```prisma
// apps/api/prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model News {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  contentVi   String   @db.Text
  contentEn   String   @db.Text
  image       String?
  category    String?
  tags        String[]
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Project {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  location    String?
  status      String   @default("ONGOING")
  images      String[]
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Service {
  id          Int      @id @default(autoincrement())
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  image       String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Product {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  category    String?
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Job {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  titleVi     String
  titleEn     String
  descVi      String   @db.Text
  descEn      String   @db.Text
  requirements String  @db.Text
  benefits    String   @db.Text
  location    String?
  salary      String?
  deadline    DateTime?
  status      String   @default("OPEN")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Banner {
  id          Int      @id @default(autoincrement())
  titleVi     String
  titleEn     String
  subtitleVi  String?
  subtitleEn  String?
  image       String
  link        String?
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Partner {
  id          Int      @id @default(autoincrement())
  name        String
  logo        String
  website     String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Contact {
  id          Int      @id @default(autoincrement())
  name        String
  email       String
  phone       String?
  subject     String?
  message     String   @db.Text
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Setting {
  id          Int      @id @default(autoincrement())
  key         String   @unique
  value       String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔐 Authentication & Authorization

### JWT Strategy
**Package**: @nestjs/jwt, passport-jwt

**Flow**:
1. User logs in with email/password
2. Backend validates credentials
3. Returns JWT token
4. Frontend stores token in localStorage
5. Token sent in Authorization header for protected routes

**Token Structure**:
```typescript
{
  sub: userId,
  email: userEmail,
  iat: issuedAt,
  exp: expiresAt
}
```

**Protected Routes**:
- All POST, PATCH, DELETE endpoints
- Admin panel pages
- Media upload

---

## 📁 File Upload System

### Configuration
**Storage**: Local filesystem  
**Directory**: `apps/api/uploads/`  
**Max Size**: 10MB  
**Allowed Formats**: jpg, jpeg, png, gif, webp

### Upload Flow
1. Admin uploads file via admin panel
2. Multer middleware validates file
3. File saved to `uploads/` directory
4. Filename returned to frontend
5. Stored in database as relative path

### Serving Files
**Static Route**: `/uploads/:filename`  
**Example**: `http://localhost:4000/uploads/image.jpg`

---

## 🎨 Styling System

### Tailwind CSS 4
**Configuration**: `apps/web/tailwind.config.ts`

**Custom Colors**:
```css
:root {
  --primary: #0066CC;
  --primary-dark: #004C99;
  --primary-50: #E6F0FF;
}
```

**Utilities**:
- Responsive breakpoints (sm, md, lg, xl, 2xl)
- Custom spacing scale
- Typography utilities
- Animation utilities

---

## 🖼️ Mock Data & Images

### Mock Data Strategy
**Purpose**: Provide fallback content when database is empty

**Behavior**:
```typescript
const display = apiData?.length > 0 ? apiData : MOCK_DATA
```

### Mock Images Used

**Homepage**:
- News: `1-Họp giao ban.JPG`, `1-Hội trường công ty.JPG`, `1-Phòng làm việc kĩ thuật.jpg`
- Partners: `petrolimex_logo.jpg` (8 copies)

**About Page**:
- Gallery: 7 company images
- Projects: `1-Trạm trộn Bình Đê.png`, `1-TRẠM TRỘN BÌNH ĐÊ.png`, etc.

**Services Page**:
- 5 services with construction site and office images

**Products Page**:
- 2 products with mixing station images

**All images located in**: `apps/web/public/images/`

---

## 🚀 Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Start database
docker compose up -d

# Setup database
cd apps/api
npx prisma generate
npx prisma db push

# Run development servers
pnpm dev
```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs
- Prisma Studio: `pnpm db:studio`

### Build
```bash
# Build all apps
pnpm build

# Build specific app
cd apps/web && pnpm build
cd apps/api && pnpm build
```

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=4000
APP_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=10485760
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 🧪 Testing

### Backend Testing
**Framework**: Jest 30.0.0

```bash
cd apps/api
pnpm test           # Run tests
pnpm test:watch     # Watch mode
pnpm test:cov       # Coverage
```

### Frontend Testing
Currently not configured

---

## 📊 API Documentation

### Swagger UI
**URL**: http://localhost:4000/api/docs

**Features**:
- Interactive API explorer
- Request/response examples
- Schema definitions
- Try-it-out functionality

---

## 🔄 State Management

### React Query
**Package**: @tanstack/react-query 5.95.2

**Usage**:
- Data fetching
- Caching
- Automatic refetching
- Optimistic updates

**Example**:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['news'],
  queryFn: () => fetch('/api/news').then(r => r.json())
})
```

---

## 📱 Responsive Design

### Breakpoints
```typescript
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Mobile-First Approach
All components designed mobile-first with progressive enhancement

---

## 🌟 Key Features Summary

### Public Website
✅ Bilingual (Vietnamese/English)  
✅ Responsive design  
✅ SEO optimized  
✅ Image optimization  
✅ Contact form  
✅ News & blog  
✅ Project portfolio  
✅ Service catalog  
✅ Product showcase  
✅ Job listings  
✅ Partner logos  
✅ Company information  

### Admin Panel
✅ Full CRUD operations  
✅ Image upload  
✅ Rich text editor  
✅ User authentication  
✅ Content management  
✅ Media library  
✅ Settings management  
✅ Contact form submissions  

### Technical
✅ Monorepo architecture  
✅ TypeScript throughout  
✅ API documentation  
✅ Database migrations  
✅ Docker support  
✅ Mock data fallbacks  
✅ Error handling  
✅ Form validation  
✅ File upload  
✅ JWT authentication  

---

## 📚 Additional Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Production deployment guide
- [README.md](../README.md) - Project overview
- [QUICKSTART.md](../QUICKSTART.md) - Quick start guide
- [CHECKLIST.md](../CHECKLIST.md) - Development checklist
- [PROJECT_REVIEW.md](../PROJECT_REVIEW.md) - Code review notes
- [SUMMARY.md](../SUMMARY.md) - Project summary

---

**Last Updated**: April 11, 2026  
**Version**: 1.0.0  
**Maintained By**: Development Team

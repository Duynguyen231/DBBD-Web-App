# Đường Bộ Bình Định

Website doanh nghiệp cho **Công ty Cổ phần Quản lý và Xây dựng Đường Bộ Bình Định**.

## Công nghệ

| Layer     | Stack                                      |
| --------- | ------------------------------------------ |
| Frontend  | Next.js 16, React 19, Tailwind CSS 4       |
| Backend   | NestJS 11, Prisma 7, PostgreSQL 16         |
| Ngôn ngữ  | TypeScript toàn bộ (monorepo pnpm)         |
| Đa ngôn ngữ | next-intl (Tiếng Việt / English)        |

## Cấu trúc thư mục

```
├── apps/
│   ├── web/          # Next.js frontend  (port 3000)
│   └── api/          # NestJS backend    (port 4000)
├── packages/
│   └── types/        # Shared TypeScript types
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Yêu cầu hệ thống

- **Node.js** ≥ 20 (LTS recommended)
- **pnpm** ≥ 10.33 (`npm install -g pnpm@10`)
- **Docker & Docker Compose** (cho PostgreSQL)

## Cài đặt & Chạy

### Quick Start (3 commands)

```bash
git clone <repo-url> duong-bo-binh-dinh
cd duong-bo-binh-dinh
docker compose up -d          # Khởi động PostgreSQL + pgAdmin
pnpm setup                    # Cài đặt deps, tạo .env, push DB schema
pnpm dev                      # Chạy API + Web
```

> Xem chi tiết đầy đủ tại `apps/docs/SETUP.md`

### Truy cập

### Truy cập

- **Website**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin
- **API docs (Swagger)**: http://localhost:4000/api/docs

### Manual Setup (step by step)

```bash
# 1. Clone & install
git clone <repo-url> duong-bo-binh-dinh
cd duong-bo-binh-dinh
pnpm install

# 2. Start database
docker compose up -d

# 3. Copy env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Push schema & generate client
cd apps/api
npx prisma generate
npx prisma db push
cd ../..

# 5. Run dev servers
pnpm dev
```

## Tài khoản Admin mặc định

Khi API khởi động lần đầu, hệ thống tự tạo tài khoản admin:

| Field    | Value              |
| -------- | ------------------ |
| Email    | admin@duongbo.com  |
| Password | Admin@123456       |

> ⚠️ **Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu.**

## Các trang công khai

| Đường dẫn                        | Mô tả                     |
| -------------------------------- | ------------------------- |
| `/`                              | Trang chủ                 |
| `/gioi-thieu`                    | Giới thiệu                |
| `/gioi-thieu/lich-su`            | Lịch sử hình thành        |
| `/gioi-thieu/su-menh-tam-nhin`   | Sứ mệnh & Tầm nhìn       |
| `/gioi-thieu/co-cau-to-chuc`    | Cơ cấu tổ chức            |
| `/gioi-thieu/doi-ngu-lanh-dao`  | Đội ngũ lãnh đạo          |
| `/linh-vuc-hoat-dong`           | Lĩnh vực hoạt động        |
| `/san-pham`                      | Sản phẩm                  |
| `/cong-trinh`                    | Công trình dự án           |
| `/tin-tuc`                       | Tin tức                    |
| `/tuyen-dung`                    | Tuyển dụng                |
| `/lien-he`                       | Liên hệ                   |

Tất cả các trang hỗ trợ 2 ngôn ngữ: `/vi/...` và `/en/...`.

## Trang quản trị (Admin)

Truy cập `/admin` → đăng nhập → quản lý toàn bộ nội dung:

| Mục              | Chức năng                                    |
| ---------------- | -------------------------------------------- |
| Dashboard        | Tổng quan (số tin, dự án, tuyển dụng, liên hệ) |
| Tin tức          | CRUD tin tức, phân loại, editor rich-text     |
| Công trình       | CRUD dự án, trạng thái, hình ảnh              |
| Dịch vụ          | CRUD lĩnh vực hoạt động, sắp xếp thứ tự      |
| Sản phẩm         | CRUD sản phẩm, phân loại                      |
| Tuyển dụng       | CRUD vị trí, trạng thái mở/đóng               |
| Banner           | Quản lý banner theo từng trang                 |
| Đối tác          | Quản lý logo đối tác                           |
| Liên hệ          | Xem form liên hệ, đánh dấu đã đọc             |
| Media            | Upload & quản lý file/hình ảnh                 |
| Cài đặt          | Thông tin công ty, mạng xã hội, footer         |

## API Endpoints

API chạy tại `http://localhost:4000`. Tài liệu đầy đủ tại Swagger UI: `http://localhost:4000/api/docs`.

Các nhóm endpoint chính:

```
POST   /auth/login          # Đăng nhập
GET    /auth/profile         # Thông tin user

GET    /news                 # Danh sách tin tức
POST   /news                 # Tạo tin (auth)
GET    /news/:slug           # Chi tiết tin

GET    /projects             # Danh sách dự án
GET    /services             # Danh sách dịch vụ
GET    /products             # Danh sách sản phẩm
GET    /jobs                 # Danh sách tuyển dụng
GET    /banners              # Danh sách banner
GET    /partners             # Danh sách đối tác

POST   /contact              # Gửi form liên hệ
POST   /media/upload         # Upload file (auth)
GET    /settings             # Cài đặt site
```

## Build production

```bash
# Build toàn bộ
pnpm build

# Hoặc từng app
cd apps/web && pnpm build
cd apps/api && pnpm build
```

Chạy production:

```bash
# API
cd apps/api && pnpm start:prod

# Web
cd apps/web && pnpm start
```

## Lưu ý

- Hình ảnh upload được lưu tại `apps/api/uploads/` và serve static tại `/uploads/*`.
- File `.env` trong repo là cấu hình dev. **Không commit secrets lên production.**
- Đổi `JWT_SECRET` trước khi deploy.
- Cấu hình CORS trong `apps/api/src/main.ts` nếu domain frontend thay đổi.

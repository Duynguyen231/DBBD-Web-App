# Hướng dẫn chạy ứng dụng trên máy local — Chi tiết từng bước

Dành cho người mới, hướng dẫn từ A-Z cách chạy toàn bộ website Đường Bộ Bình Định trên máy tính Windows.

---

## Mục lục

1. [Tổng quan — Ứng dụng gồm những gì?](#1-tổng-quan)
2. [Cài đặt phần mềm cần thiết](#2-cài-đặt-phần-mềm-cần-thiết)
3. [Khởi động Database (PostgreSQL)](#3-khởi-động-database)
4. [Tạo bảng trong Database](#4-tạo-bảng-trong-database)
5. [Chạy ứng dụng](#5-chạy-ứng-dụng)
6. [Kiểm tra và sử dụng](#6-kiểm-tra-và-sử-dụng)
7. [Dừng và tắt ứng dụng](#7-dừng-và-tắt-ứng-dụng)
8. [Xử lý lỗi thường gặp](#8-xử-lý-lỗi-thường-gặp)

---

## 1. Tổng quan

Ứng dụng gồm **3 phần** cần chạy cùng lúc:

```
┌──────────────────────────────────────────────────┐
│                  Trình duyệt                      │
│              http://localhost:3000                 │
└────────────────────┬─────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│    Next.js      │    │    NestJS       │
│  (Giao diện)    │    │   (API dữ liệu)│
│  Port: 3000     │    │   Port: 4000   │
└─────────────────┘    └────────┬────────┘
                                │
                       ┌────────▼────────┐
                       │  PostgreSQL     │
                       │  (Cơ sở dữ liệu)│
                       │  Port: 5432     │
                       └─────────────────┘
```

| Phần | Giải thích | Khi nào cần chạy |
|------|-----------|------------------|
| **PostgreSQL** | Lưu tất cả dữ liệu (tin tức, sản phẩm, user...) | Luôn luôn |
| **NestJS API** | Xử lý logic, nhận/gửi dữ liệu | Luôn luôn |
| **Next.js Web** | Hiển thị giao diện website | Luôn luôn |

> **Nếu không có PostgreSQL**: API không thể khởi động → Website chỉ hiện mock data (dữ liệu mẫu).
>
> **Nếu không có API**: Website vẫn hiển thị nhưng dùng mock data, không có admin panel.
>
> **Nếu có đủ cả 3**: Website hoạt động đầy đủ, có thể thêm/sửa/xóa nội dung qua admin.

---

## 2. Cài đặt phần mềm cần thiết

### 2.1. Node.js (BẮT BUỘC — đã có)

Kiểm tra:
```powershell
node --version
```
Phải hiện `v20.x.x` hoặc cao hơn. Nếu chưa có, tải tại: https://nodejs.org

### 2.2. pnpm (BẮT BUỘC — đã có)

Kiểm tra:
```powershell
pnpm --version
```
Phải hiện `10.x.x`. Nếu chưa có:
```powershell
npm install -g pnpm@10
```

### 2.3. Docker Desktop (BẮT BUỘC — cho PostgreSQL)

**Docker là gì?** Phần mềm giúp chạy PostgreSQL (database) mà không cần cài đặt phức tạp. Giống như chạy 1 "máy ảo nhỏ" chứa PostgreSQL.

#### Cách cài Docker Desktop:

1. **Tải về**: Vào https://www.docker.com/products/docker-desktop/
2. **Click**: "Download for Windows"
3. **Chạy file cài đặt**: `Docker Desktop Installer.exe`
4. **Trong quá trình cài**:
   - ✅ Tick "Use WSL 2 instead of Hyper-V" (nếu có)
   - ✅ Tick "Add shortcut to desktop"
   - Click "OK" / "Install"
5. **Restart máy** khi được yêu cầu
6. **Mở Docker Desktop** từ Desktop hoặc Start Menu
7. **Lần đầu mở**: 
   - Có thể hỏi đăng ký tài khoản → Click "Skip" hoặc "Continue without signing in"
   - Đợi 1-2 phút cho Docker khởi động
   - Khi thấy **"Docker Desktop is running"** ở góc dưới bên trái → sẵn sàng!

#### Kiểm tra Docker đã hoạt động:

Mở **PowerShell** (bất kỳ) và gõ:

```powershell
docker --version
```

**Nếu thấy**: `Docker version 27.x.x` → ✅ Thành công!

**Nếu thấy lỗi**: Docker Desktop chưa chạy → mở Docker Desktop rồi đợi 1 phút, thử lại.

#### Gặp lỗi "WSL 2 installation is incomplete"?

1. Mở PowerShell **với quyền Admin** (chuột phải → "Run as Administrator")
2. Chạy:
```powershell
wsl --install
```
3. Restart máy
4. Mở lại Docker Desktop

#### Gặp lỗi "Hardware assisted virtualization and data execution protection must be enabled"?

- Cần bật **Virtualization** trong BIOS
- Restart → vào BIOS (thường nhấn F2, F10, hoặc Del khi khởi động)
- Tìm "Intel VT-x" hoặc "AMD-V" hoặc "Virtualization" → Enable
- Lưu và restart

---

## 3. Khởi động Database

### 3.1. Đảm bảo Docker Desktop đang chạy

Nhìn ở **System Tray** (góc phải dưới thanh Taskbar) → thấy icon con cá voi Docker → OK.

Nếu không thấy, mở Docker Desktop từ Start Menu và đợi cho nó sẵn sàng.

### 3.2. Mở PowerShell tại thư mục dự án

```powershell
cd "D:\Coding\Web App\Web App"
```

### 3.3. Khởi động PostgreSQL + pgAdmin

```powershell
docker compose up -d
```

**Giải thích**:
- `docker compose` = công cụ chạy nhiều container
- `up` = khởi động
- `-d` = chạy nền (không chiếm terminal)

**Kết quả mong đợi**:
```
[+] Running 3/3
 ✔ Network web-app_default      Created
 ✔ Container duongbo_db         Started
 ✔ Container duongbo_pgadmin    Started
```

### 3.4. Kiểm tra container đang chạy

```powershell
docker compose ps
```

**Kết quả mong đợi**:
```
NAME              STATUS         PORTS
duongbo_db        Up             0.0.0.0:5432->5432/tcp
duongbo_pgadmin   Up             0.0.0.0:5050->80/tcp
```

Cả 2 phải hiện **"Up"**.

### 3.5. Kiểm tra database có kết nối được không

```powershell
docker exec duongbo_db psql -U duongbo -d duongbo_db -c "SELECT 1 as ok;"
```

**Nếu thấy**:
```
 ok
----
  1
```
→ ✅ Database hoạt động!

---

## 4. Tạo bảng trong Database

Database đang trống, cần tạo các bảng (users, news, products...).

### 4.1. Generate Prisma Client

```powershell
cd "D:\Coding\Web App\Web App\apps\api"
npx prisma generate
```

**Kết quả mong đợi**:
```
✔ Generated Prisma Client
```

### 4.2. Chạy Prisma db push

```powershell
npx prisma db push
```

**Kết quả mong đợi**:
```
🚀 Your database is now in sync with your Prisma schema.
```

### 4.3. Kiểm tra bằng Prisma Studio (tuỳ chọn)

```powershell
npx prisma studio
```

Tự mở trình duyệt tại `http://localhost:5555` — bạn sẽ thấy danh sách các bảng: User, News, Product, Project, Job, Banner, Partner...

Nhấn `Ctrl+C` trong terminal để tắt Prisma Studio.

### 4.4. Quay lại thư mục gốc

```powershell
cd "D:\Coding\Web App\Web App"
```

---

## 5. Chạy ứng dụng

### 5.1. Chạy cả API + Web cùng lúc

```powershell
pnpm dev
```

**Giải thích**: Lệnh này chạy song song:
- `apps/api` → NestJS API tại port 4000
- `apps/web` → Next.js website tại port 3000

**Kết quả mong đợi** (sau 10-30 giây):
```
api: API running on http://localhost:4000
api: Swagger docs: http://localhost:4000/api/docs
web: ▲ Next.js 16.2.1
web: - Local: http://localhost:3000
```

> **Lưu ý**: Terminal này phải để mở. Nếu đóng terminal → ứng dụng sẽ tắt.

### 5.2. Chạy riêng từng phần (tuỳ chọn)

Nếu muốn chạy riêng (mỗi cái 1 terminal):

**Terminal 1 — API**:
```powershell
cd "D:\Coding\Web App\Web App\apps\api"
pnpm dev
```

**Terminal 2 — Web**:
```powershell
cd "D:\Coding\Web App\Web App\apps\web"
pnpm dev
```

---

## 6. Kiểm tra và sử dụng

### 6.1. Các URL quan trọng

| URL | Chức năng | Ghi chú |
|-----|-----------|---------|
| http://localhost:3000 | Website chính (tiếng Việt) | Trang chủ |
| http://localhost:3000/vi | Website tiếng Việt | Đầy đủ |
| http://localhost:3000/en | Website tiếng Anh | Đầy đủ |
| http://localhost:3000/admin | Trang quản trị | Cần đăng nhập |
| http://localhost:4000 | API root | Hiện "Hello World!" |
| http://localhost:4000/api/docs | Swagger API docs | Test API trực tiếp |
| http://localhost:5050 | pgAdmin (quản lý DB) | Xem/sửa dữ liệu |
| http://localhost:5555 | Prisma Studio | Chỉ khi chạy `npx prisma studio` |

### 6.2. Đăng nhập Admin

Khi API khởi động lần đầu, nó tự tạo tài khoản admin:

| Thông tin | Giá trị |
|-----------|---------|
| Email | `admin@duongbo.com` |
| Mật khẩu | `Admin@123456` |
| Vai trò | SUPER_ADMIN |

**Cách đăng nhập qua Swagger**:

1. Mở http://localhost:4000/api/docs
2. Tìm `POST /auth/login` → click "Try it out"
3. Nhập:
```json
{
  "email": "admin@duongbo.com",
  "password": "Admin@123456"
}
```
4. Click "Execute"
5. Copy giá trị `access_token` từ Response
6. Scroll lên trên cùng → click nút **"Authorize"** (ổ khóa)
7. Paste token → click "Authorize"
8. Giờ bạn có thể dùng tất cả API cần xác thực (có biểu tượng khóa)

### 6.3. Thêm nội dung mẫu qua Swagger

#### Upload 1 ảnh:
1. Tìm `POST /media/upload`
2. Click "Try it out"
3. Chọn file ảnh (jpg, png...)
4. Click "Execute"
5. Copy `url` từ response (ví dụ: `/uploads/abc123.jpg`)

#### Tạo 1 tin tức:
1. Tìm `POST /news`
2. Click "Try it out"
3. Nhập:
```json
{
  "titleVi": "Tin tức đầu tiên",
  "titleEn": "First news article",
  "excerptVi": "Tóm tắt bài viết",
  "excerptEn": "Article summary",
  "contentVi": "Nội dung chi tiết bài viết...",
  "contentEn": "Detailed article content...",
  "thumbnail": "/uploads/abc123.jpg"
}
```
4. Click "Execute"

#### Tạo 1 banner:
1. Tìm `POST /banners`
2. Nhập:
```json
{
  "image": "/uploads/abc123.jpg",
  "titleVi": "Banner trang chủ",
  "titleEn": "Homepage banner",
  "order": 1,
  "page": "home"
}
```

### 6.4. Sử dụng pgAdmin (xem database)

1. Mở http://localhost:5050
2. Đăng nhập:
   - Email: `admin@duongbo.com`
   - Password: `admin`
3. Thêm server:
   - Click "Add New Server"
   - Tab "General": Name = `duongbo`
   - Tab "Connection":
     - Host name: `duongbo_db` (tên container)
     - Port: `5432`
     - Username: `duongbo`
     - Password: `duongbo_secret`
   - Click "Save"

> **Lưu ý**: pgAdmin chạy trong Docker nên dùng tên container `duongbo_db` làm hostname
4. Mở: Servers → duongbo → Databases → duongbo_db → Schemas → public → Tables
5. Click phải vào table → "View/Edit Data" → "All Rows"

> **Nếu không kết nối được**: Thử các hostname khác: `postgres`, `host.docker.internal`, hoặc `172.17.0.1`

---

## 7. Dừng và tắt ứng dụng

### 7.1. Tắt API + Web

Trong terminal đang chạy `pnpm dev`:
- Nhấn `Ctrl + C`

### 7.2. Tắt Database

```powershell
cd "D:\Coding\Web App\Web App"
docker compose stop
```

### 7.3. Tắt hoàn toàn (xoá container, giữ data)

```powershell
docker compose down
```

### 7.4. Xoá tất cả kể cả dữ liệu (reset hoàn toàn)

```powershell
docker compose down -v
```

> ⚠️ Lệnh này xoá toàn bộ dữ liệu trong database! Chỉ dùng khi muốn làm lại từ đầu.

### 7.5. Bảng tóm tắt

| Muốn làm gì | Lệnh |
|-------------|------|
| Chạy database | `docker compose up -d` |
| Kiểm tra database | `docker compose ps` |
| Chạy app | `pnpm dev` |
| Tắt app | `Ctrl + C` |
| Tắt database | `docker compose stop` |
| Xoá tất cả | `docker compose down -v` |

---

## 8. Xử lý lỗi thường gặp

### ❌ "docker: command not found" hoặc "docker is not recognized"

**Nguyên nhân**: Docker Desktop chưa cài hoặc chưa chạy.

**Cách sửa**:
1. Mở Docker Desktop từ Start Menu
2. Đợi đến khi thấy "Docker Desktop is running"
3. Thử lại lệnh

---

### ❌ "Error: P1001: Can't reach database server"

**Nguyên nhân**: PostgreSQL chưa chạy.

**Cách sửa**:
```powershell
cd "D:\Coding\Web App\Web App"
docker compose up -d
docker compose ps    # Kiểm tra cả 2 container "Up"
```
Rồi thử lại `npx prisma db push` hoặc `pnpm dev`.

---

### ❌ "Port 5432 is already in use"

**Nguyên nhân**: PostgreSQL đã được cài sẵn trên máy hoặc container cũ đang chạy.

**Cách sửa**:
```powershell
# Xem cái gì đang dùng port 5432
netstat -ano | findstr :5432

# Nếu là container cũ, tắt nó
docker compose down

# Nếu là PostgreSQL cài trên máy, tắt service
Stop-Service postgresql-x64-16
```

---

### ❌ "Port 3000 is already in use"

**Nguyên nhân**: Có app khác (hoặc lần chạy trước) đang dùng port 3000.

**Cách sửa**:
```powershell
# Tìm và tắt process trên port 3000
netstat -ano | findstr :3000
# Ghi lại PID (số cuối cùng) rồi kill nó:
taskkill /PID <số_pid> /F
```

---

### ❌ "Module not found" khi chạy pnpm dev

**Nguyên nhân**: Chưa cài dependencies.

**Cách sửa**:
```powershell
cd "D:\Coding\Web App\Web App"
pnpm install
```

---

### ❌ Website hiện nhưng không có dữ liệu (chỉ mock data)

**Nguyên nhân**: API không chạy hoặc database trống.

**Kiểm tra**:
1. Mở http://localhost:4000 → phải thấy "Hello World!"
2. Nếu không thấy → API chưa chạy
3. Nếu thấy → Database trống, cần thêm nội dung qua Swagger (xem mục 6.3)

---

### ❌ Docker Desktop rất chậm / lag

**Cách sửa**:
1. Mở Docker Desktop → Settings (⚙️) → Resources
2. Giảm Memory xuống 2GB
3. Giảm CPUs xuống 2
4. Click "Apply & restart"

---

### ❌ "WSL 2 is not installed"

**Cách sửa**:
1. Mở PowerShell **với quyền Admin**
2. Chạy:
```powershell
wsl --install
```
3. Restart máy
4. Mở lại Docker Desktop

---

## Tóm tắt nhanh — Chạy hàng ngày

Mỗi lần muốn làm việc với dự án, chỉ cần 3 lệnh:

```powershell
# 1. Mở Docker Desktop (nếu chưa mở)
#    → Click icon Docker Desktop trên desktop

# 2. Khởi động database
cd "D:\Coding\Web App\Web App"
docker compose up -d

# 3. Chạy ứng dụng
pnpm dev
```

Mở trình duyệt → http://localhost:3000 → Website chạy! 🎉

Khi xong việc:
```powershell
# Ctrl+C để tắt app
docker compose stop
```

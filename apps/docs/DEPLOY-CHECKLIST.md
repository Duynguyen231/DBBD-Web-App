# Deployment Guide — Beginner-Friendly

Hướng dẫn deploy website Đường Bộ Bình Định lên server thật, từng bước một cho người mới.

---

## Tổng quan: Website hoạt động như thế nào?

```
Người dùng (trình duyệt)
        │
        ▼
   ┌─────────┐
   │  Nginx  │  ← Web server, nhận request từ internet
   └────┬────┘
        │
   ┌────┴────────────────┐
   │                     │
   ▼                     ▼
┌──────────┐      ┌───────────┐
│ Next.js  │      │  NestJS   │
│ (Web)    │      │  (API)    │
│ port 3000│      │  port 4000│
└──────────┘      └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │PostgreSQL │
                  │(Database) │
                  │ port 5432 │
                  └───────────┘
```

**Giải thích đơn giản:**
- **Nginx**: Cổng chính, nhận mọi request từ internet rồi chuyển đến Next.js hoặc NestJS
- **Next.js (Web)**: Hiển thị giao diện website cho người dùng
- **NestJS (API)**: Xử lý dữ liệu (tin tức, sản phẩm, tuyển dụng...)
- **PostgreSQL**: Lưu trữ tất cả dữ liệu

---

## Cần chuẩn bị gì?

### Mua / Đăng ký

- [ ] **Tên miền** (ví dụ: `duongbobinhdinh.vn`)
  - Mua tại: [Nhân Hòa](https://nhanhoa.com), [P.A Vietnam](https://pavietnam.vn), [Tenten](https://tenten.vn), [MatBao](https://matbao.net)
  - Miền `.vn`: ~350k-500k VNĐ/năm
  - Miền `.com`: ~250k VNĐ/năm

- [ ] **VPS (máy chủ ảo)** — máy tính trên cloud chạy 24/7
  - Cấu hình tối thiểu: **2 vCPU, 2GB RAM, 40GB SSD, Ubuntu 24**

  | Nhà cung cấp | Giá | Vị trí | Ghi chú |
  |---------------|-----|--------|---------|
  | [AZDIGI](https://azdigi.com) | ~100-200k/tháng | Việt Nam | Rẻ nhất, hỗ trợ tiếng Việt |
  | [Tinohost](https://tinohost.com) | ~150-250k/tháng | Việt Nam | Hỗ trợ tiếng Việt tốt |
  | [Vultr](https://vultr.com) | ~$6/tháng (~150k) | Singapore | Quốc tế, ổn định |
  | [DigitalOcean](https://digitalocean.com) | ~$6/tháng (~150k) | Singapore | Tài liệu tốt cho người mới |

### Cài trên máy Windows của bạn

- [ ] **Git** — [Tải tại đây](https://git-scm.com/download/win) (để đẩy code lên)
- [ ] **SSH client** — Windows Terminal (có sẵn) hoặc [MobaXterm](https://mobaxterm.mobatek.net) (dễ dùng hơn)

### Tạo tài khoản

- [ ] **GitHub** — [github.com](https://github.com) (miễn phí, lưu code online)

---

## Giai đoạn 1: Chuẩn bị code (Trên máy Windows)

### Bước 1.1: Khởi tạo Git

Mở PowerShell tại thư mục `D:\Coding\Web App`:

```powershell
git init
git add .
git commit -m "Initial commit"
```

### Bước 1.2: Đẩy lên GitHub

1. Vào [github.com/new](https://github.com/new)
2. Tạo repository mới (tên: `duongbo-website`, chọn **Private**)
3. Chạy lệnh:

```powershell
git remote add origin https://github.com/TEN_GITHUB/duongbo-website.git
git branch -M main
git push -u origin main
```

### Bước 1.3: Kiểm tra

- [ ] Vào URL repo trên GitHub → thấy đầy đủ file
- [ ] File `.env` KHÔNG bị upload lên (đã có trong `.gitignore`)

---

## Giai đoạn 2: Thiết lập VPS

### Bước 2.1: Kết nối SSH vào VPS

Sau khi mua VPS, nhà cung cấp sẽ cho bạn:
- **Địa chỉ IP** (ví dụ: `103.xxx.xxx.xxx`)
- **Mật khẩu root**

Kết nối từ PowerShell trên máy Windows:

```powershell
ssh root@103.xxx.xxx.xxx
```

Gõ `yes` khi được hỏi, sau đó nhập mật khẩu.

> **Mẹo**: Nếu dùng MobaXterm, click "Session" → "SSH" → nhập IP và username.

### Bước 2.2: Tạo user mới (bảo mật)

```bash
adduser duongbo
usermod -aG sudo duongbo
```

Đặt mật khẩu mạnh. Từ giờ dùng user này:

```bash
su - duongbo
```

### Bước 2.3: Cài đặt tất cả phần mềm cần thiết

Copy và paste **toàn bộ** block lệnh này:

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Cài pnpm (quản lý package)
sudo npm install -g pnpm@10

# Cài PM2 (giữ app chạy 24/7)
sudo npm install -g pm2

# Cài PostgreSQL 16 (cơ sở dữ liệu)
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16

# Cài Nginx (web server)
sudo apt install -y nginx

# Cài Certbot (chứng chỉ SSL miễn phí)
sudo apt install -y certbot python3-certbot-nginx

# Cài Git
sudo apt install -y git
```

### Bước 2.4: Kiểm tra cài đặt

```bash
node --version      # v20.x.x
pnpm --version      # 10.x.x
pm2 --version       # 5.x.x
psql --version      # 16.x
nginx -v            # nginx/1.x.x
git --version       # git version 2.x.x
```

- [ ] Tất cả 6 lệnh đều hiện số phiên bản (không lỗi)

---

## Giai đoạn 3: Thiết lập Database

### Bước 3.1: Tạo Database & User

```bash
sudo -u postgres psql
```

Sẽ thấy dấu nhắc `postgres=#`. Gõ từng lệnh:

```sql
CREATE USER duongbo WITH PASSWORD 'mat_khau_manh_cua_ban';
CREATE DATABASE duongbo_db OWNER duongbo;
GRANT ALL PRIVILEGES ON DATABASE duongbo_db TO duongbo;
\q
```

> **Quan trọng**: Thay `mat_khau_manh_cua_ban` bằng mật khẩu thật (ví dụ: `Db@2026!xK9mP`). **Ghi lại** — sẽ cần dùng sau.

### Bước 3.2: Kiểm tra kết nối

```bash
psql -U duongbo -d duongbo_db -h localhost
```

Nhập mật khẩu. Nếu thấy `duongbo_db=>` là thành công! Gõ `\q` để thoát.

- [ ] Kết nối database thành công

---

## Giai đoạn 4: Deploy ứng dụng

### Bước 4.1: Clone code

```bash
sudo mkdir -p /var/www
sudo chown duongbo:duongbo /var/www
cd /var/www
git clone https://github.com/TEN_GITHUB/duongbo-website.git duongbo
cd duongbo
```

### Bước 4.2: Cài dependencies

```bash
pnpm install
```

> Đợi 2-5 phút cho đến khi xong.

### Bước 4.3: Tạo file môi trường

**File API** (`apps/api/.env`):

```bash
nano apps/api/.env
```

Paste nội dung sau (sửa lại mật khẩu và domain):

```env
DATABASE_URL="postgresql://duongbo:mat_khau_manh_cua_ban@localhost:5432/duongbo_db?schema=public"
JWT_SECRET="thay_bang_chuoi_ngau_nhien"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="https://ten-mien-cua-ban.com"
```

Tạo chuỗi JWT ngẫu nhiên:

```bash
openssl rand -hex 32
```

Copy kết quả, paste vào chỗ `thay_bang_chuoi_ngau_nhien`.

> **Cách dùng nano**: Dùng phím mũi tên di chuyển, sửa text, rồi `Ctrl+O` → Enter để lưu, `Ctrl+X` để thoát.

**File Web** (`apps/web/.env.local`):

```bash
echo 'NEXT_PUBLIC_API_URL=https://ten-mien-cua-ban.com/api' > apps/web/.env.local
```

### Bước 4.4: Tạo bảng trong Database

```bash
cd apps/api
npx prisma db push
cd ../..
```

- [ ] Hiện "Your database is now in sync with your Prisma schema"

### Bước 4.5: Tạo thư mục uploads

```bash
mkdir -p apps/api/uploads
```

### Bước 4.6: Build ứng dụng

```bash
pnpm build
```

> Đợi 3-10 phút. Nếu hết RAM, xem phần "Xử lý lỗi" ở cuối.

- [ ] Build thành công (không có lỗi đỏ)

---

## Giai đoạn 5: Khởi chạy ứng dụng

### Bước 5.1: Tạo file cấu hình PM2

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'duongbo-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'duongbo-web',
      cwd: './apps/web',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
EOF
```

### Bước 5.2: Khởi chạy

```bash
pm2 start ecosystem.config.js
```

### Bước 5.3: Kiểm tra

```bash
pm2 status
```

Phải thấy:

```
┌─────────────────┬────┬─────────┐
│ name            │ id │ status  │
├─────────────────┼────┼─────────┤
│ duongbo-api     │ 0  │ online  │
│ duongbo-web     │ 1  │ online  │
└─────────────────┴────┴─────────┘
```

- [ ] Cả 2 đều hiện `online` (không phải `errored`)

### Bước 5.4: Tự khởi động khi reboot

```bash
pm2 save
pm2 startup
```

PM2 sẽ in ra 1 lệnh bắt đầu bằng `sudo env PATH=...` → copy và chạy lệnh đó.

---

## Giai đoạn 6: Cấu hình Nginx

### Bước 6.1: Tạo file cấu hình

```bash
sudo nano /etc/nginx/sites-available/duongbo
```

Paste toàn bộ (thay `ten-mien-cua-ban.com` bằng domain thật):

```nginx
server {
    listen 80;
    server_name ten-mien-cua-ban.com www.ten-mien-cua-ban.com;

    # API — chuyển /api/* đến NestJS
    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }

    # File upload — phục vụ ảnh đã upload
    location /uploads/ {
        alias /var/www/duongbo/apps/api/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend — mọi thứ khác đến Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Lưu: `Ctrl+O` → Enter → `Ctrl+X`

### Bước 6.2: Kích hoạt

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/duongbo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

- [ ] `nginx -t` hiện "syntax is ok"

### Bước 6.3: Test bằng IP

Mở trình duyệt: `http://103.xxx.xxx.xxx` (IP VPS của bạn)

- [ ] Thấy website hiển thị!

---

## Giai đoạn 7: Kết nối tên miền

### Bước 7.1: Cấu hình DNS

Vào trang quản lý DNS của nhà đăng ký tên miền, thêm:

| Loại | Tên | Giá trị | TTL |
|------|-----|---------|-----|
| A | @ | `103.xxx.xxx.xxx` (IP VPS) | 300 |
| A | www | `103.xxx.xxx.xxx` (IP VPS) | 300 |

### Bước 7.2: Chờ DNS cập nhật

DNS mất 5 phút đến 24 giờ. Kiểm tra tại: https://dnschecker.org

### Bước 7.3: Test

Mở: `http://ten-mien-cua-ban.com`

- [ ] Website load qua tên miền

---

## Giai đoạn 8: Bật HTTPS (SSL)

### Bước 8.1: Lấy chứng chỉ SSL miễn phí

```bash
sudo certbot --nginx -d ten-mien-cua-ban.com -d www.ten-mien-cua-ban.com
```

- Nhập email khi được hỏi
- Đồng ý điều khoản (Y)
- Chọn redirect HTTP sang HTTPS (option 2)

### Bước 8.2: Kiểm tra

Mở: `https://ten-mien-cua-ban.com`

- [ ] Thấy biểu tượng khóa 🔒 trên thanh địa chỉ
- [ ] Website hoạt động bình thường qua HTTPS

### Bước 8.3: Kiểm tra tự gia hạn

```bash
sudo certbot renew --dry-run
```

- [ ] Không lỗi — SSL sẽ tự gia hạn mỗi 90 ngày

---

## Giai đoạn 9: Bật Firewall (bảo mật)

```bash
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
```

Gõ `y` khi được hỏi.

- [ ] Firewall đã bật

---

## Giai đoạn 10: Thiết lập sau deploy

### Bước 10.1: Đăng nhập Admin

1. Mở `https://ten-mien-cua-ban.com/admin`
2. Đăng nhập:
   - Email: `admin@duongbo.com`
   - Mật khẩu: `Admin@123456`

### Bước 10.2: Đổi mật khẩu admin ngay!

Đổi qua Swagger API tại `https://ten-mien-cua-ban.com/api/docs`

### Bước 10.3: Thêm nội dung

Dùng Swagger hoặc admin panel, thêm theo thứ tự:

1. [ ] Upload ảnh banner cho trang chủ
2. [ ] Thêm lĩnh vực hoạt động (services)
3. [ ] Tạo danh mục tin tức, rồi thêm bài viết
4. [ ] Thêm sản phẩm
5. [ ] Thêm công trình
6. [ ] Thêm logo đối tác
7. [ ] Thêm tin tuyển dụng (nếu có)

---

## Cách cập nhật website sau này

### Trên máy Windows:

```powershell
cd "D:\Coding\Web App"
git add .
git commit -m "Mo ta thay doi"
git push
```

### Trên VPS (SSH vào):

```bash
cd /var/www/duongbo
git pull
pnpm install
pnpm build
pm2 restart all
```

Xong! Thay đổi sẽ lên live trong 1-2 phút.

---

## Kiểm tra hệ thống

```bash
pm2 status                      # Trạng thái app
pm2 logs                        # Xem log lỗi
sudo systemctl status nginx     # Trạng thái Nginx
sudo systemctl status postgresql # Trạng thái Database
```

---

## Xử lý lỗi thường gặp

### "502 Bad Gateway"
App bị crash. Kiểm tra log và restart:
```bash
pm2 logs --lines 50
pm2 restart all
```

### "Database connection refused"
PostgreSQL chưa chạy:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### "Permission denied"
Sửa quyền file:
```bash
sudo chown -R duongbo:duongbo /var/www/duongbo
```

### "CORS error" trên trình duyệt
Kiểm tra `FRONTEND_URL` trong `apps/api/.env` đúng domain (bao gồm `https://`).

### Website load nhưng thiếu ảnh
Kiểm tra thư mục uploads:
```bash
ls -la /var/www/duongbo/apps/api/uploads/
```

### Build lỗi "out of memory"
VPS thiếu RAM. Thêm swap:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Backup (Nên làm hàng tuần)

```bash
# Backup database
pg_dump -U duongbo duongbo_db > ~/backup_$(date +%Y%m%d).sql

# Backup file upload
tar -czf ~/uploads_backup_$(date +%Y%m%d).tar.gz /var/www/duongbo/apps/api/uploads/
```

---

## Tổng hợp Checklist

### Trước khi deploy
- [ ] Đã mua tên miền
- [ ] Đã mua VPS (2GB RAM, Ubuntu 24)
- [ ] Đã tạo tài khoản GitHub
- [ ] Đã cài Git trên Windows
- [ ] Đã push code lên GitHub

### Thiết lập server
- [ ] SSH vào VPS thành công
- [ ] Đã cài Node.js, pnpm, PM2, PostgreSQL, Nginx, Certbot
- [ ] Đã tạo user riêng (không dùng root)
- [ ] Đã tạo database với user và password
- [ ] Đã clone code vào `/var/www/duongbo`
- [ ] Đã tạo file `.env` với giá trị đúng
- [ ] `prisma db push` thành công
- [ ] `pnpm build` thành công

### Chạy & Kết nối
- [ ] PM2 hiện cả 2 app `online`
- [ ] Website truy cập được qua IP
- [ ] Đã cấu hình DNS (bản ghi A)
- [ ] Website truy cập được qua tên miền
- [ ] SSL hoạt động (HTTPS có biểu tượng khóa)
- [ ] Firewall đã bật (chỉ port 22, 80, 443)

### Sau khi deploy
- [ ] Đã đổi mật khẩu admin mặc định
- [ ] Đã thêm nội dung (banner, tin tức, sản phẩm...)
- [ ] Đã thiết lập backup

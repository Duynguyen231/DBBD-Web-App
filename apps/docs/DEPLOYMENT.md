# Deployment Guide

Guide for deploying the Đường Bộ Bình Định application to production.

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Nginx /    │────▶│  Next.js    │────▶│   NestJS     │
│  Reverse     │     │  Web App    │     │   REST API   │
│  Proxy       │     │  :3000      │     │   :4000      │
└─────────────┘     └─────────────┘     └──────┬───────┘
                                                │
                                         ┌──────▼───────┐
                                         │ PostgreSQL   │
                                         │ :5432        │
                                         └──────────────┘
```

---

## Option 1: VPS / Dedicated Server (Recommended for Vietnam hosting)

### Server Requirements

| Resource | Minimum     | Recommended |
| -------- | ----------- | ----------- |
| CPU      | 1 vCPU      | 2 vCPU      |
| RAM      | 1 GB        | 2 GB        |
| Disk     | 20 GB SSD   | 40 GB SSD   |
| OS       | Ubuntu 22+  | Ubuntu 24   |

### Step 1: Install System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm@10

# Install PostgreSQL 16
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update && sudo apt install -y postgresql-16

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### Step 2: Configure PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER duongbo WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE duongbo_db OWNER duongbo;
GRANT ALL PRIVILEGES ON DATABASE duongbo_db TO duongbo;
\q
```

### Step 3: Clone & Build

```bash
# Clone project
cd /var/www
git clone <your-repo-url> duongbo
cd duongbo

# Install dependencies
pnpm install

# Setup environment
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL="postgresql://duongbo:STRONG_PASSWORD_HERE@localhost:5432/duongbo_db?schema=public"
JWT_SECRET="GENERATE_A_STRONG_RANDOM_SECRET"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="https://duongbobinhdinh.vn"
```

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://duongbobinhdinh.vn/api
```

```bash
# Migrate database
cd apps/api
npx prisma migrate deploy
cd ../..

# Build all
pnpm build
```

### Step 4: PM2 Process Management

Create `ecosystem.config.js` at project root:

```js
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
```

```bash
# Start services
pm2 start ecosystem.config.js

# Save PM2 config (auto-restart on reboot)
pm2 save
pm2 startup
```

### Step 5: Nginx Reverse Proxy

Create `/etc/nginx/sites-available/duongbo`:

```nginx
server {
    listen 80;
    server_name duongbobinhdinh.vn www.duongbobinhdinh.vn;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name duongbobinhdinh.vn www.duongbobinhdinh.vn;

    # SSL (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/duongbobinhdinh.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/duongbobinhdinh.vn/privkey.pem;

    # API proxy
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

    # Uploaded files
    location /uploads/ {
        alias /var/www/duongbo/apps/api/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend
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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/duongbo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d duongbobinhdinh.vn -d www.duongbobinhdinh.vn

# Auto-renew (already configured by certbot)
sudo certbot renew --dry-run
```

---

## Option 2: Docker Compose (Production)

Create `docker-compose.prod.yml`:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: duongbo
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: duongbo_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    restart: always
    environment:
      DATABASE_URL: postgresql://duongbo:${DB_PASSWORD}@postgres:5432/duongbo_db?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      PORT: 4000
      FRONTEND_URL: https://duongbobinhdinh.vn
    volumes:
      - uploads:/app/uploads
    depends_on:
      - postgres
    networks:
      - internal

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: https://duongbobinhdinh.vn/api
    depends_on:
      - api
    networks:
      - internal

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
      - uploads:/uploads:ro
    depends_on:
      - api
      - web
    networks:
      - internal

volumes:
  postgres_data:
  uploads:

networks:
  internal:
```

```bash
# Create .env for production secrets
echo 'DB_PASSWORD=strong_random_password' > .env.prod
echo 'JWT_SECRET=strong_random_jwt_secret' >> .env.prod

# Deploy
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

---

## Updating in Production

### VPS (PM2)

```bash
cd /var/www/duongbo
git pull origin main
pnpm install
cd apps/api && npx prisma migrate deploy && cd ../..
pnpm build
pm2 restart all
```

### Docker

```bash
docker compose -f docker-compose.prod.yml down
git pull origin main
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

---

## Backup Strategy

### Database Backup

```bash
# Manual backup
pg_dump -U duongbo -h localhost duongbo_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U duongbo -h localhost duongbo_db < backup_20260328.sql
```

### Automated Daily Backup (cron)

```bash
crontab -e
# Add:
0 2 * * * pg_dump -U duongbo duongbo_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Upload Files Backup

```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/duongbo/apps/api/uploads/
```

---

## Security Checklist

- [ ] Change default admin password after first login
- [ ] Set strong `JWT_SECRET` (use `openssl rand -hex 32`)
- [ ] Set strong PostgreSQL password
- [ ] Enable UFW firewall: only allow 80, 443, 22
- [ ] SSL/TLS enabled via Let's Encrypt
- [ ] `FRONTEND_URL` env restricts CORS to your domain
- [ ] Regular system updates: `sudo apt update && sudo apt upgrade`
- [ ] Database backup cron job configured
- [ ] Upload directory permissions: readable by nginx, writable by API only

---

## Monitoring

```bash
# Check PM2 status
pm2 status
pm2 logs

# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check PostgreSQL
sudo systemctl status postgresql
```

/**
 * Project Verification Script
 * Checks if all required files and configurations are in place
 * 
 * Usage: node scripts/verify.mjs
 */

import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

let errors = 0
let warnings = 0

function log(msg, emoji = '✅') {
  console.log(`${emoji} ${msg}`)
}

function warn(msg) {
  warnings++
  console.log(`⚠️  ${msg}`)
}

function error(msg) {
  errors++
  console.log(`❌ ${msg}`)
}

function checkFile(path, description) {
  if (existsSync(path)) {
    log(`${description} exists`)
    return true
  } else {
    error(`${description} missing: ${path}`)
    return false
  }
}

function checkFileContent(path, searchString, description) {
  if (!existsSync(path)) {
    error(`${description}: File not found`)
    return false
  }
  const content = readFileSync(path, 'utf-8')
  if (content.includes(searchString)) {
    log(`${description} configured`)
    return true
  } else {
    error(`${description}: Missing "${searchString}"`)
    return false
  }
}

console.log('\n🔍 Verifying Project Structure...\n')

// ── Root Files ───────────────────────────────────────────────────────────────
console.log('📦 Root Configuration:')
checkFile(join(root, 'package.json'), 'Root package.json')
checkFile(join(root, 'pnpm-workspace.yaml'), 'pnpm workspace config')
checkFile(join(root, 'docker-compose.yml'), 'Docker Compose config')
checkFile(join(root, 'README.md'), 'README')
checkFile(join(root, 'QUICKSTART.md'), 'Quick Start Guide')
checkFile(join(root, 'DEPLOYMENT.md'), 'Deployment Guide')
checkFile(join(root, 'PROJECT_REVIEW.md'), 'Project Review')

// ── Frontend Files ───────────────────────────────────────────────────────────
console.log('\n🌐 Frontend (Next.js):')
checkFile(join(root, 'apps', 'web', 'package.json'), 'Web package.json')
checkFile(join(root, 'apps', 'web', 'next.config.ts'), 'Next.js config')
checkFile(join(root, 'apps', 'web', '.env.example'), 'Web .env.example')
checkFile(join(root, 'apps', 'web', 'src', 'app', '[locale]', 'page.tsx'), 'Homepage')
checkFile(join(root, 'apps', 'web', 'src', 'app', '[locale]', 'gioi-thieu', 'page.tsx'), 'About page')
checkFile(join(root, 'apps', 'web', 'src', 'components', 'layout', 'Footer.tsx'), 'Footer component')
checkFile(join(root, 'apps', 'web', 'src', 'components', 'home', 'HeroSlider.tsx'), 'Hero Slider')

// ── Backend Files ────────────────────────────────────────────────────────────
console.log('\n⚙️  Backend (NestJS):')
checkFile(join(root, 'apps', 'api', 'package.json'), 'API package.json')
checkFile(join(root, 'apps', 'api', '.env.example'), 'API .env.example')
checkFile(join(root, 'apps', 'api', 'src', 'main.ts'), 'API main.ts')
checkFile(join(root, 'apps', 'api', 'prisma', 'schema.prisma'), 'Prisma schema')

// ── Check Prisma Schema ──────────────────────────────────────────────────────
console.log('\n🗄️  Database Schema:')
checkFileContent(
  join(root, 'apps', 'api', 'prisma', 'schema.prisma'),
  'url      = env("DATABASE_URL")',
  'DATABASE_URL configuration'
)
checkFileContent(
  join(root, 'apps', 'api', 'prisma', 'schema.prisma'),
  'model User',
  'User model'
)
checkFileContent(
  join(root, 'apps', 'api', 'prisma', 'schema.prisma'),
  'model News',
  'News model'
)
checkFileContent(
  join(root, 'apps', 'api', 'prisma', 'schema.prisma'),
  'model Project',
  'Project model'
)

// ── Check Images ─────────────────────────────────────────────────────────────
console.log('\n🖼️  Company Images:')
const images = [
  'logo.png',
  '1-Họp giao ban.JPG',
  '1-Hội trường công ty.JPG',
  '1-Thành tích công ty.JPG',
  '1-Thành tích công ty 2.JPG',
  '1-TRẠM TRỘN BÌNH ĐÊ.png',
  '1-Phòng làm việc kế toán.JPG',
  '1-Giám đốc kí duyệt hồ sơ.JPG',
]

for (const img of images) {
  checkFile(join(root, 'apps', 'web', 'public', 'images', img), img)
}

// ── Check Recent Updates ─────────────────────────────────────────────────────
console.log('\n✨ Recent Updates:')

// Hero Slider with logo
checkFileContent(
  join(root, 'apps', 'web', 'src', 'components', 'home', 'HeroSlider.tsx'),
  'Image',
  'Hero slider logo integration'
)

// Footer working hours
checkFileContent(
  join(root, 'apps', 'web', 'src', 'components', 'layout', 'Footer.tsx'),
  'Thứ 2 – 7',
  'Updated working hours (Mon-Sat)'
)

// Company gallery
checkFileContent(
  join(root, 'apps', 'web', 'src', 'app', '[locale]', 'gioi-thieu', 'page.tsx'),
  'Company Gallery',
  'Company gallery section'
)

// Products page
checkFileContent(
  join(root, 'apps', 'web', 'src', 'app', '[locale]', 'san-pham', 'page.tsx'),
  'Sản phẩm của chúng tôi',
  'Products page title update'
)

// ── Check Environment Examples ───────────────────────────────────────────────
console.log('\n🔐 Environment Configuration:')
checkFileContent(
  join(root, 'apps', 'api', '.env.example'),
  'DATABASE_URL',
  'API DATABASE_URL'
)
checkFileContent(
  join(root, 'apps', 'api', '.env.example'),
  'JWT_SECRET',
  'API JWT_SECRET'
)
checkFileContent(
  join(root, 'apps', 'web', '.env.example'),
  'NEXT_PUBLIC_API_URL',
  'Web API URL'
)

// ── Check Docker Config ──────────────────────────────────────────────────────
console.log('\n🐳 Docker Configuration:')
checkFileContent(
  join(root, 'docker-compose.yml'),
  'postgres:16-alpine',
  'PostgreSQL 16'
)
checkFileContent(
  join(root, 'docker-compose.yml'),
  'pgadmin',
  'pgAdmin'
)

// ── Check Scripts ────────────────────────────────────────────────────────────
console.log('\n📜 Setup Scripts:')
checkFile(join(root, 'scripts', 'setup.mjs'), 'Setup script')
checkFile(join(root, 'scripts', 'verify.mjs'), 'Verification script (this)')

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60))
console.log('📊 Verification Summary:')
console.log('─'.repeat(60))

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! Project is ready.')
  console.log('\n🚀 Next steps:')
  console.log('   1. Run: pnpm setup')
  console.log('   2. Run: pnpm dev')
  console.log('   3. Visit: http://localhost:3000')
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} error(s) found`)
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} warning(s) found`)
  }
  console.log('\n📖 Please fix the issues above before proceeding.')
  console.log('   See QUICKSTART.md for setup instructions.')
}

console.log('─'.repeat(60) + '\n')

process.exit(errors > 0 ? 1 : 0)

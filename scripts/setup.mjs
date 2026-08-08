/**
 * First-time project setup script.
 * Copies .env.example files, installs dependencies, generates Prisma client,
 * and pushes the database schema.
 *
 * Usage: node scripts/setup.mjs
 */

import { existsSync, copyFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function log(msg) {
  console.log(`\n✔ ${msg}`)
}

function warn(msg) {
  console.log(`⚠ ${msg}`)
}

function error(msg) {
  console.error(`\n❌ ${msg}`)
}

function run(cmd, cwd = root) {
  console.log(`  → ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

function runSilent(cmd, cwd = root) {
  return execSync(cmd, { cwd, encoding: 'utf-8' }).trim()
}

// ── 1. Copy .env.example → .env if missing ──────────────────────────────────

const envFiles = [
  { example: join(root, 'apps', 'api', '.env.example'), target: join(root, 'apps', 'api', '.env') },
  { example: join(root, 'apps', 'web', '.env.example'), target: join(root, 'apps', 'web', '.env.local') },
]

for (const { example, target } of envFiles) {
  if (existsSync(target)) {
    warn(`${target} already exists — skipping`)
  } else if (existsSync(example)) {
    copyFileSync(example, target)
    log(`Copied ${example} → ${target}`)
  } else {
    warn(`${example} not found — skipping`)
  }
}

// ── 1b. Validate API .env has DATABASE_URL ───────────────────────────────────

const apiEnv = join(root, 'apps', 'api', '.env')
if (existsSync(apiEnv)) {
  const envContent = readFileSync(apiEnv, 'utf-8')
  if (!envContent.includes('DATABASE_URL')) {
    error('apps/api/.env exists but is missing DATABASE_URL!')
    console.error('   Delete it and re-run setup to regenerate from .env.example:')
    console.error('     rm apps/api/.env   (or del apps\\api\\.env on Windows)')
    console.error('     pnpm setup')
    process.exit(1)
  }
} else {
  error('apps/api/.env was not created! Check that apps/api/.env.example exists.')
  process.exit(1)
}

// ── 2. Install dependencies ──────────────────────────────────────────────────

log('Installing dependencies...')
run('pnpm install')

// ── 3. Generate Prisma Client ────────────────────────────────────────────────

log('Generating Prisma Client...')
run('pnpm exec prisma generate', join(root, 'apps', 'api'))

// ── 4. Check Docker is running and DB is healthy ────────────────────────────

log('Checking database connection...')

function isDockerRunning() {
  try {
    runSilent('docker info')
    return true
  } catch {
    return false
  }
}

function isDbContainerHealthy() {
  try {
    const output = runSilent('docker compose ps --format json', root)
    // docker compose ps --format json may return one JSON object per line
    const lines = output.split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const container = JSON.parse(line)
        if (container.Name === 'duongbo_db' || container.Service === 'postgres') {
          return container.Health === 'healthy' || container.State === 'running'
        }
      } catch {
        // not JSON, skip
      }
    }
    return false
  } catch {
    return false
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function waitForDb(maxRetries = 12, intervalMs = 5000) {
  for (let i = 1; i <= maxRetries; i++) {
    console.log(`  Waiting for database to be ready... (attempt ${i}/${maxRetries})`)
    try {
      runSilent(
        'docker exec duongbo_db pg_isready -U duongbo -d duongbo_db',
        root
      )
      return true
    } catch {
      if (i < maxRetries) {
        sleep(intervalMs)
      }
    }
  }
  return false
}

if (!isDockerRunning()) {
  error('Docker is not running!')
  console.error('   Please start Docker Desktop and run:')
  console.error('     docker compose up -d')
  console.error('   Then run this setup again:')
  console.error('     pnpm setup')
  process.exit(1)
}

if (!isDbContainerHealthy()) {
  warn('Database container not found. Starting it...')
  try {
    run('docker compose up -d', root)
  } catch {
    error('Failed to start Docker containers.')
    console.error('   Please run manually:')
    console.error('     docker compose up -d')
    console.error('   Then run setup again:')
    console.error('     pnpm setup')
    process.exit(1)
  }
}

if (!waitForDb()) {
  error('Database is not responding after 60s.')
  console.error('   Check Docker logs:')
  console.error('     docker compose logs postgres')
  console.error('')
  console.error('   If you see authentication errors, the Docker volume may have stale credentials.')
  console.error('   Fix by removing the volume and recreating:')
  console.error('     docker compose down -v')
  console.error('     docker compose up -d')
  console.error('     pnpm setup')
  process.exit(1)
}

log('Database is ready!')

// ── 5. Push database schema ─────────────────────────────────────────────────

log('Pushing database schema...')
try {
  run('pnpm exec prisma db push', join(root, 'apps', 'api'))
  log('Database schema pushed successfully!')
} catch {
  error('Failed to push database schema.')
  console.error('')
  console.error('   If you see "P1000: Authentication failed", the Docker volume')
  console.error('   has stale credentials from a previous run. Fix:')
  console.error('     docker compose down -v        # ⚠ destroys DB data')
  console.error('     docker compose up -d')
  console.error('     pnpm setup')
  console.error('')
  console.error('   If you see "P1001: Cannot reach database", ensure Docker is running:')
  console.error('     docker compose ps')
  process.exit(1)
}

console.log('\n──────────────────────────────────────────')
console.log('  Setup complete! Start developing with:')
console.log('    pnpm dev')
console.log('')
console.log('  API:     http://localhost:4000')
console.log('  Swagger: http://localhost:4000/api/docs')
console.log('  Web:     http://localhost:3000')
console.log('──────────────────────────────────────────\n')

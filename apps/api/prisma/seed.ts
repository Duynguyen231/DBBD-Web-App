import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'admin@duongbo.com'
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() || 'Admin@123456'
  const adminName = 'Super Admin'

  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
    create: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log(`Admin account is ready: ${adminEmail}`)
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
    return user
  }

  async seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'admin@duongbo.com'
    const adminPassword = process.env.ADMIN_PASSWORD?.trim() || 'Admin@123456'

    const existing = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!existing) {
      const hashed = await bcrypt.hash(adminPassword, 12)
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: hashed,
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
        },
      })
      console.log(`Seeded admin user: ${adminEmail}`)
    }
  }
}

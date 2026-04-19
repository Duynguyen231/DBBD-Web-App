import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const rows = await this.prisma.siteSetting.findMany()
    return rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {} as Record<string, string>)
  }

  async get(key: string) {
    return this.prisma.siteSetting.findUnique({ where: { key } })
  }

  async upsert(key: string, value: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  async upsertMany(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
    return Promise.all(ops)
  }
}

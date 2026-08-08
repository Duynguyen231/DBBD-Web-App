import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto'

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}
  findAll(page?: string) {
    const where = page ? { page } : undefined
    return this.prisma.banner.findMany({ where, orderBy: { order: 'asc' } })
  }
  async findOne(id: number) {
    const b = await this.prisma.banner.findUnique({ where: { id } })
    if (!b) throw new NotFoundException(`Banner #${id} not found`)
    return b
  }
  create(dto: CreateBannerDto) { return this.prisma.banner.create({ data: dto }) }
  async update(id: number, dto: UpdateBannerDto) {
    await this.findOne(id)
    return this.prisma.banner.update({ where: { id }, data: dto })
  }
  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.banner.delete({ where: { id } })
  }
}

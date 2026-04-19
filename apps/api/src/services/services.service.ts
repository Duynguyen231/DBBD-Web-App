import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto'

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.service.findMany({ orderBy: { order: 'asc' } }) }
  async findOne(id: number) {
    const s = await this.prisma.service.findUnique({ where: { id } })
    if (!s) throw new NotFoundException(`Service #${id} not found`)
    return s
  }
  create(dto: CreateServiceDto) { return this.prisma.service.create({ data: dto }) }
  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id)
    return this.prisma.service.update({ where: { id }, data: dto })
  }
  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.service.delete({ where: { id } })
  }
}

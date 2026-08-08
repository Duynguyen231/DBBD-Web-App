import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto'

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.partner.findMany({ orderBy: { order: 'asc' } }) }
  async findOne(id: number) {
    const p = await this.prisma.partner.findUnique({ where: { id } })
    if (!p) throw new NotFoundException(`Partner #${id} not found`)
    return p
  }
  create(dto: CreatePartnerDto) { return this.prisma.partner.create({ data: dto }) }
  async update(id: number, dto: UpdatePartnerDto) {
    await this.findOne(id)
    return this.prisma.partner.update({ where: { id }, data: dto })
  }
  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.partner.delete({ where: { id } })
  }
}

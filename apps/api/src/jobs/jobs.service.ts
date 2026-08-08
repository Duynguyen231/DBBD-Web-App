import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto'
import slugify from 'slugify'

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: JobQueryDto) {
    const { page = 1, limit = 10, status } = query
    const skip = (page - 1) * limit
    const where: any = {}
    if (status) where.status = status
    const [data, total] = await Promise.all([
      this.prisma.job.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.job.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string) {
    const j = await this.prisma.job.findUnique({ where: { slug } })
    if (!j) throw new NotFoundException(`Job "${slug}" not found`)
    return j
  }

  async findById(id: number) {
    const j = await this.prisma.job.findUnique({ where: { id } })
    if (!j) throw new NotFoundException(`Job #${id} not found`)
    return j
  }

  async create(dto: CreateJobDto) {
    const slug = await this.generateSlug(dto.titleVi)
    return this.prisma.job.create({ data: { ...dto, slug } })
  }

  async update(id: number, dto: UpdateJobDto) {
    await this.findById(id)
    return this.prisma.job.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findById(id)
    return this.prisma.job.delete({ where: { id } })
  }

  private async generateSlug(title: string) {
    const base = slugify(title, { lower: true, locale: 'vi' })
    let slug = base; let i = 1
    while (await this.prisma.job.findUnique({ where: { slug } })) slug = `${base}-${i++}`
    return slug
  }
}

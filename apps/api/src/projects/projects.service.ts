import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/project.dto'
import { toDateOrNull } from '../common/utils/date.util'
import slugify from 'slugify'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProjectQueryDto) {
    const { page = 1, limit = 12, status, search } = query
    const skip = (page - 1) * limit
    const where: any = {}
    if (status) where.status = status
    if (search) where.OR = [
      { titleVi: { contains: search, mode: 'insensitive' } },
      { titleEn: { contains: search, mode: 'insensitive' } },
    ]
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.project.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw new NotFoundException(`Project "${slug}" not found`)
    return project
  }

  async findById(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } })
    if (!project) throw new NotFoundException(`Project #${id} not found`)
    return project
  }

  async create(dto: CreateProjectDto) {
    const slug = await this.generateSlug(dto.titleVi)
    return this.prisma.project.create({
      data: {
        ...dto,
        startDate: toDateOrNull(dto.startDate),
        endDate: toDateOrNull(dto.endDate),
        slug,
      },
    })
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findById(id)
    return this.prisma.project.update({
      where: { id },
      data: { ...dto, startDate: toDateOrNull(dto.startDate), endDate: toDateOrNull(dto.endDate) },
    })
  }

  async remove(id: number) {
    await this.findById(id)
    return this.prisma.project.delete({ where: { id } })
  }

  private async generateSlug(title: string) {
    const base = slugify(title, { lower: true, locale: 'vi' })
    let slug = base; let i = 1
    while (await this.prisma.project.findUnique({ where: { slug } })) slug = `${base}-${i++}`
    return slug
  }
}

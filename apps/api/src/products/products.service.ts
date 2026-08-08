import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto'
import slugify from 'slugify'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 12, category, search } = query
    const skip = (page - 1) * limit
    const where: any = {}
    if (category) where.category = category
    if (search) where.OR = [
      { titleVi: { contains: search, mode: 'insensitive' } },
      { titleEn: { contains: search, mode: 'insensitive' } },
    ]
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string) {
    const p = await this.prisma.product.findUnique({ where: { slug } })
    if (!p) throw new NotFoundException(`Product "${slug}" not found`)
    return p
  }

  async findById(id: number) {
    const p = await this.prisma.product.findUnique({ where: { id } })
    if (!p) throw new NotFoundException(`Product #${id} not found`)
    return p
  }

  async create(dto: CreateProductDto) {
    const slug = await this.generateSlug(dto.titleVi)
    return this.prisma.product.create({ data: { ...dto, slug } })
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findById(id)
    return this.prisma.product.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findById(id)
    return this.prisma.product.delete({ where: { id } })
  }

  private async generateSlug(title: string) {
    const base = slugify(title, { lower: true, locale: 'vi' })
    let slug = base; let i = 1
    while (await this.prisma.product.findUnique({ where: { slug } })) slug = `${base}-${i++}`
    return slug
  }
}

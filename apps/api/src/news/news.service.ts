import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  CreateNewsDto, UpdateNewsDto, NewsQueryDto,
  CreateNewsCategoryDto, UpdateNewsCategoryDto,
} from './dto/news.dto'
import slugify from 'slugify'

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  // ─── Categories ────────────────────────────────────────────────────────────

  async getCategories() {
    return this.prisma.newsCategory.findMany()
  }

  async createCategory(dto: CreateNewsCategoryDto) {
    const slug = slugify(dto.nameVi, { lower: true, locale: 'vi' })
    return this.prisma.newsCategory.create({ data: { ...dto, slug } })
  }

  async updateCategory(id: number, dto: UpdateNewsCategoryDto) {
    await this.findCategoryOrFail(id)
    return this.prisma.newsCategory.update({ where: { id }, data: dto })
  }

  async deleteCategory(id: number) {
    await this.findCategoryOrFail(id)
    return this.prisma.newsCategory.delete({ where: { id } })
  }

  private async findCategoryOrFail(id: number) {
    const cat = await this.prisma.newsCategory.findUnique({ where: { id } })
    if (!cat) throw new NotFoundException(`Category #${id} not found`)
    return cat
  }

  // ─── News ──────────────────────────────────────────────────────────────────

  async findAll(query: NewsQueryDto) {
    const { page = 1, limit = 10, categoryId, search } = query
    const skip = (page - 1) * limit

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { titleVi: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.news.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(slug: string) {
    const news = await this.prisma.news.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!news) throw new NotFoundException(`News "${slug}" not found`)
    return news
  }

  async findById(id: number) {
    const news = await this.prisma.news.findUnique({ where: { id }, include: { category: true } })
    if (!news) throw new NotFoundException(`News #${id} not found`)
    return news
  }

  async create(dto: CreateNewsDto) {
    const slug = await this.generateSlug(dto.titleVi)
    return this.prisma.news.create({ data: { ...dto, slug }, include: { category: true } })
  }

  async update(id: number, dto: UpdateNewsDto) {
    await this.findById(id)
    return this.prisma.news.update({ where: { id }, data: dto, include: { category: true } })
  }

  async remove(id: number) {
    await this.findById(id)
    return this.prisma.news.delete({ where: { id } })
  }

  private async generateSlug(title: string): Promise<string> {
    const base = slugify(title, { lower: true, locale: 'vi' })
    let slug = base
    let i = 1
    while (await this.prisma.news.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`
    }
    return slug
  }
}

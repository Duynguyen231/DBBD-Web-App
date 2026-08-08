import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { NewsService } from './news.service'
import {
  CreateNewsDto, UpdateNewsDto, NewsQueryDto,
  CreateNewsCategoryDto, UpdateNewsCategoryDto,
} from './dto/news.dto'

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  // Public ────────────────────────────────────────────────────────────────────

  @Get('categories')
  getCategories() { return this.newsService.getCategories() }

  @Get()
  findAll(@Query() query: NewsQueryDto) { return this.newsService.findAll(query) }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.newsService.findOne(slug) }

  // Admin ─────────────────────────────────────────────────────────────────────

  @Post('categories')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  createCategory(@Body() dto: CreateNewsCategoryDto) { return this.newsService.createCategory(dto) }

  @Put('categories/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsCategoryDto) {
    return this.newsService.updateCategory(id, dto)
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  deleteCategory(@Param('id', ParseIntPipe) id: number) { return this.newsService.deleteCategory(id) }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@Body() dto: CreateNewsDto) { return this.newsService.create(dto) }

  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findById(@Param('id', ParseIntPipe) id: number) { return this.newsService.findById(id) }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.newsService.remove(id) }
}

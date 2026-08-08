import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}
  @Get() findAll(@Query() q: ProductQueryDto) { return this.service.findAll(q) }
  @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug) }
  @Post() @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  create(@Body() dto: CreateProductDto) { return this.service.create(dto) }
  @Get('admin/:id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  findById(@Param('id', ParseIntPipe) id: number) { return this.service.findById(id) }
  @Put(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) { return this.service.update(id, dto) }
  @Delete(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { BannersService } from './banners.service'
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto'

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private service: BannersService) {}
  @Get() findAll(@Query('page') page?: string) { return this.service.findAll(page) }
  @Post() @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  create(@Body() dto: CreateBannerDto) { return this.service.create(dto) }
  @Put(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) { return this.service.update(id, dto) }
  @Delete(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

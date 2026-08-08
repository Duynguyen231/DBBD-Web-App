import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ServicesService } from './services.service'
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto'

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private service: ServicesService) {}
  @Get() findAll() { return this.service.findAll() }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id) }
  @Post() @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  create(@Body() dto: CreateServiceDto) { return this.service.create(dto) }
  @Put(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) { return this.service.update(id, dto) }
  @Delete(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { PartnersService } from './partners.service'
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto'

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private service: PartnersService) {}
  @Get() findAll() { return this.service.findAll() }
  @Post() @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  create(@Body() dto: CreatePartnerDto) { return this.service.create(dto) }
  @Put(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePartnerDto) { return this.service.update(id, dto) }
  @Delete(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

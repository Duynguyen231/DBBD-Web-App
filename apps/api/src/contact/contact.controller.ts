import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ContactService } from './contact.service'
import { CreateContactDto } from './dto/contact.dto'

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto) { return this.service.create(dto) }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findAll() { return this.service.findAll() }

  @Put(':id/read')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  markRead(@Param('id', ParseIntPipe) id: number) { return this.service.markRead(id) }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JobsService } from './jobs.service'
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto'

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private service: JobsService) {}
  @Get() findAll(@Query() q: JobQueryDto) { return this.service.findAll(q) }
  @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug) }
  @Post() @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  create(@Body() dto: CreateJobDto) { return this.service.create(dto) }
  @Get('admin/:id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  findById(@Param('id', ParseIntPipe) id: number) { return this.service.findById(id) }
  @Put(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateJobDto) { return this.service.update(id, dto) }
  @Delete(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

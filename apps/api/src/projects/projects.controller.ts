import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/project.dto'

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Get() findAll(@Query() q: ProjectQueryDto) { return this.service.findAll(q) }
  @Get(':slug') findOne(@Param('slug') slug: string) { return this.service.findOne(slug) }

  @Post() @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  create(@Body() dto: CreateProjectDto) { return this.service.create(dto) }

  @Get('admin/:id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  findById(@Param('id', ParseIntPipe) id: number) { return this.service.findById(id) }

  @Put(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) { return this.service.update(id, dto) }

  @Delete(':id') @UseGuards(AuthGuard('jwt')) @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id) }
}

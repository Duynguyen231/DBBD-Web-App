import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { SettingsService } from './settings.service'

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get()
  getAll() { return this.service.getAll() }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  upsertMany(@Body() data: Record<string, string>) { return this.service.upsertMany(data) }
}

import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { NewsModule } from './news/news.module'
import { ProjectsModule } from './projects/projects.module'
import { ServicesModule } from './services/services.module'
import { ProductsModule } from './products/products.module'
import { JobsModule } from './jobs/jobs.module'
import { BannersModule } from './banners/banners.module'
import { PartnersModule } from './partners/partners.module'
import { ContactModule } from './contact/contact.module'
import { MediaModule } from './media/media.module'
import { SettingsModule } from './settings/settings.module'
import { AuthService } from './auth/auth.service'
import { AppController } from './app.controller'
import { AppService } from './app.service'

const REQUIRED_R2_ENV_VARS = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
] as const

const validateEnv = (config: Record<string, unknown>) => {
  const missing = REQUIRED_R2_ENV_VARS.filter((key) => {
    const value = config[key]
    return typeof value !== 'string' || value.trim().length === 0
  })

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return config
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 20 }],
    }),
    PrismaModule,
    AuthModule,
    NewsModule,
    ProjectsModule,
    ServicesModule,
    ProductsModule,
    JobsModule,
    BannersModule,
    PartnersModule,
    ContactModule,
    MediaModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private authService: AuthService) {}

  async onModuleInit() {
    await this.authService.seedAdmin()
  }
}


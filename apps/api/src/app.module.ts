import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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


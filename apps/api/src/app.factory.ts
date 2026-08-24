import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

export async function createNestApp(adapter?: ExpressAdapter): Promise<INestApplication> {
  const app = adapter
    ? await NestFactory.create(AppModule, adapter)
    : await NestFactory.create(AppModule)

  // Running behind Vercel's proxy: trust X-Forwarded-For so req.ip reflects
  // the real client IP (needed for per-IP rate limiting on /contact).
  app.getHttpAdapter().getInstance().set('trust proxy', 1)

  app.enableCors({
    origin:
      process.env.CORS_ORIGIN ||
      process.env.FRONTEND_URL ||
      'http://localhost:3000',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Đường Bộ Bình Định API')
    .setDescription('REST API for Đường Bộ Bình Định website')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  return app
}

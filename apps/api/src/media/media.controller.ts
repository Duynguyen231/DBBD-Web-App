import {
  Controller, Post, Get, Delete, Param, UseGuards,
  UseInterceptors, UploadedFile, ParseIntPipe, BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'
import { MediaService } from './media.service'

@ApiTags('Media')
@Controller('media')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MediaController {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml|pdf)$/)) {
          return cb(new BadRequestException('Unsupported file type'), false)
        }
        cb(null, true)
      },
    })
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    const publicUrl = await this.mediaService.uploadFile(file)

    // Save to database
    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        url: publicUrl,
        mimeType: file.mimetype,
        size: file.size,
      },
    })

    return media
  }

  @Get()
  findAll() {
    return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } })
    
    if (media) {
      await this.mediaService.deleteFileByUrl(media.url)

      // Delete from database
      await this.prisma.media.delete({ where: { id } })
    }

    return { message: 'Deleted' }
  }
}

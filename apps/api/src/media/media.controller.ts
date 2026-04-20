import {
  Controller, Post, Get, Delete, Param, UseGuards,
  UseInterceptors, UploadedFile, ParseIntPipe, BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',  // ← correct
)

@ApiTags('Media')
@Controller('media')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MediaController {
  constructor(private prisma: PrismaService) {}

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

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.originalname}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)

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
      // Extract filename from Supabase URL
      const urlParts = media.url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from Supabase Storage
      await supabase.storage.from('media').remove([fileName])

      // Delete from database
      await this.prisma.media.delete({ where: { id } })
    }

    return { message: 'Deleted' }
  }
}

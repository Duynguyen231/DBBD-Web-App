import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { basename, extname } from 'path'

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name)
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly publicUrl: string

  constructor() {
    const accountId = this.getRequiredEnv('R2_ACCOUNT_ID')
    const accessKeyId = this.getRequiredEnv('R2_ACCESS_KEY_ID')
    const secretAccessKey = this.getRequiredEnv('R2_SECRET_ACCESS_KEY')

    this.bucketName = this.getRequiredEnv('R2_BUCKET_NAME')
    this.publicUrl = this.getRequiredEnv('R2_PUBLIC_URL').replace(/\/+$/, '')

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Uploaded file is empty')
    }

    const fileKey = this.buildFileKey(file.originalname)

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentLength: file.size,
        })
      )
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown upload error'
      throw new BadRequestException(`Upload failed: ${message}`)
    }

    return `${this.publicUrl}/${fileKey}`
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    const fileKey = this.extractFileKey(fileUrl)
    if (!fileKey) {
      return
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        })
      )
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.warn(`Failed to delete file from R2: ${message}`)
    }
  }

  private buildFileKey(originalName: string): string {
    const rawExtension = extname(originalName).toLowerCase()
    const extension = /^\.[a-z0-9]+$/.test(rawExtension) ? rawExtension : ''

    const nameWithoutExtension = basename(originalName, rawExtension)
    const sanitizedName = this.sanitizeFilename(nameWithoutExtension)

    return `${Date.now()}-${sanitizedName}${extension}`
  }

  private sanitizeFilename(value: string): string {
    const normalized = value
      .normalize('NFKD')
      .replace(/[^\x00-\x7F]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return normalized || 'file'
  }

  private extractFileKey(fileUrl: string): string | null {
    if (!fileUrl) {
      return null
    }

    const publicUrlPrefix = `${this.publicUrl}/`
    if (fileUrl.startsWith(publicUrlPrefix)) {
      return decodeURIComponent(fileUrl.slice(publicUrlPrefix.length))
    }

    try {
      const parsedUrl = new URL(fileUrl)
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
      const lastSegment = pathParts[pathParts.length - 1]
      return lastSegment ? decodeURIComponent(lastSegment) : null
    } catch {
      return null
    }
  }

  private getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim()
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
  }
}
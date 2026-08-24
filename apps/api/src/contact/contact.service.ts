import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { MailService } from '../mail/mail.service'
import { CreateContactDto } from './dto/contact.dto'

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name)

  constructor(private prisma: PrismaService, private mail: MailService) {}

  async create(dto: CreateContactDto) {
    const submission = await this.prisma.contactSubmission.create({ data: dto })

    // Awaited (not fire-and-forget): on Vercel's serverless runtime the
    // function can freeze right after the response is sent, killing any
    // unawaited background work. Still wrapped in try/catch so a failed
    // email never fails the visitor's request — the submission is already saved.
    try {
      await this.mail.sendContactNotification(submission)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Failed to send contact notification email: ${message}`)
    }

    return submission
  }

  findAll() {
    return this.prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } })
  }

  markRead(id: number) {
    return this.prisma.contactSubmission.update({ where: { id }, data: { isRead: true } })
  }

  remove(id: number) {
    return this.prisma.contactSubmission.delete({ where: { id } })
  }
}

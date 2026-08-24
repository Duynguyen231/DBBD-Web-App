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

    // Fire-and-forget: the submission is already saved, so a failed email
    // notification must never fail the visitor's request.
    this.mail.sendContactNotification(submission).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Failed to send contact notification email: ${message}`)
    })

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

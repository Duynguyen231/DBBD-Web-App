import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateContactDto } from './dto/contact.dto'

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateContactDto) {
    return this.prisma.contactSubmission.create({ data: dto })
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

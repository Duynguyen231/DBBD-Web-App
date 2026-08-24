import { Injectable, Logger } from '@nestjs/common'
import nodemailer, { Transporter } from 'nodemailer'

export interface ContactNotificationInput {
  id: number
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  createdAt: Date
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly transporter: Transporter | null
  private readonly from: string
  private readonly notifyTo: string

  constructor() {
    const user = process.env.SMTP_USER?.trim()
    const appPassword = process.env.SMTP_APP_PASSWORD?.trim()
    this.notifyTo = process.env.CONTACT_NOTIFY_TO?.trim() || user || ''
    this.from = process.env.MAIL_FROM?.trim() || user || ''

    if (!user || !appPassword || !this.notifyTo) {
      this.logger.warn(
        'Mail is not configured (SMTP_USER / SMTP_APP_PASSWORD / CONTACT_NOTIFY_TO) — contact notification emails will not be sent'
      )
      this.transporter = null
      return
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass: appPassword },
    })
  }

  async sendContactNotification(submission: ContactNotificationInput): Promise<void> {
    if (!this.transporter) {
      return
    }

    await this.transporter.sendMail({
      from: this.from,
      to: this.notifyTo,
      replyTo: submission.email,
      subject: `[Website] Liên hệ mới: ${submission.subject}`,
      text: this.buildText(submission),
      html: this.buildHtml(submission),
    })
  }

  private buildText(s: ContactNotificationInput): string {
    return [
      `Có tin nhắn liên hệ mới từ website (dùng cho liên hệ chung hoặc ứng tuyển).`,
      ``,
      `Họ và tên: ${s.name}`,
      `Email: ${s.email}`,
      `Số điện thoại: ${s.phone || 'Không cung cấp'}`,
      `Tiêu đề: ${s.subject}`,
      ``,
      `Nội dung:`,
      s.message,
      ``,
      `Mã liên hệ: #${s.id} — ${s.createdAt.toLocaleString('vi-VN')}`,
    ].join('\n')
  }

  private buildHtml(s: ContactNotificationInput): string {
    const escape = (v: string) =>
      v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    return `
      <div style="font-family:sans-serif;font-size:14px;color:#111">
        <p>Có tin nhắn liên hệ mới từ website (dùng cho liên hệ chung hoặc ứng tuyển).</p>
        <table cellpadding="4" style="border-collapse:collapse">
          <tr><td><b>Họ và tên</b></td><td>${escape(s.name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escape(s.email)}</td></tr>
          <tr><td><b>Số điện thoại</b></td><td>${escape(s.phone || 'Không cung cấp')}</td></tr>
          <tr><td><b>Tiêu đề</b></td><td>${escape(s.subject)}</td></tr>
        </table>
        <p><b>Nội dung:</b></p>
        <p style="white-space:pre-wrap">${escape(s.message)}</p>
        <p style="color:#888;font-size:12px">Mã liên hệ #${s.id} — ${s.createdAt.toLocaleString('vi-VN')}</p>
      </div>
    `
  }
}

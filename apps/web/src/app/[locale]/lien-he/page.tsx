import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = { title: 'Liên hệ | Đường Bộ Bình Định' }

export default function ContactPage() {
  return <ContactForm />
}

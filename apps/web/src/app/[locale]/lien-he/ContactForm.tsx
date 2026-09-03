'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import apiClient from '@/lib/api'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const t = useTranslations('contact')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.post('/contact', data)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setError(t('error'))
      setTimeout(() => setError(''), 5000)
    }
  }

  return (
    <div className="py-12">
      <div className="bg-[var(--primary)] text-white py-12 mb-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[var(--primary-50)] rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Địa chỉ</div>
                <div className="text-sm text-gray-500">Lô OTM12-13 Khu đô thị Long Vân, P. Quy Nhơn Bắc, Tỉnh Gia Lai</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[var(--primary-50)] rounded-lg flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Điện thoại</div>
                <div className="text-sm text-gray-500">091 406 1804</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[var(--primary-50)] rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Email</div>
                <div className="text-sm text-gray-500">duongbobinhdinh@gmail.com</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[var(--primary-50)] rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Giờ làm việc</div>
                <div className="text-sm text-gray-500">Thứ 2 - Thứ 7: 7:30 - 17:00</div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('name')} *</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')} *</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('subject')} *</label>
                  <input
                    {...register('subject')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('message')} *</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {submitted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" /> {t('success')}
                </div>
              )}
              {error && (
                <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Đang gửi...' : t('send')}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=13.787171953556392,109.1597619340228"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-10 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative group"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.17889520108204!2d109.1597619340228!3d13.787171953556392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f130005ea11f9%3A0x20a7e8f043eda9d6!2zQ8O0bmcgdHkgQ1AgUUwmWEQgxJDGsOG7nW5nIGLhu5kgQsOsbmggxJDhu4tuaA!5e0!3m2!1sen!2s!4v1788441712554!5m2!1sen!2s"
            width="100%"
            height="350"
            style={{ border: 0, pointerEvents: 'none' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Vị trí công ty"
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors cursor-pointer" />
        </a>
      </div>
    </div>
  )
}

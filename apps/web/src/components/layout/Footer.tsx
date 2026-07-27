'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Phone, Mail, MapPin, Video, ChevronRight } from 'lucide-react'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const lp = (href: string) => `/${locale}${href}`

  const links = [
    { label: t('nav.about'), href: '/gioi-thieu' },
    { label: t('nav.services'), href: '/linh-vuc-hoat-dong' },
    { label: t('nav.products'), href: '/san-pham' },
    { label: t('nav.projects'), href: '/cong-trinh' },
    { label: t('nav.recruitment'), href: '/tuyen-dung' },
    { label: t('nav.contact'), href: '/lien-he' },
  ]

  const newsLinks = [
    { label: 'Tin công ty', href: '/tin-tuc' },
    { label: 'Tin dự án', href: '/tin-tuc' },
    { label: 'Hoạt động xã hội', href: '/tin-tuc' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Company info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/images/logo.png" alt="Đường Bộ Bình Định" width={48} height={48} className="h-12 w-auto object-contain shrink-0" />
              <div>
                <div className="font-bold text-sm leading-tight">{t('footer.company')}</div>
                <div className="text-xs text-gray-400 mt-0.5">Road Management & Construction</div>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[var(--primary-light)]" />
                </div>
                <div className="leading-relaxed">
                  <div>Lô OTM12-13 Khu đô thị Long Vân, P. Quy Nhơn Bắc, Tỉnh Gia Lai</div>
                  <div className="text-xs text-gray-500 mt-1">Mã số thuế: 4001234567</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[var(--primary-light)]" />
                </div>
                <span>091 406 1804</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[var(--primary-light)]" />
                </div>
                <span>info@duongbobinhdinh.vn</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <a href="https://www.facebook.com/duongbobinhdinh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#1877F2] rounded-xl flex items-center justify-center transition-all duration-300" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.07 1.374.14v3.323c-.149-.016-.408-.024-.732-.024-1.04 0-1.442.394-1.442 1.42v2.7h3.879l-.666 3.666H14.16v8.174C19.395 22.84 23 18.862 23 14.044 23 8.508 18.523 4 13 4S3 8.508 3 14.044c0 4.124 2.632 7.633 6.101 9.647z"/></svg>
              </a>
              <a href="https://zalo.me/duongbobinhdinh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#0068FF] rounded-xl flex items-center justify-center transition-all duration-300" aria-label="Zalo">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48"><path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm5.8 28.2h-3.4c-.4 0-.7-.1-.9-.4l-3.2-4.6v4.3c0 .4-.3.7-.7.7h-2.4c-.4 0-.7-.3-.7-.7V17.8c0-.4.3-.7.7-.7h2.4c.4 0 .7.3.7.7v8.5l4.5-4.5c.3-.3.6-.4 1-.4h3c.6 0 .8.4.4.8l-4.8 4.6 5.2 5.2c.3.4.1.8-.4.8zm-14.4 0h-2.5c-.4 0-.7-.3-.7-.7V17.8c0-.4.3-.7.7-.7h2.5c.4 0 .7.3.7.7v13.7c0 .4-.3.7-.7.7zm22-12.7h-6.7c-.4 0-.7.3-.7.7v1.6c0 .4.3.7.7.7h3.8v2.6h-3.8c-.4 0-.7.3-.7.7v1.6c0 .4.3.7.7.7h6.7c.4 0 .7-.3.7-.7v-7.2c0-.4-.3-.7-.7-.7z"/></svg>
              </a>
              <a href="https://www.youtube.com/@duongbobinhdinh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300" aria-label="YouTube">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-[0.12em] mb-5 text-white relative">
              {t('footer.links_title')}
              <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-[var(--primary)]" />
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400 mt-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={lp(l.href)} className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all duration-200 group">
                    <ChevronRight className="w-3 h-3 text-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* News links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-[0.12em] mb-5 text-white relative">
              {t('footer.news_title')}
              <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-[var(--primary)]" />
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400 mt-4">
              {newsLinks.map((l, i) => (
                <li key={i}>
                  <Link href={lp(l.href)} className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all duration-200 group">
                    <ChevronRight className="w-3 h-3 text-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working hours */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-[0.12em] mb-5 text-white relative">
              Giờ làm việc
              <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-[var(--primary)]" />
            </h3>
            <div className="space-y-2 text-sm text-gray-400 mt-4">
              <div className="flex justify-between"><span>Thứ 2 – 7</span><span className="text-white">7:30 – 17:00</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <span>{t('footer.copyright')}</span>
          <span className="flex items-center gap-1">Thiết kế bởi <span className="text-[var(--primary-light)]">ĐBBĐ IT</span></span>
        </div>
      </div>
    </footer>
  )
}

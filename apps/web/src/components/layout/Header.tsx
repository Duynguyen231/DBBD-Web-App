'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { key: 'home', href: '/' },
  {
    key: 'about',
    href: '/gioi-thieu',
    children: [
      { key: 'about_history', href: '/gioi-thieu/lich-su' },
      { key: 'about_mission', href: '/gioi-thieu/su-menh-tam-nhin' },
      { key: 'about_org', href: '/gioi-thieu/co-cau-to-chuc' },
      { key: 'about_leaders', href: '/gioi-thieu/doi-ngu-lanh-dao' },
      { key: 'about_profile', href: '/gioi-thieu/ho-so-doanh-nghiep' },
    ],
  },
  { key: 'services', href: '/linh-vuc-hoat-dong' },
  { key: 'products', href: '/san-pham' },
  { key: 'projects', href: '/cong-trinh' },
  { key: 'news', href: '/tin-tuc' },
  { key: 'recruitment', href: '/tuyen-dung' },
  { key: 'contact', href: '/lien-he' },
]

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const localePath = (href: string) => `/${locale}${href === '/' ? '' : href}`

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, '') || '/'
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  const isActive = (href: string) => {
    const full = localePath(href)
    return pathname === full || (href !== '/' && pathname.startsWith(full))
  }

  return (
    <header className={cn('sticky top-0 z-50 transition-shadow duration-300', scrolled ? 'shadow-lg' : 'shadow-sm')}>
      {/* Top utility bar */}
      <div className="bg-[var(--primary-dark)] text-white/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-8">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> 091 406 1804</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> info@duongbobinhdinh.vn</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => switchLocale('vi')} className={cn('px-2 py-0.5 rounded text-xs transition-colors', locale === 'vi' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10')}>Tiếng Việt</button>
            <button onClick={() => switchLocale('en')} className={cn('px-2 py-0.5 rounded text-xs transition-colors', locale === 'en' ? 'bg-white/20 font-semibold' : 'hover:bg-white/10')}>English</button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href={localePath('/')} className="flex items-center gap-3 shrink-0 group">
              <Image src="/images/logo.png" alt="Đường Bộ Bình Định" width={44} height={44} className="h-11 w-auto object-contain" />
              <div className="hidden sm:block">
                <div className="font-bold text-[var(--primary-dark)] text-[13px] leading-tight tracking-wide">ĐƯỜNG BỘ BÌNH ĐỊNH</div>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase">Binh Dinh Road JSC</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="relative group"
                  onMouseEnter={() => item.children && setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={localePath(item.href)}
                    className={cn(
                      'relative flex items-center gap-1 px-4 h-[70px] text-[13px] font-semibold uppercase tracking-wide transition-colors',
                      isActive(item.href)
                        ? 'text-[var(--primary)]'
                        : 'text-gray-700 hover:text-[var(--primary)]'
                    )}
                  >
                    {t(item.key)}
                    {item.children && <ChevronDown className="w-3 h-3 mt-0.5" />}
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[var(--primary)] rounded-t" />
                    )}
                  </Link>

                  {item.children && activeDropdown === item.key && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-b-lg shadow-xl border-t-[3px] border-[var(--primary)] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={localePath(child.href)}
                          className={cn(
                            'block px-5 py-2.5 text-sm transition-colors',
                            isActive(child.href)
                              ? 'text-[var(--primary)] bg-[var(--primary-50)] font-medium'
                              : 'text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50 hover:pl-6'
                          )}
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div key={item.key}>
                <Link
                  href={localePath(item.href)}
                  className={cn(
                    'block px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'text-[var(--primary)] bg-[var(--primary-50)]'
                      : 'text-gray-700 hover:text-[var(--primary)] hover:bg-gray-50'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.key)}
                </Link>
                {item.children && (
                  <div className="ml-4 border-l-2 border-gray-100 pl-3 my-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={localePath(child.href)}
                        className="block px-3 py-2 text-sm text-gray-500 hover:text-[var(--primary)] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

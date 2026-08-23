'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import type { Banner } from '@duongbo/types'

const MOCK_BANNERS = [
  {
    id: 1,
    image: '/images/anh-cong-ty.png',
    titleVi: 'Xây dựng công trình cầu đường chuyên nghiệp',
    titleEn: 'Professional Bridge & Road Construction',
    subtitleVi: 'Kiến tạo hạ tầng giao thông bền vững cho tỉnh Gia Lai',
    subtitleEn: 'Building sustainable transport infrastructure for Gia Lai',
    link: null,
    order: 1,
    page: 'home',
  },
  {
    id: 2,
    image: '/images/anh-cong-ty.png',
    titleVi: 'Hơn 30 năm kinh nghiệm xây dựng hạ tầng',
    titleEn: 'Over 30 years of infrastructure experience',
    subtitleVi: 'Uy tín - Chất lượng - An toàn - Hiệu quả',
    subtitleEn: 'Trust - Quality - Safety - Efficiency',
    link: null,
    order: 2,
    page: 'home',
  },
  {
    id: 3,
    image: '/images/anh-cong-ty.png',
    titleVi: 'Công trình tiêu biểu tại Gia Lai',
    titleEn: 'Notable Projects in Gia Lai',
    subtitleVi: 'Xây dựng hàng trăm Km đường Quốc lộ, Tỉnh lộ, cầu và đường địa phương',
    subtitleEn: 'Building hundreds of km of national roads, provincial roads, bridges and local roads',
    link: null,
    order: 3,
    page: 'home',
  },
]

export default function HeroSlider({ banners }: { banners?: Banner[] }) {
  const t = useTranslations('home')
  const locale = useLocale()
  const slides = banners && banners.length > 0 ? banners : MOCK_BANNERS

  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(idx)
      setTimeout(() => setIsTransitioning(false), 800)
    },
    [isTransitioning]
  )

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(next, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next])

  // Pause on hover
  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
  const resume = () => {
    intervalRef.current = setInterval(next, 6000)
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950
                 h-[480px] sm:h-[540px] md:h-[600px] lg:h-[660px] xl:h-[720px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero banner"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {slides.map((slide: any, i: number) => {
        const isActive = i === current
        const title = locale === 'vi' ? slide.titleVi : slide.titleEn || slide.titleVi
        const subtitle = locale === 'vi' ? slide.subtitleVi : slide.subtitleEn || slide.subtitleVi

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-800 ease-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image - 100% full, no crop */}
            <div className="absolute inset-0 overflow-hidden bg-slate-950">
              <Image
                src={getImageUrl(slide.image)}
                alt={title}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-contain object-center transition-transform duration-[9000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Soft gradient overlay for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      to right,
                      rgba(8, 22, 55, 0.82) 0%,
                      rgba(8, 22, 55, 0.55) 40%,
                      rgba(8, 22, 55, 0.25) 70%,
                      rgba(8, 22, 55, 0.08) 100%
                    )
                  `,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 w-full">
                <div
                  className={`max-w-2xl transition-all duration-700 delay-150 ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {/* Badge */}
                  <span className="inline-flex items-center bg-blue-600/95 text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow-md">
                    {t('hero_subtitle')}
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.15] tracking-tight drop-shadow-lg mb-4">
                    {title}
                  </h1>

                  {/* Subtitle */}
                  {subtitle && (
                    <p className="text-base md:text-lg text-slate-100/95 mb-7 max-w-xl leading-relaxed drop-shadow">
                      {subtitle}
                    </p>
                  )}

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/${locale}/gioi-thieu`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {t('view_more')}
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/${locale}/lien-he`}
                      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-lg border border-white/30 transition-all backdrop-blur-sm hover:-translate-y-0.5"
                    >
                      {locale === 'vi' ? 'Liên hệ' : 'Contact us'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        disabled={isTransitioning}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 md:left-8 top-1/2 -translate-y-1/2 z-30
                   w-10 h-10 md:w-11 md:h-11
                   bg-black/25 hover:bg-black/45 disabled:opacity-40
                   text-white rounded-full flex items-center justify-center
                   transition-all border border-white/20 backdrop-blur-sm
                   hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={next}
        disabled={isTransitioning}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 md:right-8 top-1/2 -translate-y-1/2 z-30
                   w-10 h-10 md:w-11 md:h-11
                   bg-black/25 hover:bg-black/45 disabled:opacity-40
                   text-white rounded-full flex items-center justify-center
                   transition-all border border-white/20 backdrop-blur-sm
                   hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                : 'bg-white/40 w-2.5 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
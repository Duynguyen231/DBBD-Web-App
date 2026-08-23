'use client'

import { useEffect, useState, useCallback } from 'react'
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

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(idx)
      setTimeout(() => setIsTransitioning(false), 800)
    },
    [isTransitioning]
  )

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative h-[550px] md:h-[650px] lg:h-[700px] w-full overflow-hidden bg-slate-950">
      {slides.map((slide: any, i: number) => {
        const isActive = i === current
        const title = locale === 'vi' ? slide.titleVi : slide.titleEn || slide.titleVi
        const subtitle = locale === 'vi' ? slide.subtitleVi : slide.subtitleEn || slide.subtitleVi

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={getImageUrl(slide.image)}
                alt={title}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Dark Gradient Overlay for Text Readability */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(13, 30, 70, 0.95) 0%, rgba(13, 30, 70, 0.75) 45%, rgba(13, 30, 70, 0.1) 100%)'
                }}
              />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div
                  className={`max-w-2xl transition-all duration-700 delay-200 ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                >
                  <span className="inline-block bg-[var(--primary,#1d4ed8)]/90 text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded mb-4 shadow-sm">
                    {t('hero_subtitle')}
                  </span>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md mb-4">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="text-base md:text-lg text-slate-200 mb-8 max-w-xl leading-relaxed drop-shadow">
                      {subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/${locale}/gioi-thieu`}
                      className="inline-flex items-center gap-2 bg-[var(--primary,#1d4ed8)] hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      {t('view_more')}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/${locale}/lien-he`}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-lg border border-white/30 transition-all backdrop-blur-sm hover:-translate-y-0.5"
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

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm hover:scale-105"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => next()}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm hover:scale-105"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
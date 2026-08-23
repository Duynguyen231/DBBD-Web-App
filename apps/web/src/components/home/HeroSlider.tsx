'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import type { Banner } from '@duongbo/types'

const MOCK_BANNERS = [
  { id: 1, image: '/images/anh-cong-ty.png', titleVi: 'Xây dựng công trình cầu đường chuyên nghiệp', titleEn: 'Professional Bridge & Road Construction', subtitleVi: 'Kiến tạo hạ tầng giao thông bền vững cho tỉnh Gia Lai', subtitleEn: 'Building sustainable transport infrastructure for Gia Lai', link: null, order: 1, page: 'home' },
  { id: 2, image: '/images/anh-cong-ty.png', titleVi: 'Hơn 30 năm kinh nghiệm xây dựng hạ tầng', titleEn: 'Over 30 years of infrastructure experience', subtitleVi: 'Uy tín - Chất lượng - An toàn - Hiệu quả', subtitleEn: 'Trust - Quality - Safety - Efficiency', link: null, order: 2, page: 'home' },
  { id: 3, image: '/images/anh-cong-ty.png', titleVi: 'Công trình tiêu biểu tại Gia Lai', titleEn: 'Notable Projects in Gia Lai', subtitleVi: 'Xây dựng hàng trăm Km đường Quốc lộ, Tỉnh lộ, cầu và đường địa phương', subtitleEn: 'Building hundreds of km of national roads, provincial roads, bridges and local roads', link: null, order: 3, page: 'home' },
]

export default function HeroSlider({ banners }: { banners?: Banner[] }) {
  const t = useTranslations('home')
  const locale = useLocale()
  const slides = banners && banners.length > 0 ? banners : MOCK_BANNERS
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(idx)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative h-[550px] md:h-[650px] lg:h-[700px] overflow-hidden bg-gray-900">
      {slides.map((slide: any, i: number) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[800ms] ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background image with the left-weighted overlay required for readable text. */}
          {/* <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(13, 30, 70, 0.95) 0%, rgba(13, 30, 70, 0.7) 40%, rgba(13, 30, 70, 0.1) 100%), url('${getImageUrl(slide.image)}')`,
            }}
          /> */}

          {/* Background image with the left-weighted overlay required for readable text. */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(13, 30, 70, 0.95) 0%, rgba(13, 30, 70, 0.7) 40%, rgba(13, 30, 70, 0.1) 100%), url('${getImageUrl(slide.image)}')`,
              backgroundSize: 'auto 100%, 75%',
              backgroundColor: '#0d1e46',
            }}
          />


          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className={`max-w-4xl lg:max-w-[58%] transition-all duration-700 delay-200 ${
                i === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <div className="inline-block bg-[var(--primary)]/90 text-white text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded mb-5">
                  {t('hero_subtitle')}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.15] drop-shadow-lg mb-4">
                  {locale === 'vi' ? slide.titleVi : (slide.titleEn || slide.titleVi)}
                </h1>
                {(slide.subtitleVi || slide.subtitleEn) && (
                  <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                    {locale === 'vi' ? slide.subtitleVi : (slide.subtitleEn || slide.subtitleVi)}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/gioi-thieu`}
                    className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    {t('view_more')}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/${locale}/lien-he`}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-lg border border-white/30 transition-all"
                  >
                    {locale === 'vi' ? 'Liên hệ' : 'Contact us'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all border border-white/20"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => next()}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all border border-white/20"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? 'bg-white w-10' : 'bg-white/40 w-5 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

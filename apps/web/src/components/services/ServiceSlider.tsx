'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Building2, Truck, HardHat, Wrench } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface Service {
  id: number
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  image?: string
  order: number
}

interface ServiceSliderProps {
  services: Service[]
  isVi: boolean
}

const ICONS = [Building2, Truck, HardHat, Wrench]

export default function ServiceSlider({ services, isVi }: ServiceSliderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(services.length / itemsPerPage)
  const showSlider = services.length > itemsPerPage

  const pages = Array.from({ length: totalPages }, (_, i) =>
    services.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
  )

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  useEffect(() => {
    if (!showSlider) return
    const interval = setInterval(nextPage, 8000)
    return () => clearInterval(interval)
  }, [totalPages, showSlider])

  return (
    <div className="relative">
      <div className="grid">
        {pages.map((pageServices, pageIdx) => {
          const isActive = pageIdx === currentPage

          return (
            <div
              key={pageIdx}
              className={`col-start-1 row-start-1 space-y-20 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              {pageServices.map((service, idx) => {
                const Icon = ICONS[idx % ICONS.length]
                const isReversed = idx % 2 === 1
                const globalIdx = pageIdx * itemsPerPage + idx

                return (
                  <div key={service.id} className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className={isReversed ? 'md:order-2' : ''}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[var(--primary-50)] rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
                          {isVi ? 'Lĩnh vực' : 'Service'} {String(globalIdx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        {isVi ? service.titleVi : service.titleEn}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-[15px]">
                        {isVi ? service.descVi : service.descEn}
                      </p>
                    </div>

                    {/* Image */}
                    <div className={`rounded-2xl overflow-hidden shadow-lg group ${isReversed ? 'md:order-1' : ''}`}>
                      {service.image ? (
                        <img
                          src={getImageUrl(service.image)}
                          alt={isVi ? service.titleVi : service.titleEn}
                          loading="lazy"
                          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-72 bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center">
                          <Icon className="w-20 h-20 text-[var(--primary)] opacity-30" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Slider Controls */}
      {showSlider && (
        <div className="mt-16">
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prevPage}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[var(--primary)] hover:shadow-xl transition-all border border-gray-200"
              aria-label={isVi ? 'Trước' : 'Previous'}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`transition-all ${
                    idx === currentPage
                      ? 'w-8 h-3 bg-[var(--primary)] rounded-full'
                      : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                  aria-label={`${isVi ? 'Trang' : 'Page'} ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextPage}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[var(--primary)] hover:shadow-xl transition-all border border-gray-200"
              aria-label={isVi ? 'Sau' : 'Next'}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-gray-500" aria-live="polite">
            {isVi ? 'Trang' : 'Page'} {currentPage + 1} / {totalPages}
          </p>
        </div>
      )}
    </div>
  )
}

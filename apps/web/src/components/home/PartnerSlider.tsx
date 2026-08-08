'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface Partner {
  id: number
  name: string
  logo: string
  website?: string
  order: number
}

interface PartnerSliderProps {
  partners: Partner[]
  isVi: boolean
}

export default function PartnerSlider({ partners, isVi }: PartnerSliderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const totalPages = Math.ceil(partners.length / itemsPerPage)
  const showSlider = partners.length > itemsPerPage

  const currentPartners = partners.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  useEffect(() => {
    if (!showSlider) return
    const interval = setInterval(nextPage, 5000)
    return () => clearInterval(interval)
  }, [currentPage, showSlider])

  if (partners.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-12 items-center">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-center p-6 h-40"
          >
            <img
              src="/images/petrolimex_logo.jpg"
              alt={`Partner ${idx + 1}`}
              className="max-h-32 max-w-full w-auto group-hover:scale-105 transition-transform duration-300 object-contain"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-12 items-center">
        {currentPartners.map((partner) => (
          <div
            key={partner.id}
            className="group flex items-center justify-center p-6 h-40"
          >
            <img
              src={getImageUrl(partner.logo)}
              alt={partner.name}
              className="max-h-32 max-w-full w-auto group-hover:scale-105 transition-transform duration-300 object-contain"
            />
          </div>
        ))}
      </div>

      {showSlider && (
        <>
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[var(--primary)] hover:shadow-xl transition-all z-10"
            aria-label={isVi ? 'Trước' : 'Previous'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[var(--primary)] hover:shadow-xl transition-all z-10"
            aria-label={isVi ? 'Sau' : 'Next'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage
                    ? 'bg-[var(--primary)] w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${isVi ? 'Trang' : 'Page'} ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

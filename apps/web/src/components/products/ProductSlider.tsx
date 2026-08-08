'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'

interface Product {
  id: number
  slug: string
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  images?: string[]
  category?: string
}

interface ProductSliderProps {
  products: Product[]
  isVi: boolean
  locale: string
}

export default function ProductSlider({ products, isVi, locale }: ProductSliderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const showSlider = products.length > itemsPerPage

  const currentProducts = products.slice(
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
    const interval = setInterval(nextPage, 10000)
    return () => clearInterval(interval)
  }, [currentPage, showSlider])

  return (
    <div className="relative">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <Link
            key={product.id}
            href={`/${locale}/san-pham/${product.slug}`}
            className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-52 bg-gray-100 overflow-hidden relative">
              {product.images?.[0] ? (
                <img
                  src={getImageUrl(product.images[0])}
                  alt={isVi ? product.titleVi : product.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary)] font-bold text-3xl">
                  {(isVi ? product.titleVi : product.titleEn).charAt(0)}
                </div>
              )}
              {product.category && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold text-white bg-[var(--primary)] px-3 py-1 rounded-full shadow-lg">
                    {product.category}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors text-lg">
                {isVi ? product.titleVi : product.titleEn}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {isVi ? product.descVi : product.descEn}
              </p>
              <div className="mt-4 flex items-center text-[var(--primary)] font-semibold text-sm group-hover:gap-2 transition-all">
                <span>{isVi ? 'Xem chi tiết' : 'View details'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Slider Controls */}
      {showSlider && (
        <div className="mt-12">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prevPage}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[var(--primary)] hover:shadow-xl transition-all border border-gray-200"
              aria-label={isVi ? 'Trước' : 'Previous'}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
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
              onClick={nextPage}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[var(--primary)] hover:shadow-xl transition-all border border-gray-200"
              aria-label={isVi ? 'Sau' : 'Next'}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-gray-500">
            {isVi ? 'Trang' : 'Page'} {currentPage + 1} / {totalPages} 
            <span className="mx-2">•</span>
            {isVi ? 'Tổng' : 'Total'} {products.length} {isVi ? 'sản phẩm' : 'products'}
          </p>
        </div>
      )}
    </div>
  )
}

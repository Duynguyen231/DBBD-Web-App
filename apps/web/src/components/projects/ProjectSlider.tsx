'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'

interface Project {
  id: number
  slug: string
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  location: string
  status: string
  images?: string[]
}

interface ProjectSliderProps {
  projects: Project[]
  isVi: boolean
  locale: string
}

const STATUS_LABELS: Record<string, { vi: string; en: string; color: string }> = {
  ONGOING: { vi: 'Đang thi công', en: 'Ongoing', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed', color: 'bg-green-100 text-green-700' },
  UPCOMING: { vi: 'Sắp triển khai', en: 'Upcoming', color: 'bg-yellow-100 text-yellow-700' },
}

export default function ProjectSlider({ projects, isVi, locale }: ProjectSliderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const showSlider = projects.length > itemsPerPage

  const currentProjects = projects.slice(
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
        {currentProjects.map((project) => {
          const statusInfo = STATUS_LABELS[project.status] || STATUS_LABELS.ONGOING
          return (
            <Link
              key={project.id}
              href={`/${locale}/cong-trinh/${project.slug}`}
              className="group rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className="h-52 bg-gray-200 relative overflow-hidden">
                {project.images?.[0] ? (
                  <img
                    src={getImageUrl(project.images[0])}
                    alt={isVi ? project.titleVi : project.titleEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-4xl font-bold">
                    {(isVi ? project.titleVi : project.titleEn).charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg ${statusInfo.color}`}>
                    {isVi ? statusInfo.vi : statusInfo.en}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-[var(--primary)] transition-colors text-lg">
                  {isVi ? project.titleVi : project.titleEn}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <span className="line-clamp-1">{project.location}</span>
                </div>
                <div className="flex items-center text-[var(--primary)] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>{isVi ? 'Xem chi tiết' : 'View details'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          )
        })}
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
            {isVi ? 'Tổng' : 'Total'} {projects.length} {isVi ? 'công trình' : 'projects'}
          </p>
        </div>
      )}
    </div>
  )
}

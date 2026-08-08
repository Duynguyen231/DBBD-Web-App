import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getImageUrl, formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Calendar, Building2, CheckCircle2, Clock } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const STATUS_INFO: Record<string, { vi: string; en: string; color: string; icon: any }> = {
  ONGOING: { vi: 'Đang thi công', en: 'Ongoing', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  UPCOMING: { vi: 'Sắp triển khai', en: 'Upcoming', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Calendar },
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const isVi = locale === 'vi'

  let project: any = null
  try {
    const res = await fetch(`${API}/projects/${slug}`, { next: { revalidate: 60 } })
    if (res.ok) project = await res.json()
  } catch {}

  if (!project) notFound()

  const statusInfo = STATUS_INFO[project.status] || STATUS_INFO.ONGOING
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}/cong-trinh`}
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {isVi ? 'Quay lại danh sách công trình' : 'Back to projects'}
          </Link>
        </div>
      </div>

      {/* Project Detail */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Image */}
        {project.images?.length > 0 && (
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-8 group">
            <img
              src={getImageUrl(project.images[0])}
              alt={isVi ? project.titleVi : project.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {isVi ? statusInfo.vi : statusInfo.en}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 drop-shadow-lg">
                {isVi ? project.titleVi : project.titleEn}
              </h1>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Info Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-[var(--primary)]" />
                {isVi ? 'Thông tin công trình' : 'Project Information'}
              </h2>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-6 border border-gray-100">
                  {isVi ? project.descVi : project.descEn}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {project.images?.length > 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isVi ? 'Hình ảnh công trình' : 'Project Gallery'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.slice(1).map((img: string, i: number) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isVi ? 'Chi tiết' : 'Details'}
              </h3>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-start gap-3 pb-4 border-b">
                  <StatusIcon className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{isVi ? 'Trạng thái' : 'Status'}</p>
                    <p className="font-semibold text-gray-900">{isVi ? statusInfo.vi : statusInfo.en}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 pb-4 border-b">
                  <MapPin className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{isVi ? 'Địa điểm' : 'Location'}</p>
                    <p className="font-semibold text-gray-900">{project.location}</p>
                  </div>
                </div>

                {/* Timeline */}
                {project.startDate && (
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <Calendar className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{isVi ? 'Thời gian' : 'Timeline'}</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(project.startDate, locale)}
                        {project.endDate && (
                          <>
                            <br />
                            <span className="text-sm text-gray-500">→ </span>
                            {formatDate(project.endDate, locale)}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Project ID */}
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{isVi ? 'Mã công trình' : 'Project ID'}</p>
                    <p className="font-semibold text-gray-900">#{project.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-6 border border-[var(--primary)]/10">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {isVi ? 'Cần thêm thông tin?' : 'Need More Information?'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {isVi
                  ? 'Liên hệ với chúng tôi để biết thêm chi tiết về công trình'
                  : 'Contact us for more details about this project'}
              </p>
              <Link
                href={`/${locale}/lien-he`}
                className="block text-center bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-md hover:shadow-lg"
              >
                {isVi ? 'Liên hệ ngay' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isVi ? 'Công trình khác' : 'Other Projects'}
            </h2>
            <p className="text-gray-600">
              {isVi ? 'Khám phá thêm các công trình khác' : 'Explore more projects'}
            </p>
          </div>
          <div className="text-center">
            <Link
              href={`/${locale}/cong-trinh`}
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold transition-colors"
            >
              {isVi ? 'Xem tất cả công trình' : 'View all projects'}
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

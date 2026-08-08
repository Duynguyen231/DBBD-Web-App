import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Clock } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const isVi = locale === 'vi'

  let job: any = null
  try {
    const res = await fetch(`${API}/jobs/${slug}`, { next: { revalidate: 60 } })
    if (res.ok) job = await res.json()
  } catch {}

  if (!job) notFound()

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <Link href={`/${locale}/tuyen-dung`} className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{isVi ? job.titleVi : job.titleEn}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
              {job.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Hạn: {formatDate(job.deadline, locale)}
                </span>
              )}
            </div>
          </div>
          <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${
            job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {job.status === 'OPEN' ? 'Đang tuyển' : 'Đã đóng'}
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Mô tả công việc</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {isVi ? job.descVi : job.descEn}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {isVi ? job.requirementsVi : job.requirementsEn}
            </div>
          </div>
        </div>

        {job.status === 'OPEN' && (
          <div className="mt-8 pt-6 border-t">
            <a
              href={`mailto:tuyendung@duongbobinhdinh.vn?subject=Ứng tuyển: ${isVi ? job.titleVi : job.titleEn}`}
              className="inline-block bg-[var(--primary)] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              Ứng tuyển ngay
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

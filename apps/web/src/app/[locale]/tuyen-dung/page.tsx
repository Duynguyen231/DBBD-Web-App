import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { formatDate } from '@/lib/utils'
import { MapPin, Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Tuyển dụng | Đường Bộ Bình Định' }
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const MOCK_JOBS = [
  {
    id: '1',
    slug: 'ky-su-cau-duong',
    titleVi: 'Kỹ sư Cầu đường',
    titleEn: 'Bridge & Road Engineer',
    location: 'TP. Quy Nhơn, Bình Định',
    status: 'OPEN',
    deadline: '2026-04-30T00:00:00Z',
  },
  {
    id: '2',
    slug: 'ky-su-giam-sat-cong-trinh',
    titleVi: 'Kỹ sư Giám sát công trình',
    titleEn: 'Construction Supervision Engineer',
    location: 'TP. Quy Nhơn, Bình Định',
    status: 'OPEN',
    deadline: '2026-04-25T00:00:00Z',
  },
  {
    id: '3',
    slug: 'ke-toan-tong-hop',
    titleVi: 'Kế toán tổng hợp',
    titleEn: 'General Accountant',
    location: 'TP. Quy Nhơn, Bình Định',
    status: 'OPEN',
    deadline: '2026-04-20T00:00:00Z',
  },
  {
    id: '4',
    slug: 'nhan-vien-hanh-chinh-nhan-su',
    titleVi: 'Nhân viên Hành chính - Nhân sự',
    titleEn: 'HR & Admin Staff',
    location: 'TP. Quy Nhơn, Bình Định',
    status: 'OPEN',
    deadline: '2026-04-15T00:00:00Z',
  },
  {
    id: '5',
    slug: 'lai-xe-ben-tai-trong-lon',
    titleVi: 'Lái xe ben tải trọng lớn',
    titleEn: 'Heavy Dump Truck Driver',
    location: 'Huyện Tuy Phước, Bình Định',
    status: 'OPEN',
    deadline: '2026-05-01T00:00:00Z',
  },
  {
    id: '6',
    slug: 'ky-su-thi-nghiem-vat-lieu',
    titleVi: 'Kỹ sư Thí nghiệm vật liệu xây dựng',
    titleEn: 'Construction Materials Testing Engineer',
    location: 'TP. Quy Nhơn, Bình Định',
    status: 'CLOSED',
    deadline: '2026-03-01T00:00:00Z',
  },
  {
    id: '7',
    slug: 'ky-su-trac-dia',
    titleVi: 'Kỹ sư Trắc địa',
    titleEn: 'Surveying Engineer',
    location: 'TP. Quy Nhơn, Bình Định',
    status: 'CLOSED',
    deadline: '2026-02-15T00:00:00Z',
  },
]

export default async function RecruitmentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const locale = await getLocale()
  const { status = '', page = '1' } = await searchParams
  const params = new URLSearchParams({ page, limit: '10', ...(status ? { status } : {}) })

  let data: any = { data: [] }
  try {
    const res = await fetch(`${API}/jobs?${params}`, { next: { revalidate: 60 } })
    if (res.ok) data = await res.json()
  } catch {}

  const isVi = locale === 'vi'
  const allJobs = data.data.length > 0 ? data.data : MOCK_JOBS
  const jobs = status ? allJobs.filter((j: any) => j.status === status) : allJobs

  return (
    <div className="py-12">
      <div className="bg-[var(--primary)] text-white py-12 mb-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Tuyển dụng</h1>
          <p className="text-blue-200 mt-2">Cơ hội nghề nghiệp tại Đường Bộ Bình Định</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-2 mb-8">
          {[
            { label: 'Tất cả', value: '' },
            { label: 'Đang tuyển', value: 'OPEN' },
            { label: 'Đã đóng', value: 'CLOSED' },
          ].map((s) => (
            <Link
              key={s.value}
              href={s.value ? `?status=${s.value}` : '?'}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                status === s.value
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)]'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Chưa có vị trí tuyển dụng nào.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/${locale}/tuyen-dung/${job.slug}`}
                className="block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-[var(--primary-100)] transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-2">
                      {isVi ? job.titleVi : job.titleEn}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Hạn: {formatDate(job.deadline, locale)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {job.status === 'OPEN' ? 'Đang tuyển' : 'Đã đóng'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

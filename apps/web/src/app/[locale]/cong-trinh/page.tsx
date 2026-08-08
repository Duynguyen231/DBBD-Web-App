import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import ProjectSlider from '@/components/projects/ProjectSlider'

export const metadata: Metadata = { title: 'Công trình | Đường Bộ Bình Định' }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const MOCK_PROJECTS = [
  { id: 1, slug: 'nang-cap-ql-1d', titleVi: 'Nâng cấp Quốc lộ 1D đoạn qua TP. Quy Nhơn', titleEn: 'Upgrading National Route 1D through Quy Nhon', descVi: 'Nâng cấp và mở rộng tuyến Quốc lộ 1D đoạn qua thành phố Quy Nhơn, nâng cao chất lượng giao thông.', descEn: 'Upgrading and expanding National Route 1D through Quy Nhon city to improve traffic quality.', location: 'TP. Quy Nhơn', status: 'ONGOING', images: ['/images/project-1.jpg'] },
  { id: 2, slug: 'cau-thi-nai-2', titleVi: 'Xây dựng cầu Thị Nại 2', titleEn: 'Thi Nai Bridge 2 Construction', descVi: 'Xây dựng cầu Thị Nại 2 kết nối Quy Nhơn và Phù Mỹ, rút ngắn thời gian di chuyển.', descEn: 'Construction of Thi Nai Bridge 2 connecting Quy Nhon and Phu My, reducing travel time.', location: 'Quy Nhơn - Phù Mỹ', status: 'ONGOING', images: ['/images/project-2.jpg'] },
  { id: 3, slug: 'bao-tri-dt-638', titleVi: 'Bảo trì tuyến đường tỉnh lộ ĐT 638', titleEn: 'Provincial Road DT 638 Maintenance', descVi: 'Bảo trì và sửa chữa tuyến đường tỉnh lộ ĐT 638 đoạn Tây Sơn - Vĩnh Thạnh.', descEn: 'Maintenance and repair of Provincial Road DT 638 section Tay Son - Vinh Thanh.', location: 'Tây Sơn - Vĩnh Thạnh', status: 'COMPLETED', images: ['/images/project-3.jpg'] },
  { id: 4, slug: 'duong-ven-bien', titleVi: 'Đường ven biển Cát Tiến - Đề Gi', titleEn: 'Coastal Road Cat Tien - De Gi', descVi: 'Xây dựng tuyến đường ven biển Cát Tiến - Đề Gi, phát triển du lịch và kinh tế.', descEn: 'Construction of coastal road Cat Tien - De Gi, developing tourism and economy.', location: 'Phù Cát', status: 'ONGOING', images: ['/images/project-4.jpg'] },
  { id: 5, slug: 'ql-19-mo-rong', titleVi: 'Mở rộng Quốc lộ 19 đoạn An Nhơn', titleEn: 'National Route 19 Expansion - An Nhon', descVi: 'Mở rộng Quốc lộ 19 đoạn qua thị xã An Nhơn, nâng cao năng lực vận tải.', descEn: 'Expansion of National Route 19 through An Nhon town, enhancing transport capacity.', location: 'TX. An Nhơn', status: 'COMPLETED', images: ['/images/project-5.jpg'] },
  { id: 6, slug: 'duong-noi-thi', titleVi: 'Đường nội thị Hoài Nhơn', titleEn: 'Hoai Nhon Urban Road', descVi: 'Xây dựng tuyến đường nội thị Hoài Nhơn, cải thiện hạ tầng giao thông đô thị.', descEn: 'Construction of Hoai Nhon urban road, improving urban traffic infrastructure.', location: 'TX. Hoài Nhơn', status: 'UPCOMING', images: ['/images/project-6.jpg'] },
]

const STATUSES = ['', 'ONGOING', 'COMPLETED', 'UPCOMING']
const STATUS_LABELS: Record<string, { vi: string; en: string }> = {
  '': { vi: 'Tất cả', en: 'All' },
  ONGOING: { vi: 'Đang thi công', en: 'Ongoing' },
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed' },
  UPCOMING: { vi: 'Sắp triển khai', en: 'Upcoming' },
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const locale = await getLocale()
  const { status = '', page = '1' } = await searchParams
  const params = new URLSearchParams({ page, limit: '100', ...(status ? { status } : {}) })

  let data: any = { data: [], totalPages: 1 }
  try {
    const res = await fetch(`${API}/projects?${params}`, { cache: 'no-store' })
    if (res.ok) data = await res.json()
  } catch {}

  const isVi = locale === 'vi'
  const projects = data.data.length > 0 ? data.data : (status ? MOCK_PROJECTS.filter(p => p.status === status) : MOCK_PROJECTS)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-white/50" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">
              {isVi ? 'Các công trình của chúng tôi' : 'Our Projects'}
            </p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {isVi ? 'Công trình' : 'Projects'}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            {isVi 
              ? 'Các công trình giao thông trọng điểm đang và đã được triển khai trên địa bàn tỉnh Bình Định' 
              : 'Key transport projects being implemented and completed in Binh Dinh province'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={s ? `?status=${s}` : '?'}
              className={`px-6 py-3 rounded-full text-sm font-semibold border-2 transition-all ${
                status === s
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md'
              }`}
            >
              {isVi ? STATUS_LABELS[s].vi : STATUS_LABELS[s].en}
            </Link>
          ))}
        </div>

        {/* Projects Grid with Slider */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">🏗️</span>
            </div>
            <p className="text-gray-500 text-lg">
              {isVi ? 'Chưa có công trình nào.' : 'No projects available.'}
            </p>
          </div>
        ) : (
          <ProjectSlider projects={projects} isVi={isVi} locale={locale} />
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-[var(--primary)]/10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {isVi ? 'Cần thông tin về công trình?' : 'Need Project Information?'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {isVi 
              ? 'Liên hệ với chúng tôi để biết thêm chi tiết về các công trình và dự án đang triển khai'
              : 'Contact us for more details about ongoing projects and initiatives'}
          </p>
          <a 
            href={`/${locale}/lien-he`}
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-md hover:shadow-lg"
          >
            {isVi ? 'Liên hệ ngay' : 'Contact Us'}
          </a>
        </div>
      </div>
    </div>
  )
}

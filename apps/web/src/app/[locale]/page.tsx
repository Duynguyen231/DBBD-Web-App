import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import HeroSlider from '@/components/home/HeroSlider'
import StatsSection from '@/components/home/StatsSection'
import PartnerSlider from '@/components/home/PartnerSlider'
import { getImageUrl, formatDate } from '@/lib/utils'
import { ArrowRight, MapPin, Calendar, Briefcase, ChevronRight, Shield, Truck, Building2, HardHat } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Trang chủ | Đường Bộ Bình Định' }
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function fetchData<T>(path: string): Promise<T | null> {
  try {
    const isDynamicContentPath = ['/news', '/partners', '/banners', '/services', '/projects'].some((p) =>
      path.startsWith(p)
    )
    const res = await fetch(
      `${API}${path}`,
      isDynamicContentPath ? { cache: 'no-store' } : { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const SERVICE_ICONS = [Building2, Truck, HardHat, Shield]

const MOCK_SERVICES = [
  { id: 1, image: '/images/1-Trạm trộn Bình Đê Km1125+00 QL1 tỉnh Gia Lai.png', titleVi: 'Xây dựng công trình giao thông', titleEn: 'Transport Construction', descVi: 'Thi công xây dựng các công trình đường bộ, cầu, cống và hạ tầng giao thông theo tiêu chuẩn quốc gia.', descEn: 'Construction of roads, bridges, culverts and transport infrastructure.' },
  { id: 2, image: '/images/1-TRẠM TRỘN BÌNH ĐÊ.png', titleVi: 'Quản lý bảo trì đường bộ', titleEn: 'Road Maintenance Management', descVi: 'Quản lý, bảo trì hệ thống quốc lộ, tỉnh lộ và đường giao thông nông thôn trên địa bàn tỉnh Bình Định.', descEn: 'Managing and maintaining national, provincial and rural road systems in Binh Dinh province.' },
  { id: 3, image: '/images/1-Phòng làm việc kĩ thuật.jpg', titleVi: 'Sản xuất vật liệu xây dựng', titleEn: 'Construction Materials', descVi: 'Sản xuất và cung ứng vật liệu xây dựng: nhựa đường, bê tông, đá xây dựng phục vụ thi công công trình.', descEn: 'Production and supply of construction materials.' },
  { id: 4, image: '/images/1-Phòng làm việc kế toán.JPG', titleVi: 'Cho thuê máy móc, thiết bị thi công', titleEn: 'Construction Equipment Rental', descVi: 'Cho thuê các loại máy móc, thiết bị thi công đường bộ, cầu cống phục vụ các dự án xây dựng hạ tầng.', descEn: 'Rental of road and bridge construction machinery and equipment for infrastructure projects.' },
]

const MOCK_PROJECTS = [
  { id: 1, slug: 'nang-cap-ql-1d', titleVi: 'Nâng cấp Quốc lộ 1D đoạn qua TP. Quy Nhơn', titleEn: 'Upgrading National Route 1D through Quy Nhon', location: 'TP. Quy Nhơn', status: 'ONGOING', image: '/images/1-Trạm trộn Bình Đê Km1125+00 QL1 tỉnh Gia Lai.png' },
  { id: 2, slug: 'cau-thi-nai-2', titleVi: 'Xây dựng cầu Thị Nại 2', titleEn: 'Thi Nai Bridge 2 Construction', location: 'Quy Nhơn - Phù Mỹ', status: 'ONGOING', image: '/images/1-TRẠM TRỘN BÌNH ĐÊ.png' },
  { id: 3, slug: 'bao-tri-dt-638', titleVi: 'Bảo trì tuyến đường tỉnh lộ ĐT 638', titleEn: 'Provincial Road DT 638 Maintenance', location: 'Tây Sơn - Vĩnh Thạnh', status: 'COMPLETED', image: '/images/1-Họp giao ban.JPG' },
  { id: 4, slug: 'duong-ven-bien', titleVi: 'Đường ven biển Cát Tiến - Đề Gi', titleEn: 'Coastal Road Cat Tien - De Gi', location: 'Phù Cát', status: 'ONGOING', image: '/images/1-Hội trường công ty.JPG' },
  { id: 5, slug: 'ql-19-mo-rong', titleVi: 'Mở rộng Quốc lộ 19 đoạn An Nhơn', titleEn: 'National Route 19 Expansion - An Nhon', location: 'TX. An Nhơn', status: 'COMPLETED', image: '/images/1-Phòng làm việc kĩ thuật.jpg' },
  { id: 6, slug: 'duong-noi-thi', titleVi: 'Đường nội thị Hoài Nhơn', titleEn: 'Hoai Nhon Urban Road', location: 'TX. Hoài Nhơn', status: 'PLANNED', image: '/images/1-Giám đốc kí duyệt hồ sơ.JPG' },
]

export default async function HomePage() {
  const locale = await getLocale()
  const t = await getTranslations('home')
  const lp = (href: string) => `/${locale}${href}`

  const [banners, services, projects, newsData, partners] = await Promise.all([
    fetchData<any[]>('/banners?page=home'),
    fetchData<any[]>('/services'),
    fetchData<any>('/projects?limit=6'),
    fetchData<any>('/news?limit=6'),
    fetchData<any[]>('/partners'),
  ])

  const isVi = locale === 'vi'
  const displayServices = services && services.length > 0 ? services : MOCK_SERVICES
  const displayPartners = partners && partners.length > 0 ? partners : []

  return (
    <>
      <HeroSlider banners={banners || []} />

      {/* ── GIỚI THIỆU ── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-50)] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-[2px] bg-[var(--primary)]" />
                <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">{t('about_title')}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Vì sự phát triển hạ tầng giao thông <span className="text-[var(--primary)]">Bình Định</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">
                {t('about_desc')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: '30+', label: t('stats_years') },
                  { value: '500+', label: t('stats_projects') },
                  { value: '1200', label: t('stats_km') },
                  { value: '400+', label: t('stats_employees') },
                ].map((s) => (
                  <div key={s.label} className="border-l-[3px] border-[var(--primary)] pl-4 py-1">
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link href={lp('/gioi-thieu')} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-all font-semibold shadow-md hover:shadow-lg">
                {t('view_more')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-52 rounded-2xl overflow-hidden relative">
                    <img src="/images/1-TRẠM TRỘN BÌNH ĐÊ.png" alt="Trạm trộn Bình Đê" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[var(--primary)]/20" />
                  </div>
                  <div className="h-36 bg-[var(--primary-50)] rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--primary)]">30+</div>
                      <div className="text-sm text-[var(--primary-dark)] font-medium">{isVi ? 'Năm kinh nghiệm' : 'Years of experience'}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-36 rounded-2xl overflow-hidden relative">
                    <img src="/images/1-Hội trường công ty.JPG" alt="Hội trường công ty" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="h-52 rounded-2xl overflow-hidden relative">
                    <img src="/images/1-Giám đốc kí duyệt hồ sơ.JPG" alt="Giám đốc làm việc" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[var(--primary-dark)]/20" />
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{isVi ? 'ISO 9001:2015' : 'ISO 9001:2015'}</div>
                  <div className="text-xs text-gray-500">{isVi ? 'Chứng nhận chất lượng' : 'Quality certified'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LĨNH VỰC HOẠT ĐỘNG ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-10 h-[2px] bg-[var(--primary)]" />
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">{t('services_title')}</span>
              <span className="w-10 h-[2px] bg-[var(--primary)]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('services_title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.slice(0, 4).map((s: any, idx: number) => {
              const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length]
              const serviceImg = s.image || `/images/service-${idx + 1}.jpg`
              return (
                <Link key={s.id} href={lp('/linh-vuc-hoat-dong')} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--primary)]/20 hover:-translate-y-1">
                  <div className="h-44 relative overflow-hidden">
                    <img src={serviceImg} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors">{isVi ? s.titleVi : s.titleEn}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{isVi ? s.descVi : s.descEn}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      {isVi ? 'Xem thêm' : 'Learn more'} <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── CÔNG TRÌNH ── */}
      {(() => {
        const displayProjects = projects?.data && projects.data.length > 0 ? projects.data : MOCK_PROJECTS
        return (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-10 h-[2px] bg-[var(--primary)]" />
                    <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">{t('projects_title')}</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('projects_title')}</h2>
                </div>
                <Link href={lp('/cong-trinh')} className="hidden sm:inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all">
                  {t('view_all')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {displayProjects.slice(0, 6).map((p: any) => {
                  const projectImg = p.image || (p.images?.[0] ? getImageUrl(p.images[0]) : '/images/placeholder.jpg')
                  return (
                    <Link key={p.id} href={lp(`/cong-trinh/${p.slug}`)} className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="h-52 relative overflow-hidden">
                        <img src={projectImg} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                            p.status === 'COMPLETED' ? 'bg-green-500/90 text-white' : p.status === 'ONGOING' ? 'bg-blue-500/90 text-white' : 'bg-amber-500/90 text-white'
                          }`}>
                            {p.status === 'COMPLETED' ? (isVi ? 'Hoàn thành' : 'Completed') : p.status === 'ONGOING' ? (isVi ? 'Đang thi công' : 'In Progress') : (isVi ? 'Sắp triển khai' : 'Planned')}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-shadow line-clamp-2">{isVi ? p.titleVi : p.titleEn}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin className="w-3.5 h-3.5" /><span>{p.location}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ── TIN TỨC ── */}
      {newsData?.data && newsData.data.length > 0 ? (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-10 h-[2px] bg-[var(--primary)]" />
                  <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">{t('news_title')}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('news_title')}</h2>
              </div>
              <Link href={lp('/tin-tuc')} className="hidden sm:inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all">
                {t('view_all')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-7">
              {/* Featured article */}
              <Link href={lp(`/tin-tuc/${newsData.data[0].slug}`)} className="lg:row-span-2 group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all">
                <div className="h-64 lg:h-80 bg-gray-200 relative overflow-hidden">
                  {newsData.data[0].thumbnail && (
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${getImageUrl(newsData.data[0].thumbnail)})` }} />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><Calendar className="w-3.5 h-3.5" />{formatDate(newsData.data[0].publishedAt, locale)}</div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-3 group-hover:text-[var(--primary)] transition-colors mb-3">{isVi ? newsData.data[0].titleVi : newsData.data[0].titleEn}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{isVi ? newsData.data[0].excerptVi : newsData.data[0].excerptEn}</p>
                </div>
              </Link>
              {/* Other articles */}
              {newsData.data.slice(1, 5).map((article: any) => (
                <Link key={article.id} href={lp(`/tin-tuc/${article.slug}`)} className="group flex gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-28 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                    {article.thumbnail && (
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url(${getImageUrl(article.thumbnail)})` }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2"><Calendar className="w-3 h-3" />{formatDate(article.publishedAt, locale)}</div>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">{isVi ? article.titleVi : article.titleEn}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-10 h-[2px] bg-[var(--primary)]" />
                  <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">{t('news_title')}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('news_title')}</h2>
              </div>
              <Link href={lp('/tin-tuc')} className="hidden sm:inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all">
                {t('view_all')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-7">
              {/* Featured mock article */}
              <Link href={lp('/tin-tuc')} className="lg:row-span-2 group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all">
                <div className="h-64 lg:h-80 relative overflow-hidden">
                  <img src="/images/1-Trạm trộn Bình Đê Km1125+00 QL1 tỉnh Gia Lai.png" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--primary)] text-white">{isVi ? 'Nổi bật' : 'Featured'}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><Calendar className="w-3.5 h-3.5" />25/03/2026</div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-3 group-hover:text-[var(--primary)] transition-colors mb-3">{isVi ? 'Khởi công dự án nâng cấp Quốc lộ 1D đoạn qua TP. Quy Nhơn' : 'Construction begins on National Route 1D upgrade through Quy Nhon City'}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{isVi ? 'Công ty đã chính thức khởi công dự án nâng cấp, mở rộng đoạn Quốc lộ 1D từ ngã tư Phú Tài đến cầu Đôi với tổng mức đầu tư hơn 200 tỷ đồng.' : 'The company has officially commenced the project to upgrade and expand the National Route 1D section from Phu Tai intersection to Doi Bridge.'}</p>
                </div>
              </Link>
              {/* Mock articles */}
              {[
                { img: '/images/1-TRẠM TRỘN BÌNH ĐÊ.png', date: '20/03/2026', titleVi: 'Hoàn thành sửa chữa tuyến đường tỉnh lộ ĐT 638', titleEn: 'Completed repairs on provincial road DT 638', excerptVi: 'Công trình sửa chữa nâng cấp tuyến đường tỉnh lộ ĐT 638 đã hoàn thành đúng tiến độ.', excerptEn: 'The repair and upgrade project for provincial road DT 638 has been completed on schedule.', tag: isVi ? 'Công trình' : 'Projects' },
                { img: '/images/1-Họp giao ban.JPG', date: '15/03/2026', titleVi: 'Đạt giải thưởng doanh nghiệp xuất sắc ngành GTVT 2025', titleEn: 'Won outstanding enterprise award in Transport sector 2025', excerptVi: 'Công ty vinh dự nhận giải thưởng doanh nghiệp xuất sắc trong lĩnh vực giao thông vận tải.', excerptEn: 'The company is honored to receive the outstanding enterprise award in the transport sector.', tag: isVi ? 'Tin công ty' : 'Company' },
                { img: '/images/1-Hội trường công ty.JPG', date: '10/03/2026', titleVi: 'Triển khai công tác bảo trì đường bộ mùa mưa bão 2026', titleEn: 'Road maintenance deployment for 2026 storm season', excerptVi: 'Kế hoạch bảo trì và ứng phó với mùa mưa bão đã được triển khai toàn diện.', excerptEn: 'The maintenance and storm season response plan has been comprehensively deployed.', tag: isVi ? 'Bảo trì' : 'Maintenance' },
                { img: '/images/1-Giám đốc kí duyệt hồ sơ.JPG', date: '05/03/2026', titleVi: 'Ký kết hợp đồng cung cấp nhựa đường cho các tỉnh miền Trung', titleEn: 'Signed asphalt supply contract for Central provinces', excerptVi: 'Hợp đồng cung cấp vật liệu nhựa đường cho các dự án tại khu vực miền Trung.', excerptEn: 'Asphalt supply contract for projects in the Central region.', tag: isVi ? 'Sản phẩm' : 'Products' },
              ].map((article, i) => (
                <Link key={i} href={lp('/tin-tuc')} className="group flex gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-28 h-24 rounded-lg overflow-hidden shrink-0 relative">
                    <img src={article.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--primary-50)] text-[var(--primary)]">{article.tag}</span>
                      <span className="text-xs text-gray-400">{article.date}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[var(--primary)] transition-colors mb-1">{isVi ? article.titleVi : article.titleEn}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{isVi ? article.excerptVi : article.excerptEn}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ĐỐI TÁC ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-10 h-[2px] bg-[var(--primary)]" />
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">{isVi ? 'Đối tác' : 'Partners'}</span>
              <span className="w-10 h-[2px] bg-[var(--primary)]" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{isVi ? 'Đối tác & Khách hàng' : 'Partners & Clients'}</h2>
          </div>
          <PartnerSlider partners={displayPartners} isVi={isVi} />
        </div>
      </section>

      {/* ── LIÊN HỆ CTA ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t('contact_cta')}</h2>
          <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">{t('contact_cta_desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={lp('/lien-he')} className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary)] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl">
              {t('contact_btn')} <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:0914061804" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all">
              091 406 1804
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

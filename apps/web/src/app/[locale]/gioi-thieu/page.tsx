import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight, Building2, History, Target, Users, FileText } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

export const metadata: Metadata = { title: 'Giới thiệu | Đường Bộ Bình Định' }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const MOCK_PROJECTS = [
  { id: 1, slug: 'nang-cap-ql-1d', titleVi: 'Nâng cấp Quốc lộ 1D đoạn qua TP. Quy Nhơn', titleEn: 'Upgrading National Route 1D through Quy Nhon', location: 'TP. Quy Nhơn', status: 'ONGOING', images: ['/images/1-Trạm trộn Bình Đê Km1125+00 QL1 tỉnh Gia Lai.png'] },
  { id: 2, slug: 'cau-thi-nai-2', titleVi: 'Xây dựng cầu Thị Nại 2', titleEn: 'Thi Nai Bridge 2 Construction', location: 'Quy Nhơn - Phù Mỹ', status: 'ONGOING', images: ['/images/1-TRẠM TRỘN BÌNH ĐÊ.png'] },
  { id: 3, slug: 'bao-tri-dt-638', titleVi: 'Bảo trì tuyến đường tỉnh lộ ĐT 638', titleEn: 'Provincial Road DT 638 Maintenance', location: 'Tây Sơn - Vĩnh Thạnh', status: 'COMPLETED', images: ['/images/1-Họp giao ban.JPG'] },
  { id: 4, slug: 'duong-ven-bien', titleVi: 'Đường ven biển Cát Tiến - Đề Gi', titleEn: 'Coastal Road Cat Tien - De Gi', location: 'Phù Cát', status: 'ONGOING', images: ['/images/1-Hội trường công ty.JPG'] },
  { id: 5, slug: 'ql-19-mo-rong', titleVi: 'Mở rộng Quốc lộ 19 đoạn An Nhơn', titleEn: 'National Route 19 Expansion - An Nhon', location: 'TX. An Nhơn', status: 'COMPLETED', images: ['/images/1-Phòng làm việc kĩ thuật.jpg'] },
  { id: 6, slug: 'duong-noi-thi', titleVi: 'Đường nội thị Hoài Nhơn', titleEn: 'Hoai Nhon Urban Road', location: 'TX. Hoài Nhơn', status: 'UPCOMING', images: ['/images/1-Giám đốc kí duyệt hồ sơ.JPG'] },
]

export default async function AboutPage() {
  const t = await getTranslations('nav')
  const locale = await getLocale()
  const isVi = locale === 'vi'

  // Fetch projects
  let projects: any = { data: [] }
  try {
    const res = await fetch(`${API}/projects?limit=6`, { cache: 'no-store' })
    if (res.ok) projects = await res.json()
  } catch {}

  const displayProjects = projects?.data && projects.data.length > 0 ? projects.data : MOCK_PROJECTS

  const tabs = [
    { label: isVi ? 'Lịch sử hình thành' : 'History', href: `/${locale}/gioi-thieu/lich-su`, icon: History, color: 'from-blue-500 to-blue-600' },
    { label: isVi ? 'Sứ mệnh - Tầm nhìn' : 'Mission & Vision', href: `/${locale}/gioi-thieu/su-menh-tam-nhin`, icon: Target, color: 'from-purple-500 to-purple-600' },
    { label: isVi ? 'Cơ cấu tổ chức' : 'Organization', href: `/${locale}/gioi-thieu/co-cau-to-chuc`, icon: Building2, color: 'from-green-500 to-green-600' },
    { label: isVi ? 'Đội ngũ lãnh đạo' : 'Leadership', href: `/${locale}/gioi-thieu/doi-ngu-lanh-dao`, icon: Users, color: 'from-orange-500 to-orange-600' },
    { label: isVi ? 'Hồ sơ doanh nghiệp' : 'Company Profile', href: `/${locale}/gioi-thieu/ho-so-doanh-nghiep`, icon: FileText, color: 'from-red-500 to-red-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-white/50" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">
              {isVi ? 'Về chúng tôi' : 'About Us'}
            </p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t('about')}</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            {isVi ? (
              <>
                Tìm hiểu về lịch sử, sứ mệnh, tầm nhìn và cơ cấu tổ chức của
                <br />
                CÔNG TY CỔ PHẦN QUẢN LÝ VÀ XÂY DỰNG ĐƯỜNG BỘ BÌNH ĐỊNH
              </>
            ) : (
              'Learn about the history, mission, vision and organizational structure of Gia Lai Road Management & Construction Company'
            )}
          </p>
          <p className="text-base text-blue-100/90 max-w-2xl mt-4">
            {isVi ? 'Công ty hiện có 2 trạm trộn bê tông nhựa nóng: trạm trộn Bình Đê và trạm trộn Nhơn Hòa.' : 'The company currently operates 2 hot mix asphalt plants: Trạm Bình Đê and Trạm Nhơn Hòa.'}
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 mb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {tabs.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-2">
                  {item.label}
                </h3>
                <div className="flex items-center gap-2 text-[var(--primary)] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {isVi ? 'Xem thêm' : 'Learn more'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Company Gallery Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-10 h-[2px] bg-[var(--primary)]" />
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">
                {isVi ? 'Hình ảnh công ty' : 'Company Gallery'}
              </span>
              <span className="w-10 h-[2px] bg-[var(--primary)]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {isVi ? 'Không gian làm việc & Cơ sở vật chất' : 'Workspace & Facilities'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isVi 
                ? 'Khám phá môi trường làm việc chuyên nghiệp và cơ sở vật chất hiện đại của chúng tôi'
                : 'Explore our professional work environment and modern facilities'}
            </p>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">
              {isVi ? 'Công ty hiện có 2 trạm trộn bê tông nhựa nóng: trạm trộn Bình Đê và trạm trộn Nhơn Hòa.' : 'The company currently operates 2 hot mix asphalt plants: Trạm Bình Đê and Trạm Nhơn Hòa.'}
            </p>
          </div>

          {/* Gallery Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
            {/* Large Featured Image - Mixing Station */}
            {/* <div className="lg:col-span-2 lg:row-span-2 group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-TRẠM TRỘN BÌNH ĐÊ.png" 
                alt="Trạm trộn Bình Đê" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold mb-2">
                  {isVi ? 'Trạm trộn Bình Đê' : 'Binh De Mixing Station'}
                </h3>
                <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {isVi ? 'Cơ sở sản xuất vật liệu xây dựng hiện đại' : 'Modern construction materials production facility'}
                </p>
              </div>
            </div> */}

            {/* Conference Hall */}
            {/* <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Hội trường công ty.JPG" 
                alt="Hội trường công ty" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">
                  {isVi ? 'Hội trường công ty' : 'Conference Hall'}
                </h3>
              </div>
            </div> */}

            {/* Meeting Room */}
            {/* <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Họp giao ban.JPG" 
                alt="Phòng họp giao ban" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">
                  {isVi ? 'Phòng họp giao ban' : 'Meeting Room'}
                </h3>
              </div>
            </div> */}

            {/* Achievements 1 */}
            {/* <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Thành tích công ty.JPG" 
                alt="Thành tích công ty" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">
                  {isVi ? 'Thành tích & Giải thưởng' : 'Achievements & Awards'}
                </h3>
              </div>
            </div> */}

            {/* Accounting Office */}
            {/* <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Phòng làm việc kế toán.JPG" 
                alt="Phòng làm việc" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">
                  {isVi ? 'Phòng làm việc' : 'Office'}
                </h3>
              </div>
            </div> */}

            {/* Director Signing */}
            {/* <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/ban-lanh-dao.png" 
                alt="Giám đốc kí duyệt" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">
                  {isVi ? 'Ban lãnh đạo' : 'Management'}
                </h3>
              </div>
            </div> */}

            {/* Achievements 2 */}
            {/* <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Thành tích công ty 2.JPG" 
                alt="Bằng khen & Chứng nhận" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">
                  {isVi ? 'Bằng khen & Chứng nhận' : 'Certificates & Recognition'}
                </h3>
              </div>
            </div> */}
          {/* </div> */}


          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Large Featured Image - Bình Đê Station */}
            <div className="lg:col-span-2 lg:row-span-2 group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-TRẠM TRỘN BÌNH ĐÊ.png" 
                alt="Trạm trộn Bình Đê" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold mb-2">
                  {isVi ? 'Trạm trộn Bình Đê' : 'Binh De Mixing Station'}
                </h3>
                <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {isVi ? 'Cơ sở sản xuất vật liệu xây dựng hiện đại' : 'Modern construction materials production facility'}
                </p>
              </div>
            </div>

            {/* Featured: Nhơn Hòa Station (col 3, tall) */}
            <div className="lg:row-span-2 group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/tram-tron-nhon-hoa.png" 
                alt="Trạm trộn Nhơn Hòa" 
                className="w-full h-full min-h-[300px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold mb-2">
                  {isVi ? 'Trạm trộn Nhơn Hòa' : 'Nhon Hoa Mixing Station'}
                </h3>
                <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {isVi ? 'Trạm trộn bê tông nhựa nóng công suất lớn' : 'High-capacity hot mix asphalt plant'}
                </p>
              </div>
            </div>

            {/* Director Group */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/ban-lanh-dao.png" 
                alt="Ban lãnh đạo" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">{isVi ? 'Ban lãnh đạo' : 'Management'}</h3>
              </div>
            </div>

            {/* Conference Hall */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Hội trường công ty.JPG" 
                alt="Hội trường công ty" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">{isVi ? 'Hội trường công ty' : 'Conference Hall'}</h3>
              </div>
            </div>

            {/* Meeting Room */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Họp giao ban.JPG" 
                alt="Phòng họp giao ban" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">{isVi ? 'Phòng họp giao ban' : 'Meeting Room'}</h3>
              </div>
            </div>

            {/* Achievements 1 */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Thành tích công ty.JPG" 
                alt="Thành tích công ty" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">{isVi ? 'Thành tích & Giải thưởng' : 'Achievements & Awards'}</h3>
              </div>
            </div>

            {/* Accounting Office */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Phòng làm việc kế toán.JPG" 
                alt="Phòng làm việc" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">{isVi ? 'Phòng làm việc' : 'Office'}</h3>
              </div>
            </div>

            {/* Achievements 2 */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="/images/1-Thành tích công ty 2.JPG" 
                alt="Bằng khen & Chứng nhận" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold">{isVi ? 'Bằng khen & Chứng nhận' : 'Certificates & Recognition'}</h3>
              </div>
            </div>
          </div>

          
      
        </div>
      </section>





      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-[2px] bg-[var(--primary)]" />
                <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-[0.15em]">
                  {isVi ? 'Công trình' : 'Projects'}
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {isVi ? 'Công trình tiêu biểu' : 'Featured Projects'}
              </h2>
            </div>
            <Link 
              href={`/${locale}/cong-trinh`} 
              className="hidden sm:inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all"
            >
              {isVi ? 'Xem tất cả' : 'View all'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayProjects.slice(0, 6).map((p: any) => {
              const projectImg = p.image || (p.images?.[0] ? getImageUrl(p.images[0]) : '/images/placeholder.jpg')
              return (
                <Link 
                  key={p.id} 
                  href={`/${locale}/cong-trinh/${p.slug}`} 
                  className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-52 relative overflow-hidden">
                    <img 
                      src={projectImg} 
                      alt={isVi ? p.titleVi : p.titleEn} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                        p.status === 'COMPLETED' ? 'bg-green-500/90 text-white' 
                        : p.status === 'ONGOING' ? 'bg-blue-500/90 text-white' 
                        : 'bg-amber-500/90 text-white'
                      }`}>
                        {p.status === 'COMPLETED' 
                          ? (isVi ? 'Hoàn thành' : 'Completed') 
                          : p.status === 'ONGOING' 
                          ? (isVi ? 'Đang thi công' : 'In Progress') 
                          : (isVi ? 'Sắp triển khai' : 'Planned')}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-shadow line-clamp-2">
                        {isVi ? p.titleVi : p.titleEn}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{p.location}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-[var(--primary)]/10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {isVi ? 'Muốn tìm hiểu thêm về chúng tôi?' : 'Want to learn more about us?'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {isVi 
              ? 'Liên hệ với chúng tôi để biết thêm chi tiết về công ty và các dịch vụ chúng tôi cung cấp'
              : 'Contact us for more details about our company and the services we provide'}
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

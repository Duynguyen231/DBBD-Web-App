import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import ServiceSlider from '@/components/services/ServiceSlider'

export const metadata: Metadata = { title: 'Lĩnh vực hoạt động | Đường Bộ Bình Định' }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const FALLBACK_SERVICES = [
  { 
    id: 1, 
    titleVi: 'Xây dựng công trình giao thông', 
    titleEn: 'Transport Construction',
    descVi: 'Thi công xây dựng các công trình giao thông đường bộ, cầu, cống, hệ thống thoát nước, nhà ga, bến xe đúng tiến độ và chất lượng cao.', 
    descEn: 'Construction of roads, bridges, culverts, drainage systems, stations, and terminals with high quality and on schedule.',
    image: '/images/1-Trạm trộn Bình Đê Km1125+00 QL1 tỉnh Gia Lai.png',
    order: 1
  },
  { 
    id: 2, 
    titleVi: 'Quản lý, bảo trì đường bộ', 
    titleEn: 'Road Maintenance Management',
    descVi: 'Quản lý và bảo trì hệ thống đường bộ quốc lộ, tỉnh lộ trên địa bàn tỉnh Bình Định theo các quy định, tiêu chuẩn kỹ thuật hiện hành, đảm bảo an toàn giao thông, thông suốt mọi thời điểm.', 
    descEn: 'Managing and maintaining national and provincial road systems in Binh Dinh province according to current technical standards, ensuring traffic safety at all times.',
    image: '/images/1-TRẠM TRỘN BÌNH ĐÊ.png',
    order: 2
  },
  { 
    id: 3, 
    titleVi: 'Khai thác và sản xuất vật liệu xây dựng', 
    titleEn: 'Mining & Construction Materials Production',
    descVi: 'Khai thác đá, cát, sỏi và sản xuất, cung ứng các loại vật liệu xây dựng: bê tông nhựa, bê tông xi măng, cấp phối đá dăm phục vụ công trình giao thông.', 
    descEn: 'Mining of stone, sand, gravel and production, supply of construction materials: asphalt concrete, cement concrete, graded aggregate for transport projects.',
    image: '/images/1-Phòng làm việc kĩ thuật.jpg',
    order: 3
  },
  { 
    id: 4, 
    titleVi: 'Cho thuê máy móc, thiết bị thi công', 
    titleEn: 'Construction Equipment Rental',
    descVi: 'Cho thuê các loại máy móc, thiết bị thi công đường bộ, cầu cống phục vụ các dự án xây dựng hạ tầng giao thông trên địa bàn.', 
    descEn: 'Rental of road and bridge construction machinery and equipment for infrastructure projects in the region.',
    image: '/images/1-Phòng làm việc kế toán.JPG',
    order: 4
  },
  { 
    id: 5, 
    titleVi: 'Quản lí, bảo trì cao tốc', 
    titleEn: 'Highway Management & Maintenance',
    descVi: 'Quản lý vận hành và bảo trì hệ thống đường cao tốc, đảm bảo an toàn giao thông, xử lý sự cố nhanh chóng và duy trì chất lượng mặt đường theo tiêu chuẩn cao tốc.', 
    descEn: 'Operation management and maintenance of highway systems, ensuring traffic safety, quick incident response, and maintaining road quality according to highway standards.',
    image: '/images/1-Họp giao ban.JPG',
    order: 5
  },
]

export default async function ServicesPage() {
  const locale = await getLocale()
  const isVi = locale === 'vi'

  let services = FALLBACK_SERVICES
  try {
    const res = await fetch(`${API}/services`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data.length > 0) services = data
    }
  } catch {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-white/50" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">
              {isVi ? 'Dịch vụ của chúng tôi' : 'Our Services'}
            </p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {isVi ? 'Lĩnh vực hoạt động' : 'Service Areas'}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            {isVi 
              ? 'Các dịch vụ và lĩnh vực chuyên môn của chúng tôi trong xây dựng và quản lý hạ tầng giao thông' 
              : 'Our services and expertise in construction and management of transport infrastructure'}
          </p>
        </div>
      </div>

      {/* Services Content with Slider */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <ServiceSlider services={services} isVi={isVi} />
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-[var(--primary)]/10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {isVi ? 'Cần tư vấn về dịch vụ?' : 'Need Service Consultation?'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {isVi 
              ? 'Liên hệ với chúng tôi để được tư vấn chi tiết về các dịch vụ và giải pháp phù hợp với nhu cầu của bạn'
              : 'Contact us for detailed consultation on services and solutions that fit your needs'}
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

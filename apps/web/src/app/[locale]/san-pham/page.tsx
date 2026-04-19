import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import ProductSlider from '@/components/products/ProductSlider'

export const metadata: Metadata = { title: 'Sản phẩm | Đường Bộ Bình Định' }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const MOCK_PRODUCTS = [
  { id: 1, slug: 'be-tong-nhua', titleVi: 'Bê tông nhựa nóng', titleEn: 'Hot Mix Asphalt Concrete', descVi: 'Bê tông nhựa nóng các loại C12.5, C19, C25 phục vụ thi công mặt đường.', descEn: 'Hot mix asphalt concrete C12.5, C19, C25 for road surface construction.', category: 'Bê tông nhựa', images: ['/images/1-Trạm trộn Bình Đê Km1125+00 QL1 tỉnh Gia Lai.png'] },
  { id: 2, slug: 'da-xay-dung', titleVi: 'Đá xây dựng các loại', titleEn: 'Construction Aggregates', descVi: 'Đá 1x2, 4x6, đá base, đá cấp phối dùng trong xây dựng công trình giao thông.', descEn: 'Crushed stone 1x2, 4x6, base stone, graded aggregate for transport construction.', category: 'Vật liệu xây dựng', images: ['/images/1-TRẠM TRỘN BÌNH ĐÊ.png'] },
]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const locale = await getLocale()
  const { category, page = '1' } = await searchParams
  const params = new URLSearchParams({ page, limit: '100', ...(category ? { category } : {}) })

  let data: any = { data: [], total: 0, totalPages: 1 }
  try {
    const res = await fetch(`${API}/products?${params}`, { cache: 'no-store' })
    if (res.ok) data = await res.json()
  } catch {}

  const isVi = locale === 'vi'
  const products = data.data.length > 0 ? data.data : MOCK_PRODUCTS

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-white/50" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">
              {isVi ? 'Sản phẩm của chúng tôi' : 'Our Products'}
            </p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {isVi ? 'Sản phẩm của chúng tôi' : 'Our Products'}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            {isVi 
              ? 'Các sản phẩm vật liệu xây dựng chất lượng cao phục vụ công trình giao thông' 
              : 'High-quality construction materials for transport infrastructure projects'}
          </p>
        </div>
      </div>

      {/* Products Content with Slider */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <p className="text-gray-500 text-lg">{isVi ? 'Chưa có sản phẩm nào.' : 'No products available.'}</p>
          </div>
        ) : (
          <ProductSlider products={products} isVi={isVi} locale={locale} />
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-[var(--primary)]/10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {isVi ? 'Cần tư vấn về sản phẩm?' : 'Need Product Consultation?'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {isVi 
              ? 'Liên hệ với chúng tôi để được tư vấn chi tiết về sản phẩm và báo giá phù hợp với nhu cầu của bạn'
              : 'Contact us for detailed product consultation and quotation that fits your needs'}
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

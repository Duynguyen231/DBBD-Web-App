import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getImageUrl } from '@/lib/utils'
import { ArrowLeft, Package, Tag, Calendar } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const isVi = locale === 'vi'

  let product: any = null
  try {
    const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } })
    if (res.ok) product = await res.json()
  } catch {}

  if (!product) notFound()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}/san-pham`}
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> 
            {isVi ? 'Quay lại danh sách sản phẩm' : 'Back to products'}
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {product.images?.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-white group">
                  <img 
                    src={getImageUrl(product.images[0])} 
                    alt={isVi ? product.titleVi : product.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {product.category && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[var(--primary)] px-4 py-2 rounded-full shadow-lg">
                        <Tag className="w-4 h-4" />
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.slice(1, 5).map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] rounded-2xl flex flex-col items-center justify-center text-[var(--primary)] shadow-xl">
                <Package className="w-24 h-24 mb-4 opacity-50" />
                <span className="text-4xl font-bold">{(isVi ? product.titleVi : product.titleEn).charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] bg-[var(--primary-50)] px-4 py-2 rounded-full">
                <Tag className="w-4 h-4" />
                {product.category}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {isVi ? product.titleVi : product.titleEn}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{isVi ? 'Cập nhật' : 'Updated'}: {formatDate(product.updatedAt || product.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{isVi ? 'Mã sản phẩm' : 'Product ID'}: #{product.id}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {isVi ? 'Mô tả sản phẩm' : 'Product Description'}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-6 border border-gray-100">
                {isVi ? product.descVi : product.descEn}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-[var(--primary-50)] to-blue-50 rounded-2xl p-6 border border-[var(--primary)]/10">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isVi ? 'Quan tâm đến sản phẩm này?' : 'Interested in this product?'}
              </h3>
              <p className="text-gray-600 mb-4">
                {isVi 
                  ? 'Liên hệ với chúng tôi để được tư vấn chi tiết và báo giá'
                  : 'Contact us for detailed consultation and quotation'}
              </p>
              <Link
                href={`/${locale}/lien-he`}
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-md hover:shadow-lg"
              >
                {isVi ? 'Liên hệ ngay' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Section (Placeholder) */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isVi ? 'Sản phẩm liên quan' : 'Related Products'}
            </h2>
            <p className="text-gray-600">
              {isVi ? 'Khám phá thêm các sản phẩm khác' : 'Explore more products'}
            </p>
          </div>
          <div className="text-center">
            <Link
              href={`/${locale}/san-pham`}
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold transition-colors"
            >
              {isVi ? 'Xem tất cả sản phẩm' : 'View all products'}
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

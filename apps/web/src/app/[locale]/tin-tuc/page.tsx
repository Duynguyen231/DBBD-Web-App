import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getImageUrl, formatDate } from '@/lib/utils'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = { title: 'Tin tức | Đường Bộ Bình Định' }
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; page?: string }>
}) {
  const locale = await getLocale()
  const { categoryId, page = '1' } = await searchParams
  const params = new URLSearchParams({ page, limit: '12', ...(categoryId ? { categoryId } : {}) })

  let data: any = { data: [] }
  let categories: any[] = []
  try {
    const [newsRes, catRes] = await Promise.all([
      fetch(`${API}/news?${params}`, { cache: 'no-store' }),
      fetch(`${API}/news/categories`, { cache: 'no-store' }),
    ])
    if (newsRes.ok) data = await newsRes.json()
    if (catRes.ok) categories = await catRes.json()
  } catch {}

  const isVi = locale === 'vi'
  const articles = Array.isArray(data?.data) ? data.data : []

  return (
    <div className="py-12">
      <div className="bg-[var(--primary)] text-white py-12 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Tin tức</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="?"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                !categoryId
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]'
              }`}
            >
              Tất cả
            </Link>
            {categories.map((c: any) => (
              <Link
                key={c.id}
                href={`?categoryId=${c.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  categoryId === String(c.id)
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                {isVi ? c.nameVi : c.nameEn}
              </Link>
            ))}
          </div>
        )}

        {articles.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Chưa có tin tức nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article: any) => (
              <Link
                key={article.id}
                href={`/${locale}/tin-tuc/${article.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {article.thumbnail && (
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url(${getImageUrl(article.thumbnail)})` }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(article.publishedAt, locale)}</span>
                    {article.category && (
                      <span className="ml-auto text-[var(--primary)] bg-[var(--primary-50)] px-2 py-0.5 rounded text-xs">
                        {isVi ? article.category.nameVi : article.category.nameEn}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-3 group-hover:text-[var(--primary)] transition-colors">
                    {isVi ? article.titleVi : article.titleEn}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

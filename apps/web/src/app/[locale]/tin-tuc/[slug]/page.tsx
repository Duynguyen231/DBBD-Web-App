import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getImageUrl, formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const isVi = locale === 'vi'

  let article: any = null
  try {
    const res = await fetch(`${API}/news/${slug}`, { next: { revalidate: 60 } })
    if (res.ok) article = await res.json()
  } catch {}

  if (!article) notFound()

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <Link href={`/${locale}/tin-tuc`} className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <article>
        {article.thumbnail && (
          <div className="h-80 rounded-2xl overflow-hidden mb-8">
            <img src={getImageUrl(article.thumbnail)} alt={article.titleVi} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(article.publishedAt, locale)}
          </div>
          {article.category && (
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-[var(--primary)] bg-[var(--primary-50)] px-2 py-0.5 rounded">
                {isVi ? article.category.nameVi : article.category.nameEn}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">{isVi ? article.titleVi : article.titleEn}</h1>

        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {isVi ? article.contentVi : article.contentEn}
        </div>
      </article>
    </div>
  )
}

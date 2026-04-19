'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNews = () => {
    apiClient.get('/news?limit=50').then(r => setNews(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchNews() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return
    await apiClient.delete(`/news/${id}`)
    fetchNews()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức</h1>
        <Link href="/admin/news/create" className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors">
          <Plus className="w-4 h-4" /> Thêm mới
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Tiêu đề</th>
              <th className="text-left px-4 py-3 font-medium w-32">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium w-32">Ngày đăng</th>
              <th className="text-center px-4 py-3 font-medium w-24">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Đang tải...</td></tr>
            ) : news.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Chưa có tin tức nào</td></tr>
            ) : news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 line-clamp-2">{item.titleVi}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{item.category?.nameVi || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(item.publishedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Link href={`/admin/news/${item.id}/edit`} className="p-1.5 hover:bg-blue-50 rounded text-blue-600">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

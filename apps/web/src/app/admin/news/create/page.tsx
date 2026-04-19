'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import apiClient from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewsFormPage() {
  const router = useRouter()
  const params = useParams()
  const isEdit = !!params?.id
  const id = params?.id as string

  const [form, setForm] = useState({
    titleVi: '', titleEn: '', excerptVi: '', excerptEn: '',
    contentVi: '', contentEn: '', thumbnail: '', categoryId: '',
  })
  const [categories, setCategories] = useState<any[]>([])
  const [newCategory, setNewCategory] = useState({ nameVi: '', nameEn: '' })
  const [saving, setSaving] = useState(false)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  const fetchCategories = () => {
    apiClient.get('/news/categories').then(r => setCategories(r.data)).catch(() => {})
  }

  const uploadThumbnail = async (file: File | null) => {
    if (!file) return
    setUploadingThumbnail(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await apiClient.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.url) {
        setForm(prev => ({ ...prev, thumbnail: res.data.url }))
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tải ảnh lên')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    if (isEdit) {
      apiClient.get(`/news/admin/${id}`).then(r => {
        const d = r.data
        setForm({
          titleVi: d.titleVi, titleEn: d.titleEn,
          excerptVi: d.excerptVi, excerptEn: d.excerptEn,
          contentVi: d.contentVi, contentEn: d.contentEn,
          thumbnail: d.thumbnail || '', categoryId: d.categoryId?.toString() || '',
        })
      })
    }
  }, [isEdit, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
    }
    try {
      if (isEdit) await apiClient.put(`/news/${id}`, data)
      else await apiClient.post('/news', data)
      router.push('/admin/news')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const createCategory = async () => {
    if (!newCategory.nameVi.trim() || !newCategory.nameEn.trim()) {
      alert('Vui lòng nhập đầy đủ tên danh mục VI/EN')
      return
    }
    setCreatingCategory(true)
    try {
      const res = await apiClient.post('/news/categories', {
        nameVi: newCategory.nameVi.trim(),
        nameEn: newCategory.nameEn.trim(),
      })
      setNewCategory({ nameVi: '', nameEn: '' })
      fetchCategories()
      setForm(prev => ({ ...prev, categoryId: String(res.data.id) }))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tạo danh mục')
    } finally {
      setCreatingCategory(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/news" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Tin tức</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (VI) *</label>
            <input value={form.titleVi} onChange={e => update('titleVi', e.target.value)} required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (EN) *</label>
            <input value={form.titleEn} onChange={e => update('titleEn', e.target.value)} required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tóm tắt (VI) *</label>
            <textarea value={form.excerptVi} onChange={e => update('excerptVi', e.target.value)} required rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tóm tắt (EN) *</label>
            <textarea value={form.excerptEn} onChange={e => update('excerptEn', e.target.value)} required rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none resize-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung (VI) *</label>
          <textarea value={form.contentVi} onChange={e => update('contentVi', e.target.value)} required rows={8}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung (EN) *</label>
          <textarea value={form.contentEn} onChange={e => update('contentEn', e.target.value)} required rows={8}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none resize-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
            <select value={form.categoryId} onChange={e => update('categoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] outline-none">
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameVi}</option>)}
            </select>
            {categories.length === 0 && (
              <p className="mt-2 text-xs text-amber-600">Chưa có danh mục. Tạo nhanh bên dưới.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh đại diện (URL)</label>
            <input value={form.thumbnail} onChange={e => update('thumbnail', e.target.value)} placeholder="/uploads/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] outline-none" />
            <div className="mt-2">
              <label className="block text-xs text-gray-500 mb-1">Hoặc tải ảnh từ máy</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => uploadThumbnail(e.target.files?.[0] || null)}
                disabled={uploadingThumbnail}
                className="block w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:border file:border-gray-200 file:rounded-lg file:bg-white file:text-gray-700 file:cursor-pointer"
              />
              {uploadingThumbnail && <p className="text-xs text-gray-500 mt-1">Đang tải ảnh...</p>}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục mới (VI)</label>
            <input
              value={newCategory.nameVi}
              onChange={e => setNewCategory(prev => ({ ...prev, nameVi: e.target.value }))}
              placeholder="Ví dụ: Dự án"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục mới (EN)</label>
            <input
              value={newCategory.nameEn}
              onChange={e => setNewCategory(prev => ({ ...prev, nameEn: e.target.value }))}
              placeholder="Example: Projects"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[var(--primary)] outline-none"
            />
          </div>
          <button
            type="button"
            onClick={createCategory}
            disabled={creatingCategory}
            className="h-[42px] px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {creatingCategory ? 'Đang tạo...' : 'Tạo danh mục'}
          </button>
        </div>

        <div className="flex gap-3 pt-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <Link href="/admin/news" className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}

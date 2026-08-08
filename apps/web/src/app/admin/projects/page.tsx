'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdminProjectsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ titleVi: '', titleEn: '', descVi: '', descEn: '', location: '', status: 'ONGOING', image: '' })
  const [uploadingImage, setUploadingImage] = useState(false)

  const fetch = () => { apiClient.get('/projects?limit=100').then(r => setItems(r.data.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const uploadImage = async (file: File | null) => {
    if (!file) return
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await apiClient.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.url) {
        setForm(prev => ({ ...prev, image: res.data.url }))
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tải ảnh lên')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    const payload = {
      titleVi: form.titleVi,
      titleEn: form.titleEn,
      descVi: form.descVi,
      descEn: form.descEn,
      location: form.location,
      status: form.status,
      images: form.image ? [form.image] : [],
    }
    if (editId) await apiClient.put(`/projects/${editId}`, payload)
    else await apiClient.post('/projects', payload)
    setShowForm(false); setEditId(null); setForm({ titleVi: '', titleEn: '', descVi: '', descEn: '', location: '', status: 'ONGOING', image: '' }); fetch()
  }

  const handleEdit = (item: any) => {
    setForm({ titleVi: item.titleVi, titleEn: item.titleEn, descVi: item.descVi, descEn: item.descEn, location: item.location, status: item.status, image: item.images?.[0] || '' })
    setEditId(item.id); setShowForm(true)
  }

  const handleDelete = async (id: number) => { if (confirm('Xóa?')) { await apiClient.delete(`/projects/${id}`); fetch() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Công trình</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ titleVi: '', titleEn: '', descVi: '', descEn: '', location: '', status: 'ONGOING', image: '' }) }}
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)]">
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.titleVi} onChange={e => update('titleVi', e.target.value)} placeholder="Tên (VI)" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.titleEn} onChange={e => update('titleEn', e.target.value)} placeholder="Tên (EN)" className="px-3 py-2 border rounded-lg w-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea value={form.descVi} onChange={e => update('descVi', e.target.value)} placeholder="Mô tả (VI)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
            <textarea value={form.descEn} onChange={e => update('descEn', e.target.value)} placeholder="Mô tả (EN)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="Địa điểm" className="px-3 py-2 border rounded-lg w-full" />
            <select value={form.status} onChange={e => update('status', e.target.value)} className="px-3 py-2 border rounded-lg w-full">
              <option value="ONGOING">Đang thi công</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="UPCOMING">Sắp triển khai</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.image} onChange={e => update('image', e.target.value)} placeholder="URL hình ảnh" className="px-3 py-2 border rounded-lg w-full" />
            <input
              type="file"
              accept="image/*"
              onChange={e => uploadImage(e.target.files?.[0] || null)}
              disabled={uploadingImage}
              className="px-3 py-2 border rounded-lg w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:border file:border-gray-200 file:rounded file:bg-white file:text-gray-700"
            />
          </div>
          {uploadingImage && <p className="text-xs text-gray-500">Đang tải ảnh...</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm font-medium">{editId ? 'Cập nhật' : 'Tạo mới'}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border text-gray-600 text-sm">Hủy</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="text-left px-4 py-3">Tên</th><th className="text-left px-4 py-3 w-32">Địa điểm</th>
            <th className="text-left px-4 py-3 w-28">Trạng thái</th><th className="text-center px-4 py-3 w-24">Hành động</th>
          </tr></thead>
          <tbody className="divide-y">{loading ? <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Đang tải...</td></tr> :
            items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.titleVi}</td>
                <td className="px-4 py-3 text-gray-500">{item.location}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : item.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

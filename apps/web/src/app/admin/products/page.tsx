'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdminProductsPage() {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ titleVi: '', titleEn: '', descVi: '', descEn: '', category: '', image: '' })
  const [uploadingImage, setUploadingImage] = useState(false)

  const load = () => { apiClient.get('/products?limit=100').then(r => setItems(r.data.data)).catch(()=>{}) }
  useEffect(() => { load() }, [])
  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

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

  const save = async () => {
    const payload = {
      titleVi: form.titleVi,
      titleEn: form.titleEn,
      descVi: form.descVi,
      descEn: form.descEn,
      category: form.category,
      images: form.image ? [form.image] : [],
    }
    if(editId) await apiClient.put(`/products/${editId}`, payload); else await apiClient.post('/products', payload)
    setShowForm(false); setEditId(null); load()
  }
  const edit = (i: any) => { setForm({ titleVi: i.titleVi, titleEn: i.titleEn, descVi: i.descVi, descEn: i.descEn, category: i.category || '', image: i.images?.[0] || '' }); setEditId(i.id); setShowForm(true) }
  const del = async (id: number) => { if(confirm('Xóa?')){ await apiClient.delete(`/products/${id}`); load() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ titleVi: '', titleEn: '', descVi: '', descEn: '', category: '', image: '' }) }}
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Thêm</button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-xl p-5 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.titleVi} onChange={e=>u('titleVi',e.target.value)} placeholder="Tên (VI)" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.titleEn} onChange={e=>u('titleEn',e.target.value)} placeholder="Tên (EN)" className="px-3 py-2 border rounded-lg w-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea value={form.descVi} onChange={e=>u('descVi',e.target.value)} placeholder="Mô tả (VI)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
            <textarea value={form.descEn} onChange={e=>u('descEn',e.target.value)} placeholder="Mô tả (EN)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.category} onChange={e=>u('category',e.target.value)} placeholder="Danh mục" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.image} onChange={e=>u('image',e.target.value)} placeholder="URL hình ảnh" className="px-3 py-2 border rounded-lg w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hoặc tải ảnh từ máy</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => uploadImage(e.target.files?.[0] || null)}
              disabled={uploadingImage}
              className="block w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:border file:border-gray-200 file:rounded-lg file:bg-white file:text-gray-700 file:cursor-pointer"
            />
            {uploadingImage && <p className="text-xs text-gray-500 mt-1">Đang tải ảnh...</p>}
          </div>
          <div className="flex gap-2"><button onClick={save} className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm">{editId?'Cập nhật':'Tạo'}</button><button onClick={()=>setShowForm(false)} className="border px-5 py-2 rounded-lg text-sm">Hủy</button></div>
        </div>
      )}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Tên</th><th className="text-left px-4 py-3 w-28">Danh mục</th><th className="w-24 text-center px-4 py-3">Hành động</th></tr></thead>
        <tbody className="divide-y">{items.map(i=>(
          <tr key={i.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{i.titleVi}</td><td className="px-4 py-3 text-gray-500">{i.category||'—'}</td>
          <td className="px-4 py-3 text-center"><button onClick={()=>edit(i)} className="p-1.5 text-blue-600"><Pencil className="w-4 h-4"/></button><button onClick={()=>del(i.id)} className="p-1.5 text-red-500"><Trash2 className="w-4 h-4"/></button></td></tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

export default function AdminBannersPage() {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ titleVi: '', titleEn: '', image: '', link: '', page: 'home', order: 0 })
  const [uploadingImage, setUploadingImage] = useState(false)

  const load = () => { apiClient.get('/banners').then(r => setItems(r.data)).catch(()=>{}) }
  useEffect(() => { load() }, [])
  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

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
    if(editId) await apiClient.put(`/banners/${editId}`, form); else await apiClient.post('/banners', form)
    setShowForm(false); setEditId(null); load()
  }
  const edit = (i: any) => {
    setForm({ titleVi: i.titleVi || '', titleEn: i.titleEn || '', image: i.image || '', link: i.link || '', page: i.page || 'home', order: i.order || 0 })
    setEditId(i.id); setShowForm(true)
  }
  const del = async (id: number) => { if(confirm('Xóa banner?')){ await apiClient.delete(`/banners/${id}`); load() } }
  const reset = () => { setShowForm(true); setEditId(null); setForm({ titleVi: '', titleEn: '', image: '', link: '', page: 'home', order: 0 }) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Banner</h1>
        <button onClick={reset} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Thêm</button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-xl p-5 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.titleVi} onChange={e=>u('titleVi',e.target.value)} placeholder="Tiêu đề (VI)" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.titleEn} onChange={e=>u('titleEn',e.target.value)} placeholder="Title (EN)" className="px-3 py-2 border rounded-lg w-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.image} onChange={e=>u('image',e.target.value)} placeholder="URL hình ảnh" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.link} onChange={e=>u('link',e.target.value)} placeholder="Đường dẫn (link)" className="px-3 py-2 border rounded-lg w-full" />
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
          <div className="grid md:grid-cols-3 gap-4">
            <select value={form.page} onChange={e=>u('page',e.target.value)} className="px-3 py-2 border rounded-lg">
              <option value="home">Trang chủ</option><option value="about">Giới thiệu</option><option value="services">Dịch vụ</option><option value="news">Tin tức</option><option value="contact">Liên hệ</option>
            </select>
            <input value={form.order} onChange={e=>u('order',parseInt(e.target.value)||0)} type="number" placeholder="Thứ tự" className="px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-2"><button onClick={save} className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm">{editId?'Cập nhật':'Tạo'}</button><button onClick={()=>setShowForm(false)} className="border px-5 py-2 rounded-lg text-sm">Hủy</button></div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(i => (
          <div key={i.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {i.image ? <img src={getImageUrl(i.image)} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-gray-300" />}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm line-clamp-1">{i.titleVi || 'Chưa có tiêu đề'}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span className="bg-gray-100 px-2 py-0.5 rounded">{i.page}</span><span>#{i.order}</span></div>
              <div className="flex gap-1 mt-3"><button onClick={()=>edit(i)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4"/></button><button onClick={()=>del(i.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

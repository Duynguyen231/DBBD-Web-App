'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Plus, Pencil, Trash2, Globe } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

export default function AdminPartnersPage() {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', logo: '', website: '', order: 0 })
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const load = () => { apiClient.get('/partners').then(r => setItems(r.data)).catch(()=>{}) }
  useEffect(() => { load() }, [])
  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const uploadLogo = async (file: File | null) => {
    if (!file) return
    setUploadingLogo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await apiClient.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.url) {
        setForm(prev => ({ ...prev, logo: res.data.url }))
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tải logo lên')
    } finally {
      setUploadingLogo(false)
    }
  }

  const save = async () => {
    if(editId) await apiClient.put(`/partners/${editId}`, form); else await apiClient.post('/partners', form)
    setShowForm(false); setEditId(null); load()
  }
  const edit = (i: any) => {
    setForm({ name: i.name, logo: i.logo || '', website: i.website || '', order: i.order })
    setEditId(i.id); setShowForm(true)
  }
  const del = async (id: number) => { if(confirm('Xóa?')){ await apiClient.delete(`/partners/${id}`); load() } }
  const reset = () => { setShowForm(true); setEditId(null); setForm({ name: '', logo: '', website: '', order: 0 }) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Đối tác</h1>
        <button onClick={reset} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Thêm</button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-xl p-5 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.name} onChange={e=>u('name',e.target.value)} placeholder="Tên đối tác" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.logo} onChange={e=>u('logo',e.target.value)} placeholder="URL logo" className="px-3 py-2 border rounded-lg w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hoặc tải logo từ máy</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => uploadLogo(e.target.files?.[0] || null)}
              disabled={uploadingLogo}
              className="block w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:border file:border-gray-200 file:rounded-lg file:bg-white file:text-gray-700 file:cursor-pointer"
            />
            {uploadingLogo && <p className="text-xs text-gray-500 mt-1">Đang tải logo...</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.website} onChange={e=>u('website',e.target.value)} placeholder="Website" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.order} onChange={e=>u('order',parseInt(e.target.value)||0)} type="number" placeholder="Thứ tự" className="px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-2"><button onClick={save} className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm">{editId?'Cập nhật':'Tạo'}</button><button onClick={()=>setShowForm(false)} className="border px-5 py-2 rounded-lg text-sm">Hủy</button></div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(i => (
          <div key={i.id} className="bg-white border rounded-xl p-4 text-center">
            <div className="h-20 flex items-center justify-center mb-3">
              {i.logo ? <img src={getImageUrl(i.logo)} alt={i.name} className="max-h-full max-w-full object-contain" /> : <Globe className="w-10 h-10 text-gray-300" />}
            </div>
            <h3 className="font-medium text-sm line-clamp-1">{i.name}</h3>
            <p className="text-xs text-gray-400">#{i.order}</p>
            <div className="flex justify-center gap-1 mt-3"><button onClick={()=>edit(i)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4"/></button><button onClick={()=>del(i.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button></div>
          </div>
        ))}
      </div>
    </div>
  )
}

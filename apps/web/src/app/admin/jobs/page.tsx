'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminJobsPage() {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ titleVi: '', titleEn: '', descVi: '', descEn: '', requirementsVi: '', requirementsEn: '', location: '', status: 'OPEN', deadline: '' })

  const load = () => { apiClient.get('/jobs?limit=100').then(r => setItems(r.data.data)).catch(()=>{}) }
  useEffect(() => { load() }, [])
  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    const data = { ...form, deadline: form.deadline || undefined }
    if(editId) await apiClient.put(`/jobs/${editId}`, data); else await apiClient.post('/jobs', data)
    setShowForm(false); setEditId(null); load()
  }
  const edit = (i: any) => {
    setForm({ titleVi: i.titleVi, titleEn: i.titleEn, descVi: i.descVi, descEn: i.descEn, requirementsVi: i.requirementsVi, requirementsEn: i.requirementsEn, location: i.location, status: i.status, deadline: i.deadline?.split('T')[0] || '' })
    setEditId(i.id); setShowForm(true)
  }
  const del = async (id: number) => { if(confirm('Xóa?')){ await apiClient.delete(`/jobs/${id}`); load() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tuyển dụng</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ titleVi: '', titleEn: '', descVi: '', descEn: '', requirementsVi: '', requirementsEn: '', location: '', status: 'OPEN', deadline: '' }) }}
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Thêm</button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-xl p-5 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.titleVi} onChange={e=>u('titleVi',e.target.value)} placeholder="Vị trí (VI)" className="px-3 py-2 border rounded-lg w-full" />
            <input value={form.titleEn} onChange={e=>u('titleEn',e.target.value)} placeholder="Vị trí (EN)" className="px-3 py-2 border rounded-lg w-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea value={form.descVi} onChange={e=>u('descVi',e.target.value)} placeholder="Mô tả (VI)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
            <textarea value={form.descEn} onChange={e=>u('descEn',e.target.value)} placeholder="Mô tả (EN)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea value={form.requirementsVi} onChange={e=>u('requirementsVi',e.target.value)} placeholder="Yêu cầu (VI)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
            <textarea value={form.requirementsEn} onChange={e=>u('requirementsEn',e.target.value)} placeholder="Yêu cầu (EN)" rows={3} className="px-3 py-2 border rounded-lg w-full resize-none" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <input value={form.location} onChange={e=>u('location',e.target.value)} placeholder="Địa điểm" className="px-3 py-2 border rounded-lg" />
            <select value={form.status} onChange={e=>u('status',e.target.value)} className="px-3 py-2 border rounded-lg"><option value="OPEN">Đang tuyển</option><option value="CLOSED">Đã đóng</option></select>
            <input value={form.deadline} onChange={e=>u('deadline',e.target.value)} type="date" className="px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-2"><button onClick={save} className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm">{editId?'Cập nhật':'Tạo'}</button><button onClick={()=>setShowForm(false)} className="border px-5 py-2 rounded-lg text-sm">Hủy</button></div>
        </div>
      )}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Vị trí</th><th className="w-28 px-4 py-3">Địa điểm</th><th className="w-24 px-4 py-3">Trạng thái</th><th className="w-24 text-center px-4 py-3">Hành động</th></tr></thead>
        <tbody className="divide-y">{items.map(i=>(
          <tr key={i.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{i.titleVi}</td><td className="px-4 py-3 text-gray-500">{i.location}</td>
          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${i.status==='OPEN'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{i.status==='OPEN'?'Đang tuyển':'Đã đóng'}</span></td>
          <td className="px-4 py-3 text-center"><button onClick={()=>edit(i)} className="p-1.5 text-blue-600"><Pencil className="w-4 h-4"/></button><button onClick={()=>del(i.id)} className="p-1.5 text-red-500"><Trash2 className="w-4 h-4"/></button></td></tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}

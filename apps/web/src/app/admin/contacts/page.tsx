'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminContactsPage() {
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  const load = () => { apiClient.get('/contact').then(r => setItems(r.data)).catch(()=>{}) }
  useEffect(() => { load() }, [])

  const markRead = async (id: number) => { await apiClient.patch(`/contact/${id}/read`); load() }
  const del = async (id: number) => { if(confirm('Xóa liên hệ này?')){ await apiClient.delete(`/contact/${id}`); setSelected(null); load() } }

  const view = (i: any) => {
    setSelected(i)
    if(!i.isRead) markRead(i.id)
  }

  const unread = items.filter(i => !i.isRead).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Liên hệ nhận được</h1>
        {unread > 0 && <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">{unread} chưa đọc</span>}
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl overflow-hidden">
          <div className="divide-y max-h-[70vh] overflow-y-auto">
            {items.length === 0 && <p className="p-6 text-center text-gray-400">Chưa có liên hệ nào</p>}
            {items.map(i => (
              <button key={i.id} onClick={() => view(i)} className={`w-full text-left p-4 hover:bg-gray-50 ${selected?.id === i.id ? 'bg-blue-50' : ''} ${!i.isRead ? 'bg-yellow-50' : ''}`}>
                <div className="flex items-center gap-2">
                  {i.isRead ? <MailOpen className="w-4 h-4 text-gray-400 shrink-0" /> : <Mail className="w-4 h-4 text-blue-600 shrink-0" />}
                  <span className={`text-sm font-medium truncate ${!i.isRead ? 'text-blue-900' : ''}`}>{i.fullName}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{i.subject || i.message?.slice(0, 60)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(i.createdAt)}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">{selected.fullName}</h2>
                  <p className="text-sm text-gray-500">{selected.email} &bull; {selected.phone}</p>
                  {selected.company && <p className="text-sm text-gray-400">{selected.company}</p>}
                </div>
                <button onClick={() => del(selected.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
              {selected.subject && <h3 className="font-medium mb-2">{selected.subject}</h3>}
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              <p className="text-xs text-gray-400 mt-4">{formatDate(selected.createdAt)}</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl p-12 text-center text-gray-400">
              <Eye className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>Chọn một liên hệ để xem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

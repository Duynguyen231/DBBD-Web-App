'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Save } from 'lucide-react'

const SETTINGS_KEYS = [
  { key: 'company_name', label: 'Tên công ty', type: 'text' },
  { key: 'company_name_en', label: 'Company name (EN)', type: 'text' },
  { key: 'address', label: 'Địa chỉ', type: 'text' },
  { key: 'phone', label: 'Số điện thoại', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'fax', label: 'Fax', type: 'text' },
  { key: 'tax_code', label: 'Mã số thuế', type: 'text' },
  { key: 'google_maps_embed', label: 'Google Maps Embed URL', type: 'text' },
  { key: 'facebook', label: 'Facebook URL', type: 'text' },
  { key: 'youtube', label: 'YouTube URL', type: 'text' },
  { key: 'zalo', label: 'Zalo', type: 'text' },
  { key: 'footer_text', label: 'Footer text (VI)', type: 'textarea' },
  { key: 'footer_text_en', label: 'Footer text (EN)', type: 'textarea' },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiClient.get('/settings').then(r => {
      const map: Record<string, string> = {}
      r.data.forEach((s: any) => { map[s.key] = s.value })
      setValues(map)
    }).catch(()=>{})
  }, [])

  const update = (key: string, value: string) => setValues(p => ({ ...p, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      for (const { key } of SETTINGS_KEYS) {
        if (values[key] !== undefined) {
          await apiClient.put('/settings', { key, value: values[key] })
        }
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cài đặt chung</h1>
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          <Save className="w-4 h-4" /> {saved ? 'Đã lưu ✓' : saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-lg border-b pb-3">Thông tin công ty</h2>
        {SETTINGS_KEYS.filter(s => s.type === 'text' && !['facebook','youtube','zalo'].includes(s.key)).map(s => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
            <input value={values[s.key] || ''} onChange={e => update(s.key, e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        ))}
        <h2 className="font-semibold text-lg border-b pb-3 pt-4">Mạng xã hội</h2>
        {SETTINGS_KEYS.filter(s => ['facebook','youtube','zalo'].includes(s.key)).map(s => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
            <input value={values[s.key] || ''} onChange={e => update(s.key, e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        ))}
        <h2 className="font-semibold text-lg border-b pb-3 pt-4">Footer</h2>
        {SETTINGS_KEYS.filter(s => s.type === 'textarea').map(s => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
            <textarea value={values[s.key] || ''} onChange={e => update(s.key, e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
          </div>
        ))}
      </div>
    </div>
  )
}

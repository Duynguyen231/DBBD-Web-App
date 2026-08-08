'use client'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'
import { Newspaper, FolderOpen, Briefcase, Mail } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, projects: 0, jobs: 0, contacts: 0 })

  useEffect(() => {
    Promise.all([
      apiClient.get('/news?limit=1').then(r => r.data.total).catch(() => 0),
      apiClient.get('/projects?limit=1').then(r => r.data.total).catch(() => 0),
      apiClient.get('/jobs?limit=1').then(r => r.data.total).catch(() => 0),
      apiClient.get('/contact').then(r => r.data.filter((c: any) => !c.isRead).length).catch(() => 0),
    ]).then(([news, projects, jobs, contacts]) => setStats({ news, projects, jobs, contacts }))
  }, [])

  const cards = [
    { label: 'Tin tức', value: stats.news, icon: Newspaper, color: 'text-blue-600 bg-blue-50' },
    { label: 'Công trình', value: stats.projects, icon: FolderOpen, color: 'text-green-600 bg-green-50' },
    { label: 'Tuyển dụng', value: stats.jobs, icon: Briefcase, color: 'text-orange-600 bg-orange-50' },
    { label: 'Tin nhắn chưa đọc', value: stats.contacts, icon: Mail, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

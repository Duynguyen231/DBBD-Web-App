'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AdminAuthProvider'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Newspaper, FolderOpen, Wrench, Package, Briefcase,
  Image as ImageIcon, Users, Mail, Settings, LogOut, ChevronLeft, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/news', label: 'Tin tức', icon: Newspaper },
  { href: '/admin/projects', label: 'Công trình', icon: FolderOpen },
  { href: '/admin/services', label: 'Dịch vụ', icon: Wrench },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/jobs', label: 'Tuyển dụng', icon: Briefcase },
  { href: '/admin/banners', label: 'Banner', icon: ImageIcon },
  { href: '/admin/partners', label: 'Đối tác', icon: Users },
  { href: '/admin/contacts', label: 'Liên hệ', icon: Mail },
  { href: '/admin/media', label: 'Thư viện', icon: ImageIcon },
  { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
]

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-gray-900 text-white flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {!collapsed && (
          <Link href="/admin" className="font-bold text-sm">
            DBBD Admin
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white">
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href + '/'))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-gray-700 px-4 py-3">
        {!collapsed && user && (
          <div className="text-xs text-gray-400 mb-2 truncate">{user.email}</div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Đăng xuất'}
        </button>
      </div>
    </aside>
  )
}

'use client'
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider'
import AdminSidebar from '@/components/admin/AdminSidebar'
import QueryProvider from '@/components/layout/QueryProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminAuthProvider>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </AdminAuthProvider>
    </QueryProvider>
  )
}

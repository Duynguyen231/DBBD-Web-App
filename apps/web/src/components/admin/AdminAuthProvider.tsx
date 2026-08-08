'use client'
import { useEffect, useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'

type User = { id: number; email: string; name: string; role: string }

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  logout: () => void
}>({ user: null, loading: true, logout: () => {} })

export function useAuth() {
  return useContext(AuthContext)
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      router.push('/admin/login')
      return
    }
    apiClient
      .get('/auth/profile')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('access_token')
        router.push('/admin/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

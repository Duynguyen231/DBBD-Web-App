import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Đường Bộ Bình Định',
  description: 'Công ty Cổ phần Quản lý và Xây dựng Đường bộ Bình Định',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}


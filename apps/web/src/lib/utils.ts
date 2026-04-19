import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale = 'vi') {
  return new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return path
  return `${getApiUrl()}${path}`
}

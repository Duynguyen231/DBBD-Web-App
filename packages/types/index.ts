// ─── Enums ──────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'SUPER_ADMIN'

export type ProjectStatus = 'ONGOING' | 'COMPLETED' | 'UPCOMING'

export type JobStatus = 'OPEN' | 'CLOSED'

// ─── Bilingual base ──────────────────────────────────────────────────────────

export interface Bilingual {
  titleVi: string
  titleEn: string
}

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsCategory {
  id: number
  slug: string
  nameVi: string
  nameEn: string
}

export interface News {
  id: number
  slug: string
  titleVi: string
  titleEn: string
  excerptVi: string
  excerptEn: string
  contentVi: string
  contentEn: string
  thumbnail: string | null
  category: NewsCategory | null
  publishedAt: string
  createdAt: string
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: number
  slug: string
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  location: string
  status: ProjectStatus
  images: string[]
  startDate: string | null
  endDate: string | null
  createdAt: string
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface Service {
  id: number
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  icon: string | null
  image: string | null
  order: number
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: number
  slug: string
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  images: string[]
  category: string | null
  createdAt: string
}

// ─── Job ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: number
  slug: string
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  requirementsVi: string
  requirementsEn: string
  location: string
  deadline: string | null
  status: JobStatus
  createdAt: string
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export interface Banner {
  id: number
  image: string
  titleVi: string | null
  titleEn: string | null
  link: string | null
  order: number
  page: string
}

// ─── Partner ─────────────────────────────────────────────────────────────────

export interface Partner {
  id: number
  name: string
  logo: string
  website: string | null
  order: number
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactSubmission {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  address: string
  phone: string
  fax: string
  email: string
  facebook: string
  youtube: string
  mapEmbedUrl: string
  officeHours: string
}

import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://duongbobinhdinh.vn'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['vi', 'en']
  const routes = [
    '',
    '/gioi-thieu',
    '/gioi-thieu/lich-su',
    '/gioi-thieu/su-menh-tam-nhin',
    '/gioi-thieu/co-cau-to-chuc',
    '/gioi-thieu/doi-ngu-lanh-dao',
    '/linh-vuc-hoat-dong',
    '/san-pham',
    '/cong-trinh',
    '/tin-tuc',
    '/tuyen-dung',
    '/lien-he',
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    }
  }

  return entries
}

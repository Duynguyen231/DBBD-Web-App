import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

type RemotePattern = NonNullable<NextConfig['images']>['remotePatterns'][number]

function toRemotePattern(urlValue: string): RemotePattern | null {
  try {
    const parsed = new URL(urlValue)
    const pathname = parsed.pathname === '/' ? '/**' : `${parsed.pathname.replace(/\/$/, '')}/**`

    return {
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
      hostname: parsed.hostname,
      port: parsed.port,
      pathname,
    }
  } catch {
    return null
  }
}

const remotePatterns: RemotePattern[] = [
  { protocol: 'http', hostname: 'localhost', port: '4000' },
  { protocol: 'https', hostname: '*.r2.dev' },
]

const customR2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL
if (customR2PublicUrl) {
  const customPattern = toRemotePattern(customR2PublicUrl)
  if (customPattern) {
    remotePatterns.push(customPattern)
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
}

export default withNextIntl(nextConfig)


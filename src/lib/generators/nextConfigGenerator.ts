/**
 * Next.js config 코드를 생성한다.
 */
import type { NextConfigOptions } from '@/lib/schemas'

/** Next.js config 전체 코드를 생성한다 */
export const generateNextConfig = (options: NextConfigOptions): string => {
  const configEntries: string[] = []

  if (options.strictMode) {
    configEntries.push('  reactStrictMode: true,')
  }

  if (options.images) {
    configEntries.push('  images: {')
    configEntries.push("    formats: ['image/avif', 'image/webp'],")
    configEntries.push('  },')
  }

  if (options.standalone) {
    configEntries.push("  output: 'standalone',")
  }

  const lines: string[] = []
  lines.push("/** @type {import('next').NextConfig} */")
  lines.push('const nextConfig = {')
  lines.push(...configEntries)
  lines.push('}')
  lines.push('')
  lines.push('module.exports = nextConfig')

  // headers/redirects/webpack은 고급 옵션 — 주석으로 안내
  const advancedComments: string[] = []
  if (options.headers) advancedComments.push('// TODO: Add custom headers in async headers() {}')
  if (options.redirects) advancedComments.push('// TODO: Add redirects in async redirects() {}')
  if (options.webpack)
    advancedComments.push('// TODO: Add webpack customization in webpack(config) {}')

  if (advancedComments.length > 0) {
    lines.push('')
    lines.push(...advancedComments)
  }

  return lines.join('\n')
}

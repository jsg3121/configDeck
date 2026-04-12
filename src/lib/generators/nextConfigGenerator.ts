/**
 * Next.js config 코드를 생성한다.
 * 신규 옵션 구조 기반으로, 사용자가 설정한(touched) 옵션만 출력한다.
 */

/** Next.js config 전체 코드를 생성한다 */
export const generateNextConfig = (options: Record<string, unknown>): string => {
  const configEntries: string[] = []
  const asyncFunctions: string[] = []

  // reactStrictMode
  if (options.reactStrictMode === true) {
    configEntries.push('  reactStrictMode: true,')
  }

  // output
  if ('output' in options && options.output !== '') {
    configEntries.push(`  output: '${options.output}',`)
  }

  // basePath
  if ('basePath' in options && options.basePath !== '') {
    configEntries.push(`  basePath: '${options.basePath}',`)
  }

  // images
  if (options.imagesEnabled === true) {
    const imageEntries: string[] = []

    if (
      'imagesFormats' in options &&
      Array.isArray(options.imagesFormats) &&
      options.imagesFormats.length > 0
    ) {
      const formats = (options.imagesFormats as string[]).map((f) => `'${f}'`).join(', ')
      imageEntries.push(`    formats: [${formats}],`)
    } else {
      imageEntries.push("    formats: ['image/avif', 'image/webp'],")
    }

    if (
      'imagesDomains' in options &&
      Array.isArray(options.imagesDomains) &&
      options.imagesDomains.length > 0
    ) {
      imageEntries.push('    remotePatterns: [')
      for (const domain of options.imagesDomains as string[]) {
        imageEntries.push('      {')
        imageEntries.push("        protocol: 'https',")
        imageEntries.push(`        hostname: '${domain}',`)
        imageEntries.push('      },')
      }
      imageEntries.push('    ],')
    }

    configEntries.push('  images: {')
    configEntries.push(...imageEntries)
    configEntries.push('  },')
  }

  // turbopack
  if (options.turbopack === true) {
    configEntries.push('  experimental: {')
    configEntries.push('    turbo: {},')
    configEntries.push('  },')
  }

  // async functions (redirects, rewrites, headers)
  if (options.redirects === true) {
    asyncFunctions.push('  async redirects() {')
    asyncFunctions.push('    return [')
    asyncFunctions.push('      {')
    asyncFunctions.push("        source: '/old-page',")
    asyncFunctions.push("        destination: '/new-page',")
    asyncFunctions.push('        permanent: true,')
    asyncFunctions.push('      },')
    asyncFunctions.push('    ]')
    asyncFunctions.push('  },')
  }

  if (options.rewrites === true) {
    asyncFunctions.push('  async rewrites() {')
    asyncFunctions.push('    return [')
    asyncFunctions.push('      {')
    asyncFunctions.push("        source: '/api/:path*',")
    asyncFunctions.push("        destination: 'http://localhost:3001/api/:path*',")
    asyncFunctions.push('      },')
    asyncFunctions.push('    ]')
    asyncFunctions.push('  },')
  }

  if (options.headers === true) {
    asyncFunctions.push('  async headers() {')
    asyncFunctions.push('    return [')
    asyncFunctions.push('      {')
    asyncFunctions.push("        source: '/(.*)',")
    asyncFunctions.push('        headers: [')
    asyncFunctions.push("          { key: 'X-Frame-Options', value: 'DENY' },")
    asyncFunctions.push("          { key: 'X-Content-Type-Options', value: 'nosniff' },")
    asyncFunctions.push('        ],')
    asyncFunctions.push('      },')
    asyncFunctions.push('    ]')
    asyncFunctions.push('  },')
  }

  // webpack
  if (options.webpack === true) {
    asyncFunctions.push('  webpack(config) {')
    asyncFunctions.push('    // Customize webpack config here')
    asyncFunctions.push('    return config')
    asyncFunctions.push('  },')
  }

  const lines: string[] = []
  lines.push("/** @type {import('next').NextConfig} */")
  lines.push('const nextConfig = {')
  lines.push(...configEntries)
  lines.push(...asyncFunctions)
  lines.push('}')
  lines.push('')
  lines.push('module.exports = nextConfig')

  return lines.join('\n')
}

/**
 * .gitignore 코드를 생성한다.
 * 사용자가 선택한(touched) 섹션의 패턴 블록만 출력한다.
 */

/** 카테고리별 .gitignore 패턴 블록 */
const PATTERN_BLOCKS: Record<string, { header: string; patterns: string[] }> = {
  node: {
    header: '# Dependencies',
    patterns: [
      'node_modules/',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',
    ],
  },
  build: {
    header: '# Build output',
    patterns: ['dist/', 'build/', '.output/'],
  },
  env: {
    header: '# Environment',
    patterns: ['.env', '.env.local', '.env.*.local'],
  },
  macos: {
    header: '# macOS',
    patterns: ['.DS_Store', '.AppleDouble', '.LSOverride'],
  },
  windows: {
    header: '# Windows',
    patterns: ['Thumbs.db', 'ehthumbs.db', 'Desktop.ini'],
  },
  linux: {
    header: '# Linux',
    patterns: ['*~', '.directory'],
  },
  vscode: {
    header: '# VS Code',
    patterns: ['.vscode/', '*.code-workspace'],
  },
  jetbrains: {
    header: '# JetBrains',
    patterns: ['.idea/', '*.iml', '*.iws'],
  },
  nextjs: {
    header: '# Next.js',
    patterns: ['.next/', 'out/'],
  },
  nuxt: {
    header: '# Nuxt',
    patterns: ['.nuxt/', '.output/'],
  },
  astro: {
    header: '# Astro',
    patterns: ['.astro/'],
  },
  coverage: {
    header: '# Test coverage',
    patterns: ['coverage/'],
  },
}

/** .gitignore 전체 코드를 생성한다 */
export const generateGitignore = (options: Record<string, unknown>): string => {
  const blocks: string[] = []

  for (const [key, value] of Object.entries(options)) {
    if (key === 'customPatterns') continue
    if (value === true && PATTERN_BLOCKS[key]) {
      const block = PATTERN_BLOCKS[key]
      blocks.push(`${block.header}\n${block.patterns.join('\n')}`)
    }
  }

  // 커스텀 패턴
  if (
    'customPatterns' in options &&
    Array.isArray(options.customPatterns) &&
    options.customPatterns.length > 0
  ) {
    blocks.push(`# Custom\n${(options.customPatterns as string[]).join('\n')}`)
  }

  return blocks.join('\n\n')
}

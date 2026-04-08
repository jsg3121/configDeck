/**
 * .gitignore 코드를 생성한다.
 * 카테고리별 패턴 블록을 조합한다.
 */
import type { GitignoreOptions } from '@/lib/schemas'

/** 카테고리별 .gitignore 패턴 블록 */
const PATTERN_BLOCKS: Record<string, { header: string; patterns: string[] }> = {
  node: {
    header: '# Dependencies',
    patterns: ['node_modules/', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'],
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
  astro: {
    header: '# Astro',
    patterns: ['dist/', '.astro/'],
  },
}

/** .gitignore 전체 코드를 생성한다 */
export const generateGitignore = (options: GitignoreOptions): string => {
  const blocks: string[] = []

  for (const [key, isEnabled] of Object.entries(options)) {
    if (isEnabled && PATTERN_BLOCKS[key]) {
      const block = PATTERN_BLOCKS[key]
      blocks.push(`${block.header}\n${block.patterns.join('\n')}`)
    }
  }

  return blocks.join('\n\n')
}

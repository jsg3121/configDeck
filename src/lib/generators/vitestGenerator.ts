/**
 * Vitest config 코드를 생성한다.
 */
import type { VitestOptions } from '@/lib/schemas'

/** Vitest config 전체 코드를 생성한다 */
export const generateVitestConfig = (options: VitestOptions): string => {
  const lines: string[] = []

  lines.push("import { defineConfig } from 'vitest/config'")
  lines.push('')
  lines.push('export default defineConfig({')
  lines.push('  test: {')
  lines.push(`    environment: '${options.environment}',`)

  if (options.globals) {
    lines.push('    globals: true,')
  }

  if (options.coverage) {
    lines.push('    coverage: {')
    lines.push("      provider: 'v8',")
    lines.push("      reporter: ['text', 'json', 'html'],")
    lines.push('    },')
  }

  if (options.setupFile) {
    lines.push("    setupFiles: ['./src/test/setup.ts'],")
  }

  lines.push('  },')
  lines.push('})')

  return lines.join('\n')
}

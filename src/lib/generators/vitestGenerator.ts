/**
 * Vitest config 코드를 생성한다.
 * 신규 옵션 구조 기반으로, 사용자가 설정한(touched) 옵션만 출력한다.
 */

/** Vitest config 전체 코드를 생성한다 */
export const generateVitestConfig = (options: Record<string, unknown>): string => {
  const lines: string[] = []
  const testEntries: string[] = []

  lines.push("import { defineConfig } from 'vitest/config'")
  lines.push('')
  lines.push('export default defineConfig({')

  // test.environment
  if ('environment' in options && options.environment !== '') {
    testEntries.push(`    environment: '${options.environment}',`)
  }

  // test.globals
  if (options.globals === true) {
    testEntries.push('    globals: true,')
  }

  // test.include
  if ('include' in options && Array.isArray(options.include) && options.include.length > 0) {
    const items = (options.include as string[]).map((p) => `'${p}'`).join(', ')
    testEntries.push(`    include: [${items}],`)
  }

  // test.exclude
  if ('exclude' in options && Array.isArray(options.exclude) && options.exclude.length > 0) {
    const items = (options.exclude as string[]).map((p) => `'${p}'`).join(', ')
    testEntries.push(`    exclude: [${items}],`)
  }

  // test.setupFiles
  if ('setupFiles' in options && options.setupFiles !== '') {
    testEntries.push(`    setupFiles: ['${options.setupFiles}'],`)
  }

  // test.testTimeout
  if ('testTimeout' in options && options.testTimeout !== null) {
    testEntries.push(`    testTimeout: ${options.testTimeout},`)
  }

  // test.watch
  if (options.watch === true) {
    testEntries.push('    watch: true,')
  }

  // test.reporter
  if ('reporter' in options && options.reporter !== '' && options.reporter !== 'default') {
    testEntries.push(`    reporter: '${options.reporter}',`)
  }

  // test.coverage
  if (options.coverageEnabled === true) {
    const coverageEntries: string[] = []
    const provider = ('coverageProvider' in options ? options.coverageProvider : 'v8') as string
    coverageEntries.push(`      provider: '${provider}',`)

    if (
      'coverageReporter' in options &&
      Array.isArray(options.coverageReporter) &&
      options.coverageReporter.length > 0
    ) {
      const reporters = (options.coverageReporter as string[]).map((r) => `'${r}'`).join(', ')
      coverageEntries.push(`      reporter: [${reporters}],`)
    } else {
      coverageEntries.push("      reporter: ['text', 'json', 'html'],")
    }

    testEntries.push('    coverage: {')
    testEntries.push(...coverageEntries)
    testEntries.push('    },')
  }

  if (testEntries.length > 0) {
    lines.push('  test: {')
    lines.push(...testEntries)
    lines.push('  },')
  }

  lines.push('})')

  return lines.join('\n')
}

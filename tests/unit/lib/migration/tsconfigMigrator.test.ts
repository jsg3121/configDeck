/**
 * TSConfig 마이그레이터 테스트
 */
import { describe, expect, it } from 'vitest'

import { migrateTsconfig } from '@/lib/migration/tsconfigMigrator'

describe('migrateTsconfig - 단순 리네임 (deprecated 자동 변환)', () => {
  it('out → outDir 키로 변환한다 (값 보존)', () => {
    const result = migrateTsconfig({ compilerOptions: { out: './dist/bundle.js' } })
    expect(result.config?.compilerOptions?.outDir).toBe('./dist/bundle.js')
    expect(result.config?.compilerOptions?.out).toBeUndefined()
  })

  it('noImplicitUseStrict → alwaysStrict로 변환한다', () => {
    const result = migrateTsconfig({ compilerOptions: { noImplicitUseStrict: false } })
    expect(result.config?.compilerOptions?.alwaysStrict).toBe(false)
    expect(result.config?.compilerOptions?.noImplicitUseStrict).toBeUndefined()
  })
})

describe('migrateTsconfig - 제거 + 경고', () => {
  it('charset을 제거하고 경고를 추가한다', () => {
    const result = migrateTsconfig({ compilerOptions: { charset: 'utf-8' } })
    expect(result.config?.compilerOptions?.charset).toBeUndefined()
    expect(result.warnings.some((w) => w.message.includes('charset'))).toBe(true)
  })

  it('importsNotUsedAsValues를 제거하고 verbatimModuleSyntax 안내', () => {
    const result = migrateTsconfig({
      compilerOptions: { importsNotUsedAsValues: 'remove' },
    })
    expect(result.config?.compilerOptions?.importsNotUsedAsValues).toBeUndefined()
    expect(
      result.warnings.some(
        (w) =>
          w.message.includes('importsNotUsedAsValues') &&
          w.message.includes('verbatimModuleSyntax'),
      ),
    ).toBe(true)
  })
})

describe('migrateTsconfig - 권장값 적용', () => {
  it('빈 compilerOptions에 권장 옵션이 채워진다', () => {
    const result = migrateTsconfig({ compilerOptions: {} })
    expect(result.config?.compilerOptions?.strict).toBe(true)
    expect(result.config?.compilerOptions?.target).toBe('ES2022')
    expect(result.config?.compilerOptions?.module).toBe('ESNext')
    expect(result.config?.compilerOptions?.moduleResolution).toBe('bundler')
  })

  it('이미 명시된 옵션은 사용자 값을 보존한다 (덮어쓰지 않음)', () => {
    const result = migrateTsconfig({
      compilerOptions: { target: 'ES5', strict: false },
    })
    expect(result.config?.compilerOptions?.target).toBe('ES5')
    expect(result.config?.compilerOptions?.strict).toBe(false)
  })

  it('compilerOptions 자체가 없는 입력에도 권장값을 채운다', () => {
    const result = migrateTsconfig({})
    expect(result.config?.compilerOptions).toBeDefined()
    expect(result.config?.compilerOptions?.strict).toBe(true)
  })
})

describe('migrateTsconfig - 최상위 키 보존', () => {
  it('extends/include/exclude/files/references는 그대로 보존된다', () => {
    const result = migrateTsconfig({
      extends: '@tsconfig/strictest',
      include: ['src/**/*'],
      exclude: ['node_modules'],
      files: ['./global.d.ts'],
      references: [{ path: './packages/core' }],
      compilerOptions: { strict: true },
    })
    expect(result.config?.extends).toBe('@tsconfig/strictest')
    expect(result.config?.include).toEqual(['src/**/*'])
    expect(result.config?.exclude).toEqual(['node_modules'])
    expect(result.config?.files).toEqual(['./global.d.ts'])
    expect(result.config?.references).toEqual([{ path: './packages/core' }])
  })
})

describe('migrateTsconfig - 출력 형식', () => {
  it('output에 권장값 기반 결과 안내 헤더 주석이 포함된다', () => {
    const result = migrateTsconfig({ compilerOptions: { strict: true } })
    expect(result.output).toContain('//')
    expect(result.output).toMatch(/권장값|recommendations/i)
  })

  it('output의 JSON 본문은 2칸 들여쓰기로 정렬된다', () => {
    const result = migrateTsconfig({ compilerOptions: { strict: true } })
    expect(result.output).toContain('  "compilerOptions"')
  })

  it('output 헤더 이후 부분은 유효한 JSON이다', () => {
    const result = migrateTsconfig({ compilerOptions: { strict: true } })
    // 헤더 주석 이후 첫 "{" 부터 본문 시작
    const jsonStart = result.output.indexOf('{')
    const jsonBody = result.output.slice(jsonStart)
    expect(() => JSON.parse(jsonBody)).not.toThrow()
  })
})

describe('migrateTsconfig - 권장값 안내 경고 (사용자 합의)', () => {
  it('warnings의 첫 항목은 "권장값 기반 결과 — 검토 후 적용" 안내이다', () => {
    const result = migrateTsconfig({ compilerOptions: {} })
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0].messageKo).toMatch(/권장값|검토/)
    expect(result.warnings[0].message).toMatch(/recommendations|review/i)
  })
})

describe('migrateTsconfig - 복합 케이스', () => {
  it('deprecated 자동 변환 + 제거 + 권장값 추가를 동시에 처리한다', () => {
    const result = migrateTsconfig({
      compilerOptions: {
        out: './dist/bundle.js', // → outDir 리네임
        charset: 'utf-8', // → 제거 + 경고
        target: 'ES5', // 사용자 값 보존
      },
    })

    // 리네임 결과
    expect(result.config?.compilerOptions?.outDir).toBe('./dist/bundle.js')
    expect(result.config?.compilerOptions?.out).toBeUndefined()

    // 제거 결과
    expect(result.config?.compilerOptions?.charset).toBeUndefined()
    expect(result.warnings.some((w) => w.message.includes('charset'))).toBe(true)

    // 사용자 값 보존
    expect(result.config?.compilerOptions?.target).toBe('ES5')

    // 권장값 추가
    expect(result.config?.compilerOptions?.strict).toBe(true)
  })
})

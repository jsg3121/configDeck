/**
 * TSConfig 설정 감사기 테스트
 */
import { describe, expect, it } from 'vitest'

import { auditTsconfig } from '@/lib/migration/tsconfigAuditor'

describe('auditTsconfig - deprecated 옵션', () => {
  it('out 옵션 사용을 warning으로 감지한다', () => {
    const code = `{ "compilerOptions": { "out": "./dist/bundle.js" } }`
    const result = auditTsconfig(code)
    expect(result.items.some((i) => i.severity === 'warning' && i.message.includes('"out"'))).toBe(
      true,
    )
  })

  it('importsNotUsedAsValues는 5.0+에서 deprecated 안내', () => {
    const code = `{ "compilerOptions": { "importsNotUsedAsValues": "remove" } }`
    const result = auditTsconfig(code)
    expect(
      result.items.some(
        (i) => i.severity === 'warning' && i.message.includes('importsNotUsedAsValues'),
      ),
    ).toBe(true)
  })

  it('suppressExcessPropertyErrors도 안내한다', () => {
    const code = `{ "compilerOptions": { "suppressExcessPropertyErrors": true } }`
    const result = auditTsconfig(code)
    expect(
      result.items.some(
        (i) => i.severity === 'warning' && i.message.includes('suppressExcessPropertyErrors'),
      ),
    ).toBe(true)
  })

  it('deprecated 옵션이 하나라도 있으면 isLegacyConfig=true', () => {
    const code = `{ "compilerOptions": { "out": "./dist/bundle.js" } }`
    expect(auditTsconfig(code).isLegacyConfig).toBe(true)
  })

  it('deprecated 옵션이 없으면 isLegacyConfig=false', () => {
    const code = `{ "compilerOptions": { "strict": true, "target": "ES2022" } }`
    expect(auditTsconfig(code).isLegacyConfig).toBe(false)
  })
})

describe('auditTsconfig - 권장 옵션 누락 안내', () => {
  it('strict가 없으면 info로 안내한다', () => {
    const code = `{ "compilerOptions": { "target": "ES2022" } }`
    const result = auditTsconfig(code)
    expect(result.items.some((i) => i.severity === 'info' && i.message.includes('"strict"'))).toBe(
      true,
    )
  })

  it('target이 없으면 info로 안내한다', () => {
    const code = `{ "compilerOptions": { "strict": true } }`
    const result = auditTsconfig(code)
    expect(result.items.some((i) => i.severity === 'info' && i.message.includes('"target"'))).toBe(
      true,
    )
  })

  it('이미 정의된 권장 옵션은 누락 안내가 없다', () => {
    const code = `{
      "compilerOptions": {
        "strict": true,
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "isolatedModules": true,
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitReturns": true,
        "noUncheckedIndexedAccess": true
      }
    }`
    const result = auditTsconfig(code)
    const missingInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('Consider setting'),
    )
    expect(missingInfos).toHaveLength(0)
  })
})

describe('auditTsconfig - extends 안내', () => {
  it('extends 필드가 있으면 정보 안내가 추가된다', () => {
    const code = `{
      "extends": "@tsconfig/strictest",
      "compilerOptions": { "outDir": "./dist" }
    }`
    const result = auditTsconfig(code)
    const extendsInfo = result.items.find(
      (i) =>
        i.severity === 'info' &&
        i.message.includes('extends') &&
        i.message.includes('not included'),
    )
    expect(extendsInfo).toBeDefined()
  })

  it('extends 안내는 다른 항목보다 먼저 노출된다 (가장 위)', () => {
    const code = `{
      "extends": "@tsconfig/strictest",
      "compilerOptions": { "out": "./dist/bundle.js" }
    }`
    const result = auditTsconfig(code)
    expect(result.items[0]?.message).toContain('extends')
  })

  it('extends가 없으면 extends 안내도 없다', () => {
    const code = `{ "compilerOptions": { "strict": true } }`
    const result = auditTsconfig(code)
    const extendsInfo = result.items.find((i) => i.message.includes('extends'))
    expect(extendsInfo).toBeUndefined()
  })
})

describe('auditTsconfig - 빈 설정 / summary', () => {
  it('빈 객체는 빈 설정 안내가 추가된다', () => {
    const result = auditTsconfig('{}')
    expect(result.items.some((i) => i.message.includes('empty'))).toBe(true)
  })

  it('summary가 severity별 카운트를 정확히 반영한다', () => {
    const code = `{ "compilerOptions": { "out": "./bundle.js" } }`
    const result = auditTsconfig(code)
    expect(result.summary.warnings).toBe(
      result.items.filter((i) => i.severity === 'warning').length,
    )
    expect(result.summary.infos).toBe(result.items.filter((i) => i.severity === 'info').length)
  })
})

describe('auditTsconfig - 권장값 톤 (사용자 합의)', () => {
  it('모든 항목에 영문/한글 메시지가 포함된다', () => {
    const code = `{
      "extends": "@tsconfig/base",
      "compilerOptions": { "out": "./dist/bundle.js" }
    }`
    const result = auditTsconfig(code)
    for (const item of result.items) {
      expect(item.message).toBeTruthy()
      expect(item.messageKo).toBeTruthy()
      expect(item.message).not.toBe(item.messageKo)
    }
  })

  it('권장 옵션 안내는 단정적이지 않은 톤(Consider)을 사용한다', () => {
    const code = `{ "compilerOptions": {} }`
    const result = auditTsconfig(code)
    const recommendInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('Consider'),
    )
    expect(recommendInfos.length).toBeGreaterThan(0)
  })
})

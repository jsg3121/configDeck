# tests/

프로젝트의 테스트 코드를 보관하는 폴더이다.

## 폴더 구조

```
tests/
├── index.md          # 이 파일. 테스트 구조 설명
├── unit/             # Vitest 단위 테스트
│   └── lib/          # src/lib 대응 테스트
├── e2e/              # Playwright E2E 테스트
│   ├── pages/        # 페이지별 테스트
│   └── flows/        # 사용자 플로우 테스트
├── fixtures/         # 테스트 픽스처 (모의 데이터)
└── results/          # 테스트 결과 출력 (gitignore)
```

## 테스트 종류

### 단위 테스트 (Vitest)

- **위치**: `tests/unit/`
- **실행**: `pnpm test` 또는 `pnpm test:watch`
- **대상**: 설정 생성 로직, 유틸리티 함수, 스키마 검증

```typescript
// tests/unit/lib/generators/eslint.test.ts
import { describe, expect, it } from 'vitest'

import { generateEslintConfig } from '@/lib/generators/eslintGenerator'

describe('ESLint 설정 생성', () => {
  it('TypeScript 옵션 활성화 시 @typescript-eslint 포함', () => {
    // ...
  })
})
```

### E2E 테스트 (Playwright)

- **위치**: `tests/e2e/`
- **실행**: `pnpm test:e2e`
- **대상**: 페이지 렌더링, 사용자 인터랙션, 다운로드 플로우

```typescript
// tests/e2e/pages/generator.spec.ts
import { expect, test } from '@playwright/test'

test('설정 생성기 옵션 선택 및 다운로드', async ({ page }) => {
  await page.goto('/ko/generator/eslint')
  // ...
})
```

## 파일 네이밍 규칙

| 종류        | 패턴           | 예시                        |
| ----------- | -------------- | --------------------------- |
| 단위 테스트 | `*.test.ts`    | `eslint.test.ts`            |
| E2E 테스트  | `*.spec.ts`    | `generator.spec.ts`         |
| 픽스처      | `*.fixture.ts` | `eslint-options.fixture.ts` |

## 테스트 결과

- 단위 테스트: `tests/results/unit-results.json`
- E2E 테스트: `tests/results/e2e-results.json`
- E2E 리포트: `tests/results/e2e-report/`

## 관련 설정

- `vitest.config.ts` — Vitest 설정
- `playwright.config.ts` — Playwright 설정

## 테스트 작성 가이드

### 단위 테스트 원칙

1. **격리**: 각 테스트는 독립적으로 실행 가능해야 한다
2. **명확한 네이밍**: 테스트명은 "상황 → 기대 결과" 형식으로 작성
3. **AAA 패턴**: Arrange(준비) → Act(실행) → Assert(검증) 구조 사용

### E2E 테스트 원칙

1. **사용자 관점**: 실제 사용자 시나리오 기반으로 작성
2. **안정성**: 타이밍 의존적인 테스트 지양, `waitFor` 적극 활용
3. **선택자**: `data-testid` 또는 접근성 속성 기반 선택자 우선

# 품질 게이트 기준

PR 병합 및 배포 전 통과해야 하는 품질 기준을 정의한다.

## PR 병합 기준

### 필수 (차단)

다음 조건을 모두 만족해야 PR 병합이 가능하다:

| 항목 | 명령어 | 통과 기준 |
|------|--------|-----------|
| 빌드 | `pnpm build` | 에러 0건 |
| 단위 테스트 | `pnpm test` | 전체 통과 |
| E2E 테스트 | `pnpm test:e2e` | 전체 통과 |
| ESLint | `pnpm lint` | 에러 0건 |
| TypeScript | `pnpm astro check` | 에러 0건 |

### 권장 (경고)

다음 조건은 권장 사항이며, 위반 시 리뷰어와 논의:

| 항목 | 기준 | 예외 허용 |
|------|------|-----------|
| ESLint 경고 | 5건 이하 | 합리적 사유 시 |
| Prettier 위반 | 0건 | 자동 수정 권장 |
| 테스트 커버리지 | 신규 코드 80% 이상 | 테스트 불가 영역 |

## 이슈 심각도별 대응

### 🔴 심각 (Critical)

**정의**: 기능 동작 불가, 빌드 실패, 런타임 에러

**예시**:
- 테스트 실패
- TypeScript 타입 에러
- ESLint 에러 레벨 규칙 위반
- 빌드 실패

**대응**: 즉시 수정, PR 병합 차단

### 🟡 권장 (Warning)

**정의**: 품질 저하, 잠재적 문제, 베스트 프랙티스 위반

**예시**:
- ESLint 경고 레벨 규칙 위반
- 접근성 경고 (WCAG A/AA)
- 테스트 커버리지 미달
- any 사용 (프로젝트 규칙)

**대응**: 수정 권장, 리뷰어와 논의 후 예외 가능

### 🔵 참고 (Info)

**정의**: 개선 가능한 영역, 최적화 기회

**예시**:
- 코드 스타일 개선
- 성능 최적화 가능
- 리팩토링 기회

**대응**: 선택적 대응, 백로그에 기록

## 자동화된 검증

### CI/CD 연동

```yaml
# .github/workflows/qa.yml
name: QA
on: [push, pull_request]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      
      # 필수 검증
      - run: pnpm build
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm test:e2e
```

### 로컬 검증

개발 중 빠른 검증:

```bash
# 전체 검증
pnpm build && pnpm lint && pnpm test

# 빠른 검증 (E2E 제외)
pnpm lint && pnpm test
```

## 검증 주기

| 시점 | 검증 범위 | 실행 방법 |
|------|-----------|-----------|
| 커밋 전 | lint, format | pre-commit hook |
| PR 생성 | 전체 | CI 자동 실행 |
| 병합 전 | 전체 | qa-agent 수동 실행 |
| 배포 전 | E2E 중점 | qa-agent 수동 실행 |

## 예외 처리

### 허용되는 예외

1. **외부 라이브러리 타입 문제**: `// @ts-expect-error` 사용 가능 (사유 주석 필수)
2. **테스트 불가 영역**: UI 렌더링 로직 등 (이유 문서화)
3. **임시 workaround**: 명확한 TODO 주석과 이슈 연결

### 예외 기록 방법

```typescript
// @ts-expect-error - 외부 라이브러리 타입 정의 누락, issue #123 참조
externalLib.undocumentedMethod()
```

## 참고

- `.claude/conventions/guides/coding.md` — 코딩 규칙
- `.claude/conventions/guides/linting.md` — 린팅 규칙

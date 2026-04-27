# E2E 테스트 실행 운영 가이드

E2E 테스트(Playwright) 작성·디버깅·재검증 시 시간과 자원을 효율적으로 사용하면서도 크로스 브라우저 호환성을 보장하기 위한 운영 지침이다.

## 이 가이드가 풀려는 문제

E2E 테스트는 단위 테스트와 달리 **빌드 + preview 서버 + 실제 브라우저** 가 필요해 1회 실행이 길다. 신규 spec 작성이나 차단 이슈 fix 단계에서 무신경하게 반복 실행하면 한 사이클에 수 분이 소모된다.

실제 사례(2026-04-28, SPEC-0004 7단계 작업):

- 신규 `migration-flow.spec.ts` 디버깅 5회 실행 = 약 4분
- 시간의 약 80%가 매 실행마다 새로 도는 **빌드/서버 시작 비용**
- 실제 Playwright 자체 실행 시간은 모두 합쳐 ~40초

→ Playwright 자체가 느린 게 아니라 **빌드 반복**이 원인이다.

## 핵심 원칙

### 1. 빌드와 preview 서버는 한 번만 띄운다

각 `pnpm exec playwright test` 호출마다 빌드/서버를 새로 시작하지 말고, 디버깅 사이클 동안 같은 서버를 재사용한다.

```bash
# 한 번만 실행 (백그라운드)
pnpm build && pnpm preview &

# 이후 모든 playwright 실행은 빌드 없이 동작
pnpm exec playwright test tests/e2e/flows/migration-flow.spec.ts --reporter=line
```

`playwright.config.ts`의 `webServer.reuseExistingServer: !process.env.CI` 설정 덕분에 로컬에서는 자동으로 재사용된다. 서버가 종료되지 않게 유지하는 것이 중요하다.

> **Why:** 빌드 1회는 약 30~50초, 서버 시작은 추가 2~5초. 5번 실행하면 빌드만 200초 누적된다. 서버 1회 띄우기로 이 비용을 한 번으로 압축한다.

### 2. 작성·디버깅 단계의 단일 브라우저 사용은 임시 수단이다

ConfigDeck은 일반 사용자가 Chrome, Firefox, Safari, 모바일 Chrome, 모바일 Safari 환경에서 사용하므로 **모든 브라우저에서의 통과는 PR 머지의 필수 조건**이다. 다음 두 단계를 명확히 구분한다.

#### 2-A. 작성·디버깅 단계 (임시 단축 허용)

오타/셀렉터 오류/입력값 실수처럼 어떤 브라우저에서도 동일하게 실패할 명백한 코드 문제를 빠르게 잡는 단계다. 이때만 chromium 단일 브라우저로 빠른 피드백을 받는다.

```bash
# 작성 중 빠른 검증 (임시 단축)
pnpm exec playwright test --project=chromium --reporter=line
```

이 단계는 **spec이 한 번이라도 의도한 대로 동작하는지 확인**이 목적이지, 통과 검증이 아니다.

#### 2-B. 검증 단계 (전체 브라우저 필수)

다음 시점에는 **반드시** 전체 브라우저로 실행한다.

- 신규 spec 작성을 마치고 커밋 직전
- 차단 이슈 fix 후 qa-agent 재검증 전
- PR 생성 직전

```bash
# 전체 브라우저 검증 (필수)
pnpm exec playwright test --reporter=line
```

> **Why:** chromium 단일 실행만 통과하고 끝내면 firefox·webkit·mobile 환경에서 발생하는 hydration 타이밍, CSS 호환성, 터치 이벤트 차이 같은 회귀를 놓친다. 실제로 이번 사이클에서도 "chromium에서만 textarea 못 찾음" 같은 브라우저별 차이가 있었고, 전체 브라우저 실행이 있어서 잡혔다.

### 3. 출력은 `--reporter=line` 사용

기본 `list` 리포터는 매 케이스마다 색상/이모지/단계별 진행 상황을 출력해 시각적 노이즈가 크다. `line` 리포터는 한 줄 갱신 형식이라 결과 비교가 쉽다.

```bash
pnpm exec playwright test --reporter=line
```

> **Why:** "같은 테스트가 반복 실행되는 것처럼 느껴지는" 체감 문제는 출력 형식 때문에도 발생한다. line 리포터로 개선된다.

### 4. 새 spec 작성 시 안정성을 처음부터 확보한다

다음 패턴을 spec 작성 시 기본으로 적용하면 1차 실행 통과 확률이 크게 높아진다.

#### 4-1. Svelte 아일랜드 hydration 대기

`.svelte` 컴포넌트가 인터랙션을 받으려면 hydration이 완료되어야 한다.

```typescript
await page.goto('/ko/generator/eslint-config')
await page.waitForLoadState('networkidle')  // hydration 안정화
await page.getByRole('button', { name: '마이그레이션' }).click()
```

#### 4-2. 셀렉터는 ARIA 우선

`page.locator('pre code')` 같은 일반 CSS 셀렉터는 페이지 변경에 취약하다. ARIA role과 accessible name을 사용한다.

```typescript
// BAD — 페이지에 pre code가 여러 개 있으면 strict mode violation
page.locator('pre code')

// GOOD — 의미 단위로 좁힘
page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
```

> **Why:** 컴포넌트가 추가/삭제될 때 일반 셀렉터는 회귀를 일으킨다. ARIA 셀렉터는 의미가 변하지 않는 한 안정적이다. 이번 사이클에서 1.2.0 spec이 1.3.0의 MigrationPanel 추가로 회귀한 것이 대표 사례다.

#### 4-3. helper 함수로 진입 동선 캡슐화

여러 시나리오가 동일한 진입 동선을 반복하면 helper로 추출한다.

```typescript
const enterMigrationTab = async (page: Page) => {
  await page.goto('/ko/generator/eslint-config')
  await page.waitForLoadState('networkidle')
  const migrateTab = page.getByRole('button', { name: '마이그레이션', exact: true })
  await expect(migrateTab).toBeVisible()
  await migrateTab.click()
  await expect(page.locator('textarea')).toBeVisible()
}
```

> **Why:** 진입 동선의 안정성 보강(networkidle 추가 등)이 한 곳에서 끝난다. 시나리오마다 같은 코드를 5벌 수정하지 않는다.

## 디버깅 워크플로우

신규 spec 또는 차단 이슈 fix 시 다음 순서로 진행한다.

```text
1. 빌드 & preview 서버 백그라운드 기동 (1회)
   pnpm build && pnpm preview &

2. spec 작성/수정

3. 작성·디버깅 단계 — chromium으로 빠른 검증 (임시)
   pnpm exec playwright test <spec> --project=chromium --reporter=line

4. spec 동작이 맞을 때까지 2~3 반복
   (서버 재사용으로 매번 1~3초만 소요)

5. ⚠️ 검증 단계 — 전체 브라우저로 마지막 검증 (필수)
   pnpm exec playwright test <spec> --reporter=line

6. 백그라운드 서버 종료
   kill %1   # 또는 jobs로 PID 확인 후 kill
```

5단계의 전체 브라우저 검증을 통과하지 않은 spec은 커밋하지 않는다.

## 재검증 운영 (qa-agent fix 사이클)

차단 이슈를 fix한 후 qa-agent에 재검증을 요청할 때:

### 재검증 트리거

- **동일 도메인 차단 이슈는 일괄 수정 후 재검증** (1건씩 fix → 재검증을 반복하지 않음)
- 단, 한 fix가 다른 영역에 영향을 줄 가능성이 있으면 즉시 재검증

### 신규 작업 디버깅 단계의 spec 선별

새 spec을 작성하거나 기존 spec을 수정할 때, 디버깅 단계에서는 변경에 영향이 있는 spec만 좁혀서 빠르게 피드백 받는다.

```bash
# 새 spec 단독 검증 (가장 좁은 범위)
pnpm exec playwright test tests/e2e/flows/migration-flow.spec.ts \
  --project=chromium --reporter=line

# 같은 페이지/컴포넌트에 관련된 spec까지 묶어 검증
pnpm exec playwright test \
  tests/e2e/flows/migration-flow.spec.ts \
  tests/e2e/pages/generator.spec.ts \
  --project=chromium --reporter=line
```

**이 단계는 빠른 피드백 루프를 위한 임시 단축이며, PR 머지 직전에는 반드시 `pnpm exec playwright test`(전체) 1회 실행으로 마무리**한다. "어떤 spec까지 영향이 있을지" 판단은 사람이 하므로 영향 경로를 놓칠 가능성이 있고, 그 마지막 안전망이 전체 실행이다.

> **Why 전체 실행을 빼면 안 되는가:** 같은 페이지의 다른 컴포넌트, 동일 셀렉터, 같은 hydration 타이밍 등 변경의 영향 경로는 사전 판단이 어렵다. 본 가이드 도입 사이클(SPEC-0004 7단계)에서도 1.3.0의 MigrationPanel 변경이 1.2.0부터 통과하던 generator.spec.ts/home.spec.ts에 12건 회귀를 일으킨 사례가 있다. 머지 직전 1회 전체 실행(36초)은 이런 회귀를 잡는 가장 단순하고 확실한 안전망이다.

### 실패 케이스 선별 재검증

fix → 재검증 사이클의 빠른 피드백을 위해, 디버깅 단계에서는 직전 실패한 케이스만 재실행한다.

```bash
# 직전 실행에서 실패한 케이스만 재실행
pnpm exec playwright test --last-failed --reporter=line

# 또는 특정 테스트/파일로 좁힘
pnpm exec playwright test --grep="검색 기능" --reporter=line
pnpm exec playwright test tests/e2e/flows/migration-flow.spec.ts --reporter=line
```

> **Why:** 통과한 케이스를 매번 함께 돌리면 디버깅 피드백이 느려진다. 실패한 범위만 좁혀 빠르게 확인하고, 사이클을 짧게 가져간다.

### 최종 검증은 반드시 전체 실행

`--last-failed`나 `--grep`만 반복하면 fix 과정에서 새로 깨진 다른 케이스를 놓칠 수 있다. **모든 차단 이슈가 통과 상태가 된 직후, 머지 직전에는 반드시 전체 브라우저로 한 번 실행**해 회귀를 차단한다.

```text
디버깅 사이클: --last-failed → 통과
              ↓
모든 차단 이슈 0건 도달
              ↓
최종 검증: 전체 브라우저 + 전체 spec 1회 (필수)
              ↓
PR 생성/머지
```

> **Why:** 셀렉터 한 줄 수정이 다른 케이스에서 회귀를 일으키는 일이 실제로 발생한다(이번 사이클에서도 mobile-chrome flaky 발견 사례 있음). 전체 1회 실행 비용이 회귀를 놓치는 리스크보다 훨씬 작다.

### 재검증 통과 조건

- [quality-gates.md](quality-gates.md)의 "필수 (차단)" 표 5개 항목 모두 0건
- E2E는 **전체 브라우저(5종)**에서 통과해야 함
- 새 차단 이슈가 발생하지 않음 (회귀 방지)

### 무한 루프 방지

- 재검증 **3회 연속** 차단 이슈 발생 시 작업을 정지하고 사용자에게 보고
- **동일 이슈가 2회 연속** 발생 시 fix 접근법을 재검토 (셀렉터/타이밍/입력값 중 어느 차원의 문제인지 다시 진단)

> **Why:** 재검증을 무한 반복하면 시간만 소비하고 근본 원인 파악이 늦어진다. 횟수 제한을 두어 사용자에게 결정권을 돌려준다.

### 테스트 코드 vs 프로덕션 코드 — fix 위치 판단

E2E 실패가 발생했을 때 **반드시 "어느 쪽의 결함인가"를 먼저 판단**한다. 무조건 테스트 코드만 고치면 실제 사용자가 마주하는 버그를 놓칠 수 있다.

| 신호 | 결함 위치 | 대응 |
| ---------- | ---------- | ---------- |
| 페이지 구조 변경으로 셀렉터가 모호해진 경우(예: 동일 셀렉터 매칭 다수) | 테스트 코드 | ARIA 셀렉터로 좁힘 |
| Playwright 자동화 속도가 사람보다 빨라서 발생하는 race(예: hydration 직후 클릭) | 테스트 코드 | `waitForLoadState('networkidle')` 등 대기 추가 |
| 사용자가 직접 시도해도 재현되는 동작 오류 | **프로덕션 코드** | 컴포넌트/로직 수정 후 회귀 테스트 추가 |
| 다국어/뷰포트별로 다른 결과 (코드 분기 누락) | **프로덕션 코드** | 분기 보완 |

**판단이 애매할 때는 사용자에게 수동 검증을 요청한다.** 예: "새로고침 직후 X 버튼을 즉시 클릭했을 때 정상 동작하나요?" 같이 구체적으로.

> **Why:** "테스트만 수정해서 통과시키기"는 손쉬운 길이지만, 그 과정에서 실제 결함을 가릴 수 있다. 어느 쪽 결함인지 명확히 한 다음에야 적절한 fix가 가능하다.

## 자주 만나는 이슈 패턴

### A. `strict mode violation: locator('X') resolved to N elements`

페이지에 같은 셀렉터가 여러 개 매칭된다는 뜻. 다음 중 하나로 해결.

- ARIA 셀렉터로 의미 단위로 좁힘 (4-2 참조)
- `.first()` / `.nth(n)` / `.last()` 명시
- 부모 컨테이너로 범위 한정 (`getByRole('region', ...).locator('...')`)

### B. `element(s) not found` — 특정 브라우저에서만 실패

거의 항상 **hydration 또는 렌더링 타이밍 차이**다. 단일 브라우저 통과를 보고 끝내지 말고 다음을 적용한 뒤 전체 브라우저로 다시 검증한다.

- `page.waitForLoadState('networkidle')` 호출
- 활성화 상태(`bg-white` 클래스 등)를 명시적으로 기다림
- 인터랙션 직전 `expect(button).toBeVisible()` 단언으로 자동 대기

### C. 동일 spec이 한 번은 통과, 한 번은 실패

flaky 테스트의 신호. 다음을 점검:

- 디바운스/리액티브 갱신 후 검증할 요소가 안정될 때까지 대기 누락
- 외부 리소스(폰트, 이미지) 로드를 기다리지 않음
- 모바일/데스크톱 뷰포트 분기를 spec이 인지하지 못함

## 관련 문서

- [quality-gates.md](quality-gates.md) — PR 병합 전 통과 기준
- [../templates/report.md](../templates/report.md) — qa-agent 리포트 템플릿
- [../../agents/e2e-tester.md](../../agents/e2e-tester.md) — E2E 테스트 서브에이전트 정의

## 변경 이력

| 날짜 | 변경 내용 |
| ---------- | ---------- |
| 2026-04-28 | 초안 작성. SPEC-0004 7단계 E2E 작업 사이클(약 4분 소요)을 분석한 결과 도출. 작성·디버깅 단계의 단일 브라우저 사용은 임시 수단이며 검증 단계는 반드시 전체 브라우저로 수행함을 명시 |
| 2026-04-28 | "실패 케이스 선별 재검증(--last-failed)" 운영 원칙 추가. 디버깅 사이클은 좁혀서 빠르게, 머지 직전에는 반드시 전체 실행으로 회귀 차단. 또한 테스트 코드 vs 프로덕션 코드 결함 위치 판단 표를 추가해 무조건 테스트만 수정하지 않도록 가드 |
| 2026-04-28 | "신규 작업 디버깅 단계의 spec 선별" 원칙 추가. 작성·디버깅 단계에서는 변경에 영향이 있는 spec만 좁혀서 빠른 피드백을 받되, PR 머지 직전 전체 실행으로 마무리해 변경의 영향 경로를 놓치지 않도록 한다. ADR-0016 참조 |

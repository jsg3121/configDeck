# ADR-0016: E2E 테스트 검증 전략 — 디버깅 단계 선별 실행 + 머지 직전 전체 실행

- 상태: 승인됨
- 날짜: 2026-04-28
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck의 E2E 테스트는 Playwright로 작성되며, [`playwright.config.ts`](../../../playwright.config.ts)에 5개 브라우저 프로젝트(chromium, firefox, webkit, mobile-chrome, mobile-safari)가 정의되어 있다. 2026-04-28 시점 spec 4개 / 고유 케이스 37개 / 브라우저별 곱 = **총 185 케이스**가 운영 중이다.

SPEC-0004 7단계(E2E 테스트 보완) 작업 중 다음 두 가지 운영 이슈가 드러났다.

### 1. 작성·디버깅 사이클의 시간 비용 누적

신규 `migration-flow.spec.ts` 작성 시 셀렉터/입력값/타이밍을 고치며 5번 반복 실행했고, 매 실행마다 빌드(약 30~50초) + Playwright 실행(약 9~19초)이 누적되어 **약 4분**이 소요됐다. 시간의 약 80%가 빌드 반복에서 발생했고, Playwright 자체는 빠르지만 매번 새 프로세스로 띄우는 구조 때문이었다.

### 2. 변경 범위 vs 영향 범위의 차이

Phase B의 `MigrationPanel` 변경은 마이그레이션 페이지에 한정된 것으로 보였지만, 실제로는 **같은 페이지의 다른 컴포넌트가 사용하는 `pre code` 셀렉터와 충돌**해 1.2.0부터 통과하던 기존 spec(generator.spec.ts, generator-flow.spec.ts, home.spec.ts)에서 12건 회귀가 발생했다. qa-agent 1차 검증(2026-04-28-1.3.0-phase-b-qa.md)에서 이 회귀가 처음 발견되었고, fix → 재검증 사이클 중 또 다른 회귀가 추가로 드러났다(qa-v2 → Q3-B-2).

이 경험으로 두 가지 사실이 분명해졌다.

- 영향 범위는 사람이 사전에 정확히 판단하기 어렵다. 같은 페이지·동일 셀렉터·같은 hydration 타이밍 등 여러 경로로 회귀가 발생할 수 있다
- 따라서 머지 직전 전체 실행은 단순한 안전망이지만 가장 확실한 안전망이다

### 트래이드오프

E2E를 어떻게 운영할지에 대한 후보들:

- 매번 전체를 돌리면 디버깅 사이클이 길어진다
- 변경에 영향이 있는 spec만 돌리면 사람의 판단 오류로 회귀를 놓친다
- nightly 빌드처럼 main에서 별도로 전체를 돌리는 방식은 회귀를 PR 머지 후에 발견하게 만든다

ConfigDeck의 현재 E2E 자체 시간(약 36초)을 감안할 때, **"디버깅은 좁혀서 빠르게, 머지 직전에는 전체로 마무리"** 가 비용 대비 효과가 가장 좋다고 판단했다.

## 결정 (Decision)

E2E 테스트 운영을 다음 두 단계로 구분한다.

### 1. 디버깅·작성 단계 — spec/케이스 선별

신규 spec 작성, 기존 spec 수정, 차단 이슈 fix 등 **반복 실행이 필요한 디버깅 단계**에서는 변경에 영향이 있는 범위만 좁혀서 빠른 피드백을 받는다.

- 새 spec 단독 검증: `pnpm exec playwright test <spec> --project=chromium --reporter=line`
- 같은 페이지/컴포넌트 관련 spec까지 묶어 검증: 여러 spec 경로 나열
- 직전 실패 케이스만 재검증: `pnpm exec playwright test --last-failed`
- 특정 패턴 검증: `pnpm exec playwright test --grep="..."`

이 단계의 크로스 브라우저 검증은 **임시로 단일 브라우저(chromium)** 로 축소할 수 있다. 단, **이 축소는 작성·디버깅 단계에서만 허용**되고 검증 결과로 인정되지 않는다.

### 2. PR 머지 직전 — 전체 실행 1회 필수

모든 차단 이슈가 통과 상태에 도달하면, **PR 생성 직전 또는 머지 직전에 반드시 `pnpm exec playwright test`(전체 spec × 5 브라우저) 1회를 실행**한다. 이 실행이 통과하지 않으면 PR을 머지하지 않는다.

이 단계는:

- 디버깅 단계에서 좁혀 둔 범위 밖에서 발생한 회귀를 차단한다
- "어떤 spec까지 영향이 있을지" 사전 판단의 누락을 보완한다
- ConfigDeck 전체 E2E spec(`home`, `generator`, `flows/*`)을 모두 통과해야 하는 단일 게이트로 작동한다

### 적용 위치

이 운영 원칙은 [`.claude/qa/guides/e2e-execution.md`](../../qa/guides/e2e-execution.md)에 명시한다. 본 ADR은 그 결정의 배경과 근거를 기록한다.

## 근거 (Rationale)

### 비용 분석

실측 데이터(2026-04-28):

| 실행 방식 | 케이스 수 | E2E 자체 시간 | 빌드 포함 총 시간 |
| ---------- | ---------- | ---------- | ---------- |
| migration-flow만 | 20 | 9초 | 약 17초 |
| generator 관련 spec만 | 125 | 27초 | 약 35초 |
| 전체 spec | 185 | 36초 | 약 43초 |

부분/전체 차이는 약 26초이며, **케이스 1000건 가정 시에도 전체 실행이 약 3~4분 수준**이다. 즉 "전체 실행을 빼야 할 만큼 비싸지는" 임계점에 현재 도달하지 않았다.

### 회귀 차단 가치

이번 사이클에서 발생한 12건 + 2건 회귀는 **모두 변경 범위 밖에서 발생**했고, 머지 직전 전체 실행이 없었다면 main에서 발견되었을 것이다. main 머지 후 회귀를 발견하는 비용(롤백, 핫픽스 PR, 사용자 영향)은 머지 직전 전체 실행 1회(43초)보다 훨씬 크다.

### Playwright 자체 기능 활용

`--last-failed`, `--grep`, `--project`, 파일 경로 인자 등 Playwright가 제공하는 기본 기능만으로 디버깅 단계 선별이 가능하다. 별도 도구 도입 없이 운영 가능하다.

### Why-First 정리

| 원칙 | Why |
| ---------- | ---------- |
| 디버깅은 좁힌다 | 매번 전체를 돌리면 피드백 사이클이 길어져 작업 효율이 낮아진다 |
| 머지 직전 전체 1회 | 영향 범위 사전 판단이 어렵고, 회귀를 main에서 발견하는 비용이 더 크다 |
| 단일 브라우저는 작성 단계에만 | 사용자는 5개 브라우저를 모두 사용하므로, 검증 결과로 인정하려면 전체 브라우저가 필요하다 |

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
| ---------- | ---------- |
| **항상 전체 실행** | 디버깅 사이클에 매번 빌드 + 36초가 누적되어 작업 효율이 낮아진다. 본 사이클의 약 4분 누적 사례가 그 예시 |
| **변경 영향 spec만 실행 (전체 실행 생략)** | 영향 범위 사전 판단이 어렵다. 본 사이클의 12건 회귀가 변경 범위 밖에서 발생한 것이 직접 사례 |
| **PR마다 변경 spec, main 머지 후 nightly로 전체 실행** | 회귀를 main에서 발견하게 만들어 롤백/핫픽스 비용 발생. nightly 인프라(GitHub Actions 등) 도입 비용도 추가됨 |
| **Playwright `--shard`로 병렬 실행 가속** | 케이스 수가 임계점에 도달하지 않은 현재 시점에 도입 효과가 작다. 워커 수 분배·결과 집계 등 운영 복잡도 증가 |
| **변경 파일 기반 자동 매핑(affected-only)** | 매핑 누락 시 회귀를 놓치고, 매핑 자체를 유지·관리하는 비용 발생. ConfigDeck 규모에서는 과한 도구화 |

## 결과 (Consequences)

### 긍정적 결과

- 디버깅 단계 사이클이 30~70% 단축된다 (185 케이스 36초 → 관련 spec만 9~27초)
- 머지 직전 전체 실행으로 회귀를 main 머지 전에 차단한다
- 별도 도구 도입 없이 Playwright 기본 기능만으로 운영 가능하다

### 후속 조치

- [`.claude/qa/guides/e2e-execution.md`](../../qa/guides/e2e-execution.md)에 운영 절차를 명시 (반영 완료, 2026-04-28)
- E2E 케이스 수가 1000건을 넘거나 전체 실행이 5분을 초과하는 시점이 오면 본 ADR을 재검토한다 (대안 표의 `--shard`, nightly 분리, affected-only 등을 다시 검토)
- 1.4.0 이후 작업에서 본 운영 원칙이 실제로 회귀를 잡는 효과를 측정한다 (예: PR마다 머지 직전 전체 실행에서 발견된 회귀 건수)

### 부정적 결과/리스크

- 머지 직전 전체 실행이 약 43초 추가됨 (현재 시점에는 수용 가능)
- 디버깅 단계의 spec 선별 판단이 사람에게 맡겨져 있어 누락 가능성 존재 (전체 실행이 안전망으로 작동)
- 빌드/preview 서버 재기동 비용 자체는 줄지 않으므로, 디버깅 사이클 동안에는 [e2e-execution.md §1 (빌드와 preview 서버는 한 번만)](../../qa/guides/e2e-execution.md)에 따른 백그라운드 서버 재사용을 병행해야 효과가 극대화된다

## 참고 자료 (References)

- [`.claude/qa/guides/e2e-execution.md`](../../qa/guides/e2e-execution.md) — E2E 테스트 실행 운영 가이드 (본 ADR의 운영 절차)
- [`.claude/qa/guides/quality-gates.md`](../../qa/guides/quality-gates.md) — PR 머지 전 통과해야 하는 품질 기준
- [`.claude/qa/reports/2026-04-28-1.3.0-phase-b-qa.md`](../../qa/reports/2026-04-28-1.3.0-phase-b-qa.md) — 본 ADR의 직접적 계기가 된 v1 검증 리포트(차단 4건 발견)
- [`.claude/qa/reports/2026-04-28-1.3.0-phase-b-qa-v3.md`](../../qa/reports/2026-04-28-1.3.0-phase-b-qa-v3.md) — 운영 원칙 적용 후 머지 가능 판정 리포트
- [Playwright Test — Command line](https://playwright.dev/docs/test-cli) — `--last-failed`, `--grep`, `--project` 등 본 ADR이 활용하는 기본 기능
- [Playwright Test — Sharding](https://playwright.dev/docs/test-sharding) — 향후 임계점 도달 시 검토할 가속 옵션

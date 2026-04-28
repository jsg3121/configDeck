---
id: SPEC-0004
title: Import & Audit — 기존 설정 파일 분석/진단/마이그레이션
status: 구현 중
owner: jsg3121
created: 2026-04-26
updated: 2026-04-29
related_adrs:
  - ADR-0014  # 성장 전략 로드맵 (Import & Audit P0.5 신설)
  - ADR-0016  # E2E 테스트 검증 전략 (7단계 작업에서 도출)
related_specs:
  - SPEC-0001  # 파일 옵션 생성기 기능 보강
---

# SPEC-0004: Import & Audit — 기존 설정 파일 분석/진단/마이그레이션

> **본 SPEC은 1.2.0에 부분 구현된 ESLint Legacy → Flat 마이그레이션을 정식 SPEC으로 회수하고, 후속 확장(Prettier·TSConfig Audit 등)의 골격을 정의한다.**
> ADR-0014의 후속 조치 목록에서 "SPEC-0003: Import & Audit"으로 예약되어 있던 항목을 번호 정합을 맞춰 SPEC-0004로 발급한다 (SPEC-0003은 Shareable URL이 선점).

## 1. 배경 (Background)

### 1.1 현재 상태

- ConfigDeck은 "처음부터 만들기"(생성기) 기능에 집중되어 있어, 기존 프로젝트 사용자는 직접적인 활용 동선이 없다
- 1.2.0 사이클에서 ESLint v9 전환 수요(STR-0002/MI-0002)에 대응해 **ESLint Legacy → Flat 마이그레이션 기능**을 추가했다
  - [src/lib/migration/parser.ts](../../../../src/lib/migration/parser.ts) — JSON/CommonJS/ESM 형식 감지 + 레거시 설정 파싱
  - [src/lib/migration/eslintMigrator.ts](../../../../src/lib/migration/eslintMigrator.ts) — `extends`/`env` → flat config 변환
  - [src/lib/migration/eslintAuditor.ts](../../../../src/lib/migration/eslintAuditor.ts) — deprecated 규칙·prettier 충돌·권장 규칙 감사
  - [MigrationPanel.svelte](../../../../src/components/generator/MigrationPanel.svelte) — UI 통합
- 단위 테스트 50건 작성됨 ([tests/unit/lib/migration/](../../../../tests/unit/lib/migration/))

### 1.2 문제점

1. **시장 대상 한정**: 생성 기능만으로는 "기존 프로젝트를 가진 사용자(시장 대다수)"가 ConfigDeck을 방문할 이유가 없다 (ADR-0014 §근거 2)
2. **차별화 부족**: gitignore.io 등 단일 파일 생성기와의 결정적 차이를 보여주는 기능이 부재했다
3. **ESLint v9 전환 수요 미대응**: 단기 트래픽 유입의 핵심 레버였으나 1.2.0 이전까지 미구현
4. **공유 가능한 가치 결여**: "ConfigDeck으로 내 설정 점검해봤는데" 형태의 바이럴 트리거(ADR-0014 §근거 2)가 만들어지지 않음
5. **확장 골격 부재**: 1.2.0의 ESLint 마이그레이션은 단발성 기능으로 추가되었고, Prettier/TSConfig 등 다른 도구로의 확장 패턴이 정리되지 않았다

### 1.3 사용자 요구

- ESLint v9 출시(2024-04) 이후 누적된 flat config 전환 수요 (MI-0002)
- 외부 분석 보고서(ADR-0014 참조)의 "Import & Audit" 차별화 제안
- 1.2.0 사용자 피드백: "내 .eslintrc.json을 붙여넣으면 결과를 즉시 보여주는 게 가장 유용했다"

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

#### Phase A — ESLint Legacy 마이그레이션 (1.2.0 완료)

- `.eslintrc.json` / `.eslintrc.js` (CommonJS) / `.eslintrc.cjs` 입력 형식 감지
- `extends` (eslint:recommended, airbnb 등) → flat config 매핑
- `env` → globals 변환
- `rules` 보존
- deprecated 규칙(indent, semi 등) 경고
- `eslint-config-prettier`와 포맷팅 규칙 충돌 경고
- 권장 규칙(no-console, no-debugger 등) 누락 안내
- 다국어(한/영) 메시지

#### Phase B — Audit-only 모드 (이번 SPEC 신규)

- Legacy/Flat 무관, 사용자가 붙여넣은 설정을 "현 상태 점검"한다
- 감사 결과를 카테고리(❌ 에러 / ⚠️ 권장 / ℹ️ 정보)별로 노출
- 마이그레이션 없이 진단만 받는 흐름 제공

#### Phase C — 확장 (마이그레이션 도구 추가)

- Prettier 옵션 분석/마이그레이션 (deprecated 옵션 감지, Prettier 3.x 전환)
- TSConfig 분석 (target/module 권장값, strict 옵션 누락 감지, 사용되지 않는 옵션)
- (장기) `package.json` scripts 분석 → 도구 호환성 진단

### 2.2 다루지 않는 것 (Out of Scope)

- **자동 적용/PR 생성** — 클라이언트 도구의 본질(데이터 외부로 보내지 않음)을 지킨다. 사용자가 결과를 복사해 직접 적용한다
- **ESLint 플러그인 Rule 데이터베이스 자체 호스팅** — 공식 메타데이터(eslint, @eslint/js, typescript-eslint)에 의존
- **AI 기반 자연어 설명** — Phase A/B에서는 정적 매핑만 사용. AI 통합은 트래픽 검증 후 별도 검토
- **CI/CD 통합 (GitHub Action 등)** — CLI(SPEC-0005)에서 다룬다
- **Yaml 형식 입력** — 점유율 낮음. 요청이 누적되면 별도 검토

## 3. 제안 (Proposal)

### 3.1 개요

ConfigDeck의 정체성을 **"설정 파일 생성기"에서 "설정 관리 허브"로** 전환하는 핵심 기능이다 (ADR-0014). 사용자가 기존 설정을 붙여넣으면 ConfigDeck이 분석·진단·변환 결과를 보여주고, 사용자는 결과를 자신의 프로젝트에 직접 적용한다.

기능은 도구별 모듈로 구성하되, 공통 인터페이스(`detect → parse → audit → migrate`)를 따른다. 1.2.0의 ESLint 구현이 이 패턴의 첫 사례이며, Prettier/TSConfig가 같은 골격을 따라 추가된다.

### 3.2 상세 설계

#### 3.2.1 모듈 인터페이스 (공통)

```typescript
// src/lib/migration/types.ts (1.3.0에서 도입 — feature/1.3.0-config-inspector)
export interface ConfigInspector<TLegacy, TModern = unknown> {
  detect(input: string): ConfigFormat
  parse(input: string, format: ConfigFormat): TLegacy
  audit(input: string): AuditResult
  migrate(legacy: TLegacy): MigrationResult<TModern>
}

export type ConfigFormat = 'json' | 'commonjs' | 'esm' | 'unknown'
export type AuditSeverity = 'error' | 'warning' | 'info'

export interface AuditItem {
  severity: AuditSeverity
  message: string         // 영문
  messageKo: string       // 한글
  suggestion?: string     // 영문 제안 메시지 (1.2.0 ESLint 구현이 이미 사용 중)
  suggestionKo?: string   // 한글 제안 메시지
  ruleName?: string
  line?: number
}

export interface AuditResult {
  isLegacyConfig: boolean
  items: AuditItem[]
  summary: { errors: number; warnings: number; infos: number }
}

export interface MigrationWarning {
  message: string
  messageKo: string
}

export interface MigrationResult<TModern = unknown> {
  output: string          // 변환된 코드(문자열)
  config?: TModern        // 변환된 객체(옵셔널 — JSON 산출 도구만 채움)
  warnings: MigrationWarning[]
}
```

> **TModern을 옵셔널로 둔 이유:** ESLint 마이그레이션은 import 문 + 배열 리터럴 형태의 코드 문자열만 산출하므로 단일 객체로 환원할 가치가 없다. 반면 Prettier/TSConfig는 JSON 객체이므로 자연스럽게 채울 수 있다. 양쪽 모두 만족하도록 옵셔널 필드로 정의한다.
>
> **suggestion/suggestionKo 추가 이유:** SPEC 초안에는 누락되었으나 1.2.0의 [eslintAuditor.ts](../../../../src/lib/migration/eslintAuditor.ts) 구현이 이미 활발히 사용 중이다. 1.3.0 정형화 시 SPEC을 코드 현실에 맞춰 보강한다.

> **Why 공통 인터페이스:** Phase B/C에서 추가되는 모듈(Prettier, TSConfig)이 동일한 UI/플로우에 통합되도록 한다. 1.2.0의 ESLint 구현은 이 인터페이스를 사실상 충족하므로 큰 리팩터링 없이 정형화 가능하다.

#### 3.2.2 페이지 구조

```
/{locale}/migration/                 # 허브 페이지 (도구 선택)
/{locale}/migration/eslint           # ESLint Legacy → Flat (Phase A 완료)
/{locale}/migration/prettier         # Prettier 분석 (Phase C)
/{locale}/migration/tsconfig         # TSConfig 분석 (Phase C)
```

> **Why 별도 경로:** 생성기(`/generator/{file}`)와 동선/검색 의도가 다르다. SEO 측면에서 "eslint flat config migration", "tsconfig audit" 같은 키워드를 별도 페이지로 잡는다.

#### 3.2.3 사용자 플로우

```
[Migration 페이지 진입]
   │
   ├─ 1. 도구 선택 (ESLint / Prettier / TSConfig …)
   ├─ 2. 사용자가 기존 설정을 붙여넣음
   ├─ 3. detect → parse (실패 시 형식 안내)
   ├─ 4. audit 결과 표시 (❌ ⚠️ ℹ️ 카테고리별)
   ├─ 5. (Legacy인 경우) migrate 버튼 노출
   ├─ 6. 변환 결과 미리보기 + diff 강조
   ├─ 7. "복사" 또는 "다운로드" 또는 "공유 URL 생성"
   │      └─ 공유 URL은 SPEC-0003 인코딩 사용
   └─ 8. (옵션) 변환 결과를 생성기에 import → 추가 옵션 조정
```

#### 3.2.4 Audit-only 모드 (Phase B — 1.3.0 구현 완료)

Phase A의 [eslintAuditor.ts](../../../../src/lib/migration/eslintAuditor.ts)는 이미 Legacy/Flat 두 형식 모두에 대한 점검 항목을 가지고 있다. UI에서 "마이그레이션" 버튼을 isLegacyConfig=false 일 때 숨기고 audit 결과만 노출하면 Phase B는 즉시 가능하다.

[MigrationPanel.svelte](../../../../src/components/generator/MigrationPanel.svelte)는 입력 코드에 대해 `auditEslintConfig`를 먼저 호출해 `isLegacyConfig`를 판정하고 두 흐름으로 분기한다.

| 입력 | panelMode | 미리보기 | 진단 | 변환 경고 |
| ---- | --------- | -------- | ---- | --------- |
| Legacy (`isLegacyConfig=true`) | `migrate` | 변환 결과 | 변환 결과 기준 | 노출 |
| Flat (`isLegacyConfig=false`) | `audit` | 입력 그대로 | 입력 기준 | 미노출 |

Audit 모드에서는 형식 배지 옆에 "Audit only" 배지를 노출하고, "Flat config가 감지되었습니다" 안내문을 표시한다. 권장 규칙 적용(`handleApplyRule`)은 양쪽 모드 모두 지원되며, Audit 모드에서는 적용 결과 위에서 audit를 재계산해 진단 항목이 자연스럽게 갱신된다.

### 3.3 1.2.0 구현분(Phase A) 사후 명세

#### 3.3.1 입력 형식 감지

[parser.ts](../../../../src/lib/migration/parser.ts)의 `detectConfigFormat`:

| 입력 | 판정 |
|------|------|
| `{` 시작 | `json` |
| `module.exports` 포함 | `commonjs` |
| `export default` 포함 | `esm` (현재는 flat config로 간주, 변환 대상 아님) |
| 그 외 | `unknown` |

#### 3.3.2 파싱 보정

- `parseJsonConfig`: trailing comma·주석 제거 후 JSON.parse
- `parseCommonJsConfig`: 객체 리터럴 추출 → `jsObjectToJson`(작은따옴표→큰따옴표, 식별자 키→따옴표 키) → JSON.parse

#### 3.3.3 마이그레이션

[eslintMigrator.ts](../../../../src/lib/migration/eslintMigrator.ts):

- `extends` → `import` 문 + `configs.recommended`/`config(...)` 호출
- `env: { browser: true, node: true }` → `globals.browser` + `globals.node` 통합
- `rules` 보존(2-space 들여쓰기)
- `parserOptions`/`parser` → `languageOptions`로 이동

#### 3.3.4 감사 (Audit)

[eslintAuditor.ts](../../../../src/lib/migration/eslintAuditor.ts):

- Legacy 감지 (`extends` 키 또는 `module.exports`)
- deprecated 규칙 매칭(`indent`, `semi`, `quotes`, `space-before-function-paren` 등)
- `eslint-config-prettier`와 포맷팅 규칙 동시 사용 시 경고
- 권장 규칙 누락(`no-console`, `no-debugger`, `eqeqeq`, `no-unused-vars` 등) info 안내
- `extractRules` 정규식이 중첩 객체에 안전하도록 brace-balance 알고리즘 사용 (1.2.0 QA 후속)

## 4. 근거 (Rationale)

- **ConfigDeck 정체성 전환의 핵심**: ADR-0014에서 "설정 파일 생성기 → 설정 관리 허브"로의 전환을 차별화 핵심으로 명시
- **단기 ESLint v9 전환 수요 포착**: STR-0002/MI-0002에서 ESLint v9 flat config가 6개월 내 트래픽 레버로 식별됨 ([ESLint v9 announcement, 2024-04-05](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/))
- **Audit-only 진입점 가치**: Legacy 사용자만이 아니라 이미 flat config로 전환한 사용자도 "내 설정 괜찮은가?"라는 동기로 진입 가능. SEO 키워드 다양성 확보
- **클라이언트 완결성 유지**: 사용자 설정을 외부로 전송하지 않는다. 정적 사이트 아키텍처(ADR-0002/0004)와 부합하고 신뢰도 높임
- **공통 인터페이스 도입**: 도구별로 패턴을 통일함으로써 Prettier/TSConfig 추가 시 학습 비용 최소화. 1.2.0의 단발성 구현을 정형화

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|------|------|------|------|-----------|
| **Phase A/B/C 점진 확장 (현재 안)** | ESLint → 진단 분리 → Prettier/TSConfig | 1.2.0 자산 활용, 점진적 검증 | 다도구 확장에 시간 소요 | **채택** |
| 한 번에 ESLint+Prettier+TSConfig 출시 | 빅뱅 출시 | 마케팅 임팩트 큼 | 1인 운영 한계, 품질 리스크 | 불채택 |
| GitHub Repo URL 직접 입력 | URL → repo fetch → 분석 | UX 매끄러움 | CORS/private repo/API rate limit | 불채택 (Phase 외 후속 검토) |
| AI 기반 자연어 진단 ("이 설정의 문제점 알려줘") | LLM 호출 | 설명 풍부 | API 비용·외부 전송, 클라이언트 완결성 위배 | 불채택 |
| 자동 PR 생성 (GitHub OAuth) | 변환 결과를 PR로 직접 푸시 | 사용자 작업 0 | 인증 인프라 필요, 정적 아키텍처 위배 | 불채택 |

## 6. 실행 계획 (Execution Plan)

### 6.1 단계

| 단계 | Phase | 작업 | 산출물 | 선행 조건 |
|------|-------|------|--------|-----------|
| 1 | A | ESLint parser/migrator/auditor 구현 | src/lib/migration/* | - |
| 2 | A | MigrationPanel UI 통합 | MigrationPanel.svelte/astro | 1 |
| 3 | A | 단위 테스트 작성 | tests/unit/lib/migration/* | 1 |
| 4 | A | QA 후속 보정 (extractRules brace-balance, parser commonjs 보정, indent 통일) | 1.2.0 QA 사이클 | 3 |
| 5 | **B** | **공통 인터페이스 정형화** (`ConfigInspector`) ✅ | src/lib/migration/types.ts | 4 |
| 6 | **B** | **Audit-only 진입 동선 추가** ✅ | MigrationPanel 모드 분기 (허브 페이지는 10단계로 분리) | 5 |
| 7 | **B** | **E2E 테스트 보완** (마이그레이션 실패/성공 플로우) ✅ | tests/e2e/flows/migration-flow.spec.ts | 6 |
| 8 | C | Prettier inspector 구현 ✅ | src/lib/migration/prettier{Parser,Auditor,Migrator,Inspector}.ts | 5 |
| 9 | C | TSConfig inspector 구현 ✅ | src/lib/migration/tsconfig{Parser,Auditor,Migrator,Inspector}.ts | 5 |
| 10 | C | 도구 선택 허브 페이지 + SEO 메타 | src/pages/[locale]/migration/* | 6, 8, 9 |

### 6.2 마일스톤

- **M1 (1.2.0 — 완료)**: Phase A 완료. ESLint Legacy → Flat 마이그레이션 + 감사 + 단위 테스트
- **M2 (1.3.0 후보)**: Phase B 완료. 공통 인터페이스 + Audit-only 진입 + E2E 테스트
- **M3 (P0.5 60일)**: Phase C — Prettier/TSConfig inspector 추가 + 허브 페이지

### 6.3 확인 지점 (Checkpoints)

- [x] M1: 1.2.0 QA 통과 (2026-04-26 재검증 완료)
- [x] M2 시작 전: 공통 인터페이스(`ConfigInspector`) 설계 검토 → 사용자 승인 (2026-04-27, feature/1.3.0-config-inspector)
- [x] M2 완료 후: Audit-only 모드 UX 검토 (Q1 자동 변환 유지, Q2 모드 배지+안내문, Q3 권장 규칙 적용 허용 + 미리보기 한정 안내) — 2026-04-28, feature/1.3.0-audit-only
- [x] M2 머지 직전: 종합 QA 검증 통과 (단위 105/105, E2E 182 passed × 5 브라우저, 정적 분석 0 errors) — 2026-04-28, feature/1.3.0-qa, [QA v3 리포트](../../../qa/reports/2026-04-28-1.3.0-phase-b-qa-v3.md)
- [ ] M3 시작 전: Prettier·TSConfig deprecated 옵션·권장 규칙 데이터셋 출처 검토
- [ ] M3 완료 후: 허브 페이지 SEO 메타·구조화 데이터 검토 (seo-specialist 위임)

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| ESLint 플러그인 생태계가 빠르게 변해 매핑 노후화 | 변환 결과 부정확 | 매핑 테이블에 출처/검증일 명시. 사용자에게 "최종 확인일" 노출. 자동 업데이트 파이프라인 검토 |
| Prettier 3.x deprecated 옵션 데이터셋 확보 어려움 | Phase C 일정 지연 | 공식 [Prettier docs](https://prettier.io/docs/en/options.html)와 changelog를 1차 소스로 사용 |
| TSConfig 옵션 폭(80+개) | 데이터셋·UI 복잡도 | 핵심 30~40개로 시작 (compilerOptions 빈도 기반). SPEC-0001의 "주요/전체" 2단 패턴 재사용 |
| Audit 결과를 사용자가 신뢰할 수 있는가 | 잘못된 진단 시 신뢰도 추락 | 각 진단 항목에 공식 문서 링크 첨부. "이 진단이 부정확합니까?" 피드백 채널 |
| 클라이언트 완결성 위반 유혹(서버 호출) | 아키텍처 불일치 | ADR-0002/0004 위배. AI 통합 등은 별도 ADR 필요 |
| 1인 운영 — Phase C 일정 부담 | 출시 지연 | Phase B 분리로 점진 출시. Phase C는 트래픽 검증 후 결정 |

## 8. 성공 지표 (Success Metrics)

> ADR-0014의 KPI 추가 항목과 정렬한다.

| 지표 | M1(완료) | 30일 | 90일 | 비고 |
|------|---------|------|------|------|
| ESLint 마이그레이션 사용 수 | 측정 시작 | 100/월 | 500/월 | Migration 버튼 클릭 카운트 |
| Audit-only 모드 사용 수 | - | M2 후 측정 시작 | 200/월 | Phase B |
| Migration 진입 → 결과 복사 전환율 | 측정 시작 | 40% | 60% | 핵심 가치 전달 지표 |
| 마이그레이션 키워드 SEO 순위 | - | 색인 완료 | 10위 이내 | "eslint flat config migration" 등 |
| Prettier/TSConfig Audit 출시 | - | - | M3 출시 | Phase C 완료 여부 |

## 9. 참고 자료 (References)

- [ADR-0014: 성장 전략 로드맵](../../../decisions/records/ADR-0014-growth-strategy-roadmap.md) — Import & Audit 신설 근거
- [ADR-0016: E2E 테스트 검증 전략](../../../decisions/records/ADR-0016-e2e-validation-strategy.md) — 7단계 작업에서 도출한 디버깅·검증 운영 원칙
- [STR-0002: ConfigDeck 전략 보고서](../../../research/reports/STR-0002-configdeck-strategy-2026-04.md) — ESLint v9 전환 수요
- [MI-0002: 경쟁사 분석](../../../research/reports/MI-0002-competitor-analysis-2026-04.md) — 직접 경쟁자 부재
- [BA-0002: 경쟁력 분석](../../../research/reports/BA-0002-configdeck-competitiveness-2026-04.md) — Import & Audit 차별화 가치
- [ESLint v9.0.0 announcement](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) — flat config 정식 전환
- [ESLint Migration Guide: Configuration Files](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Prettier Options](https://prettier.io/docs/en/options.html) — Phase C 데이터셋 1차 소스
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig) — Phase C 데이터셋 1차 소스

## 10. 변경 이력 (Changelog)

| 날짜 | 변경 내용 | 변경자 |
| ---------- | ---------- | -------- |
| 2026-04-26 | 초안 작성. 1.2.0의 Phase A를 회수하고 Phase B/C 골격 정의 | jsg3121 |
| 2026-04-27 | §3.2.1 인터페이스 정형화 (Phase B 5단계 완료). MigrationResult.outputCode → output 리네임, AuditItem에 suggestion?/suggestionKo? 보강, ConfigInspector TModern 옵셔널화. 브랜치 feature/1.3.0-config-inspector | jsg3121 |
| 2026-04-28 | Audit-only 진입 동선 추가 (Phase B 6단계 완료). MigrationPanel에 panelMode 분기 도입, Flat config 입력 시 입력 그대로 미리보기 + audit-only 흐름. 모드 배지 + 안내문 + 권장 규칙 재적용 후 audit 재계산. 단위 테스트 4건 추가. 브랜치 feature/1.3.0-audit-only | jsg3121 |
| 2026-04-28 | E2E 테스트 보완 + Phase B 종합 QA 검증 완료 (Phase B 7단계 완료). migration-flow.spec.ts 신규(4 시나리오 × 5 브라우저). qa-agent v1→v2→v3 사이클로 차단 이슈 4건 fix(Q3-A 인라인 import 타입, Q3-B 'pre code' ARIA 셀렉터 + hydration 대기, Q3-C 사이트 header 셀렉터 구체화, Q3-D Prettier 포맷). E2E 운영 가이드 신규(.claude/qa/guides/e2e-execution.md). Phase B 마일스톤(M2) 완료, 1.3.0 main 머지 가능 판정. 브랜치 feature/1.3.0-qa | jsg3121 |
| 2026-04-29 | Prettier inspector 구현 (Phase C 8단계 완료). prettierParser/Auditor/Migrator/Inspector 신규. Prettier 3.0.0 릴리즈 노트 기반 데이터셋: jsxBracketSameLine→bracketSameLine 자동 변환, pluginSearchDirs 제거+경고, trailingComma 기본값 변경 info 안내. ESLint와 달리 객체 환원이 자연스러워 MigrationResult.config 필드를 채움. 단위 테스트 43건 추가(parser 17 + auditor 15 + migrator 11). 브랜치 feature/1.4.0-prettier-inspector | jsg3121 |
| 2026-04-29 | TSConfig inspector 구현 (Phase C 9단계 완료). tsconfigParser/Auditor/Migrator/Inspector 신규. TypeScript 공식 레퍼런스 기반 데이터셋: deprecated 9개(out, charset, suppressExcessPropertyErrors, importsNotUsedAsValues 등), 권장 옵션 14개(target/module/strict/skipLibCheck/noUncheckedIndexedAccess 등). migrate는 "권장값 적용" 동작(Q3 사용자 결정). extends 필드는 외부 fetch 없이 표면 분석만 + "extends된 옵션은 진단에 포함되지 않음" info 안내(Q1 사용자 결정). 모든 메시지를 단정적이지 않은 "권장합니다/검토하세요" 톤으로 통일하고 migrator output 헤더에 "권장값 기반 결과 — 검토 후 적용" 안내 주석 + warnings 첫 항목으로 일반 경고 추가(사용자 합의 — TSConfig는 정답이 아닌 권장형이므로 사용자 혼동 방지). 단위 테스트 47건 추가(parser 19 + auditor 15 + migrator 13). 브랜치 feature/1.4.0-tsconfig-inspector | jsg3121 |

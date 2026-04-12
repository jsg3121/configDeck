---
id: SPEC-0001
title: 파일 옵션 생성기 기능 보강 — 입력 타입 확장 및 옵션 범위 확대
status: 승인됨
owner: jsg3121
created: 2026-04-09
updated: 2026-04-09
related_adrs:
  - ADR-0008
related_specs: []
---

# SPEC-0001: 파일 옵션 생성기 기능 보강 — 입력 타입 확장 및 옵션 범위 확대

## 1. 배경 (Background)

### 1.1 현재 상태

ConfigDeck의 파일별 생성기는 [src/lib/data/files.ts](../../../../src/lib/data/files.ts)에서 정의된 옵션 스키마를 기반으로 [src/components/generator/OptionForm.svelte](../../../../src/components/generator/OptionForm.svelte)가 UI를 렌더링한다.

- 옵션 입력 타입은 [src/types/generator.ts:13](../../../../src/types/generator.ts#L13)에 `OptionInputType = 'radio' | 'checkbox'`로만 정의되어 있다
- `OptionField`는 `{ label, value, checked }` 구조로 boolean 선택 상태만 표현한다
- 각 파일이 지원하는 옵션 수가 실제 파일 스펙 대비 극히 일부에 불과하다
- 프리셋 값은 [src/lib/schemas/](../../../../src/lib/schemas/) 하위의 `getXxxPresetDefaults` 함수에 하드코딩되어 있다

### 1.2 문제점

#### 문제 1: 입력 방식 제한 — radio/checkbox 2종뿐

실제 설정 파일 옵션은 다양한 입력 타입을 요구한다.

| 파일 | 옵션 예시 | 필요한 입력 타입 | 현재 표현 |
|---|---|---|---|
| Prettier | `printWidth` | number (기본 80) | 표현 불가 |
| Prettier | `tabWidth` | number (기본 2) | 표현 불가 |
| Prettier | `endOfLine` | select ('lf' \| 'crlf' \| 'cr' \| 'auto') | 표현 불가 |
| Prettier | `arrowParens` | select ('always' \| 'avoid') | 표현 불가 |
| TSConfig | `target` | select ('ES5'~'ESNext' 등 15+개) | 표현 불가 |
| TSConfig | `paths` | key-value map (`@/*` → `["src/*"]`) | 표현 불가 |
| TSConfig | `lib` | tags (문자열 배열) | 표현 불가 |
| TSConfig | `outDir` | text | 표현 불가 |

현재 구조로는 사용자가 실제로 원하는 값을 입력할 수 없고, 옵션이 존재해도 "켜기/끄기"로만 표현되어 정보가 손실된다.

#### 문제 2: 지원 옵션 범위가 전체 스펙의 극히 일부

| 파일 | 현재 지원 | 실제 공식 옵션 수 | 커버리지 |
|---|---|---|---|
| Prettier | 3개 | 약 20개 | ~15% |
| TSConfig | 3개 | 약 80개 (compilerOptions 기준) | ~4% |
| ESLint | 4 rules | 핵심 rule 280+ + 플러그인 수천 | <1% |
| Vite | 3개 | 다수 | 낮음 |

결과적으로 사용자는 ConfigDeck에서 생성한 파일을 받은 뒤에도 수동 편집이 필요하며, 이는 "설정 파일을 빠르게 만들어주는 도구"라는 서비스 핵심 가치를 훼손한다.

### 1.3 사용자 요구

사용자는 다음을 요구했다:

1. 입력 방식을 더 자유롭게 만들어, 체크박스뿐 아니라 radio/select/number 등 옵션 형식에 맞는 입력을 제공할 것
2. 각 파일이 실제로 지원하는 옵션을 모두 지원할 것
3. 옵션이 많은 파일은 실무에서 자주 쓰는 주요 옵션을 프리셋으로 빠르게 선택할 수 있게 할 것

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

- 옵션 입력 타입을 확장해 실제 파일 스펙과 1:1 매핑 가능한 UI 제공 (radio, checkbox, select, number, text, tags, key-value)
- "주요 옵션 + 전체 옵션" 2단 구조로 초보자 친화성과 파워유저 커버리지를 동시에 확보
- 각 파일의 옵션을 "실무에서 자주 쓰이는 것"을 근거 기반으로 선별해 주요 옵션으로 지정
- 실무 프리셋을 데이터로 분리하고 근거 링크를 포함해 신뢰도 확보
- 옵션 수 증가에 대비한 옵션 검색(`Ctrl+K`) 기능 제공
- **모든 옵션 항목에 짧은 설명(툴팁/안내 문구) 제공** — 사용자가 옵션 의미를 즉시 파악할 수 있도록 `description` 필드를 필수화하고 UI에 노출
- 9개 파일을 하나씩 순차적으로 마이그레이션하며, 각 파일 완료 시점마다 사용자 확인 획득

### 2.2 다루지 않는 것 (Out of Scope)

- **옵션 상태 URL 직렬화 및 공유 링크** — 별도 SPEC으로 분리. 이번 범위는 입력/렌더링 확장에 집중한다
- **스택별 생성기(`/generator/{stack-name}`)의 옵션 확장** — 파일별 생성기 마이그레이션 완료 후 별도 작업
- **ESLint 전체 rule 지원** — 핵심 rule 30~50개 + 주요 프리셋(Airbnb/Standard/Next.js) 중심으로 제한. 전체 rule 지원은 비현실적
- **직접 JSON 편집 탭** — 검토 후 필요 시 별도 SPEC
- **옵션 간 자동 의존성 추론** — 이번 범위는 기본적인 `normalize()` 수준만. 고도화된 의존성 그래프는 후속 작업

## 3. 제안 (Proposal)

### 3.1 개요

3축으로 기능을 보강한다.

1. **타입 확장**: `OptionInputType`을 판별 유니온(Discriminated Union)으로 재설계해 radio/checkbox 외 5가지 타입을 추가한다
2. **데이터 분리**: 파일별 옵션 정의를 `src/lib/data/options/` 하위로 분리하고, 각 파일의 주요 옵션과 전체 옵션을 `tier` 메타로 구분한다
3. **UI 확장**: 옵션 컨트롤을 서브컴포넌트로 분리하고, `OptionForm.svelte`는 디스패처 역할만 수행한다. "전체 옵션 보기" 토글과 옵션 검색을 추가한다

마이그레이션은 파일 단위로 점진 진행하며, 각 파일마다 외부 레퍼런스 조사를 통해 "주요 옵션"을 근거 기반으로 선정한다.

### 3.2 상세 설계

#### A. 옵션 입력 타입 확장

| 타입 | 설명 | 사용 예 |
|---|---|---|
| `radio` | 단일 선택 (기존) | ESLint language |
| `checkbox` | 단일 boolean (기존) | Prettier `semi` |
| `select` | 드롭다운 단일 선택 (옵션 多) | TSConfig `target`, Prettier `endOfLine` |
| `number` | 숫자 입력 + min/max/step | Prettier `printWidth`, `tabWidth` |
| `text` | 문자열 입력 | TSConfig `outDir`, `baseUrl` |
| `tags` | 문자열 배열 입력 (칩 UI) | TSConfig `lib`, `types`, `include` |
| `key-value` | 키-값 쌍 리스트 | TSConfig `paths` |

판별 유니온 설계:

```ts
// src/types/generator.ts
export type OptionControl =
  | RadioControl
  | CheckboxControl
  | SelectControl
  | NumberControl
  | TextControl
  | TagsControl
  | KeyValueControl

export interface BaseControl {
  key: string              // 옵션 식별자 (직렬화 시 사용)
  label: string            // UI 라벨 (ko/en locale별)
  labelEn: string
  description: string      // 필수: 옵션 의미를 설명하는 짧은 안내 문구 (툴팁/보조 텍스트로 노출)
  descriptionEn: string    // 필수: 영문 설명
  tier: 'core' | 'advanced'  // 주요/전체 옵션 구분
  rationale?: string       // "주요"로 선정한 근거 (선정 이유 + 출처)
  docsUrl?: string         // 공식 문서 링크
}

export interface NumberControl extends BaseControl {
  type: 'number'
  default: number
  min?: number
  max?: number
  step?: number
  unit?: string
}

// ... 나머지 타입도 동일한 패턴
```

> **Why 판별 유니온:** 타입별로 필요한 필드가 다르므로 판별 유니온으로 컴파일 타임 안전성을 확보한다. ([TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions))

#### B. 옵션 스키마/데이터 분리 구조

```
src/lib/data/
├── files.ts                    # 파일 메타 (slug, fileName, 설명)만 유지
└── options/
    ├── index.ts                # slug → 옵션 정의 맵
    ├── eslint.ts
    ├── prettier.ts
    ├── tsconfig.ts
    ├── tsconfig-lib-values.ts  # lib 옵션의 선택지 목록
    └── ...
src/lib/data/presets/
    ├── index.ts
    ├── prettier-default.ts
    ├── tsconfig-nextjs.ts
    └── ...
```

프리셋은 데이터로 분리하고 각 프리셋에 `source: string` 필드로 근거 링크를 포함한다.

> **Why 분리:** Progressive Disclosure 원칙(CLAUDE.md)에 따라 각 파일을 500줄 이하로 유지한다. 데이터가 한 파일에 몰리면 유지보수가 불가능하다.

#### C. "주요 옵션 + 전체 옵션" 2단 표시

```
┌─ Compiler Options ────────────────┐
│ 주요 옵션                          │
│  • target          [ES2022 ▾]     │
│  • module          [ESNext ▾]     │
│  • strict          [✓]            │
│                                    │
│ ▸ 전체 옵션 보기 (47개)            │
└───────────────────────────────────┘
```

- 초기 상태: 주요 옵션만 펼침, 전체 옵션 접힘
- "전체 옵션 보기" 클릭 시 나머지 옵션이 아코디언 하위 섹션별로 펼쳐짐
- 모든 옵션이 DOM에 렌더링되어 SEO 인덱싱 가능 ([Google Search Central: Hidden content](https://developers.google.com/search/blog/2014/12/are-you-hiding-from-googlebot))
- 옵션 검색(`Ctrl+K`) 지원: 전체 옵션 중 이름/설명 기반 검색

#### D. 주요 옵션 선정 프로세스 (근거 기반)

각 파일의 마이그레이션 단계에서 다음 절차로 주요 옵션을 선정한다:

1. 공식 문서의 "Recommended" / "Common" 섹션 조사
2. 주요 프리셋(Next.js, Vite, Astro, Airbnb, Standard 등)이 명시적으로 설정하는 옵션 수집
3. State of JS, npm trends 등 실사용 통계 참고
4. GitHub 이슈/Stack Overflow에서 자주 언급되는 옵션 수집
5. 수집 결과를 종합해 "주요" 후보 선정
6. 각 주요 옵션의 `rationale` 필드에 선정 근거와 출처를 기록

> **Why 근거 기반:** CLAUDE.md의 "근거 기반 논의" 원칙을 따른다. "주요"의 기준이 주관에 휘둘리면 나중에 재검토할 때 판단 기준이 사라진다.

#### E. UI 컴포넌트 분리

```
src/components/generator/controls/
├── RadioControl.svelte
├── CheckboxControl.svelte
├── SelectControl.svelte
├── NumberControl.svelte
├── TextControl.svelte
├── TagsControl.svelte
└── KeyValueControl.svelte
```

[src/components/generator/OptionForm.svelte](../../../../src/components/generator/OptionForm.svelte)는 `control.type`을 판별해 해당 서브컴포넌트를 렌더링하는 디스패처 역할만 수행한다.

**옵션 설명 UX**: 모든 컨트롤 컴포넌트는 `description`을 다음 중 하나의 방식으로 노출한다.

- **기본**: 라벨 아래 작은 보조 텍스트(muted) — 항상 표시
- **보완**: 라벨 우측에 `?` 아이콘 — 호버/포커스 시 툴팁 표시 (`docsUrl`이 있으면 "자세히 보기" 링크 포함)
- 접근성: 툴팁은 `aria-describedby`로 input과 연결. 키보드 포커스로도 접근 가능해야 한다

> **Why:** 옵션이 80개씩 되는 파일에서 사용자는 옵션명만 보고 의미를 파악하기 어렵다. 설명이 항상 보이면 길이 때문에 스크롤 부담이 커지고, 툴팁만 있으면 모바일 환경에서 접근성이 떨어진다. "기본 보조 텍스트 + 선택적 툴팁" 조합이 두 요구를 모두 충족한다.

#### F. 생성기 로직 대응

[src/lib/generators/](../../../../src/lib/generators/)의 각 생성기는 다음 변경이 필요하다:

1. **값 직렬화 공통 유틸**: JSON/JS/INI/dotenv 포맷별 직렬화 함수
2. **기본값 생략**: 사용자가 선택한 값이 기본값과 같으면 출력 생략
3. **기본적 정규화**: `normalize(options)` 함수로 모순되는 옵션 조합 해결 (예: `jsx` 없이 `jsxImportSource` 설정 불가)

### 3.3 사용자 플로우

1. 사용자가 `/generator/tsconfig` 진입
2. 좌측 패널에 주요 옵션(예: 10개)이 먼저 보임
3. 프리셋 버튼("Next.js", "Vite + React" 등)으로 빠른 설정 가능
4. 전문가는 "전체 옵션 보기 (70개)" 클릭으로 모든 옵션 접근
5. 특정 옵션 찾기 어려우면 `Ctrl+K`로 검색
6. 옵션 변경 시 우측 미리보기 즉시 업데이트
7. 다운로드 버튼으로 완성된 파일 저장

## 4. 근거 (Rationale)

### 4.1 B안(주요 + 전체) 선택 근거

- **인지 부하**: 초보자에게 80개 옵션을 동시 노출하면 이탈률 상승. Nielsen Norman Group의 [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) 원칙
- **SEO**: 모든 옵션이 DOM에 존재하면 접힌 상태여도 Google이 인덱싱 ([Google Search Central: Hidden content and accessibility](https://developers.google.com/search/blog/2014/12/are-you-hiding-from-googlebot))
- **레퍼런스**: [PureDevTools TSConfig Generator](https://puredevtools.tools/tsconfig-generator/)가 "Show all options" 방식으로 동일 전략 채택

### 4.2 판별 유니온 선택 근거

- [TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions): 타입별 필드가 다른 경우 컴파일 타임 안전성 확보를 위한 표준 패턴
- 대안인 "optional 필드가 많은 단일 interface"는 any에 가까워지고 타입 가드 없이 안전하게 사용 불가

### 4.3 데이터 분리 근거

- CLAUDE.md의 Progressive Disclosure 원칙: 문서와 코드 모두 500줄 이하 유지
- 현재 `files.ts`가 440줄. 옵션 확장 후 단일 파일 유지 시 수천 줄 예상

### 4.4 점진 마이그레이션 근거

- 사용자가 명시적으로 요청: 파일 하나씩 완료 후 확인
- 리스크 관리: 파일 하나의 마이그레이션이 실패해도 다른 파일에 영향 없음
- 피드백 반영: 초기 파일에서 발견된 구조 문제를 후속 파일에 즉시 반영

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|---|---|---|---|---|
| A. 전체 옵션 모두 노출 | tier 구분 없이 모든 옵션 펼침 | 숨겨진 옵션이 없음, SEO 극대화 | 인지 부하 과다, 이탈률 증가 | 불채택 |
| B. 주요 + 전체 2단 (채택) | 주요 옵션만 기본 노출, 전체는 토글 | 인지 부하 감소 + SEO 유지 | 선정 기준 관리 필요 | **채택** |
| C. 주요만 + JSON 직접 편집 | 주요 옵션 UI + 나머지는 JSON 편집 탭 | 구현 단순 | 파워유저에게 불편, SEO 불리 | 불채택 |
| D. 단일 interface (판별 유니온 대신) | `OptionField`에 모든 필드 추가 (optional) | 구현 단순 | 타입 안전성 손실, any 유사 | 불채택 |
| E. 한 번에 재작성 (점진 대신) | 모든 파일 옵션을 한 PR로 재작성 | 일관성 확보 | 리스크 과다, 피드백 반영 불가 | 불채택 |

## 6. 실행 계획 (Execution Plan)

### 6.1 단계

| 단계 | 작업 | 산출물 | 선행 조건 |
|---|---|---|---|
| 1 | 타입 설계: `OptionControl` 판별 유니온 | `src/types/generator.ts` 갱신 | - |
| 2 | 데이터 디렉터리 구조 생성 | `src/lib/data/options/index.ts`, `src/lib/data/presets/index.ts` | 1 |
| 3 | UI 컨트롤 서브컴포넌트 구현 | `src/components/generator/controls/*.svelte` 7종 | 1 |
| 4 | `OptionForm.svelte` 디스패처 전환 | OptionForm 리팩터링 | 3 |
| 5 | 공통 직렬화 유틸 | `src/lib/generators/serialize.ts` | 2 |
| 6 | "전체 옵션 보기" 토글 + 옵션 검색 UI | `OptionForm` 확장 | 4 |
| 7 | **파일 마이그레이션 (순차)** | 파일당: options 정의, presets 정의, generator 갱신, 테스트 | 1~6 |
| 8 | 마이그레이션 완료 후 기존 `files.ts`/`schemas/` 정리 | legacy 코드 제거 | 7 |

### 6.2 파일 마이그레이션 순서

단순한 것부터 복잡한 것 순으로 진행하며, 가장 복잡한 ESLint는 다른 파일 마이그레이션에서 얻은 경험을 바탕으로 **맨 마지막**에 진행한다.

1. **Prettier** (옵션 적음, 구조 단순 → 새 구조 검증에 적합)
2. **EditorConfig** (옵션 매우 적음, INI 포맷 검증)
3. **TSConfig** (옵션 많음, `tags`/`key-value`/`select` 고급 입력 타입 검증)
4. **Vite Config** (플러그인 함수 호출 직렬화 검증)
5. **Vitest Config** (Vite 기반, 중첩 객체 검증)
6. **Next.js Config** (함수형 옵션 처리)
7. **.gitignore** (섹션 템플릿 조합)
8. **.env.example** (카테고리별 변수 + 주석 생성)
9. **ESLint** (rule + 프리셋 복잡, 가장 마지막 — 앞선 8개 파일의 구조 검증 완료 후 진행)

### 6.3 마일스톤

- **M1**: 인프라 구축 완료 (타입/데이터 구조/UI 컨트롤/직렬화 유틸)
- **M2**: Prettier 마이그레이션 완료 (첫 번째 파일, 구조 검증)
- **M3**: EditorConfig 마이그레이션 완료 (INI 포맷 검증)
- **M4**: TSConfig 마이그레이션 완료 (고급 입력 타입 검증)
- **M5**: Vite Config 마이그레이션 완료
- **M6**: Vitest Config 마이그레이션 완료
- **M7**: Next.js Config 마이그레이션 완료
- **M8**: .gitignore 마이그레이션 완료
- **M9**: .env.example 마이그레이션 완료
- **M10**: ESLint 마이그레이션 완료 (가장 복잡한 파일)
- **M11**: legacy 코드 정리 및 최종 검증

### 6.4 확인 지점 (Checkpoints)

사용자 확인이 필요한 지점 — 에이전트는 이 지점에서 반드시 멈춘다.

- [ ] M1 완료 후: 인프라 구조 검토 및 Prettier 착수 승인
- [ ] 각 파일 마이그레이션 완료 시: 작업 내용 정리 및 다음 파일 착수 승인 (사용자 명시 요청)
- [ ] ESLint 마이그레이션 전: 주요 rule 목록과 프리셋 범위 승인
- [ ] legacy 코드 정리 전: 제거 대상 목록 승인

### 6.5 파일 마이그레이션 작업 단위 (파일당)

각 파일 마이그레이션은 다음 단계를 포함한다:

1. **사전 조사 (간략)**: 해당 파일/기술의 공식 옵션 카탈로그를 가볍게 파악하는 단계. **보고서를 작성하지 않고**, 다음 항목만 확인해 작업자가 맥락을 잡는 용도로 사용한다.
   - 공식 문서에서 제공하는 전체 옵션 목록과 대략적 개수
   - 각 옵션의 간단한 용도 (한 줄 수준)
   - 기본값과 대표적인 값 선택지
   - 주요 프리셋/템플릿이 어떤 옵션을 사용하는지 훑어보기
   > **Why:** 옵션 정의를 작성하기 전에 전체 스펙을 먼저 훑어야 "어떤 옵션이 핵심이고, 어떤 입력 타입이 맞는지" 판단할 수 있다. 다만 이 단계는 리서치 보고서가 아닌 작업자의 사전 이해이므로 별도 산출물로 남기지 않는다.
2. **주요 옵션 선정**: 사전 조사를 바탕으로 공식 문서 Recommended 섹션, 주요 프리셋 사용 여부, 실사용 통계를 근거로 `tier: 'core'` 옵션을 선정한다. 각 core 옵션의 `rationale` 필드에 선정 근거와 출처를 기록한다
3. **옵션 정의 작성**: `src/lib/data/options/{file}.ts`. 모든 옵션에 `description`(ko/en) 필수 작성 — UI 툴팁/안내 문구로 노출됨
4. **프리셋 작성**: `src/lib/data/presets/{file}-*.ts` (각 프리셋에 `source` 근거 링크 필수)
5. **생성기 갱신**: `src/lib/generators/{file}Generator.ts`를 새 구조로 갱신. 공통 직렬화 유틸 활용
6. **파일 메타/연결**: `src/lib/data/files.ts`의 legacy 필드 제거, `options/index.ts`·`presets/index.ts`에 등록
7. **테스트**: 생성 결과가 공식 스펙에 맞는지 검증 (빌드/타입체크/수동 검증)
8. **기존 코드 제거**: 해당 파일의 legacy 스키마(`src/lib/schemas/{file}Schema.ts`) 제거
9. **작업 보고**: 사용자에게 작업 내용 정리 보고 및 다음 파일 착수 확인. SPEC-0001의 해당 마일스톤 체크박스 업데이트

### 6.6 상세 페이즈 계획 및 진행 체크리스트

각 페이즈 완료 시 해당 체크박스에 표시한다. 이 체크리스트가 이번 기획의 **진행 상황 추적 단일 소스**이다.

#### M1. 인프라 구축

- [x] **Phase 1.1** — `OptionControl` 판별 유니온 및 타입 시스템 설계 ([src/types/generator.ts](../../../../src/types/generator.ts))
- [x] **Phase 1.2** — 데이터 디렉터리 구조 생성 (`src/lib/data/options/`, `src/lib/data/presets/`), 동적 import 맵 준비
- [x] **Phase 1.3** — UI 컨트롤 서브컴포넌트 7종 구현 (`src/components/generator/controls/*.svelte`)
- [x] **Phase 1.4** — `OptionForm.svelte` 디스패처 전환 + legacy 어댑터 함수 추가 (기존 9개 파일 회귀 없음 확인)
- [x] **Phase 1.5** — 공통 직렬화 유틸 (`src/lib/generators/serialize.ts`: JSON/JS/INI/dotenv + `omitDefaults`)
- [x] **Phase 1.6** — "전체 옵션 보기" 토글 + 옵션 검색(`Ctrl+K`) UI
- [x] **✅ M1 완료 Checkpoint**: 인프라 전체 검토, 회귀 테스트, Phase 2(Prettier) 착수 승인

#### M2. Prettier 마이그레이션

- [x] **Phase 2.1** — Prettier 공식 옵션 사전 조사 (core 8개 / advanced 10개 선정)
- [x] **Phase 2.2** — `src/lib/data/options/prettier.ts` 옵션 정의 작성 (18개 옵션, description/docsUrl 포함)
- [x] **Phase 2.3** — `src/lib/data/presets/prettier.ts` 프리셋 4종 작성 (Prettier Default, Standard JS, Airbnb-like, Minimal)
- [x] **Phase 2.4** — [src/lib/generators/prettierGenerator.ts](../../../../src/lib/generators/prettierGenerator.ts) 갱신 (기본값 생략 로직)
- [x] **Phase 2.5** — 파일 메타/연결 업데이트 + `schemas/index.ts` 신규 프리셋 분기 추가
- [x] **Phase 2.6** — 테스트 및 검증 (타입 체크 + 린트 + 빌드 35페이지 통과)
- [x] **✅ M2 완료 Checkpoint**: 작업 보고 + M3(EditorConfig) 착수 승인

#### M3. EditorConfig 마이그레이션

- [x] **Phase 3.1** — EditorConfig 공식 스펙 사전 조사 (8개 속성 파악)
- [x] **Phase 3.2** — 주요 옵션 선정 (core 6개 / advanced 2개)
- [x] **Phase 3.3** — `src/lib/data/options/editorconfig.ts` 옵션 정의 작성 (8개 옵션, description/docsUrl 포함)
- [x] **Phase 3.4** — `src/lib/data/presets/editorconfig.ts` 프리셋 4종 작성 (Standard, Tabs, 4-Space, Minimal)
- [x] **Phase 3.5** — `src/lib/generators/editorconfigGenerator.ts` 갱신 (touched 키만 출력, markdown 예외 섹션)
- [x] **Phase 3.6** — 파일 메타/연결 + `schemas/index.ts` legacy 분기 제거
- [x] **Phase 3.7** — 테스트 및 검증 (타입 체크 + 빌드 35페이지 통과)
- [x] **✅ M3 완료 Checkpoint**: 작업 보고 + M4(TSConfig) 착수 승인

#### M4. TSConfig 마이그레이션 (핵심)

- [x] **Phase 4.1** — TSConfig 사전 조사 (약 80개 compilerOptions 파악)
- [x] **Phase 4.2** — 주요 옵션 선정 (core 13개 / advanced 12개 = 25개, 7��� 섹션)
- [x] **Phase 4.3** — `src/lib/data/options/tsconfig.ts` 옵션 정의 작성 (tags, key-value, text 등 다양한 입력 타입 활용)
- [x] **Phase 4.4** — `src/lib/data/presets/tsconfig.ts` 프리셋 6종 (Node 20, React+Vite, Next.js, Astro, Library, Strict)
- [x] **Phase 4.5** — `src/lib/generators/tsconfigGenerator.ts` 재작성 (touched 키만 출력, paths 배열 래핑, include/exclude 최상위)
- [x] **Phase 4.6** — 파일 메타/연결 + `schemas/index.ts` legacy 분기 제거
- [x] **Phase 4.7** — 테스트 및 검증 (타입 체크 + 빌드 35페이지 통과)
- [ ] **✅ M4 완료 Checkpoint**: 작업 보고 + M5(Vite) 착수 승인

#### M5. Vite Config 마이그레이션

- [x] **Phase 5.1~5.2** — Vite 공식 옵션 조사 + 주요 옵션 선정 (core 4개 / advanced 7개 = 11개, 4개 섹션)
- [x] **Phase 5.3** — `src/lib/data/options/vite.ts` 옵션 정의 (프레임워크, 경로, 서버, 빌드)
- [x] **Phase 5.4** — `src/lib/data/presets/vite.ts` 프리셋 4종 (React, Vue, Svelte, Minimal)
- [x] **Phase 5.5** — `src/lib/generators/viteGenerator.ts` 재작성 (플러그인 import, server/build 중첩 객체)
- [x] **Phase 5.6** — 파일 메타/연결 + `schemas/index.ts` legacy 분기 제거
- [x] **Phase 5.7** — 빌드 35페이지 통과
- [ ] **✅ M5 완료 Checkpoint**: 작업 보고 + M6(Vitest) 착수 승인

#### M6. Vitest Config 마이그레이션

- [x] **Phase 6.1~6.2** — Vitest 옵션 조사 + 주요 옵션 선정 (core 4개 / advanced 9개 = 13개, 4개 섹션)
- [x] **Phase 6.3** — `src/lib/data/options/vitest.ts` 옵션 정의 (환경, 파일매칭, 커버리지, 실행)
- [x] **Phase 6.4** — `src/lib/data/presets/vitest.ts` 프리셋 4종 (React, Node, Vue, Minimal)
- [x] **Phase 6.5** — `src/lib/generators/vitestGenerator.ts` 재작성 (test 중첩, coverage 하위 객체)
- [x] **Phase 6.6** — 파일 메타/연결 + `schemas/index.ts` legacy 분기 제거
- [x] **Phase 6.7** — 빌드 35페이지 통과
- [ ] **✅ M6 완료 Checkpoint**: 작업 보고 + M7(Next.js) 착수 승인

#### M7. Next.js Config 마이그레이션

- [ ] **Phase 7.1** — Next.js config 사전 조사
- [ ] **Phase 7.2** — 주요 옵션 선정
- [ ] **Phase 7.3** — 옵션 정의 작성
- [ ] **Phase 7.4** — 프리셋 작성
- [ ] **Phase 7.5** — 생성기 갱신 (함수형 옵션 처리)
- [ ] **Phase 7.6** — 파일 메타/연결 + legacy 스키마 제거
- [ ] **Phase 7.7** — 테스트 및 검증
- [ ] **✅ M7 완료 Checkpoint**: 작업 보고 + M8(.gitignore) 착수 승인

#### M8. .gitignore 마이그레이션

- [ ] **Phase 8.1** — .gitignore 패턴 사전 조사 (OS/IDE/프레임워크별)
- [ ] **Phase 8.2** — 주요 섹션 선정
- [ ] **Phase 8.3** — 옵션 정의 작성
- [ ] **Phase 8.4** — 프리셋 작성
- [ ] **Phase 8.5** — 생성기 갱신 (섹션 템플릿 조합)
- [ ] **Phase 8.6** — 파일 메타/연결 + legacy 스키마 제거
- [ ] **Phase 8.7** — 테스트 및 검증
- [ ] **✅ M8 완료 Checkpoint**: 작업 보고 + M9(.env.example) 착수 승인

#### M9. .env.example 마이그레이션

- [ ] **Phase 9.1** — .env.example 관행 사전 조사
- [ ] **Phase 9.2** — 주요 카테고리 선정
- [ ] **Phase 9.3** — 옵션 정의 작성
- [ ] **Phase 9.4** — 프리셋 작성
- [ ] **Phase 9.5** — 생성기 갱신 (카테고리별 변수 + 주석)
- [ ] **Phase 9.6** — 파일 메타/연결 + legacy 스키마 제거
- [ ] **Phase 9.7** — 테스트 및 검증
- [ ] **✅ M9 완료 Checkpoint**: 작업 보고 + M10(ESLint) 착수 승인

#### M10. ESLint 마이그레이션 (가장 복잡, 마지막)

- [ ] **Phase 10.0** — ESLint 범위 결정: 핵심 rule 30~50개 후보 + 프리셋 목록 — **Checkpoint**: 범위 및 프리셋 사용자 승인
- [ ] **Phase 10.1** — ESLint 사전 조사 (core rules, Flat config 구조)
- [ ] **Phase 10.2** — 주요 rule 선정 및 근거 기록
- [ ] **Phase 10.3** — 옵션 정의 작성
- [ ] **Phase 10.4** — 프리셋 작성 (`eslint:recommended`, Airbnb, Standard, Next.js, TypeScript Strict)
- [ ] **Phase 10.5** — 생성기 갱신 (Flat config 9+ 기준)
- [ ] **Phase 10.6** — 파일 메타/연결 + legacy 스키마 제거
- [ ] **Phase 10.7** — 테스트 및 검증
- [ ] **✅ M10 완료 Checkpoint**: 작업 보고 + M11(Legacy 정리) 착수 승인

#### M11. Legacy 정리 및 최종 검증

- [ ] **Phase 11.1** — 제거 대상 목록 작성 — **Checkpoint**: 제거 목록 사용자 승인
  - `OptionField`, 기존 `OptionSection`, `OptionInputType` ([src/types/generator.ts](../../../../src/types/generator.ts))
  - `FileGenerator.svelte`의 legacy 어댑터 함수
  - [src/lib/data/files.ts](../../../../src/lib/data/files.ts)의 legacy 필드
  - `src/lib/schemas/` 잔여 파일
- [ ] **Phase 11.2** — 제거 실행 (빌드/타입 통과 확인하며 순차 제거)
- [ ] **Phase 11.3** — 최종 검증 (전체 9개 파일 생성기 수동 테스트)
- [ ] **✅ M11 완료 Checkpoint**: SPEC-0001 상태를 `완료`로 업데이트, Changelog 마무리

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|---|---|---|
| 주요 옵션 선정 기준의 주관 개입 | 사용자 가치 저하, 재작업 | 근거 기반 선정 프로세스 강제, `rationale` 필드 필수 |
| 옵션 수 증가로 인한 번들 크기 증가 | 초기 로딩 속도 저하 | 파일별 옵션을 동적 import로 코드 분할 검토 |
| 점진 마이그레이션 중 legacy와 신규 구조 공존 | 중복 코드, 일관성 저하 | 파일 완료 시점에 즉시 legacy 제거, 공존 기간 최소화 |
| 판별 유니온으로 인한 기존 OptionForm 리팩터 범위 과다 | 회귀 버그 | 단계 3~4에서 디스패처 구조를 먼저 완성하고, 기존 radio/checkbox부터 새 구조로 변환 후 파일 마이그레이션 착수 |
| ESLint rule 범위 결정 난이도 | 범위 무한 확장 | "핵심 rule 30~50개 + 주요 프리셋" 상한 고정, ESLint 단계에서 사용자 확인 |

## 8. 성공 지표 (Success Metrics)

- **옵션 커버리지**: 각 파일별 공식 옵션 대비 지원 옵션 비율
  - Prettier: ≥ 90%
  - TSConfig: ≥ 60% (전체), 주요 옵션 15~20개
  - ESLint: 핵심 rule 30~50개 + 주요 프리셋 4개 이상
- **입력 타입 커버리지**: 7종 모두 실제 사용
- **프리셋 근거 기록률**: 모든 프리셋에 `source` 링크 포함 (100%)
- **주요 옵션 근거 기록률**: 모든 `tier: 'core'` 옵션에 `rationale` 포함 (100%)
- **빌드/테스트 통과**: 각 파일 마이그레이션 후 빌드와 생성 결과 검증 통과

## 9. 참고 자료 (References)

- [ADR-0008: 옵션 입력 타입 확장 및 옵션 정의 분리](../../../decisions/records/ADR-0008-option-schema-redesign.md) — 이 기획서의 기술적 의사결정
- [ADR-0007: 페이지 구조 재설계](../../../decisions/records/ADR-0007-page-structure-redesign.md) — 생성기 페이지 구조 선행 결정
- [TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Nielsen Norman Group - Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [Google Search Central - Hidden content and crawling](https://developers.google.com/search/blog/2014/12/are-you-hiding-from-googlebot)
- [PureDevTools TSConfig Generator](https://puredevtools.tools/tsconfig-generator/) — "Show all options" UX 레퍼런스
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)

## 10. 변경 이력 (Changelog)

| 날짜       | 변경 내용                                                                           | 변경자  |
|------------|-------------------------------------------------------------------------------------|---------|
| 2026-04-09 | 초안 작성 및 승인                                                                   | jsg3121 |
| 2026-04-09 | 페이즈 체크리스트(6.6) 추가, ESLint 마지막 순서로 변경, 사전조사/툴팁 요구사항 반영 | jsg3121 |

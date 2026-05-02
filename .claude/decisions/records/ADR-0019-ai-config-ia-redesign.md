# ADR-0019: AI Config IA 재설계 — 카탈로그 + 통합 생성기 분리, URL 파라미터 컨텍스트 전달

- 상태: 승인됨
- 날짜: 2026-05-01
- 의사결정자: jsg3121

## 맥락 (Context)

SPEC-0005 §5에서 초기 결정은 다음과 같았다:

- `/ai-config` = 통합 생성기 (부모 페이지)
- `/ai-config/cursor`, `/ai-config/agents-md` 등 5개 = SEO용 도구별 랜딩 (자식 페이지)

2026-05-01 기준 5개 SEO 랜딩 페이지(`/ai-config/cursor`, `/ai-config/agents-md`, `/ai-config/copilot`, `/ai-config/claude-code`, `/ai-config/agent-skills`)의 구현이 완료된 시점에서 IA를 재검토한 결과, 다음 두 가지 문제가 발견되었다.

### 문제 1: 부모-자식 IA 위계 역전

일반적인 IA 패턴에서 부모 페이지는 카탈로그/개요 역할을, 자식 페이지는 상세 역할을 담당한다. 그러나 현재 구조는 이를 역전하고 있다:

- 부모(`/ai-config`): 복잡한 인터랙티브 생성기 (4단계 입력 + 미리보기 + 다운로드)
- 자식(`/ai-config/cursor` 등): 단순 정적 SEO 랜딩

이 역전 구조로 인해:

- 헤더 네비게이션 "AI Config Files" → `/ai-config` 연결이 "카탈로그 진입"이 아닌 "생성기 직접 진입"으로 해석되어 사용자에게 혼란을 유발
- 자식 페이지가 부모보다 훨씬 단순한 콘텐츠를 가지므로 IA 가치의 미완결 상태

### 문제 2: 검색 유입 경로의 맥락 단절

검색에서 도구별 랜딩(예: `/ai-config/cursor`)으로 유입된 사용자가 CTA("생성기 시작하기")를 클릭하면 `/ai-config`(통합 생성기)로 이동하는데, 이때 Cursor가 미리 선택된 상태가 아니다. 사용자는 Cursor에 관심이 있어 해당 랜딩에 도달했으나, 생성기 진입 후에는 어떤 도구도 사전 선택되지 않아 "검색 키워드 → 랜딩 → 생성기" 경로의 맥락이 단절된다.

## 결정 (Decision)

**옵션 C+(보완형 C)를 채택한다:** URL 재편(옵션 C)과 URL 파라미터 컨텍스트 전달(옵션 D')의 핵심을 결합한다.

### 페이지 역할 재정의

| URL | 새 역할 | 기존 역할 |
| --- | ------- | --------- |
| `/[locale]/ai-config` | 카탈로그 허브 (5개 도구 카드 + 통합 생성기 CTA) | 통합 생성기 |
| `/[locale]/ai-config/generator` (신규) | 통합 생성기 (기존 `AiConfigGenerator.svelte` 이전) | 없음 |
| `/[locale]/ai-config/agents-md` | 도구별 상세 가이드. CTA → `/ai-config/generator?focus=agents-md` | 동일 (CTA URL만 변경) |
| `/[locale]/ai-config/cursor` | 도구별 상세 가이드. CTA → `/ai-config/generator?focus=cursor` | 동일 (CTA URL만 변경) |
| `/[locale]/ai-config/copilot` | 도구별 상세 가이드. CTA → `/ai-config/generator?focus=copilot` | 동일 (CTA URL만 변경) |
| `/[locale]/ai-config/claude-code` | 도구별 상세 가이드. CTA → `/ai-config/generator?focus=claude-code` | 동일 (CTA URL만 변경) |
| `/[locale]/ai-config/agent-skills` | 도구별 상세 가이드. CTA → `/ai-config/generator?focus=agent-skills` | 동일 (CTA URL만 변경) |

### 재설계 후 IA 위계

```text
/ai-config (카탈로그 허브 — 개요, 진입점)
├── /ai-config/generator   (통합 생성기 — 실제 기능)
├── /ai-config/agents-md   (AGENTS.md 도구별 상세 가이드)
├── /ai-config/cursor      (Cursor 도구별 상세 가이드)
├── /ai-config/copilot     (Copilot 도구별 상세 가이드)
├── /ai-config/claude-code (Claude Code 도구별 상세 가이드)
└── /ai-config/agent-skills (Agent Skills 도구별 상세 가이드)
```

부모는 카탈로그/개요, 자식들은 동등한 레벨(통합 생성기 / 도구별 상세). 일반적인 IA 위계 패턴과 일치한다.

### 카탈로그 페이지 구조

```text
┌────────────────────────────────────────────┐
│ <h1> AI 코딩 도구 설정 카탈로그              │
│ <p> 4개 AI 도구의 설정 파일과 Skills를      │
│     선택해서 생성하세요.                    │
├────────────────────────────────────────────┤
│ <h2> 한 번에 모두 생성                      │
│ [통합 생성기 시작하기 →]                    │
│   → /ai-config/generator                  │
├────────────────────────────────────────────┤
│ <h2> 도구별로 알아보기                      │
│ [AGENTS.md] [Cursor] [Copilot]             │
│ [CLAUDE.md] [Agent Skills]                 │
│   → /ai-config/{slug}                     │
└────────────────────────────────────────────┘
```

### URL 파라미터 컨텍스트 전달

`AiConfigGenerator.svelte`가 `?focus={slug}` 파라미터를 읽어 해당 자식 랜딩의 컨텍스트에 맞게 생성기 초기 상태를 설정한다. 파라미터 이름을 `?tool` 대신 `?focus`로 정의하는 이유는 이 파라미터가 "도구 선택"을 지시하는 것이 아니라 "이 페이지가 강조하는 컨텍스트"를 전달하기 때문이다. 예를 들어 `agents-md` 랜딩은 특정 도구가 아니라 AGENTS.md라는 산출물에 초점이 맞춰져 있고, `agent-skills` 랜딩은 도구가 아닌 Skills 출력 영역을 강조한다. 따라서 각 자식 랜딩의 성격에 따라 생성기 초기 상태가 비대칭적으로 정의된다.

| 자식 랜딩 CTA 진입 URL | 생성기 초기 상태 |
| ---------------------- | --------------- |
| `/ai-config/generator?focus=agents-md` | 4개 도구 모두 선택(Cursor, Copilot, Claude Code, Codex) + AGENTS.md 미리보기 탭 활성화 |
| `/ai-config/generator?focus=cursor` | Cursor만 선택 + Cursor MDC 미리보기 탭 활성화 |
| `/ai-config/generator?focus=copilot` | Copilot만 선택 + Copilot 미리보기 탭 활성화 |
| `/ai-config/generator?focus=claude-code` | Claude Code 선택(추가로 AGENTS.md 임포트 옵션 활성화 가능, CP-3 기준) + CLAUDE.md 미리보기 탭 활성화 |
| `/ai-config/generator?focus=agent-skills` | 도구 선택은 사용자 기본값 유지 + Step 2 Agent Skills 영역이 펼쳐진 상태 |

**비대칭 매핑 설계 근거:**

- **`agents-md`**: AGENTS.md는 OpenAI Codex 네이티브이지만 Cursor, Copilot, Claude Code가 공식 지원하는 공통 표준 파일이다. `?focus=agents-md` 진입이 "Codex만 선택"으로 초기화되면 사용자 의도와 모순된다. AGENTS.md 페이지에 진입한 사용자의 의도는 "Codex를 사용 중"이 아니라 "AGENTS.md를 만들고 싶다"이므로 4개 도구 모두 선택하는 것이 올바른 컨텍스트다.
- **`cursor` / `copilot`**: 단일 도구 전용 랜딩에서 진입한 사용자는 해당 도구에만 관심이 있다. 단일 선택이 사용자 의도와 일치한다.
- **`claude-code`**: Claude Code 단일 선택을 기본값으로 하되, AGENTS.md 임포트 연계(CP-3)가 핵심 기능이므로 임포트 옵션을 활성화한다.
- **`agent-skills`**: Agent Skills는 "도구"가 아니라 "출력 산출물의 종류"이므로 Step 1 도구 선택과 직접 대응되지 않는다. 도구 선택은 사용자 기본값을 유지하고, Step 2 Skills 영역을 펼쳐 해당 컨텍스트를 강조한다.

### 헤더 네비게이션

`Header.astro`의 "AI Config Files" 메뉴는 `/ai-config`(카탈로그)로 그대로 유지. 카탈로그가 진입점 역할을 담당한다.

### SEO 처리 방침

현 시점 미배포 상태(2026-05-01 도입, 상용 배포 전)이므로 301 redirect 등 별도 SEO 처리 불필요. 사용자(jsg3121) 명시적 결정.

## 근거 (Rationale)

### IA 위계 정상화

일반적인 정보 아키텍처 원칙에서 부모-자식 관계는 "일반 → 구체" 방향이어야 한다(Nielsen Norman Group, Information Architecture for the Web). 카탈로그가 부모이고 생성기 + 도구별 가이드가 자식인 구조가 사용자의 멘탈 모델에 부합한다.

### 맥락 단절 해결

검색 유입 사용자의 전환율은 "검색 키워드 → 랜딩 콘텐츠 → CTA 진입 상태"의 일관성에 직접적으로 영향을 받는다. `?focus` 파라미터로 컨텍스트를 전달하면 각 자식 랜딩에서 유입된 사용자가 해당 랜딩의 의도에 맞는 초기 상태로 생성기에 진입한다.

이때 자식 랜딩별로 초기 상태가 비대칭적으로 정의된다. `cursor` / `copilot`처럼 단일 도구 전용 랜딩은 해당 도구만 선택된 상태로 진입하는 반면, `agents-md`는 AGENTS.md가 4개 도구 공통 표준 파일이라는 성격을 반영하여 4개 도구 모두 선택 상태로 초기화된다. `agent-skills`는 도구가 아닌 산출물의 종류를 강조하는 랜딩이므로 도구 선택을 변경하지 않고 Skills 영역만 펼친 상태로 진입한다. 이 비대칭 설계는 각 랜딩의 사용자 의도를 생성기 진입 상태에 정확히 반영하기 위함이다.

### SEO 가치 보존

5개 자식 랜딩의 URL, 콘텐츠, JSON-LD는 변경하지 않는다. SEO 관점에서 기존 인덱싱 작업이 그대로 유효하다. 변경되는 것은 CTA URL(`/ai-config` → `/ai-config/generator?focus={slug}`)뿐이다.

### 구현 비용 최소화

- `/ai-config`: 기존 생성기 컴포넌트 제거, 카탈로그 UI로 교체
- `/ai-config/generator`: 기존 `AiConfigGenerator.svelte` 그대로 이전, URL 파라미터 초기화 로직만 추가
- 5개 자식 랜딩: CTA URL 1줄 변경만 필요
- 미배포 상태이므로 301 redirect, SEO 재색인 등 추가 작업 없음

## 고려한 대안 (Alternatives Considered)

이전 product-planner IA 재검토 보고서에서 5개 옵션을 분석했다.

| 옵션 | 설명 | 장점 | 단점 | 채택 여부 |
| ---- | ---- | ---- | ---- | --------- |
| B'. 자식 랜딩 콘텐츠 강화 | 자식 랜딩에 미니 생성기/상세 콘텐츠 추가. URL 구조 유지 | URL 변경 없음, 구현 위치 변경 없음 | 부모-자식 위계 역전 근본 미해결, 자식이 독립 가치를 가지면 부모 필요성 약화 | 불채택 |
| C. URL 재편 | `/ai-config`를 카탈로그로, `/ai-config/generator`를 생성기로 분리 | IA 위계 정상화 | 기존 `/ai-config` 생성기 진입 경로 변경으로 혼란 가능. 카탈로그 추가 콘텐츠 작성 필요 | **부분 채택 (C+ 기반)** |
| D. 카탈로그 통합 (현재 구조 내) | `/ai-config`에 카탈로그 섹션 추가 + 생성기 동일 페이지 유지 | URL 변경 없음 | 생성기와 카탈로그가 한 페이지에 혼재, 페이지 목적 불명확 | 불채택 |
| D'. URL 파라미터 컨텍스트 전달 | 자식 랜딩 CTA를 `?focus={slug}` 파라미터로 변경 | 맥락 단절 해결, URL 구조 유지 가능 | IA 위계 역전 근본 미해결. 옵션 C+에서 흡수 | **핵심만 흡수 (C+에 통합)** |
| E. 완전 재설계 | 도구별 독립 생성기로 분리 | 도구별 SEO 극대화 | DRY 위반 부활, "통합 부트스트래퍼" 포지셔닝 소실, 구현 비용 최대 | 불채택 |

**옵션 C+**: 옵션 C(URL 재편)의 IA 위계 정상화 + 옵션 D'(URL 파라미터)의 맥락 단절 해결을 결합. 두 문제를 모두 해결하면서 SEO 가치와 기존 구현 자산을 최대한 보존한다.

## 결과 (Consequences)

### 즉각적 변경 사항

- `/ai-config/generator` 신규 Astro 페이지 생성 (기존 `AiConfigGenerator.svelte` 이전)
- `/ai-config/index.astro` 카탈로그 UI로 전면 교체
- `AiConfigGenerator.svelte`에 `?focus` URL 파라미터 읽기 + 랜딩별 비대칭 초기화 로직 추가
- 5개 자식 랜딩의 CTA URL을 `/ai-config/generator?focus={slug}`로 변경
- 카탈로그 페이지용 한/영 i18n 카피 추가

### SPEC-0005 연동 갱신

SPEC-0005의 갱신이 필요한 섹션:

- frontmatter: `status`, `related_adrs` (ADR-0019 추가)
- §2.1 In Scope: IA 재설계 항목 추가
- §3.1 개요: 카탈로그 + 생성기 분리 구조 명시
- §3.2.1: `?focus` URL 파라미터 초기화 로직 명시
- §3.3 사용자 플로우: 경로 A/B, `?focus` 파라미터 비대칭 매핑 추가
- §5 대안 A: 결정 보완 — IA 재검토 결과로 갱신된 근거 명시
- §6.1 단계: 단계 11 완료 표시, 단계 12(IA 재설계) 추가
- §9.1 URL 구조: 카탈로그/생성기 분리 반영
- §9.4 JSON-LD: 카탈로그(`CollectionPage` + `ItemList`), 생성기(`SoftwareApplication`) 명확화

### SPEC-0005-design.md 연동

`SPEC-0005-design.md` §1.1 URL 맵에 `/ai-config/generator` 추가 및 `/ai-config` 역할 변경 반영이 필요하다. 카탈로그 페이지의 와이어프레임은 SPEC-0005-design.md에 별도 추가를 권장한다.

### Phase B Shareable URL(SPEC-0003) 연관성

Phase B에서 Shareable URL을 구현할 때, `/ai-config/generator?focus=cursor`와 Shareable URL 파라미터의 충돌 또는 통합을 설계해야 한다. 예를 들어 `/ai-config/generator?focus=cursor&state=...` 형태 또는 파라미터 우선순위 규칙이 필요하다. 이 설계는 Phase B 착수 시 별도 검토한다.

### 위험 요소

- **카탈로그 콘텐츠 작성 부담**: `/ai-config` 카탈로그의 도구 카드 콘텐츠(한/영)를 새로 작성해야 한다
- **기존 `/ai-config` 경로 북마크**: 사용자가 `/ai-config`를 북마크했다면 카탈로그 페이지로 도달하게 된다. 그러나 미배포 상태이므로 실제 영향 없음
- **`?focus` 파라미터 유효성 검증**: 정의되지 않은 slug 값으로 진입 시 기본 상태로 폴백하는 로직이 필요하다
- **5개 자식 랜딩별 동작 차별화로 인한 구현 분기 증가**: 각 `?focus` 값에 따라 생성기 초기 상태 설정 로직이 비대칭적으로 분기된다. 구현 시 `focus` 값별 초기화 함수를 명확히 분리하여 관리해야 한다
- **정의되지 않은 focus 값 진입 시 폴백 명세 필요**: `?focus` 값이 5개 정의된 슬러그(`agents-md`, `cursor`, `copilot`, `claude-code`, `agent-skills`) 외의 값인 경우, 파라미터를 무시하고 기본 상태(도구 미선택, Step 1 안내)로 초기화하는 폴백 로직을 명세에 포함해야 한다

## 참고 자료 (References)

- [SPEC-0005 §3.1, §5](../../../ia/specs/features/SPEC-0005-ai-tool-config-and-skills.md) — 초기 대안 A 결정 및 IA 재검토 결과
- [SPEC-0005-design.md §1.1](../../../ia/specs/features/SPEC-0005-design.md) — URL 맵 및 페이지 역할 정의
- [SPEC-0003 Shareable URL](../../../ia/specs/features/SPEC-0003-shareable-url.md) — Phase B URL 파라미터 통합 연관
- [STR-0002 §자사 강점 S3](../../../research/reports/STR-0002-configdeck-strategy-2026-04.md) — SEO 핵심 채널. 도구별 랜딩 SEO 가치 보존 근거
- [RES-0003 §6.1](../../../research/reports/RES-0003-ai-tool-config-files-2026-04.md) — 통합 생성기 권장. 분리 구조에서도 통합 생성기 단일 진입점 유지
- [ADR-0014 §후속 조치](./ADR-0014-growth-strategy-roadmap.md) — 성장 전략 로드맵. B축 AI 도구 설정 파일 선점 전략과의 정합성
- [ADR-0017](./ADR-0017-ai-config-file-format-priority.md) — AI 도구 설정 파일 형식 우선순위
- [ADR-0018](./ADR-0018-agent-skills-catalog.md) — Agent Skills 카탈로그 채택

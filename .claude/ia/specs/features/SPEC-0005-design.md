---
id: SPEC-0005-design
title: AI 도구 설정 + Skills 생성기 UX 설계
status: 초안
owner: ux-designer
created: 2026-04-30
updated: 2026-04-30
related_spec: SPEC-0005
related_adrs:
  - ADR-0009  # 스택 생성기 UX 패턴 (아코디언 인라인)
  - ADR-0017  # AI 설정 파일 형식 우선순위
  - ADR-0018  # Agent Skills 카탈로그
  - ADR-0005  # 공유 링크 / 반응형 역할 분담
related_research:
  - RES-0002  # 스택 생성기 UX 패턴
  - RES-0003  # AI 도구 설정 파일 시장 리서치
---

# SPEC-0005 UX 설계: AI 도구 설정 + Skills 생성기

## 1. 페이지 IA 및 URL 구조

### 1.1 URL 맵

> **[ADR-0019 반영 — 2026-05-01]** IA 위계 역전 해소를 위해 `/ai-config`를 카탈로그 허브로, `/ai-config/generator`(신규)를 통합 생성기로 분리. 자식 랜딩 CTA는 `/ai-config/generator?tool={slug}` 형식으로 도구 컨텍스트를 전달한다.

| 페이지 역할 | 한국어 URL | 영어 URL | 렌더링 |
| --- | --- | --- | --- |
| 카탈로그 허브 (신규) | `/ko/ai-config` | `/en/ai-config` | SSG 정적 (카드 목록 + CTA) |
| 통합 생성기 (신규 경로) | `/ko/ai-config/generator` | `/en/ai-config/generator` | Astro 아일랜드 (`?tool` 파라미터 읽기) |
| Cursor 설정 랜딩 | `/ko/ai-config/cursor` | `/en/ai-config/cursor` | SSG 정적. CTA → `?tool=cursor` |
| AGENTS.md 랜딩 | `/ko/ai-config/agents-md` | `/en/ai-config/agents-md` | SSG 정적. CTA → `?tool=codex` |
| Copilot 인스트럭션 랜딩 | `/ko/ai-config/copilot` | `/en/ai-config/copilot` | SSG 정적. CTA → `?tool=copilot` |
| Claude Code 랜딩 | `/ko/ai-config/claude-code` | `/en/ai-config/claude-code` | SSG 정적. CTA → `?tool=claude-code` |
| Agent Skills 랜딩 | `/ko/ai-config/agent-skills` | `/en/ai-config/agent-skills` | SSG 정적. CTA → `?tool=agent-skills` |

> **근거:** 통합 생성기는 Svelte 아일랜드가 필요하므로 Astro 아일랜드 방식. 카탈로그와 도구별 랜딩은 인터랙션 없이 콘텐츠 + CTA만 포함하므로 정적 HTML로 충분하다 (Astro SSG 원칙, ADR-0002). IA 위계 역전 해소 근거는 ADR-0019 참조.

### 1.2 hreflang 구조

각 페이지에 다음 태그를 삽입한다:

```html
<!-- /ko/ai-config 에서 -->
<link rel="alternate" hreflang="ko" href="https://configdeck.dev/ko/ai-config" />
<link rel="alternate" hreflang="en" href="https://configdeck.dev/en/ai-config" />
<link rel="alternate" hreflang="x-default" href="https://configdeck.dev/en/ai-config" />
```

> **근거:** 기존 ConfigDeck hreflang 패턴 동일 적용 (SPEC-0005 §9.3). x-default는 영어 URL로 설정한다 — 검색 봇이 언어를 결정하지 못할 때 영어가 더 넓은 커버리지를 가진다.

---

## 2. 메인 페이지 (`/ai-config`) 화면 구조

### 2.1 설계 원칙

이 페이지는 기존 스택 생성기(`/stacks`)의 좌우 분할 패턴(ADR-0009)을 계승하되, 단일 파일 목록 대신 **4단계 입력 플로우**를 좌측 패널에 수용한다. 이 결정의 근거는 다음과 같다:

- 스택 생성기 사용자는 이미 "좌측에서 설정 → 우측에서 확인" 패턴에 익숙하다
- 4단계 플로우는 선형 진행이므로 좌측 수직 스크롤 구조와 자연스럽게 맞는다
- 우측 출력 패널은 입력이 완료된 후 실시간으로 갱신되어야 하므로 항상 시야에 있어야 한다

### 2.2 데스크톱 와이어프레임 (1280px+)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [ConfigDeck 로고]  [nav: Generators | Stacks | AI Config | ...]     │ ← header
├────────────────────────────┬─────────────────────────────────────────┤
│  좌측 입력 패널 (w-96~112)  │  우측 출력 패널 (flex-1)                │
│  sticky, overflow-y-auto   │  sticky, overflow-y-auto                │
│                            │                                          │
│  ┌── Step 1: 스택 ────────┐ │  ┌── 출력 파일 트리 ─────────────────┐  │
│  │ [react-vite-ts]        │ │  │ 📄 AGENTS.md              [복사]  │  │
│  │ [nextjs]               │ │  │ 📄 CLAUDE.md              [복사]  │  │
│  │ [astro]                │ │  │ 📁 .cursor/rules/                 │  │
│  │ [nodejs]               │ │  │   📄 core.mdc             [복사]  │  │
│  └───────────────────────┘ │  │   📄 stack.mdc            [복사]  │  │
│                            │  │   📄 boundaries.mdc       [복사]  │  │
│  ┌── Step 2: Best Pract. ─┐ │  │ 📄 .github/copilot-...    [복사]  │  │
│  │ [commands][testing]... │ │  │ 📁 .claude/skills/                │  │
│  │ [탭 6개: 카테고리별]    │ │  │   📄 commit/SKILL.md      [복사]  │  │
│  │ ─────────────────────  │ │  │   📄 pr-create/SKILL.md   [복사]  │  │
│  │ ☑ 명시적 import문 사용 │ │  │   ...                             │  │
│  │ ☑ named export 우선    │ │  │                                   │  │
│  │ ☐ no-default-export    │ │  │  [전체 ZIP 다운로드]               │  │
│  │                        │ │  └──────────────────────────────────┘  │
│  │ Additional Notes:      │ │                                          │
│  │ [textarea]             │ │  ┌── 파일 미리보기 ───────────────────┐  │
│  └───────────────────────┘ │  │ [AGENTS.md][CLAUDE.md][core.mdc]...│  │
│                            │  │ ─────────────────────────────────── │  │
│  ┌── Step 3: Boundaries ──┐ │  │  # Project: {스택}                  │  │
│  │ ✅ Always do           │ │  │                                    │  │
│  │   ☑ lint --fix 실행    │ │  │  ## Commands                       │  │
│  │   [+ 직접 입력]        │ │  │  pnpm dev                          │  │
│  │                        │ │  │  pnpm build                        │  │
│  │ ⚠️ Ask first           │ │  │  ...                               │  │
│  │   ☑ DB 스키마 변경     │ │  │                                    │  │
│  │   [+ 직접 입력]        │ │  └──────────────────────────────────┘  │
│  │                        │ │                                          │
│  │ 🚫 Never do            │ │                                          │
│  │   ☑ 프로덕션 DB 직접수정│ │                                          │
│  │   [+ 직접 입력]        │ │                                          │
│  └───────────────────────┘ │                                          │
│                            │                                          │
│  ┌── Step 4: 도구 + Skills ┐ │                                          │
│  │ 사용 도구 선택:         │ │                                          │
│  │ [Cursor ✓] [Copilot]   │ │                                          │
│  │ [Claude Code ✓][Codex] │ │                                          │
│  │                        │ │                                          │
│  │ [Claude Code 단독 사용] │ │                                          │
│  │  ┌─ 안내 박스 ────────┐ │ │                                          │
│  │  │ⓘ Claude Code는    │ │ │                                          │
│  │  │AGENTS.md를 직접   │ │ │                                          │
│  │  │읽지 않습니다.      │ │ │                                          │
│  │  │→ 공식 문서         │ │ │                                          │
│  │  └────────────────────┘ │ │                                          │
│  │                        │ │                                          │
│  │ Skills 선택:           │ │                                          │
│  │ [commit ✓][pr-create ✓]│ │                                          │
│  │ [pr-review][test-writer]│ │                                          │
│  │ [debug ✓][refactor]    │ │                                          │
│  │ [adr-create][readme-upd]│ │                                          │
│  └───────────────────────┘ │                                          │
├────────────────────────────┴─────────────────────────────────────────┤
│  footer                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.3 태블릿 와이어프레임 (768px ~ 1279px)

```
┌──────────────────────────────────────────────────────┐
│  [로고]  [nav: 햄버거 메뉴]                            │
├──────────────────────────────────────────────────────┤
│  Step 1  Step 2  Step 3  Step 4       [출력 보기 →]  │ ← 단계 인디케이터 + 출력 토글
├──────────────────────────────────────────────────────┤
│                                                      │
│  [현재 활성 단계 내용 — 전체 너비]                     │
│                                                      │
│  Step 1: 스택 선택                                    │
│  ┌──────────┐ ┌──────────┐                           │
│  │react-vite│ │  nextjs  │                           │
│  └──────────┘ └──────────┘                           │
│  ┌──────────┐ ┌──────────┐                           │
│  │  astro   │ │  nodejs  │                           │
│  └──────────┘ └──────────┘                           │
│                                                      │
│              [다음 단계 →]                            │
├──────────────────────────────────────────────────────┤
│  ┌── 출력 요약 (접기/펴기) ──────────────────────┐    │
│  │ 생성될 파일: 7개    [전체 ZIP 다운로드]        │    │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

> **태블릿 설계 근거:** 768~1279px 구간에서 좌우 분할을 유지하면 양쪽 패널이 너무 좁아진다. 스택 생성기(ADR-0009)도 `lg:flex-row`로 1024px+ 이상에서만 분할한다. 이 페이지는 입력 항목이 더 많으므로 기준을 1280px로 높인다. 태블릿에서는 단계별 진행으로 전환하고, 하단에 출력 요약 카드를 축소하여 표시한다.

### 2.4 모바일 와이어프레임 (768px 미만)

```
┌────────────────────────────┐
│ [← ConfigDeck]             │ ← back nav
│ AI 도구 설정 생성기         │
├────────────────────────────┤
│  ●━━━○━━━○━━━○             │ ← 단계 인디케이터 (dot 방식)
│  1/4: 스택 선택             │
├────────────────────────────┤
│                            │
│  프로젝트 스택을 선택하세요   │
│                            │
│  ┌──────────┐              │
│  │ react-   │  ← 2열 카드  │
│  │ vite-ts  │              │
│  └──────────┘              │
│  ...                       │
│                            │
├────────────────────────────┤
│  [건너뛰기]    [다음 →]     │ ← 하단 고정 CTA
└────────────────────────────┘

--- 4단계 완료 후 ---

┌────────────────────────────┐
│ 생성 완료                   │
├────────────────────────────┤
│ 📄 AGENTS.md        [복사] │
│ 📄 CLAUDE.md        [복사] │
│ 📁 .cursor/rules/          │
│   📄 core.mdc       [복사] │
│   ...                      │
│                            │
│ [전체 ZIP 다운로드]          │
└────────────────────────────┘
```

> **모바일 설계 근거:** ADR-0005의 "모바일: 옵션 선택 + 공유" 역할 분담 원칙을 따른다. 미리보기 패널 대신 단계별 진행으로 입력에 집중하고, 완료 후 파일 목록과 복사 버튼을 제공한다. ZIP 다운로드는 모바일에서도 지원하되 주요 CTA는 개별 복사다 (파일 앱 접근이 데스크톱보다 번거롭기 때문).

---

## 3. 입력 4단계 인터랙션 명세

### 3.1 단계 구조 개요

```
단계 1: 스택 선택 (필수)
단계 2: Best Practices — 카탈로그 체크리스트 + Additional Notes (선택)
단계 3: Boundaries 3-tier (선택)
단계 4: 도구 선택 + Skills 선택 (도구는 필수, Skills는 선택)
```

데스크톱에서는 4단계가 좌측 패널의 수직 섹션으로 상시 표시된다. 섹션 간 이동은 스크롤이며, 단계 구분은 `<h2>` + 구분선으로 명확히 한다.

태블릿/모바일에서는 한 번에 하나의 단계만 표시하는 Wizard 패턴을 적용한다.

> **왜 데스크톱에서 Wizard가 아닌가:** 단계가 4개이고 각 단계를 보면서 다른 단계 결과를 우측에서 실시간 확인해야 한다. 단계 간 이동 클릭 비용이 발생하는 Wizard는 이 시나리오에서 적합하지 않다. 모든 단계가 좌측에 펼쳐져 있으면 사용자가 임의 순서로 수정할 수 있어 유연성이 높다.

### 3.2 Step 1 — 스택 선택

**컴포넌트:** `AiConfigStackSelector.svelte`

**UI 패턴:** 2열 카드 그리드 (기존 스택 페이지의 프리셋 카드 재사용 가능)

```
┌───────────────┐  ┌───────────────┐
│  ⚛ React      │  │  ▲ Next.js    │
│  + Vite + TS  │  │               │
│  [선택됨 ✓]   │  │               │
└───────────────┘  └───────────────┘
┌───────────────┐  ┌───────────────┐
│  🚀 Astro     │  │  🟢 Node.js   │
│               │  │               │
└───────────────┘  └───────────────┘
```

| 상태 | 표현 |
|------|------|
| 기본 | border-border bg-white |
| 선택됨 | border-primary bg-primary/5 ring-1 ring-primary |
| hover | border-primary/50 |

**단일 선택** — AiConfigStackSlug 타입에 따라 4종 중 하나만 선택 가능.

**스택 아이콘:** 기존 `getFileIcon()` 유틸리티와 동일한 SVG 아이콘 시스템 활용.

**선택 전 출력 패널 상태:** 빈 상태 (Step 1 안내 문구).

### 3.3 Step 2 — Best Practices

**컴포넌트:** `AiConfigBestPractices.svelte`

**UI 패턴:** 6개 카테고리 탭 + 탭 내부 체크리스트

```
[commands] [testing] [project-structure] [code-style] [git-workflow] [boundaries]
                                               ↑ 활성 탭
─────────────────────────────────────────────────────
☑  명시적 import문 사용 (named export 우선)
☑  파일당 컴포넌트 1개
☐  함수형 컴포넌트만 사용
☐  index.ts re-export 패턴 사용
─────────────────────────────────────────────────────
Additional Notes
┌─────────────────────────────────────────────────┐
│ 프로젝트 전용 추가 지시사항을 자유롭게 입력...    │
└─────────────────────────────────────────────────┘
```

**탭 설계 이유:**

- 6개 카테고리를 한 화면에 나열하면 스크롤이 길어지고 분류가 불명확해진다
- 탭은 카테고리 경계를 명확히 하고 한 번에 표시하는 항목 수를 줄인다
- Additional Notes는 탭 밖 하단에 항상 표시 — 카테고리와 무관한 전체 지시사항이기 때문

**카테고리별 항목 수 (M1 카탈로그 기준):**

- commands: 1개 (범용)
- testing: 2개 (범용)
- project-structure: 1개 범용 + 스택별 추가
- code-style: 5개 범용 + 스택별 추가
- git-workflow: 2개 (범용)
- boundaries: → Step 3에서 별도 처리

> **근거:** `boundaries` 카테고리는 3-tier 구조가 필요하므로 탭에서 분리하여 Step 3를 별도 단계로 둔다. 탭에는 `boundaries`를 포함하지 않는다.

**스택 연동:** `appliesTo: readonly AppliesTo[]` 타입을 활용하여 선택된 스택과 맞지 않는 항목은 자동으로 숨긴다.

**Additional Notes 배치:**

- 텍스트에어리어는 탭 섹션 하단에 고정 배치
- placeholder: "팀 컨벤션이나 추가 지시사항을 자유롭게 작성하세요"
- 최대 높이: `max-h-32 resize-y` (사용자 확장 가능, 무한 확장 방지)

### 3.4 Step 3 — Boundaries 3-tier

**컴포넌트:** `AiConfigBoundaries.svelte`

**UI 패턴:** 3개 Tier 섹션 (아코디언 없이 항상 펼침)

```
✅ Always do — AI가 항상 수행
──────────────────────────────────
☑  커밋 전 lint --fix 자동 실행
☑  타입 오류 0개 유지
[+ 항목 추가]
   └─ [텍스트 입력] [추가]

⚠️ Ask first — 먼저 확인할 것
──────────────────────────────────
☐  기존 DB 스키마 변경
☐  외부 의존성 추가
[+ 항목 추가]

🚫 Never do — 절대 금지
──────────────────────────────────
☑  프로덕션 DB 직접 수정
☑  비밀키를 코드에 삽입
[+ 항목 추가]
```

**시각적 구분:**

| Tier | 배경색 | 아이콘 | 텍스트 |
|------|--------|--------|--------|
| Always do | `bg-green-50` | ✅ | `text-green-800` |
| Ask first | `bg-amber-50` | ⚠️ | `text-amber-800` |
| Never do | `bg-red-50` | 🚫 | `text-red-800` |

**직접 입력 필드:**

- [+ 항목 추가] 버튼 클릭 → 인라인 텍스트 입력 필드 + [추가] 버튼 등장
- 추가된 항목은 체크된 상태로 카탈로그 항목 아래 표시
- 삭제 버튼(×) 포함

**Step 3 전체는 선택(optional):** 섹션 상단에 "건너뛰어도 기본 Boundaries 예시가 포함됩니다" 안내 추가.

### 3.5 Step 4 — 도구 + Skills

**컴포넌트:** `AiConfigToolsAndSkills.svelte`

#### 4-1 도구 선택

**UI 패턴:** 토글 칩 4개 (체크박스 스타일이 아닌 pill 토글)

```
사용 중인 AI 코딩 도구를 모두 선택하세요:

[● Cursor]  [○ Copilot]  [● Claude Code]  [○ Codex]
```

| 상태 | 표현 |
|------|------|
| 선택됨 | bg-primary text-white border-primary |
| 해제됨 | bg-white text-gray-700 border-border |

- 복수 선택 가능
- 최소 1개 이상 선택 강제 (모두 해제 시 "최소 1개 이상 선택" 에러 메시지)

#### 4-2 Claude Code 단독 사용 토글 (CP-3)

```
[ ] Claude Code만 단독으로 사용합니다

┌── 정보 박스 (Claude Code 선택 시 표시) ────────────────────────────────┐
│ ⓘ  Claude Code와 다른 도구를 함께 사용하고 있습니다.                     │
│                                                                          │
│ Claude Code는 AGENTS.md를 직접 읽지 않으므로, CLAUDE.md에                 │
│ @AGENTS.md 임포트를 자동으로 삽입합니다. 이렇게 하면 AGENTS.md             │
│ 하나로 4개 도구 모두에서 동일한 설정을 공유할 수 있습니다.                  │
│                                                                          │
│ → Claude Code 공식 문서: Memory 가이드 보기 [↗]                          │
└───────────────────────────────────────────────────────────────────────┘
```

**안내 박스 표시 조건:**

1. Claude Code 도구가 선택된 상태 + 다른 도구도 선택된 상태 → 박스를 표시하되 토글은 OFF 상태 (기본값: @AGENTS.md 자동 임포트 설명)
2. "Claude Code만 단독 사용" 토글을 ON → 박스 내용이 "단독 사용 모드" 설명으로 변경
3. Claude Code 도구가 선택되지 않은 상태 → 안내 박스 숨김

**CP-3 배치 결정의 이유:**

- 토글 옆 인라인 텍스트: 설명이 길어 잘려 보일 위험
- 토글 클릭 시 모달: 클릭 비용 추가, 모달은 중단적 경험
- 토글 아래 박스(채택): 항상 노출되어 사용자가 클릭 없이 내용을 파악 가능. 처음 접하는 사용자도 맥락을 이해하고 올바른 선택을 할 수 있다.

#### 4-3 Skills 선택

```
포함할 Agent Skills를 선택하세요:

┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  commit       │  │  pr-create    │  │  pr-review    │  │  test-writer  │
│  커밋 메시지   │  │  PR 본문 생성  │  │  PR 품질 검토  │  │  테스트 작성   │
│  자동 작성    │  │               │  │               │  │               │
│  [선택됨 ✓]   │  │  [선택됨 ✓]   │  │               │  │               │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  debug        │  │  refactor     │  │  adr-create   │  │  readme-update│
│  에러 분석    │  │  안전한 리팩토링│  │  ADR 문서 작성 │  │  README 갱신  │
│  [선택됨 ✓]   │  │               │  │               │  │               │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘

[전체 선택]  [전체 해제]
```

**UI 패턴:** 4열 카드 그리드 (데스크톱 기준). 각 카드는 스킬 이름 + 한 줄 설명 + 선택 상태.

**Skills와 도구 선택의 위치 관계:**
Skills 선택은 도구 선택 바로 아래에 동일 Step 4 영역 내에 배치한다. 이유: Skills SKILL.md는 선택된 도구와 관계없이 동일한 파일이 생성되므로 도구 선택과 논리적으로 연관되면서도 분리될 필요가 없다.

---

## 4. 출력 패널 UX 명세

### 4.1 파일 트리

```
생성될 파일 (7개)
───────────────────────────────────────
📄 AGENTS.md                    [복사]
📄 CLAUDE.md                    [복사]
📁 .cursor/
  📁 rules/
    📄 core.mdc                 [복사]
    📄 stack.mdc                [복사]
    📄 boundaries.mdc           [복사]
📁 .github/
  📄 copilot-instructions.md    [복사]
📁 .claude/
  📁 skills/
    📁 commit/
      📄 SKILL.md               [복사]
    📁 pr-create/
      📄 SKILL.md               [복사]
    ...

[전체 ZIP 다운로드]
```

**파일 트리 설계:**

- 트리 구조는 실제 파일 시스템 경로를 그대로 반영한다 — 사용자가 ZIP을 풀었을 때 어떤 폴더에 무엇이 들어가는지 미리 인지할 수 있다
- 각 파일 행에 [복사] 버튼을 배치한다
- 선택된 도구에 따라 파일 목록이 실시간 변경된다 (예: Cursor 도구 해제 시 `.cursor/rules/` 폴더 사라짐)
- "생성될 파일 (N개)" 카운터를 상단에 표시한다

**파일 아이콘:**
기존 `getFileIcon()` 유틸리티를 AGENTS.md, CLAUDE.md, .mdc, SKILL.md에 대응하도록 확장한다.

**[복사] 버튼 피드백:**

- 클릭 즉시: "복사됨 ✓" + 아이콘 변경 (2초 후 원래 상태 복귀)
- 기존 스택 생성기의 CodePreview [복사] 버튼 패턴 재사용

**[전체 ZIP 다운로드] 버튼:**

- 파일 트리 하단에 고정 배치
- 아이콘: 다운로드 화살표
- ZIP 내부 구조: 실제 파일 시스템 경로 그대로 (.cursor/rules/core.mdc 등)

### 4.2 파일 미리보기

파일 트리 아래에 탭 + 코드 뷰어 구성. 기존 `FileTabBar` + `CodePreview` 컴포넌트를 재사용한다.

```
[AGENTS.md] [CLAUDE.md] [core.mdc] [stack.mdc] [...더보기 ▼]
─────────────────────────────────────────────────────────────
# Project: react-vite-ts

## Commands
pnpm dev
pnpm build
pnpm test

## Testing
...
```

**탭 오버플로우 처리:**
생성된 파일이 많을 때(7개 이상) 탭이 넘칠 수 있다. "...더보기 ▼" 드롭다운으로 오버플로우 파일을 접근할 수 있게 한다.

**파일 트리 클릭 연동:**
파일 트리에서 파일 이름 클릭 시 해당 파일의 탭이 활성화된다.

**코드 렌더링:**

- Markdown 파일(AGENTS.md, CLAUDE.md, SKILL.md): 코드 블록으로 표시 (raw Markdown 텍스트)
- .mdc 파일: YAML frontmatter + Markdown raw 텍스트로 표시
- 구문 강조: 기존 스택 생성기의 구문 강조 방식 동일 적용

**실시간 갱신:**
모든 입력(스택, 체크리스트, 도구, Skills) 변경 시 미리보기 즉시 갱신. Svelte `$derived` 반응성 활용 (기존 패턴 동일).

### 4.3 초기 빈 상태 (Step 1 미완료)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│          🛠 스택을 선택하면                          │
│         생성될 파일이 여기에 표시됩니다              │
│                                                    │
│         ← 좌측에서 Step 1: 스택 선택을 시작하세요    │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 4.4 도구 미선택 상태

Step 4에서 도구를 모두 해제하면 (허용하지 않으므로 해당 없음, 최소 1개 강제). AGENTS.md는 항상 생성되므로 완전한 빈 출력은 발생하지 않는다.

---

## 5. CP-3 안내 UX 명세

### 5.1 배치 결정

**위치:** Step 4 도구 선택 영역 내, Claude Code 도구 토글 바로 아래

**표시 조건 (3가지 상태):**

| 조건 | 표시 내용 |
|------|----------|
| Claude Code 미선택 | 안내 박스 숨김 |
| Claude Code 선택 + 다른 도구도 선택 | 파란색 정보 박스: 다도구 모드 설명 + @AGENTS.md 자동 임포트 안내 |
| "Claude Code 단독 사용" 토글 ON | 파란색 정보 박스: 단독 모드 설명 변경 |

### 5.2 안내 문구 (한국어 확정문)

**다도구 모드 (기본, Claude Code + 다른 도구 동시 선택):**

```
ⓘ  Claude Code와 다른 도구를 함께 사용하고 있습니다.

Claude Code는 AGENTS.md를 직접 읽지 않으므로, CLAUDE.md에
@AGENTS.md 임포트를 자동으로 삽입합니다. 이렇게 하면 AGENTS.md
하나로 4개 도구 모두에서 동일한 설정을 공유할 수 있습니다.

→ Claude Code 공식 문서: Memory 가이드 보기 [↗]
```

**Claude Code 단독 사용 모드 (토글 ON):**

```
ⓘ  Claude Code 단독 사용 모드

Claude Code만 사용하므로 CLAUDE.md를 단일 진실원으로 작성합니다.
AGENTS.md 임포트(@AGENTS.md)는 생략됩니다.

→ Claude Code 공식 문서: Memory 가이드 보기 [↗]
```

### 5.3 시각 처리

- 박스 배경: `bg-blue-50 border border-blue-200`
- 아이콘: `ⓘ` (정보 아이콘)
- 링크: `text-blue-700 underline` + 외부 링크 표시 `↗`
- 최대 너비: 좌측 패널 너비 내 100%

---

## 6. 반응형 브레이크포인트 상세

| 구간 | 레이아웃 변화 | 근거 |
|------|-------------|------|
| `< 768px` (모바일) | 단계별 Wizard. 출력 패널은 완료 후 별도 화면 | ADR-0005: 모바일은 옵션 선택 + 공유 역할 |
| `768px ~ 1279px` (태블릿) | Wizard 유지 + 하단에 생성 파일 카운터 카드 표시. 파일 미리보기는 접힌 상태로 "출력 보기" 버튼으로 전환 | 좌우 분할 시 양쪽 패널이 각 400px 미만으로 좁아짐 |
| `1280px+` (데스크톱) | 좌(입력 4단계 항상 표시) + 우(파일 트리 + 탭 미리보기) 분할 | ADR-0009 패턴 계승 |

**단계별 Wizard 브레이크포인트 결정 이유:**
기존 스택 생성기는 `lg:flex-row` (1024px)에서 분할한다. 이 페이지는 좌측 패널의 수직 길이가 훨씬 길기 때문에 (4단계 × 평균 200px = ~800px) 분할 기준을 1280px로 높인다. 1280px 미만에서는 우측 출력 패널이 의미 있게 보이기 어렵다.

**스크롤 동작:**

- 데스크톱: 좌측 패널과 우측 패널 각자 독립 스크롤 (`overflow-y-auto`)
- 모바일/태블릿: 전체 페이지 단일 스크롤

---

## 7. 상태 정의

| 상태 ID | 진입 조건 | 표현 |
|---------|---------|------|
| `idle` | 페이지 최초 진입 | 우측 빈 상태 화면. Step 1 스택 선택 안내 |
| `stack-selected` | Step 1 완료 | 우측에 "스택 기반 기본 AGENTS.md" 미리보기 표시. 이미 기본 출력 생성 시작 |
| `practices-editing` | Step 2 체크리스트 조작 중 | 우측 미리보기 실시간 갱신 |
| `boundaries-editing` | Step 3 Boundaries 조작 중 | Boundaries 섹션 미리보기 실시간 갱신 |
| `tools-selected` | Step 4 도구 선택 완료 | 도구별 파일이 파일 트리에 추가/제거 |
| `skills-selected` | Step 4 Skills 선택 | .claude/skills/ 파일 트리 갱신 |
| `ready` | 스택 + 도구 최소 선택 완료 | [전체 ZIP 다운로드] 버튼 활성화 |
| `copying` | [복사] 버튼 클릭 | 버튼 "복사됨 ✓" 상태 2초 |
| `downloading` | [ZIP 다운로드] 클릭 | 버튼 "다운로드 중..." 상태 (JSZip 생성 완료 전) |

**`ready` 활성화 조건:**

- Step 1: 스택 1개 선택됨
- Step 4: 도구 1개 이상 선택됨

Step 2, 3은 optional이므로 ready에 영향 없음.

**ZIP 생성 시간:**
클라이언트 사이드 JSZip으로 생성하므로 실질적으로 즉시 완료되나, 버튼 피드백 UX를 위해 `downloading` 상태를 100ms 이상 유지하는 것을 권장한다.

---

## 8. 기존 패턴 재사용 매핑

| 재사용 대상 | 현재 위치 | AI 설정 생성기에서의 활용 | 수정 여부 |
|-----------|---------|----------------------|---------|
| `StackGenerator.svelte` 좌우 분할 레이아웃 | `src/components/generator/StackGenerator.svelte` | 동일 구조 (`lg:flex-row`) 적용 | 레이아웃 클래스 재사용, 컴포넌트 자체는 별도 생성 |
| `FileAccordionItem.svelte` 아코디언 패턴 | `src/components/generator/FileAccordionItem.svelte` | Step 2 카테고리 탭 내 체크리스트 아이템 — 아코디언 대신 단순 체크박스 리스트로 활용 | 아코디언 토글 불필요, 체크박스 부분만 추출 |
| `FileTabBar.svelte` 탭 바 | `src/components/generator/FileTabBar.svelte` | 출력 파일 탭 미리보기 탭 바 | 파일 탭 수가 많을 때 오버플로우 처리 추가 필요 |
| `CodePreview.svelte` 코드 미리보기 | `src/components/generator/CodePreview.svelte` | 파일별 코드 미리보기 | 그대로 재사용 |
| 스택 프리셋 카드 UI | `src/pages/stacks/` 관련 컴포넌트 | Step 1 스택 선택 카드 | 아이콘 + 이름 카드 패턴 재사용 |
| `downloadFilesAsZip` 유틸리티 | `src/components/generator/modules/stackGeneratorLogic.ts` | ZIP 패키징 로직 | 다중 파일 구조 추가 (중첩 폴더 경로) |
| 디자인 토큰 (primary, border, text-gray-*) | Tailwind CSS v4 @theme | 모든 컴포넌트에 동일 토큰 적용 | 변경 없음 |

**재사용하지 않는 것:**

- `OptionControlRenderer.svelte`: AI 설정 생성기는 JSON 옵션 스키마가 아닌 체크박스 카탈로그 방식이므로 불필요
- `encodeStackGeneratorUrl` / `decodeStackGeneratorUrl`: CP-5에서 Shareable URL Phase A 제외 결정

---

## 9. 도구별 SEO 랜딩 페이지 구조 (5종)

모든 도구별 랜딩 페이지는 동일한 섹션 구조를 공유하고, 도구별 콘텐츠만 달라진다.

### 9.1 공통 페이지 구조

```
<header> 글로벌 nav
<main>
  <section>  ← Hero
  <section>  ← 도구 소개
  <section>  ← 생성 예시 (출력 파일 스니펫)
  <section>  ← CTA: 메인 생성기 진입
  <section>  ← 관련 도구 링크 (내부 SEO 링크 빌딩)
<footer>
```

### 9.2 섹션별 콘텐츠

#### Hero 섹션

```
[도구 로고/아이콘]
h1: {도구명} 설정 파일 생성기
   (예: "AGENTS.md 생성기 — 4개 AI 도구를 한 번에 설정")
p: 한 줄 설명
[생성기 시작하기 →] ← 메인 페이지 앵커 링크 또는 이동
```

#### 도구 소개 섹션

```
h2: {도구명}이란?
[도구 특징 3~4가지 — 카드 그리드]
  📋 특징 1
  ⚡ 특징 2
  🔧 특징 3
```

#### 출력 예시 섹션

```
h2: 생성되는 파일 예시
[파일명 탭]
[코드 블록: 실제 출력 예시 스니펫]
```

이 섹션은 정적 HTML로 렌더링한다 — 인터랙션 없이 미리 정의된 예시 코드를 보여주면 충분하다.

#### 메인 생성기 CTA 섹션

```
h2: 지금 바로 생성해보세요
p: 스택과 옵션을 선택하면 {도구명} 설정 파일을 즉시 다운로드할 수 있습니다.
[AI 설정 생성기 시작하기 →]  ← /ai-config 링크
```

#### 관련 도구 링크 (내부 링크 빌딩)

```
관련 생성기:
[AGENTS.md 생성기] [Cursor 설정 생성기] [Claude Code 설정 생성기] [Agent Skills 생성기]
```

이 섹션은 내부 링크 빌딩용이며 접근성 있는 `<nav>` 또는 `<ul>` 리스트로 마크업한다.

### 9.3 도구별 h1 및 타겟 키워드

| 페이지 | h1 (한국어) | h1 (영어) | 타겟 키워드 |
|--------|------------|---------|-----------|
| `/ai-config/agents-md` | AGENTS.md 생성기 — AI 도구 통합 설정 파일 | AGENTS.md Generator — One File for All AI Tools | agents.md generator |
| `/ai-config/cursor` | Cursor Rules 생성기 (MDC 형식) | Cursor Rules Generator — MDC Format | cursor rules generator |
| `/ai-config/copilot` | GitHub Copilot 인스트럭션 생성기 | Copilot Instructions Generator | copilot instructions generator |
| `/ai-config/claude-code` | Claude Code CLAUDE.md 생성기 | CLAUDE.md Generator for Claude Code | CLAUDE.md 생성기 |
| `/ai-config/agent-skills` | Agent Skills 부트스트래퍼 | Agent Skills Bootstrapper | agent skills generator |

### 9.4 JSON-LD 스키마 (각 랜딩 페이지)

기존 생성기 랜딩의 JSON-LD 패턴을 재사용한다:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AGENTS.md Generator — ConfigDeck",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0"
  },
  "description": "스택을 선택하면 Cursor, Copilot, Claude Code, Codex의 설정 파일을 즉시 생성합니다."
}
```

---

## 10. ui-publisher 구현 컴포넌트 목록

### 10.1 신규 생성 컴포넌트

| 컴포넌트 | 경로 | 역할 |
|---------|------|------|
| `AiConfigGenerator.svelte` | `src/components/ai-config/AiConfigGenerator.svelte` | 전체 생성기 루트. 좌우 분할 레이아웃 + 상태 관리 |
| `AiConfigStackSelector.svelte` | `src/components/ai-config/AiConfigStackSelector.svelte` | Step 1: 스택 카드 선택 |
| `AiConfigBestPractices.svelte` | `src/components/ai-config/AiConfigBestPractices.svelte` | Step 2: 카테고리 탭 + 체크리스트 + Additional Notes |
| `AiConfigBoundaries.svelte` | `src/components/ai-config/AiConfigBoundaries.svelte` | Step 3: 3-tier Boundaries |
| `AiConfigToolsAndSkills.svelte` | `src/components/ai-config/AiConfigToolsAndSkills.svelte` | Step 4: 도구 토글 + CP-3 안내 박스 + Skills 카드 |
| `AiConfigOutputPanel.svelte` | `src/components/ai-config/AiConfigOutputPanel.svelte` | 우측 출력 패널: 파일 트리 + 탭 미리보기 + 다운로드 |
| `AiConfigFileTree.svelte` | `src/components/ai-config/AiConfigFileTree.svelte` | 파일 트리 렌더링 + 개별 복사 버튼 |
| `ClaudeCodeOnlyBanner.svelte` | `src/components/ai-config/ClaudeCodeOnlyBanner.svelte` | CP-3 안내 박스 (조건부 표시) |
| `SkillCard.svelte` | `src/components/ai-config/SkillCard.svelte` | Skills 선택 카드 (이름 + 설명 + 선택 상태) |
| `BoundaryTierSection.svelte` | `src/components/ai-config/BoundaryTierSection.svelte` | Boundary Tier 단위 섹션 (✅/⚠️/🚫) |
| `StepIndicator.svelte` | `src/components/ai-config/StepIndicator.svelte` | 모바일/태블릿용 단계 인디케이터 |

### 10.2 재사용 컴포넌트 (수정 없이 또는 최소 수정)

| 컴포넌트 | 재사용 방식 |
|---------|-----------|
| `CodePreview.svelte` | 파일 미리보기에 그대로 사용 |
| `FileTabBar.svelte` | 출력 탭 바에 그대로 사용 (탭 오버플로우 처리 추가 권장) |

### 10.3 Astro 페이지 파일

| 페이지 | 경로 |
|--------|------|
| 메인 생성기 | `src/pages/[lang]/ai-config/index.astro` |
| AGENTS.md 랜딩 | `src/pages/[lang]/ai-config/agents-md.astro` |
| Cursor 랜딩 | `src/pages/[lang]/ai-config/cursor.astro` |
| Copilot 랜딩 | `src/pages/[lang]/ai-config/copilot.astro` |
| Claude Code 랜딩 | `src/pages/[lang]/ai-config/claude-code.astro` |
| Agent Skills 랜딩 | `src/pages/[lang]/ai-config/agent-skills.astro` |

### 10.4 상태 관리 모듈

| 모듈 | 경로 | 역할 |
|------|------|------|
| `aiConfigGeneratorLogic.ts` | `src/components/ai-config/modules/aiConfigGeneratorLogic.ts` | ZIP 패키징, 파일 트리 빌드, 복사 로직 |

---

## 11. 접근성 명세

| 요소 | 접근성 처리 |
|------|-----------|
| 도구 토글 버튼 | `role="checkbox"` + `aria-checked` 또는 `<input type="checkbox">` 활용 |
| 단계 인디케이터 | `aria-label="4단계 중 1단계"` |
| 파일 트리 | `<ul>` + `<li>` 시맨틱 구조. 폴더는 `<details>/<summary>` 활용 검토 |
| 복사 버튼 | `aria-label="AGENTS.md 복사"` (파일명 포함) |
| CP-3 안내 박스 | `role="note"` + `aria-live="polite"` (내용 변경 시 스크린 리더에 알림) |
| 카테고리 탭 | `role="tablist"` + `role="tab"` + `aria-selected` |
| 체크리스트 | `<fieldset>` + `<legend>` (카테고리명) + `<input type="checkbox">` |

---

## 12. 설계 미결 사항 (ui-publisher가 구현 시 결정)

1. **파일 탭 오버플로우 처리:** "...더보기" 드롭다운 vs 가로 스크롤 vs 탭 래핑 — 구현 시 기존 FileTabBar 확장 방식과 함께 결정
2. **Boundaries 직접 입력 항목 순서:** 카탈로그 항목 아래 vs 위에 배치 — 구현 시 판단
3. **Skills 카드 그리드 컬럼 수:** 태블릿에서 2열 vs 3열 — 카드 최소 너비 기준으로 결정

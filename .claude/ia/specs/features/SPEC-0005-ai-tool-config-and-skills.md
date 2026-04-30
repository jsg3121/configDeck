---
id: SPEC-0005
title: AI 코딩 도구 설정 파일 + Agent Skills 생성기
status: 검토 중
owner: jsg3121
created: 2026-04-30
updated: 2026-04-30
related_adrs:
  - ADR-0014  # 성장 전략 로드맵 (B축 AI 도구 설정 파일 선점)
  - ADR-XXXX  # [후속 ADR 필요] AI 도구 설정 파일 생성기 채택 형식 우선순위
  - ADR-XXXX  # [후속 ADR 필요] Agent Skills 카탈로그 채택 결정 (agentskills.io 표준, P0 8종)
related_specs:
  - SPEC-0003  # Shareable URL — Phase B에서 연동
  - SPEC-0004  # Import & Audit — Audit 모드는 이 SPEC에서 제외 (합의됨)
---

# SPEC-0005: AI 코딩 도구 설정 파일 + Agent Skills 생성기

## 1. 배경 (Background)

### 1.1 현재 상태

ConfigDeck은 1.4.0 기준으로 ESLint, Prettier, TypeScript, Tailwind 등 9종 설정 파일 생성기와 Import & Audit 기능(SPEC-0004)을 제공한다. STR-0002(전략 로드맵)에서 "P1 — AI 도구 설정 파일 생성기"가 정의되어 있고, RES-0003 리서치(2026-04-30)가 완료되어 SPEC 작성 조건이 충족되었다.

현재 ConfigDeck에는 AI 코딩 도구(Cursor, GitHub Copilot, Claude Code, OpenAI Codex)를 위한 설정 파일 생성 기능이 없다. 사용자는 다음 중 하나를 선택해야 한다:

- 직접 파일을 작성한다 (시간 비용, 각 도구별 스펙 습득 필요)
- 단일 도구 전용 생성기(CursorRules.org, CopilotCraft.dev 등)를 개별로 방문한다
- awesome-cursorrules 등 커뮤니티 카탈로그에서 찾아 수동 수정한다

Agent Skills(SKILL.md) 영역은 RES-0003 §5.4에서 "스택 기반 묶음 생성 도구가 아직 부재한 블루오션"으로 확인되었다.

### 1.2 문제점

1. **다도구 분산 비용**: 4개 AI 도구를 병행 사용하는 것이 이미 표준이 되었으나(RES-0003 §6.1), 설정 파일을 도구별로 따로 작성해야 한다. 같은 컨텐츠(코드 스타일, 빌드 명령 등)를 4번 반복 입력하는 DRY 위반 문제가 발생한다.
2. **스펙 파악 부담**: AGENTS.md, Cursor MDC, Copilot path-specific instructions, CLAUDE.md는 각기 다른 frontmatter 스펙을 가진다. 개발자가 모든 스펙을 파악하기 어렵다.
3. **Skills 부트스트랩 공백**: Agent Skills는 SKILL.md 1개가 4개 도구 모두에서 동작하지만(RES-0003 §5.2), 스택에 맞는 기본 스킬 셋을 빠르게 생성하는 도구가 없다. Anthropic/OpenAI 공식 스킬 리포(combined 126K+ stars)에 수요가 증명되어 있으나, 스택 기반 패키지화 도구는 부재.
4. **다국어 공백**: 모든 경쟁사가 영어 중심이다(RES-0003 §4.2). 한국어/일본어 개발자를 위한 생성기가 없다.

### 1.3 사용자 요구

- STR-0002 B축: "AI 도구 설정 파일 선점" — 단기(ESLint v9) 수요 이후 중기 유입 채널 확보
- RES-0003 §3.1: "agents.md generator", "cursor rules generator" 등 키워드 검색 수요 성숙 단계 진입 확인
- AGENTS.md의 Linux Foundation 표준화(RES-0003 §2.1): 60,000+ 오픈소스 리포지토리 채택으로 수요 실증됨
- 팀 컨벤션 공유 시나리오: "팀의 AI 컨벤션 + 표준 스킬 셋을 단일 URL로 공유하고 싶다" (SPEC-0003 Shareable URL와 연동)

---

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

**Phase A (1차 출시)**:
- AGENTS.md 생성기 (OpenAI Codex 네이티브, Cursor/Copilot 공식 지원, Claude Code `@AGENTS.md` 임포트 연동)
- Cursor MDC 생성기 (`.cursor/rules/*.mdc` — 다중 파일, YAML frontmatter + Markdown)
- GitHub Copilot 인스트럭션 생성기 (`.github/copilot-instructions.md` — 단일 파일)
- Claude CLAUDE.md 생성기 (`@AGENTS.md` 임포트 1줄 + Claude 특화 섹션)
- Agent Skills 카탈로그 P0 8종: `commit`, `pr-create`, `pr-review`, `test-writer`, `debug`, `refactor`, `adr-create`, `readme-update`
- 한국어/영어 i18n (설정 파일 본문 포함)
- ZIP 다운로드 (다중 파일 Cursor MDC) + 개별 복사 (단일 파일)

**Phase B (확장)**:
- Copilot path-specific instructions (`.github/instructions/*.instructions.md`) — glob 단위 분리
- Cursor MDC 다중 파일 사용자 토픽 직접 지정
- 스택별 Skills 카탈로그 추가 (`new-component`, `new-page`, `new-api-route`, `vitest-setup`, `playwright-setup` 등)
- Shareable URL 연동 (SPEC-0003 시스템 재사용) — 설정 + Skills 셋 통합 공유

**Phase C (장기)**:
- 일본어 지원
- Codex 글로벌 설정(`~/.codex/AGENTS.md`) 생성 옵션
- AGENTS.md 표준 채택 도구 추가 (Windsurf, Gemini CLI 등)
- 메타 스킬: `skill-creator`, `init-claude-md`

### 2.2 다루지 않는 것 (Out of Scope)

- **Audit 모드**: AI 설정 문서(AGENTS.md, CLAUDE.md 등)는 자유 형식 자연어이므로 "위반"의 정의가 불가능하고, 사용자에게 실질적 가치가 낮다. 합의된 제외 항목.
- **형식 변환** (`.cursorrules` → MDC, MDC ↔ AGENTS.md 등): 본 생성기가 모든 형식을 동시 출력하므로 변환 수요 자체가 거의 없다. 합의된 제외 항목.
- **자동 적용/PR 생성**: 클라이언트 도구의 원칙(데이터 외부 전송 없음)을 유지한다. 사용자가 결과를 복사/다운로드해 직접 적용한다.
- **AI 기반 자연어 생성**: Phase A/B는 스택 기반 정적 템플릿 조합. AI 통합은 트래픽 검증 후 별도 검토.
- **사용자 계정/저장 기능**: 정적 사이트 아키텍처 원칙 유지. Shareable URL(SPEC-0003)로 대체.
- **CLI 통합** (`npx configdeck init`): STR-0002 P1 별도 항목. 본 SPEC 범위 외.

> **Why Out of Scope 명시:** Audit 모드와 형식 변환은 개발 비용 대비 사용자 가치가 낮다는 것을 사용자와 합의했다. 나머지 항목은 현재 아키텍처 원칙이나 별도 SPEC과 충돌하므로 범위를 명확히 분리한다.

---

## 3. 제안 (Proposal)

### 3.1 개요

ConfigDeck에 "AI 코딩 도구 통합 생성기" 페이지를 신설한다. 사용자가 스택과 선호 옵션을 한 번 입력하면, 4개 AI 도구(Cursor, GitHub Copilot, Claude Code, OpenAI Codex)의 설정 파일과 자주 쓰는 Agent Skills 묶음을 한국어/영어로 동시 생성한다.

**차별화 포지셔닝** (RES-0003 §7.2):
> "스택을 고르면 4개 AI 도구의 설정 파일과 자주 쓰는 Skills 묶음을 한국어/영어로 한 번에 부트스트랩하는 도구"

경쟁사(CursorRules.org, DevTk.AI, CopilotCraft.dev 등)는 단일 도구 전용 또는 영어 전용이다. 4개 도구 통합 + 다국어 + Skills 결합을 동시에 제공하는 서비스는 RES-0003 §4.2 조사에서 발견되지 않았다.

### 3.2 상세 설계

#### 3.2.1 사용자 입력 구조 (3단계)

**1단계 — 프로젝트 스택 선택**

기존 9종 생성기와 동일한 스택 프리셋 데이터 모델을 재사용한다.

| 입력 항목 | 선택지 (예시) | 비고 |
|-----------|--------------|------|
| 프레임워크 | React, Next.js, Astro, Vue, Svelte, 없음(Vanilla) | 복수 선택 가능 |
| 언어 | TypeScript, JavaScript, Python, Go | 단일 선택 |
| 패키지 매니저 | pnpm, npm, yarn, bun | 단일 선택 |
| 테스트 도구 | Vitest, Jest, Playwright, Cypress, 없음 | 복수 선택 가능 |

> **Why 스택 입력이 필요한가:** AGENTS.md의 `Commands` 섹션(빌드/실행 명령)과 `Testing` 섹션은 스택에 따라 달라진다. GitHub Blog의 2,500+ AGENTS.md 분석(RES-0003 §2.2)에서 이 두 섹션이 가장 높은 영향력을 가진다고 확인되었다.

**2단계 — 베스트 프랙티스 체크리스트**

카탈로그 체크리스트 방식을 채택한다. GitHub Blog의 6대 핵심 섹션(RES-0003 §2.2)을 기반으로 구성한다.

| 섹션 | 체크리스트 항목 예시 |
|------|---------------------|
| Code Style | 함수형 컴포넌트만 사용, named export만 사용, 파일당 1 컴포넌트 |
| Git Workflow | Conventional Commits, squash merge, PR 리뷰 필수 |
| Testing | 신규 기능 단위 테스트 필수, E2E 커버리지 필수, TDD 권장 |
| Boundaries | 직접 수정 가능 / 먼저 물어볼 것 / 절대 하지 말 것 |

> **결정 필요 항목 (1):** 2단계 입력 방식 — 카탈로그 체크리스트(권장) vs 자유 텍스트 vs 혼합. 권장안 채택 이유: 자유 텍스트는 품질이 사용자 작성 능력에 의존하고, 베스트 프랙티스 인지도가 낮은 사용자에게 시작점을 제공하지 못한다. 카탈로그는 GitHub Blog 분석 기반 검증된 패턴을 즉시 활용할 수 있게 한다.

**3단계 — Boundaries 3-tier (선택)**

RES-0003 §2.2에서 AGENTS.md 6대 핵심 섹션 중 하나로 확인된 Boundaries 패턴을 구조화한 입력으로 지원한다.

```
✅ Always do (AI가 항상 수행): 예) "커밋 전 lint --fix 실행"
⚠️ Ask first (먼저 확인): 예) "기존 DB 스키마 변경", "의존성 추가"
🚫 Never do (절대 금지): 예) "프로덕션 DB 직접 수정", "비밀키 코드에 삽입"
```

각 tier별로 자주 쓰이는 항목을 체크박스로 제공하고, 사용자 정의 항목 추가 입력란을 병행한다.

#### 3.2.2 출력 설계

**Phase A 산출물 목록**

| 파일 | 경로 | 형식 | 생성 방식 |
|------|------|------|-----------|
| AGENTS.md | `AGENTS.md` | 순수 Markdown | 6대 섹션 + 스택 기반 Commands 자동 채움 |
| Cursor MDC | `.cursor/rules/general.mdc`, `.cursor/rules/testing.mdc`, `.cursor/rules/frontend.mdc` | YAML frontmatter + Markdown | 3파일 고정 분리 (Phase B에서 사용자 토픽 지정으로 확장) |
| Copilot instructions | `.github/copilot-instructions.md` | Markdown (frontmatter 없음) | AGENTS.md 본문 기반 단일 파일 |
| CLAUDE.md | `CLAUDE.md` | Markdown | `@AGENTS.md` 1줄 임포트 + Claude 특화 섹션 |
| Skills (×8) | `.claude/skills/{name}/SKILL.md` | YAML frontmatter + Markdown | P0 8종 카탈로그에서 선택 생성 |

**AGENTS.md 섹션 구조**

```markdown
# Project: {프로젝트명}

## Commands
{스택 기반 자동 생성: npm/pnpm/yarn + 프레임워크별 dev/build/test 명령}

## Testing
{테스트 도구 선택 기반 자동 생성}

## Project Structure
{프레임워크별 표준 디렉토리 구조}

## Code Style
{체크리스트 2단계에서 선택한 항목}

## Git Workflow
{체크리스트 2단계에서 선택한 항목}

## Boundaries
{3단계에서 입력한 3-tier Boundaries}
```

**Cursor MDC 파일 분리 기준 (Phase A)**

Phase A에서는 3파일 고정 분리로 시작한다:
- `general.mdc` — `alwaysApply: true`, 프로젝트 전반 규칙 (Code Style, Git Workflow)
- `frontend.mdc` — `globs: src/**/*.{tsx,ts,jsx,js,svelte,vue,astro}`, 프론트엔드 규칙
- `testing.mdc` — `globs: **/*.{test,spec}.{ts,js}`, 테스트 규칙

> **결정 필요 항목 (2):** Cursor MDC 파일 분리 기준 — Phase A 자동 3파일 분리(권장) vs 사용자가 직접 토픽 지정. 권장안: Phase A는 3파일 고정으로 출시 복잡도를 낮추고, Phase B에서 사용자 토픽 지정을 추가한다. 근거: Cursor Docs(RES-0003 §1.1)의 "토픽별 다중 파일" 권장 패턴을 따르되 UX 복잡도를 단계적으로 높인다.

**CLAUDE.md 생성 패턴**

```markdown
@AGENTS.md

# Claude-specific Settings

## Permissions
{Boundaries에서 Ask first 항목을 Claude 허가 모델 형식으로 변환}

## Memory
Auto-memory: ~/.claude/projects/{project}/memory/MEMORY.md
```

> **결정 필요 항목 (3):** CLAUDE.md `@AGENTS.md` 임포트 — 자동 삽입(권장) vs 사용자 선택 옵션. 권장안: 자동 삽입. 근거: Claude Code는 AGENTS.md를 직접 읽지 않으므로(RES-0003 §2.3) 임포트 없이는 AGENTS.md 내용이 Claude에 전달되지 않는다. "4개 도구 모두 커버"라는 핵심 가치를 달성하려면 자동 삽입이 필수다.

**Agent Skills 출력**

P0 8종 각각에 대해 SKILL.md를 생성한다. 경로는 `.claude/skills/{name}/SKILL.md`로 고정한다.
→ Cursor가 `.claude/skills/`를 레거시 호환으로 자동 인식하므로(RES-0003 §5.2), 이 경로 1개로 4개 도구 모두에서 동작한다.

**SKILL.md 기본 구조**:

```markdown
---
name: commit
description: 변경사항을 분석하여 Conventional Commit 형식의 커밋 메시지를 생성한다. git diff 또는 스테이징 내용이 있을 때 자동 트리거.
---

# Commit Message Generator

{스택 및 체크리스트 선택 기반 지시문}
```

> **결정 필요 항목 (4):** Skills frontmatter 도구별 분기 — 공통 필드(`name`, `description`)만 기본 생성(권장) vs Claude 확장 필드(`disable-model-invocation`, `paths`, `allowed-tools` 등) 옵션 노출. 권장안: Phase A는 공통 필드만 생성. Claude 확장 필드는 Phase B에서 "고급 옵션(접기)"으로 추가. 근거: agentskills.io 표준(RES-0003 §5.1)의 최소 요건이 `name` + `description`이며, Phase A에서 진입 장벽을 낮추는 것이 우선이다.

**출력 패키징**

| 파일 유형 | 다운로드 방식 |
|-----------|-------------|
| 단일 파일 (AGENTS.md, CLAUDE.md, Copilot instructions, 개별 SKILL.md) | 클립보드 복사 + 개별 다운로드 버튼 |
| 다중 파일 묶음 (Cursor MDC 3파일, Skills 폴더) | ZIP 다운로드 |
| 전체 묶음 | ZIP 다운로드 (모든 파일 포함) |

> **결정 필요 항목 (5):** 출력 패키징 세부 조합 — ZIP + 개별 복사 병행(권장) vs ZIP 단독 vs 개별 복사 단독. 권장안: 병행. 근거: Cursor MDC(3파일)는 ZIP 없이는 사용 불편하고, AGENTS.md처럼 단일 파일은 클립보드 복사가 더 빠르다. 사용자 맥락에 따라 선택 가능하게 한다.

#### 3.2.3 기존 자산 재사용

| 기존 자산 | 재사용 방식 |
|-----------|-----------|
| 스택 프리셋 데이터 모델 | 1단계 스택 선택 UI에 그대로 재사용 |
| 옵션 체크리스트 UX 패턴 (9종 생성기) | 2단계 베스트 프랙티스 체크리스트에 동일 패턴 적용 |
| Shareable URL 시스템 (SPEC-0003) | Phase B에서 설정+Skills 셋 통합 공유에 연동 |
| 한/영 i18n 인프라 | 설정 파일 본문의 다국어 생성에 적용 |

> **결정 필요 항목 (6):** Skills와 설정 파일의 관계 — 한 생성기 페이지에서 동시 생성(권장) vs 분리된 페이지/탭. 권장안: 동시 생성. 근거: RES-0003 §6.1 통합 권장. 같은 입력(스택+체크리스트)에서 설정 파일과 Skills를 함께 생성하면 S1 강점("스택 기반 복수 파일 조합")이 극대화된다. 분리 시 사용자가 두 번 입력해야 하고, "통합 부트스트래퍼" 포지셔닝이 희석된다.

### 3.3 사용자 플로우

**Phase A 기본 플로우**:

1. `/ai-config` 페이지 진입 (또는 `/ko/ai-config`)
2. **1단계**: 스택 선택 — 프레임워크, 언어, 패키지 매니저, 테스트 도구
3. **2단계**: 베스트 프랙티스 체크리스트 — Code Style / Git Workflow / Testing 섹션별 선택
4. **3단계** (선택): Boundaries 3-tier 커스터마이징
5. 미리보기 탭: AGENTS.md / Cursor MDC / Copilot / CLAUDE.md / Skills 탭 전환으로 각 산출물 확인
6. 다운로드:
   - "전체 ZIP 다운로드" 버튼 (모든 파일 포함)
   - 각 파일별 "복사" 버튼 (미리보기 탭 상단에 위치)

**Phase B 추가 플로우**:

- Shareable URL 생성: "링크 공유" 버튼 → URL 복사 → 팀원이 동일 설정으로 즉시 생성 가능

---

## 4. 근거 (Rationale)

- **AGENTS.md를 1차 산출물로 선택**: OpenAI Codex 네이티브, Cursor/Copilot 공식 지원, Claude Code `@AGENTS.md` 임포트로 4개 도구 모두 커버 가능. 60,000+ 리포 채택, Linux Foundation 표준화로 안정성 확보. (RES-0003 §2.1, §2.3)
- **4개 도구 통합 생성**: 동일 컨텐츠(스택 명령어, 코드 스타일 등)를 4번 반복하지 않기 위한 DRY 원칙. 사용자가 도구별로 개별 방문할 때의 마찰을 제거. (RES-0003 §6.1)
- **Skills P0 8종 동시 출시**: GitHub Blog 2,500+ AGENTS.md 분석 6대 핵심 섹션(Testing, Git workflow 등)과 awesome-claude-skills 빈출 패턴의 교집합으로 선정. 스택 기반 묶음 생성기 시장 부재로 블루오션 진입 가능. (RES-0003 §5.3, §5.4, §5.5)
- **Skills 경로 `.claude/skills/`**: Cursor 2.4+가 이 경로를 레거시 호환으로 자동 인식하므로 SKILL.md 1개로 4개 도구에서 동작. (RES-0003 §5.2)
- **한/영 1차 출시 필수**: 모든 경쟁사가 영어 전용. 다국어 지원이 STR-0002의 핵심 강점 S4. (RES-0003 §4.2, STR-0002 §자사 강점)
- **Copilot path-specific instructions를 Phase B로 이동**: Phase A는 `.github/copilot-instructions.md` 단일 파일로 충분. path-specific(`.github/instructions/*.instructions.md`)은 glob 분리 UX 설계가 필요해 Phase A 복잡도를 높이므로 Phase B로 연기. (RES-0003 §1.2)

---

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|------|------|------|------|-----------|
| A. 도구별 분리 페이지 | `/ai-config/cursor`, `/ai-config/copilot` 등 도구별 개별 생성기 | 도구별 SEO 최적화 용이, 구현 단순 | 사용자 4번 방문 필요, DRY 위반, 통합 포지셔닝 불가 | 불채택 (통합 SEO 전략과 병행 — 상세 페이지는 SEO용으로 유지, 생성기 자체는 통합) |
| B. ZIP 단독 다운로드 | 모든 파일을 ZIP으로만 제공 | 구현 단순 | 단일 파일(AGENTS.md 등) 복사 시 ZIP 열어야 하는 불편 | 불채택 (개별 복사 병행 채택) |
| C. 자유 텍스트 입력 | 베스트 프랙티스를 자유 텍스트로 입력 | 유연성 최대 | 빈 캔버스 앞에서 사용자 이탈 위험, 품질 불균일 | Phase B에서 보조 입력으로 검토 |
| D. Skills 전용 별도 페이지 | `/ai-skills` 별도 생성기 | Skills 독립 SEO, 개별 마케팅 | 설정+Skills 시너지 소실, 사용자 두 번 입력 | 불채택 (SEO용 랜딩은 별도, 생성기 자체는 통합) |
| E. Skills Phase B 이동 | Skills를 Phase B로 연기, Phase A는 설정 파일만 | Phase A 출시 속도 향상 | Skills 블루오션 선점 지연, "통합 부트스트래퍼" 포지셔닝 약화 | 불채택 (Skills가 핵심 신규 차별화이므로 Phase A 포함) |

---

## 6. 실행 계획 (Execution Plan)

### 6.1 단계

| 단계 | 작업 | 산출물 | 선행 조건 |
|------|------|--------|-----------|
| 1 | SPEC-0005 검토 및 승인 | 승인된 SPEC | - |
| 2 | 후속 ADR 2개 작성 (채택 형식 우선순위, Skills 카탈로그) | ADR-XXXX × 2 | 1 |
| 3 | AGENTS.md 생성기 데이터 모델 설계 (6대 섹션 + 스택별 Commands) | 타입 정의, 스택 데이터 파일 | 2 |
| 4 | Cursor MDC 생성기 (3파일 고정 분리) | 생성 로직, frontmatter 빌더 | 3 |
| 5 | Copilot instructions 생성기 (단일 파일) | 생성 로직 | 3 |
| 6 | CLAUDE.md 생성기 (`@AGENTS.md` 임포트 + 특화 섹션) | 생성 로직 | 3 |
| 7 | Skills P0 8종 템플릿 작성 (스택 기반 분기 포함) | SKILL.md 템플릿 × 8 | 3 |
| 8 | 생성기 UI 구현 (3단계 입력 + 미리보기 탭 + 다운로드) | Svelte 컴포넌트 | 4, 5, 6, 7 |
| 9 | ZIP 패키징 로직 구현 | JSZip 또는 동등 라이브러리 통합 | 8 |
| 10 | i18n 메시지 작성 (한/영) | 번역 파일 | 8 |
| 11 | SEO 랜딩 페이지 신설 (`/ai-config`, `/ai-config/cursor` 등) | Astro 페이지, JSON-LD, hreflang | 8 |
| 12 | 단위 테스트 (생성 로직) | Vitest 테스트 | 4~7 |
| 13 | E2E 테스트 (생성 + 다운로드 플로우) | Playwright 테스트 | 8, 9 |

### 6.2 마일스톤

- **M1**: 후속 ADR 2개 승인 (2026-04-30 ADR-0017/0018 승인 완료) + 확인 지점 결정(2026-04-30 CP-1~CP-7 확정) + 데이터 모델/타입 정의 완료
- **M2**: AGENTS.md + CLAUDE.md 생성기 로직 완료 (핵심 산출물 우선)
- **M3**: Cursor MDC + Copilot instructions + Skills P0 8종 생성기 로직 완료
- **M4**: UI 구현 + ZIP 패키징 완료
- **M5**: i18n + SEO 랜딩 완료 + QA 통과 → Phase A 출시

### 6.3 확인 지점 (Checkpoints) — 결정 완료

> 2026-04-30 사용자 승인 완료. 모든 결정 사항이 확정되었다.

- [x] **CP-1**: 2단계 입력 방식 → **카탈로그 체크리스트 + 자유 텍스트 병행**
  - 카탈로그가 기본 UX이고, 자유 텍스트로 추가 지시사항을 보완할 수 있게 한다
  - 자유 텍스트 입력은 출력 시 "Additional Notes" 또는 동등한 섹션에 자연어 그대로 삽입
- [x] **CP-2**: Cursor MDC Phase A 파일 분리 기준 → **3파일 고정 자동 분리**
  - `core.mdc` (alwaysApply: true), `stack.mdc` (globs 기반), `boundaries.mdc` (description 기반)
  - 사용자 토픽 지정은 Phase B로 이연
- [x] **CP-3**: CLAUDE.md `@AGENTS.md` 임포트 → **조건부 자동 삽입 + 안내 문구**
  - **Claude Code만 단독 사용**으로 표시한 경우: 임포트 없이 CLAUDE.md를 단일 진실원으로 작성
  - **Claude Code 외 다른 도구도 함께 사용**: `@AGENTS.md` 자동 삽입
  - UI에 안내 문구 노출: "Claude Code는 AGENTS.md를 직접 읽지 않으므로 임포트가 필요합니다." + [공식 문서 링크](https://code.claude.com/docs/en/memory#agentsmd)
- [x] **CP-4**: Skills frontmatter → **Phase A는 공통 필드만, Phase B 고급 옵션 토글**
  - Phase A: `name`, `description`만 출력 (agentskills.io 표준 최소 요건)
  - Phase B: "고급 옵션 표시" 토글 추가 → Claude 확장 필드(`disable-model-invocation`, `allowed-tools`, `paths` 등) 선택적 노출
- [x] **CP-5**: 출력 패키징 → **개별 복사 + 전체 ZIP 다운로드**
  - 파일별 [복사] 버튼 + [전체 다운로드] ZIP 버튼 병행
  - **Shareable URL은 Phase A에서 제외** (이 기능은 기술 스택 생성기와 달리 필수성이 낮음. Phase B에서도 선택적 추가 항목)
- [x] **CP-6**: Skills와 설정 파일 → **한 페이지 동시 생성**
  - `/ai-config` 단일 페이지에서 스택 → 베스트 프랙티스 → Skills 선택 → 통합 출력
- [x] **CP-7**: ZIP 라이브러리 → **기존 JSZip(`^3.10.1`) 재사용, 신규 ADR 불필요**
  - 스택 생성기에서 이미 사용 중인 JSZip을 그대로 재사용
  - 동일 라이브러리 사용으로 번들 크기 추가 0, 일관성 유지

---

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| AGENTS.md/SKILL.md 표준 스펙 변경 | 중간 — 생성된 파일이 구 스펙을 따를 수 있음 | AGENTS.md는 Linux Foundation 표준화로 안정성 확보(RES-0003 §2.1). agentskills.io 표준 변경 모니터링. frontmatter 필드는 `name`+`description` 최소 공통만 Phase A에서 사용 |
| Cursor MDC 스펙 변경 | 중간 — `.cursor/rules/` 경로나 frontmatter 변경 가능 | Cursor Docs 공식 채널 모니터링. MDC는 2025년 기준 안정화 단계 (RES-0003 §1.1) |
| Skills 콘텐츠 품질 | 중간 — 잘못된 SKILL.md는 잘못된 AI 행동 유발 | Phase A P0 8종은 Anthropic 공식 패턴(anthropics/skills 126K stars) + awesome-claude-skills 큐레이션 + 공식 docs에서 검증된 패턴만 사용 (RES-0003 §5.5) |
| ZIP 라이브러리 번들 크기 | 낮음 — 정적 사이트 번들 크기 증가 | 클라이언트 사이드 ZIP은 lazy import. 필요 시 ADR 작성하여 라이브러리 비교 |
| Phase A 출시 지연 시 Skills 블루오션 선점 실패 | 중간 — 경쟁사가 먼저 Skills 생성기 출시 가능 | MVP 범위를 Phase A로 명확히 제한. Audit/변환/고급 UX는 모두 Phase B+ |
| SEO 키워드 성숙도 | 낮음 — RES-0003 §6.3에서 이미 성숙 단계 진입 확인 | 도구별 랜딩 페이지를 Phase A에서 함께 신설하여 초기 색인 확보 |

---

## 8. 성공 지표 (Success Metrics)

> RES-0003 §7.4의 KPI 추가 권장 항목을 반영.

- **AGENTS.md 생성 수** (월간): Phase A 출시 후 3개월 내 300건/월 달성
- **SKILL.md 생성 수** (월간): Phase A 출시 후 3개월 내 200건/월 달성
- **가장 인기 있는 Skills Top 5**: 사용자 선택 패턴 파악 → Phase B 스택별 Skills 우선순위 결정에 활용
- **ZIP 다운로드 비율**: 전체 생성 대비 ZIP 사용 비율 → 패키징 UX 개선 판단 기준
- **Shareable URL 중 AI 파일 비중** (Phase B 이후): 팀 공유 시나리오 검증
- **`/ai-config` 페이지 유기 검색 유입**: 3개월 내 월 500 세션 달성

---

## 9. SEO 고려사항

ConfigDeck의 핵심 유입 채널은 SEO다(STR-0002 §자사 강점 S3). 아래 SEO 구조를 Phase A에 포함한다.

### 9.1 URL 구조

| 페이지 | 한국어 URL | 영어 URL |
|--------|-----------|---------|
| 통합 생성기 허브 | `/ko/ai-config` | `/en/ai-config` |
| Cursor 설정 랜딩 | `/ko/ai-config/cursor` | `/en/ai-config/cursor` |
| AGENTS.md 랜딩 | `/ko/ai-config/agents-md` | `/en/ai-config/agents-md` |
| Copilot 인스트럭션 랜딩 | `/ko/ai-config/copilot` | `/en/ai-config/copilot` |
| Claude Code CLAUDE.md 랜딩 | `/ko/ai-config/claude-code` | `/en/ai-config/claude-code` |
| Agent Skills 랜딩 | `/ko/ai-config/agent-skills` | `/en/ai-config/agent-skills` |

### 9.2 타겟 키워드 (근거: RES-0003 §3.1)

| 키워드 | 언어 | 우선순위 |
|--------|------|---------|
| agents.md generator | 영어 | P0 |
| cursor rules generator | 영어 | P0 |
| copilot instructions generator | 영어 | P0 |
| CLAUDE.md 생성기 | 한국어 | P0 |
| cursor rules 생성기 | 한국어 | P0 |
| agent skills generator | 영어 | P1 |
| SKILL.md generator | 영어 | P1 |

### 9.3 hreflang 전략

기존 ConfigDeck의 hreflang 패턴을 동일하게 적용한다:

```html
<link rel="alternate" hreflang="ko" href="https://configdeck.dev/ko/ai-config" />
<link rel="alternate" hreflang="en" href="https://configdeck.dev/en/ai-config" />
```

### 9.4 JSON-LD 구조화 데이터

각 도구별 랜딩 페이지에 `SoftwareApplication` 또는 `WebApplication` 스키마를 적용한다. 기존 생성기 랜딩의 JSON-LD 패턴을 재사용.

---

## 10. 후속 ADR 식별

본 SPEC 승인 후 다음 ADR을 작성해야 구현 착수가 가능하다.

| ADR | 제목 | 결정 내용 | 우선순위 |
|-----|------|----------|---------|
| ADR-XXXX | AI 도구 설정 파일 생성기 채택 형식 우선순위 | AGENTS.md를 1차 산출물로, MDC/Copilot instructions/CLAUDE.md를 부가 산출물로 선언. `.cursorrules` 레거시 제외 근거 | M1 (구현 착수 전 필수) |
| ADR-XXXX | Agent Skills 카탈로그 채택 결정 | agentskills.io 표준 채택, P0 8종 범위 확정, `.claude/skills/` 경로 선택 근거 | M1 (구현 착수 전 필수) |
| ADR-XXXX (조건부) | ZIP 라이브러리 선택 | JSZip vs 대안 비교. 번들 크기 + 라이선스 검토 필요 시 ADR 작성 | M1~M2 |

---

## 11. 참고 자료 (References)

### 핵심 근거 자료
- [RES-0003 AI 코딩 도구 설정 파일 생성기 시장 리서치](../../../research/reports/RES-0003-ai-tool-config-files-2026-04.md) — 본 SPEC의 모든 결정의 출발점
- [STR-0002 ConfigDeck 시장 진입 및 성장 전략](../../../research/reports/STR-0002-configdeck-strategy-2026-04.md) — B축 전략 근거

### 공식 문서
- [Cursor Docs — Rules](https://cursor.com/docs/context/rules) — MDC 형식, 4가지 Rule Type, frontmatter 필드
- [GitHub Docs — Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — Copilot instructions 스펙
- [Claude Code Docs — Memory](https://code.claude.com/docs/en/memory) — CLAUDE.md 계층, `@AGENTS.md` 임포트 문법
- [OpenAI Codex Docs — AGENTS.md](https://developers.openai.com/codex/guides/agents-md) — 탐색 순서, 32 KiB 제한
- [agents.md — 표준 사이트](https://agents.md/) — AGENTS.md 표준 정의, 60K+ 채택 통계
- [OpenAI — Agentic AI Foundation](https://openai.com/index/agentic-ai-foundation/) — Linux Foundation 표준화 발표
- [agentskills.io — Agent Skills 표준](https://agentskills.io) — SKILL.md 표준, 30+ 채택 도구

### 분석 자료
- [GitHub Blog — How to write a great agents.md (2,500+ repos)](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — 6대 핵심 섹션, Boundaries 3-tier 근거
- [GitHub — anthropics/skills](https://github.com/anthropics/skills) — P0 선정 기준 (126K stars, 검증된 패턴)
- [GitHub — travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — 커뮤니티 큐레이션 (Skills 카탈로그 소재)

### 경쟁사 (차별화 근거)
- [CursorRules.org](https://cursorrules.org/) — Cursor 단일 도구, 영어 전용
- [DevTk.AI AGENTS.md Generator](https://devtk.ai/en/tools/agents-md-generator/) — 영어 전용, Skills 없음
- [CopilotCraft.dev](https://www.copilotcraft.dev/) — Copilot 단일 도구, 영어 전용

---

## 12. 변경 이력 (Changelog)

| 날짜 | 변경 내용 | 변경자 |
|------|----------|--------|
| 2026-04-30 | 초안 작성. RES-0003 리서치 완료 후 SPEC 신설. Phase A/B/C 범위 정의, 결정 필요 항목 7가지 명시 | product-planner |

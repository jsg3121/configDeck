# RES-0003: AI 코딩 도구 설정 파일 생성기 시장 리서치

- 조사일: 2026-04-30
- 최종 수정: 2026-04-30 (Agent Skills 챕터 추가)
- 조사자: /research 스킬
- 목적: STR-0002 전략 옵션 B축(AI 도구 설정 파일 선점) 실행 가능성 검증, 다음 SPEC 작성 근거 자료
- 조사 범위: Cursor, GitHub Copilot, Claude Code, OpenAI Codex (4개 도구)
- 조사 영역: (1) 설정 파일 생성, (2) Agent Skills 템플릿 (확장 영역)

---

## 요약

### 설정 파일 영역

1. **4개 도구 중 3개가 AGENTS.md를 공식 또는 우회 지원**한다. Codex는 네이티브, Cursor·Copilot은 AGENTS.md를 보조 형식으로 인정한다. Claude Code는 `CLAUDE.md`만 직접 읽지만 `@AGENTS.md` 임포트로 동일 내용 공유가 가능하다.
2. **AGENTS.md는 사실상 표준**이 되어가고 있다. 2025년 8월 출시 후 8개월 만에 60,000+ 오픈소스 리포지토리에 채택되었고, OpenAI는 이를 Linux Foundation 산하 Agentic AI Foundation에 기증했다.
3. **경쟁사는 이미 다수 존재**한다. CursorRules.org, DevTk.AI, CopilotCraft.dev 등이 운영 중이지만, **4개 도구를 통합 지원하는 다국어 생성기는 발견되지 않았다**. ConfigDeck의 차별화 여지가 있다.
4. **MVP 권장 범위**: AGENTS.md 우선(다도구 호환), Cursor MDC + Copilot path-specific instructions를 부가 산출물로. Claude/Codex 전용 파일은 AGENTS.md 임포트 패턴으로 커버.

### Agent Skills 영역 (확장 발견)

1. **Agent Skills는 4개 도구 모두에서 통용되는 또 하나의 표준**이다. [agentskills.io](https://agentskills.io)가 공식 표준이며, Claude Code(원본 제정), Cursor(2.4+), Copilot(VS Code), Codex가 모두 동일한 `SKILL.md` 형식을 채택했다. 30+ 도구가 호환.
2. **Anthropic skills 리포는 GitHub 스타 126K**, 이미 거대한 커뮤니티 자산이 형성됨. 자주 등장하는 패턴(테스트, 리뷰, PR, 디버깅, 마이그레이션 등) 카탈로그화 가능.
3. **Skills 생성기 시장은 설정 파일보다 더 비어 있다.** 단일 SKILL.md 작성 가이드는 다수 있으나, **스택 기반으로 자주 쓰이는 스킬을 패키지로 생성하는 도구는 발견되지 않았다**. 진정한 블루오션.
4. **MVP 확장 권장**: AI 설정 파일 + Agent Skills 템플릿 카탈로그를 결합한 "AI 워크플로우 부트스트래퍼"로 포지션. ConfigDeck의 "스택 기반 복수 파일 조합" S1 강점이 이 영역에서 더욱 강력하게 작동.

---

## 1. 도구별 파일 스펙

### 1.1 Cursor

| 항목 | 내용 |
|------|------|
| 표준 경로 | `.cursor/rules/*.mdc` (디렉토리 기반, 다중 파일) |
| 레거시 경로 | `.cursorrules` (단일 파일, 공식 문서에서 더 이상 언급되지 않음) |
| 대안 | 프로젝트 루트 `AGENTS.md` (공식 지원) |
| 형식 | MDC = YAML frontmatter + Markdown 본문 |
| 파일 단위 | 토픽별 다중 파일 권장. `frontend/`, `backend/` 등 폴더 구조화 가능 |

**MDC frontmatter 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `description` | string | 룰 용도. Agent가 적용 여부 판단에 사용 |
| `globs` | string | 파일 패턴 (쉼표 구분). 매칭 시 자동 적용 |
| `alwaysApply` | boolean | true면 모든 세션에 무조건 포함 |

**4가지 Rule Type**:
- Always Apply: `alwaysApply: true`
- Apply Intelligently: description만 지정 → Agent가 관련성 판단
- Apply to Specific Files: globs 지정
- Apply Manually: 메타데이터 최소 → `@`-mention으로만 적용

**예시**:
```markdown
---
description: "RPC 서비스 컨벤션 및 패턴"
alwaysApply: false
globs: src/components/**/*.tsx
---

- Use named exports, not default exports
- Co-locate styles in module CSS files
```

**참고**: [Cursor Docs - Rules](https://cursor.com/docs/context/rules)

---

### 1.2 GitHub Copilot

Copilot은 **여러 형식의 인스트럭션을 동시 지원**한다:

| 형식 | 경로 | 형식 | 적용 범위 |
|------|------|------|----------|
| Repository instructions | `.github/copilot-instructions.md` | Markdown (frontmatter 없음) | 저장소 전체 |
| Path-specific instructions | `.github/instructions/NAME.instructions.md` | Markdown + frontmatter (`applyTo`, `excludeAgent`) | glob 패턴 매칭 파일 |
| Agent instructions | `AGENTS.md` 또는 `CLAUDE.md`, `GEMINI.md` | Markdown | 가장 가까운 파일 우선 |
| Personal instructions | GitHub.com 사용자 설정 | - | 본인 모든 요청 |
| Home directory | `$HOME/.copilot/copilot-instructions.md` | Markdown | CLI 글로벌 |

**Path-specific frontmatter**:
```markdown
---
applyTo: "**/*.ts,**/*.tsx"
excludeAgent: "code-review"
---
```

**지원 환경**: GitHub.com, VS Code, Visual Studio, JetBrains, Copilot CLI, Copilot cloud agent

**참고**:
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Add custom instructions for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)

---

### 1.3 Claude Code

| 항목 | 내용 |
|------|------|
| 프로젝트 경로 | `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` |
| 사용자 경로 | `~/.claude/CLAUDE.md` (모든 프로젝트 공통) |
| 로컬 (gitignore) | `./CLAUDE.local.md` |
| 관리형 정책 | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) 등 |
| 다중 파일 | `.claude/rules/*.md` 디렉토리 (path-scoped 지원) |
| 형식 | 순수 Markdown (frontmatter는 path-scoped rules에서 `paths` 필드만) |

**핵심 특징**:
- **임포트 문법**: `@path/to/file.md` — 다른 파일을 컨텍스트에 포함. 최대 5단계 재귀
- **AGENTS.md 호환**: Claude Code는 `AGENTS.md`를 직접 읽지 **않지만**, `CLAUDE.md`에 `@AGENTS.md`로 임포트하면 동일 효과
- **권장 크기**: 200줄 이하
- **Auto memory**: `~/.claude/projects/<project>/memory/MEMORY.md` (Claude가 자동 관리, v2.1.59+)

**Path-scoped rules 예시**:
```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules
- All API endpoints must include input validation
```

**참고**: [Claude Code - Memory](https://code.claude.com/docs/en/memory)

---

### 1.4 OpenAI Codex (AGENTS.md)

| 항목 | 내용 |
|------|------|
| 프로젝트 경로 | 저장소 루트 `AGENTS.md`, 하위 디렉토리 중첩 가능 |
| 글로벌 경로 | `~/.codex/AGENTS.md` (또는 `CODEX_HOME` 환경변수) |
| 오버라이드 | `AGENTS.override.md` (각 레벨에서 우선 적용) |
| 형식 | 순수 Markdown (frontmatter 없음) |
| 최대 크기 | 32 KiB 기본값 (`project_doc_max_bytes` 설정으로 조정) |
| 폴백 파일명 | `project_doc_fallback_filenames` 설정으로 `TEAM_GUIDE.md` 등 지정 가능 |

**탐색 우선순위**:
1. 글로벌: `~/.codex/AGENTS.override.md` → `AGENTS.md` (첫 번째 발견 파일만)
2. 프로젝트: Git 루트 → 현재 디렉토리까지 하향 탐색
3. 각 디렉토리에서 `AGENTS.override.md` → `AGENTS.md` → 폴백 순
4. 병합 규칙: 현재 디렉토리에 가까운 파일이 이전 지침을 오버라이드

**참고**:
- [OpenAI Codex - AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)
- [agents.md (공식 표준 사이트)](https://agents.md/)

---

## 2. AGENTS.md 표준의 위상

### 2.1 채택 통계

- **60,000+ 오픈소스 리포지토리** 채택 (2025년 8월 ~ 2026년 4월, 약 8개월)
- **20+ AI 도구 지원**: Codex, Cursor, Copilot, Claude Code, Gemini CLI, Devin, Windsurf, Jules, Factory, goose, opencode, Zed, Warp, Aider, JetBrains Junie, RooCode, Kilo Code, Phoenix, Semgrep 등
- **거버넌스**: OpenAI가 Linux Foundation 산하 [Agentic AI Foundation](https://openai.com/index/agentic-ai-foundation/)에 기증

### 2.2 GitHub Blog 분석 (2,500+ 리포 분석)

GitHub 공식 블로그가 2,500+ AGENTS.md를 분석한 결과 [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)에서 도출한 **6대 핵심 섹션**:

1. **Commands** — 빌드/실행 명령어 (앞부분 배치 권장)
2. **Testing** — 테스트 실행/작성 가이드
3. **Project structure** — 디렉토리 레이아웃
4. **Code style** — 컨벤션, 패턴
5. **Git workflow** — 커밋/PR 규칙
6. **Boundaries** — ✅ Always do / ⚠️ Ask first / 🚫 Never do 3-tier 시스템

**작성 베스트 프랙티스**:
- 정확한 버전 명시 (general이 아닌 specific)
- 설명보다 코드 예시
- 명령어를 앞쪽에 배치
- 작은 범위로 시작 후 확장

### 2.3 4개 도구의 AGENTS.md 호환 매트릭스

| 도구 | AGENTS.md 직접 읽기 | 우회 지원 방식 |
|------|---------------------|--------------|
| OpenAI Codex | ✅ 네이티브 (1순위) | - |
| GitHub Copilot | ✅ 공식 지원 | path-specific instructions와 병행 가능 |
| Cursor | ✅ 공식 지원 (Nested 지원) | `.cursor/rules/*.mdc` 병행 가능 |
| Claude Code | ❌ 직접 읽지 않음 | `CLAUDE.md`에 `@AGENTS.md` 임포트 필요 |

**시사점**: AGENTS.md 1개 + Claude용 1줄 임포트(`@AGENTS.md`)만으로 4개 도구 모두 커버 가능.

---

## 3. 시장 수요

### 3.1 검색 키워드 동향

검색량 정량 데이터(예: Google Keyword Planner)는 이번 조사 범위에서 확인하지 않았으나, 다음 사실이 검색 결과에서 관찰됨:

- "Cursor Rules 2026", "MDC format" 관련 가이드/템플릿 글이 **다수 발행** (Medium, 전문 블로그)
- "agents.md generator", "agents.md template" 키워드로 **다수 도구 사이트 노출**
- "copilot instructions generator" 키워드로 CopilotCraft.dev 등 노출

> **추정**: 키워드 수요는 STR-0002에서 우려한 "미성숙" 단계를 이미 지나고 있음. 60K 리포 채택 + 다수 가이드 발행이 이를 뒷받침.

### 3.2 GitHub 리포 사용량

| 형식 | 추정 사용 리포 수 |
|------|--------------|
| AGENTS.md | 60,000+ (공식 발표) |
| .cursorrules / .cursor/rules | 수만 추정 (PatrickJS/awesome-cursorrules 18K+ 스타) |
| .github/copilot-instructions.md | github/awesome-copilot 등 활발 |
| CLAUDE.md | Anthropic 공식 사이트가 워크플로우로 권장, 정확 통계 미공개 |

---

## 4. 경쟁 환경

### 4.1 기존 생성기 사이트

| 사이트 | 지원 도구 | 형식 | 가격 | 다국어 |
|--------|---------|------|------|------|
| [CursorRules.org](https://cursorrules.org/) | Cursor 전용 | `.cursorrules` + `.mdc` | 무료 | 일부 (정확한 언어 미공개) |
| [DevTk.AI Cursor Rules Generator](https://devtk.ai/en/tools/cursor-rules-generator/) | Cursor | `.cursorrules` | 무료 | 영어 중심 |
| [DevTk.AI AGENTS.md Generator](https://devtk.ai/en/tools/agents-md-generator/) | AGENTS.md (Claude/Copilot/Cursor/Devin/Windsurf/Gemini 호환 명시) | AGENTS.md | 무료 | 영어 중심 |
| [CopilotCraft.dev](https://www.copilotcraft.dev/) | Copilot 전용 | `.instructions.md` + `copilot-instructions.md` | 무료 | 영어 |
| [design.dev Cursor Rules Generator](https://design.dev/ai/cursor-rules-generator/) | Cursor | `.mdc` | 무료 | 영어 |
| [AI Dev Hub](https://aidevhub.io/cursor-rules-generator/) | Cursor + Windsurf | `.cursorrules` + `.windsurfrules` | 무료 | 영어 |

**커뮤니티 카탈로그**:
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 가장 큰 .cursorrules 카탈로그
- [github/awesome-copilot](https://github.com/github/awesome-copilot) — Copilot 공식 커뮤니티 컬렉션
- [agents.md/](https://agents.md/) — AGENTS.md 표준 + 도구 디렉토리

### 4.2 ConfigDeck 차별화 가능 지점

조사 결과, 다음 결합을 동시에 만족하는 서비스는 발견되지 않음:

1. **4개 도구 통합 생성기** — 단일 입력으로 AGENTS.md + Cursor MDC + Copilot path-specific + Claude CLAUDE.md 동시 출력
2. **다국어 (한/영)** — 모든 경쟁사가 영어 중심
3. **스택 기반 옵션 조합** — ConfigDeck S1 강점(스택 → 복수 파일)과 정확히 부합
4. **Shareable URL** — 1.2.0에 도입한 공유 메커니즘과 결합

---

## 5. Agent Skills 표준 (확장 영역)

### 5.1 Agent Skills 표준 개요

Agent Skills는 **AI 에이전트에게 새로운 능력과 전문성을 부여하는 표준화된 형식**이다. Anthropic이 원래 개발하여 오픈 표준으로 공개했고, 이후 30+ AI 도구가 채택했다.

**핵심 구조** (모든 도구 공통):

```text
my-skill/
├── SKILL.md          # 필수: 메타데이터 + 지시문
├── scripts/          # 선택: 실행 가능한 코드
├── references/       # 선택: 상세 참조 문서
├── assets/           # 선택: 템플릿, 리소스
└── ...
```

**SKILL.md 표준 frontmatter** (최소 요구사항):

```yaml
---
name: skill-name
description: 스킬이 무엇을 하고 언제 사용하는지 (자동 트리거 판단에 사용)
---

스킬 본문 (Markdown)
```

**Progressive Disclosure 동작 원리** (3단계):

1. **Discovery**: 시작 시 name + description만 로드 (적은 컨텍스트 비용)
2. **Activation**: 작업이 description과 매치되면 SKILL.md 본문 로드
3. **Execution**: 지시문 따라 실행, 필요 시 scripts/ 또는 references/ 추가 로드

**참고**: [agentskills.io](https://agentskills.io)

### 5.2 도구별 Skills 지원 현황

| 도구 | 표준 채택 | 파일 위치 | 호출 방식 | 특이 사항 |
|------|---------|---------|---------|---------|
| Claude Code | ✅ 원본 제정 | `~/.claude/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md` | `/skill-name` 또는 자동 | frontmatter 확장 다수 (`disable-model-invocation`, `allowed-tools`, `paths`, `context: fork` 등) |
| Cursor | ✅ 2.4+ 공식 지원 | `.cursor/skills/`, `.agents/skills/`, `~/.cursor/skills/` | `/skill-name` 또는 `@skill-name` | **레거시 호환**: `.claude/skills/`, `.codex/skills/` 위치도 자동 인식 |
| OpenAI Codex | ✅ 공식 지원 | `.agents/skills/`, `$HOME/.agents/skills/` | `/skills`, `$skill-name` | `agents/openai.yaml`로 UI 메타데이터 추가 가능 |
| GitHub Copilot | ✅ VS Code 등 지원 | VS Code customizations | Custom Agents 또는 슬래시 명령 | "Custom Agents" 명칭 사용 (구 chat modes) |

**핵심 발견**: Cursor가 `.claude/skills/`와 `.codex/skills/`까지 **레거시 호환**으로 자동 인식한다. 즉 SKILL.md 1개를 작성하면 4개 도구에서 모두 활용 가능. 이는 AGENTS.md와 동일한 "1개 파일 → 다도구 커버" 패턴.

**참고**:
- [Claude Code Docs - Skills](https://code.claude.com/docs/en/skills)
- [Cursor - Skills](https://cursor.com/help/customization/skills)
- [OpenAI Codex - Agent Skills](https://developers.openai.com/codex/skills)
- [GitHub - Copilot Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

### 5.3 자주 쓰이는 Skills 패턴 카탈로그

#### Anthropic 공식 [anthropics/skills](https://github.com/anthropics/skills) (126K stars)

| 카테고리 | 대표 스킬 | 용도 |
|---------|---------|------|
| 문서 처리 | `docx`, `pdf`, `pptx`, `xlsx` | Office 문서 생성/편집 |
| 개발 | `web-artifacts-builder`, `mcp-builder` | React/Tailwind 산출물, MCP 서버 작성 |
| 디자인 | `canvas-design` | PNG/PDF 시각 산출물 |
| 메타 | `skill-creator` | 스킬 자체를 작성하는 스킬 |

#### Claude Code Bundled Skills (모든 세션 자동 제공)

`/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api` 등 — 빌트인이지만 프롬프트 기반이라 사용자가 동일 패턴으로 직접 작성 가능.

#### 커뮤니티 인기 패턴 ([awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills), [obra/superpowers](https://github.com/obra/superpowers) 등)

| 카테고리 | 대표 스킬 |
|---------|---------|
| **테스팅/품질** | TDD 사이클, 테스트 작성, 커버리지 분석, 단위 테스트 부트스트랩 |
| **PR/리뷰** | PR 생성, PR 요약, 보안 리뷰, 코드 리뷰 체크리스트 |
| **디버깅** | 에러 추적, 로그 분석, 재현 단계 작성 |
| **마이그레이션** | 프레임워크 전환, 라이브러리 업그레이드, 리팩토링 |
| **커밋/Git** | 컨벤셔널 커밋, 자동 커밋 메시지, PR 템플릿 |
| **문서화** | README 생성, 아키텍처 문서, ADR 작성 |
| **프로젝트 부트스트랩** | 새 컴포넌트 생성, 새 페이지 생성, 새 API 라우트 생성 |
| **보안** | 정적 분석, 취약점 탐지 (Trail of Bits Skills 등) |

**참고**:
- [GitHub - anthropics/skills](https://github.com/anthropics/skills)
- [GitHub - travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- [GitHub - openai/skills (Skills Catalog for Codex)](https://github.com/openai/skills)

### 5.4 Skills 생성기 시장 현황

**조사 결과 다음 사실 확인**:

- **단일 SKILL.md 작성 가이드/템플릿 사이트**는 다수 존재 (Anthropic 공식 스킬 빌더, awesome-claude-skills 큐레이션 등)
- **스택 기반으로 자주 쓰이는 스킬 묶음을 자동 생성하는 도구는 발견되지 않음**
- AGENTS.md 생성기는 다수이나 (DevTk.AI 등), Skills 생성기는 거의 부재

**시사점**:
- Skills 생성기 시장은 **AGENTS.md 시장보다 더 비어 있다** (블루오션 수준 ↑)
- ConfigDeck S1 강점("스택 기반 복수 파일 조합")이 더 강하게 작동: "React + Vitest + Playwright 선택 시 → 테스트 작성/PR 리뷰/컴포넌트 생성 스킬 자동 패키지"

### 5.5 ConfigDeck Skills 카탈로그 설계 권장안

**1차 카탈로그 (스택 무관 범용)**:

| 스킬 | 용도 | 우선순위 |
|------|------|--------|
| `commit` | 컨벤셔널 커밋 메시지 자동 작성 | P0 |
| `pr-create` | PR 본문 템플릿 + 변경사항 요약 | P0 |
| `pr-review` | PR 보안/품질 체크리스트 | P0 |
| `test-writer` | 단위 테스트 작성 (스택별 분기) | P0 |
| `debug` | 에러 분석 + 재현 단계 | P1 |
| `refactor` | 안전한 리팩토링 절차 | P1 |
| `adr-create` | 의사결정 기록 작성 | P1 |
| `readme-update` | README 자동 갱신 | P2 |

**2차 카탈로그 (스택별)**:

| 스택 | 스킬 |
|------|------|
| React/Next.js | `new-component`, `new-page`, `new-api-route` |
| Astro | `new-island`, `new-content-collection` |
| 백엔드 | `new-endpoint`, `new-migration` |
| 테스트 | `vitest-setup`, `playwright-setup` |

**3차 (선택형 메타 스킬)**:

| 스킬 | 용도 |
|------|------|
| `skill-creator` | 새 스킬을 작성하는 스킬 (Anthropic 공식 패턴) |
| `init-claude-md` | CLAUDE.md/AGENTS.md 초안 자동 생성 |

> **Why P0 선정 기준**: GitHub Blog의 2,500+ AGENTS.md 분석 [6대 핵심 섹션](#22-github-blog-분석-2500-리포-분석)(Commands, Testing, Git workflow, Boundaries 등)과 awesome-claude-skills의 빈출 패턴이 교집합을 이루는 영역.

### 5.6 Skills 영역의 차별화 포인트

기존 ConfigDeck 자산과의 시너지:

| ConfigDeck 자산 | Skills 영역에서의 활용 |
|---------------|------------------|
| 스택 프리셋 | 스택 선택 → 해당 스택용 스킬 묶음 자동 추천 |
| 옵션 체크리스트 (9종 생성기) | "어떤 스킬을 포함할지" 동일 UX 패턴 재사용 |
| Shareable URL | 팀 표준 스킬 셋을 URL로 공유 — 재방문 KPI 강력 추진 |
| 다국어 (한/영) | 모든 경쟁사가 영어 전용 — 다시 한 번 차별화 |

### 5.7 Skills 영역 도입의 리스크

| 리스크 | 평가 | 완화 방안 |
|------|------|--------|
| 표준 진화로 SKILL.md 스펙 변경 | 중간 — Anthropic이 [agentskills.io](https://agentskills.io) 표준 공식 운영 중, 안정성 확보 | 표준 사이트 모니터링, frontmatter 옵션은 핵심 필드(`name`, `description`)만 우선 |
| 스킬 콘텐츠 품질 (자연어 본문) | 중간 — 잘못된 스킬은 잘못된 행동 유발 | 1차는 검증된 패턴(awesome-claude-skills 큐레이션 + 공식 docs)만 카탈로그화 |
| 도구별 frontmatter 차이 | 중간 — Claude는 `disable-model-invocation` 등 확장, Cursor/Codex는 단순 | 공통 부분(name, description) 중심 + 도구별 확장은 옵션 |
| 사용자 인지도 | 낮음 — Skills는 2026년 들어 급속히 확산 중 | "AGENTS.md 생성기 + Skills 부트스트랩" 함께 노출하여 인지 동시 형성 |

---

## 6. 종합 분석

### 6.1 통합 vs 분리: 통합 권장

**통합 권장 근거**:
- AGENTS.md가 사실상 4개 도구 모두 커버 가능 (Claude는 1줄 임포트 추가)
- 사용자는 "여러 AI 도구를 함께 사용"하는 것이 표준 (조사 결과 도구 간 병행 사용 패턴 다수 관찰)
- ConfigDeck의 S1 강점 "스택 기반 복수 파일 조합"과 정확히 부합

**분리 시 단점**:
- 같은 콘텐츠(코드 스타일, 빌드 명령 등)를 4번 반복 생성 → DRY 위배
- 사용자가 매번 4개 페이지 방문 → 재방문/세션시간 KPI에 악영향

### 6.2 자연어 본문 vs 룰 카탈로그: **혼합 권장**

**도구별 적합 방식**:

| 도구 | 본문 성격 | 적합 방식 |
|------|---------|---------|
| AGENTS.md | 자유 형식 Markdown | **혼합** — 섹션별 템플릿(자연어) + 보일러플레이트(Commands/Code Style 등 표준 섹션) |
| Cursor MDC | frontmatter + Markdown | **룰 카탈로그** — 파일 단위 분리, globs 패턴별 룰 묶음 |
| Copilot path-specific | frontmatter + Markdown | **룰 카탈로그** — applyTo glob 단위 |
| CLAUDE.md | 자유 형식 + path-scoped rules | **혼합** — 메인은 짧게, 토픽별은 `.claude/rules/`로 분리 |

**구체적 설계 권장**:
- 1차 입력: 스택(React/Next.js/Astro 등) + 언어(TS/JS/Python) + 패키지 매니저 + 테스트 도구
- 2차 입력: 베스트 프랙티스 체크리스트 (예: "함수형 컴포넌트만 사용", "Tailwind 사용", "함수당 50줄 제한")
- 3차 입력 (선택): Boundaries 3-tier 사용자 정의

### 6.3 STR-0002 "키워드 미성숙" 리스크 검증

| 항목 | STR-0002 우려 | 조사 결과 | 결론 |
|------|------|------|------|
| 키워드 검색량 | 미성숙 | 60K+ 리포, 다수 가이드/도구 노출 | **성숙 단계 진입** |
| 스펙 안정성 | 3개월 내 변경 우려 | AGENTS.md는 Linux Foundation 표준화, Cursor MDC도 안정 | **개선됨** |
| 블루오션 | 경쟁사 적음 가정 | 단일 도구 생성기는 다수 존재, **4종 통합 + 다국어**는 미발견 | **여전히 블루오션** (한정적) |

**결론**: STR-0002의 우려보다 **B축 진입 적기에 더 가깝다**. 단, 단일 도구 생성기 시장은 이미 포화이므로 **통합·다국어·Audit 결합**이 차별화 핵심.

### 6.4 1차 MVP 권장 범위 (Skills 영역 통합 반영)

**Phase A (1차 출시) — 설정 파일 + Skills 부트스트랩 동시 출시**:

1. AGENTS.md 생성기 — 1차 산출물, 60K 리포 표준
2. Cursor MDC 생성기 — `.cursor/rules/*.mdc` 다중 파일 출력
3. Copilot 인스트럭션 생성기 — `.github/copilot-instructions.md` (단일 파일 우선)
4. Claude CLAUDE.md — `@AGENTS.md` 임포트 + Claude 특화 섹션 추가 패턴
5. **Agent Skills 카탈로그 (P0 8종)** — `commit`, `pr-create`, `pr-review`, `test-writer`, `debug`, `refactor`, `adr-create`, `readme-update`. SKILL.md 1개 = 4개 도구 호환 (Cursor 레거시 인식 활용)
6. 한/영 i18n

**Phase B (확장)**:

- Copilot path-specific instructions (`.github/instructions/*.instructions.md`) glob 단위 분리
- Cursor MDC `.claude/rules/`(Claude path-scoped) 등 다중 파일 풀 활용
- **스택별 Skills 카탈로그 추가** — `new-component`, `new-page`, `new-api-route`, `vitest-setup`, `playwright-setup` 등
- 1.2.0 Shareable URL 연동 (설정 파일 + 스킬 셋 통합 공유)

**Phase C (장기)**:

- Codex 글로벌 설정(`~/.codex/AGENTS.md`) 생성 옵션
- AGENTS.md 표준 채택 도구 추가 (Windsurf, Gemini CLI 등)
- **메타 스킬** — `skill-creator`, `init-claude-md` 등
- 일본어 지원

### 6.5 ConfigDeck 기존 기능과의 시너지

| 기존 기능 | AI 설정 파일 + Skills와의 시너지 |
|---------|------|
| 스택 프리셋 | 스택 선택 → 설정 파일 + Skills 패키지 + ESLint/Prettier 동시 생성 (S1 강점 극대화) |
| Shareable URL (1.2.0) | "팀의 AI 컨벤션 + 표준 스킬 셋"을 단일 URL로 공유 — 재방문 KPI 강력 추진 |
| 아티클 (66건) | "AGENTS.md 작성 가이드", "Skills로 PR 리뷰 자동화" 등 SEO 콘텐츠 기회 다수 |

---

## 7. 결론 및 추천

### 7.1 진입 권장 (B축 GO, Skills 영역까지 확장)

조사 결과 STR-0002 "키워드 미성숙" 우려는 **이미 해소되었거나 해소 직전**이다. AGENTS.md의 60K 리포 채택, Linux Foundation 표준화, 20+ 도구 지원은 시장이 이미 본격화되었음을 보여준다.

추가로 발견된 **Agent Skills 영역**은 설정 파일보다 더 비어 있는 시장이다. SKILL.md 1개로 4개 도구를 모두 커버할 수 있고(Cursor의 `.claude/skills/` `.codex/skills/` 레거시 인식), 스택 기반 묶음 생성기는 아직 부재.

### 7.2 차별화 전략 (확장 포지셔닝)

**기존 한 줄 포지셔닝** (설정 파일만):
> "스택 기반 한 번 입력으로 4개 AI 도구의 설정 파일을 한국어/영어로 생성하는 도구"

**확장 한 줄 포지셔닝** (설정 파일 + Skills):
> "**스택을 고르면 4개 AI 도구의 설정 파일과 자주 쓰는 Skills 묶음을 한국어/영어로 한 번에 부트스트랩하는 도구**"

세부 차별화:

1. **통합 생성** (vs 단일 도구 경쟁사들)
2. **설정 + Skills 결합** (vs 설정만 / 스킬 카탈로그만 운영하는 경쟁사들) — **신규 차별화**
3. **한/영 다국어** (vs 영어 전용 경쟁사들) — STR-0002 핵심 강점 S4 활용
4. **스택 기반 자동 추론** (vs 빈 캔버스 입력 경쟁사들) — S1 강점 활용
5. **Shareable URL** — 팀 컨벤션+스킬 셋 공유 시나리오로 재방문 유도

### 7.3 SPEC 작성 시 결정해야 할 추가 항목

1. **출력 파일 패키징**: ZIP 다운로드 vs 개별 복사 vs Shareable URL 단일 (또는 모두)
2. **Cursor MDC 다중 파일 분리 기준**: 자동 분류(globs 기반) vs 사용자가 직접 토픽 지정
3. **CLAUDE.md `@AGENTS.md` 패턴**: 임포트 자동 삽입 vs 사용자 선택 옵션
4. **Boundaries 3-tier 입력 UX**: 자유 텍스트 vs 카탈로그 체크리스트 vs 혼합
5. **Skills 카탈로그 범위**: P0 8종 모두 Phase A vs 일부만 (예: 4종) Phase A → 나머지 Phase B
6. **Skills frontmatter 도구별 분기**: 공통 필드(`name`, `description`)만 채울지 vs Claude 확장 필드(`disable-model-invocation`, `paths` 등) 옵션 노출
7. **Skills와 설정 파일의 관계**: 한 번에 둘 다 생성 vs 분리된 페이지/탭

### 7.4 후속 조치

- 본 보고서를 근거로 **SPEC-0005 작성**(`product-planner` 에이전트). 설정 파일 + Skills 카탈로그 범위 동시에 정의
- ADR 작성 필요 항목:
  - "AI 도구 설정 파일 생성기 채택 형식 우선순위" (AGENTS.md 1순위 선언)
  - "Agent Skills 카탈로그 채택 결정" (agentskills.io 표준 채택, 1차 P0 8종 범위)
- KPI 추가 권장:
  - AGENTS.md 생성 수 (월간)
  - SKILL.md 생성 수 (월간) / 가장 인기 있는 스킬 Top 5
  - Shareable URL 중 AI 파일 비중

---

## 참고 자료

### 공식 문서

- [Cursor Docs — Rules](https://cursor.com/docs/context/rules) — MDC 형식, 4가지 Rule Type, frontmatter 필드 정의
- [GitHub Docs — Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — `.github/copilot-instructions.md`, path-specific, AGENTS.md 지원
- [GitHub Docs — Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) — CLI 글로벌/저장소 인스트럭션
- [Claude Code Docs — Memory](https://code.claude.com/docs/en/memory) — CLAUDE.md 계층, 임포트 문법, AGENTS.md 호환
- [OpenAI Codex Docs — AGENTS.md](https://developers.openai.com/codex/guides/agents-md) — 탐색 순서, 32 KiB 제한, override 패턴
- [agents.md (표준 사이트)](https://agents.md/) — 표준 정의, 지원 도구 목록, 60K 채택 통계
- [OpenAI — Agentic AI Foundation](https://openai.com/index/agentic-ai-foundation/) — Linux Foundation 산하 표준화 발표

### Agent Skills 표준 및 공식 카탈로그

- [agentskills.io — Agent Skills 표준](https://agentskills.io) — SKILL.md 표준, 30+ 채택 도구
- [Claude Code Docs — Skills](https://code.claude.com/docs/en/skills) — frontmatter 풀 스펙, bundled skills, 호출 제어
- [Cursor — Skills](https://cursor.com/help/customization/skills) — 2.4+ 지원, `.claude/skills/` 레거시 인식
- [OpenAI Codex — Agent Skills](https://developers.openai.com/codex/skills) — `$HOME/.agents/skills` 위치, `agents/openai.yaml` 메타
- [VS Code — Custom Agents (구 chat modes)](https://code.visualstudio.com/docs/copilot/customization/custom-agents) — Copilot Custom Agents
- [GitHub - anthropics/skills](https://github.com/anthropics/skills) — Anthropic 공식 스킬 카탈로그 (126K stars)
- [GitHub - openai/skills](https://github.com/openai/skills) — OpenAI Codex 스킬 카탈로그 (system/curated/experimental)
- [GitHub - travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — 커뮤니티 큐레이션
- [GitHub - obra/superpowers](https://github.com/obra/superpowers) — TDD/디버깅 등 검증된 스킬 20+

### 분석 자료

- [GitHub Blog — How to write a great agents.md (2,500+ repos)](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — 6대 핵심 섹션, 베스트 프랙티스
- [On the Impact of AGENTS.md Files on AI Coding Agents (arxiv)](https://arxiv.org/html/2601.20404v1) — 학술 분석

### 경쟁사

- [CursorRules.org](https://cursorrules.org/) — Cursor 전용, 60+ 템플릿
- [DevTk.AI — AGENTS.md Generator](https://devtk.ai/en/tools/agents-md-generator/) — AGENTS.md 생성, 다도구 호환 명시
- [DevTk.AI — Cursor Rules Generator](https://devtk.ai/en/tools/cursor-rules-generator/)
- [CopilotCraft.dev](https://www.copilotcraft.dev/) — Copilot 전용, frontmatter 지원
- [design.dev — Cursor Rules Generator](https://design.dev/ai/cursor-rules-generator/)

### 커뮤니티 카탈로그

- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- [github/awesome-copilot](https://github.com/github/awesome-copilot)
- [kunal8164705/Agents.md-Templates](https://github.com/kunal8164705/Agents.md-Templates)

### 가이드

- [Cursor Rules Complete Guide & 15 Templates (2026)](https://www.vibecodingacademy.ai/blog/cursor-rules-complete-guide)
- [How to Structure Cursor Rules in 2026: The 5-Level System](https://medium.com/@vibecodingdirectory/how-to-structure-cursor-rules-in-2026-the-5-level-system-cursor-rules-eaf0df16e8e7)
- [Writing a good CLAUDE.md (HumanLayer)](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

# ADR-0017: AI 도구 설정 파일 생성기 채택 형식 우선순위

- 상태: 승인됨
- 날짜: 2026-04-30
- 승인일: 2026-04-30
- 의사결정자: 사용자, Claude Code
- 관련 SPEC: [SPEC-0005](../../ia/specs/features/SPEC-0005-ai-tool-config-and-skills.md)
- 관련 리서치: [RES-0003](../../research/reports/RES-0003-ai-tool-config-files-2026-04.md)
- 관련 전략: [STR-0002](../../research/reports/STR-0002-configdeck-strategy-2026-04.md), [ADR-0014](ADR-0014-growth-strategy-roadmap.md)

## 맥락 (Context)

ConfigDeck은 STR-0002 전략 옵션 B축(AI 도구 설정 파일 선점)을 실행하기 위해 SPEC-0005를 통해 4개 AI 도구(Cursor, GitHub Copilot, Claude Code, OpenAI Codex)의 설정 파일 생성기를 도입한다.

각 도구가 지원하는 설정 파일 형식이 다양하고 시간에 따라 진화 중이다(예: Cursor의 `.cursorrules` → `.cursor/rules/*.mdc` 전환). 따라서 다음 결정이 필요하다:

1. **어떤 형식을 1순위로 생성할 것인가**
2. **레거시 형식(`.cursorrules` 등)을 지원할 것인가**
3. **도구별 형식의 상호 호환성을 어떻게 활용할 것인가**

이 결정은 SPEC-0005 Phase A의 산출물 정의, UI/UX, SEO 페이지 구조에 직접 영향을 미친다.

## 결정 (Decision)

### 1순위 형식: AGENTS.md

**AGENTS.md를 4개 도구 모두를 커버하는 1순위 산출물로 채택**한다.

- Codex: 네이티브 (1순위 인식)
- Cursor: 공식 지원 (Nested AGENTS.md 인식)
- Copilot: 공식 지원 (`AGENTS.md` 또는 `CLAUDE.md`, `GEMINI.md` 명시)
- Claude Code: 직접 읽지 않음 → `CLAUDE.md`에 `@AGENTS.md` 임포트 1줄 추가로 우회

### 2순위 형식: 도구별 네이티브 형식

각 도구가 가장 잘 활용하도록 네이티브 형식을 함께 생성한다:

- **Cursor**: `.cursor/rules/*.mdc` (3파일 자동 분리: 핵심 룰, 스택별 룰, 보안/베스트 프랙티스)
- **GitHub Copilot**: `.github/copilot-instructions.md` (단일 파일, path-specific는 Phase B)
- **Claude Code**: `CLAUDE.md` (`@AGENTS.md` 임포트 + Claude 특화 섹션)
- **OpenAI Codex**: AGENTS.md 1순위로 충분 (별도 형식 불필요)

### 레거시 형식 제외: `.cursorrules`

**`.cursorrules` 형식은 생성기에서 제외**한다.

- Cursor 공식 문서가 더 이상 `.cursorrules`를 언급하지 않음
- `.cursor/rules/*.mdc`가 현재 표준
- `.cursorrules`는 단일 파일 평면 텍스트라 frontmatter 메타데이터(`globs`, `alwaysApply`)를 활용할 수 없음

### `@AGENTS.md` 자동 임포트

CLAUDE.md 생성 시 **`@AGENTS.md` 임포트를 자동 삽입**한다. 사용자 옵션으로 노출하지 않는다.

```markdown
@AGENTS.md

## Claude Code 특화 섹션
{Claude 전용 추가 지시}
```

## 근거 (Rationale)

### AGENTS.md 1순위 채택 근거

1. **시장 표준화**: 2025년 8월 출시 후 8개월 만에 60,000+ 오픈소스 리포지토리 채택 ([agents.md/](https://agents.md/))
2. **거버넌스**: OpenAI가 Linux Foundation 산하 [Agentic AI Foundation](https://openai.com/index/agentic-ai-foundation/)에 기증하여 장기 표준 안정성 확보
3. **다도구 호환**: 4개 도구 중 3개가 직접 지원, Claude Code도 1줄 임포트로 우회 가능
4. **단일 파일 → 복수 도구**: ConfigDeck S1 강점 "스택 기반 복수 파일 조합"과 정확히 부합
5. **GitHub 공식 분석**: GitHub Blog가 [2,500+ AGENTS.md 분석](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)을 통해 6대 핵심 섹션(Commands, Testing, Project structure, Code style, Git workflow, Boundaries)을 도출 — 자동 생성에 필요한 구조화 가능

### 도구별 네이티브 형식 병행 근거

AGENTS.md만으로 충분하지만, 각 도구가 네이티브 형식에서 더 강력한 기능을 제공한다:

- **Cursor MDC**: `globs`/`alwaysApply` frontmatter로 파일 패턴별 자동 적용 — AGENTS.md로는 불가
- **Copilot**: `.github/copilot-instructions.md`는 GitHub.com, VS Code, JetBrains, CLI 등 모든 채널에서 표준 인식
- **Claude Code**: `CLAUDE.md`는 임포트 문법(`@path/to/file`), `.claude/rules/` path-scoped rules 등 Claude 전용 기능 활용 가능

따라서 "AGENTS.md(공통) + 네이티브 형식(도구별 강화)" 조합이 사용자 가치 최대화.

### `.cursorrules` 제외 근거

1. **공식 문서 미언급**: [Cursor Docs - Rules](https://cursor.com/docs/context/rules) 현재 페이지에 `.cursorrules` 자체가 언급되지 않음 (RES-0003 §1.1)
2. **표현력 한계**: 단일 평면 텍스트로 frontmatter 활용 불가
3. **레거시 부담**: 지원 시 두 가지 출력 형식 유지 필요 → 코드 복잡도 증가
4. **사용자 보호**: 새 프로젝트는 신형식으로 시작하는 것이 장기적으로 유리

### `@AGENTS.md` 자동 임포트 근거

1. **Claude Code는 AGENTS.md를 직접 읽지 않음**: [Claude Code 공식 문서](https://code.claude.com/docs/en/memory#agentsmd)가 명시
2. **임포트 없이는 4도구 통합 가치 상실**: 사용자가 CLAUDE.md만 보면 AGENTS.md 내용을 다시 작성해야 함 → DRY 위배
3. **사용자 옵션화의 단점**: 옵션화하면 사용자가 매번 이 도구별 차이를 학습해야 함 — UX 비용 > 자유도 가치

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| `.cursorrules`만 1순위 | 공식 문서에서 사라진 형식. 신규 프로젝트에 부적합 |
| 도구별 네이티브 형식만 (AGENTS.md 없이) | 동일 콘텐츠를 4번 반복 생성 → DRY 위배, 유지보수 부담 ↑ |
| AGENTS.md만 (네이티브 형식 없음) | Cursor MDC `globs` 등 네이티브 기능 활용 불가, 도구별 차별화 약화 |
| `CLAUDE.md` 안에 모든 내용 직접 작성 | AGENTS.md를 별도로 두는 의미 사라짐. 다른 3개 도구가 Claude 전용 섹션을 읽게 됨 |
| `@AGENTS.md` 임포트 사용자 옵션화 | 사용자가 도구별 차이를 학습해야 함. 기본값을 자동 삽입으로 두는 것이 압도적으로 유리 |

## 결과 (Consequences)

### 긍정

- AGENTS.md 1개 + 도구별 네이티브 파일 = 4개 도구 풀 커버
- AGENTS.md 시장 채택률 상승 흐름에 편승 (블루오션 + 표준 합류)
- DRY 원칙 준수, 콘텐츠 1회 작성으로 다중 출력
- Claude Code의 임포트 메커니즘 활용으로 우회 비용 거의 0

### 주의/리스크

- AGENTS.md 표준이 진화하면 추적 필요 — agentskills.io / agents.md 모니터링 체계 필요
- `.cursorrules` 키워드로 검색해서 들어오는 사용자에게 별도 안내 필요 (예: "We generate `.cursor/rules/` instead — modern Cursor format")
- Cursor MDC 3파일 자동 분리 기준이 사용자 의도와 다를 가능성 → Phase B에서 사용자 토픽 지정 옵션 추가 예정

### 후속 조치

- SPEC-0005 Phase A 산출물 정의에 본 결정 반영 (이미 반영됨)
- 4개 형식의 공통 데이터 모델 설계 (AGENTS.md를 단일 진실원으로 두고 다른 형식으로 변환)
- 랜딩 페이지 SEO 키워드: "AGENTS.md generator", "Cursor MDC generator", "copilot-instructions.md template", "CLAUDE.md template" 4종 동시 타겟
- AGENTS.md 표준 진화 모니터링: [agents.md](https://agents.md), [agentskills.io](https://agentskills.io) 분기별 확인

## 참고 자료 (References)

### 공식 문서

- [agents.md — AGENTS.md 표준](https://agents.md/) — 60K+ 채택, 20+ 도구 지원 통계
- [OpenAI — Agentic AI Foundation](https://openai.com/index/agentic-ai-foundation/) — Linux Foundation 산하 표준화 발표
- [Cursor Docs - Rules](https://cursor.com/docs/context/rules) — `.cursor/rules/*.mdc` 표준, frontmatter 필드
- [GitHub Docs - Adding repository custom instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) — `.github/copilot-instructions.md`, AGENTS.md 인식
- [Claude Code Docs - Memory](https://code.claude.com/docs/en/memory) — CLAUDE.md `@path` 임포트 문법, AGENTS.md 호환 가이드
- [OpenAI Codex Docs - AGENTS.md](https://developers.openai.com/codex/guides/agents-md) — 탐색 순서, override 패턴

### 분석 자료

- [GitHub Blog - How to write a great agents.md (2,500+ repos)](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — 6대 핵심 섹션
- [RES-0003](../../research/reports/RES-0003-ai-tool-config-files-2026-04.md) — 4개 도구 스펙 비교, 경쟁사 분석
- [STR-0002](../../research/reports/STR-0002-configdeck-strategy-2026-04.md) — 전략 옵션 B축

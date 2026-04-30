# ADR-0018: Agent Skills 카탈로그 채택 및 P0 범위

- 상태: 제안됨
- 날짜: 2026-04-30
- 의사결정자: 사용자, Claude Code
- 관련 SPEC: [SPEC-0005](../../ia/specs/features/SPEC-0005-ai-tool-config-and-skills.md)
- 관련 리서치: [RES-0003 §5 Agent Skills 표준](../../research/reports/RES-0003-ai-tool-config-files-2026-04.md)
- 관련 ADR: [ADR-0017](ADR-0017-ai-config-file-format-priority.md)

## 맥락 (Context)

SPEC-0005는 AI 도구 설정 파일 생성에 더해 Agent Skills 카탈로그 부트스트랩을 핵심 차별화 요소로 정의한다. ConfigDeck의 포지션은 단순 설정 파일 생성기가 아닌 "**스택 기반 AI 워크플로우 부트스트래퍼**"로 격상된다.

이를 실행하려면 다음 결정이 필요하다:

1. **어떤 Skills 표준을 채택할 것인가** (agentskills.io 표준 vs 도구별 독자 형식)
2. **P0 카탈로그 범위는 무엇인가** (몇 종, 어떤 스킬을 1차 출시 포함)
3. **SKILL.md 저장 경로는 어떻게 안내할 것인가** (`.claude/skills/`, `.cursor/skills/`, `.agents/skills/` 등 도구마다 다름)
4. **frontmatter 확장 필드를 어디까지 노출할 것인가** (공통 필드만 vs Claude 확장 필드까지)

## 결정 (Decision)

### 1. agentskills.io 표준 채택

**[agentskills.io](https://agentskills.io)의 SKILL.md 표준을 단일 표준으로 채택**한다.

- 30+ AI 도구가 동일 형식 채택
- Claude Code(원본 제정), Cursor(2.4+), OpenAI Codex, GitHub Copilot 등 4개 도구 모두 지원
- Anthropic이 오픈 표준으로 공개 후 커뮤니티 거버넌스로 이전

### 2. P0 카탈로그: 8종 (Phase A 전체 포함)

Phase A에 8종을 모두 포함한다. 분할 출시하지 않는다:

| 스킬 | 용도 | 출처 근거 |
|------|------|---------|
| `commit` | 컨벤셔널 커밋 메시지 자동 작성 | GitHub Blog 6대 섹션 (Git workflow) |
| `pr-create` | PR 본문 템플릿 + 변경사항 요약 | GitHub Blog 6대 섹션 (Git workflow) |
| `pr-review` | PR 보안/품질 체크리스트 | awesome-claude-skills 빈출, obra/superpowers 참조 |
| `test-writer` | 단위 테스트 작성 (스택별 분기) | GitHub Blog 6대 섹션 (Testing) |
| `debug` | 에러 분석 + 재현 단계 | obra/superpowers, Claude Code bundled `/debug` |
| `refactor` | 안전한 리팩토링 절차 | awesome-claude-skills 빈출 |
| `adr-create` | 의사결정 기록 작성 | GitHub Blog 6대 섹션 (Project structure) |
| `readme-update` | README 자동 갱신 | awesome-claude-skills 빈출 |

### 3. 저장 경로: `.claude/skills/` 단일 경로

생성된 SKILL.md를 `.claude/skills/{skill-name}/SKILL.md` 경로에 저장하도록 안내한다.

- Cursor가 `.claude/skills/`와 `.codex/skills/`를 **레거시 호환으로 자동 인식** (RES-0003 §5.2)
- Codex는 `.agents/skills/`가 표준이지만 `.claude/skills/` 함께 인식하는 도구가 더 많음
- 결과: **SKILL.md 한 번 작성 → 4개 도구 모두 활용**

ZIP 다운로드 시 다음 구조로 패키징한다:

```text
.claude/skills/
├── commit/
│   └── SKILL.md
├── pr-create/
│   └── SKILL.md
└── ...
```

Codex 사용자가 `.agents/skills/` 경로를 선호할 경우를 대비해 안내 문구로 "Codex 사용 시 폴더명을 `.agents/skills/`로 변경 가능" 명시한다.

### 4. frontmatter: 공통 필드만 (Phase A)

Phase A는 agentskills.io 표준의 **최소 필수 필드만** 생성한다:

```yaml
---
name: skill-name
description: 스킬 용도와 사용 시점
---
```

Claude Code 확장 필드(`disable-model-invocation`, `allowed-tools`, `paths`, `context: fork` 등)는 **Phase B 고급 옵션으로 분리**한다.

이유: 4개 도구 모두 동일하게 인식되는 최소 공통 분모를 우선. Claude 확장 필드는 다른 도구가 무시하지만 호환성 문제는 없음 — 단, 사용자에게 도구별 차이를 학습시키는 비용을 Phase B로 미룬다.

## 근거 (Rationale)

### agentskills.io 표준 채택 근거

1. **시장 일치**: 30+ AI 도구가 동일 형식 사용. 별도 표준 채택 시 어느 쪽도 만족 못함
2. **Anthropic 원조 + 커뮤니티 거버넌스**: 단일 벤더 종속 위험 낮음
3. **Progressive Disclosure 검증된 패턴**: name/description 디스커버리 → 활성화 → 실행의 3단계 로딩이 토큰 효율적이고 도구 채택률 높음
4. **Claude Code skills 리포 126K stars**: 거대한 커뮤니티 자산을 직접 활용/참조 가능

### P0 8종 채택 근거

**선정 기준**: GitHub Blog의 [2,500+ AGENTS.md 분석 6대 핵심 섹션](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)과 awesome-claude-skills/obra-superpowers 커뮤니티 빈출 패턴의 **교집합**.

| 6대 핵심 섹션 | 대응 P0 스킬 |
|------------|-----------|
| Commands | (설정 파일 측에서 커버) |
| Testing | `test-writer` |
| Project structure | `adr-create`, `readme-update` |
| Code style | (설정 파일 측에서 커버) |
| Git workflow | `commit`, `pr-create` |
| Boundaries | (설정 파일 측에서 커버) |
| (커뮤니티 빈출) | `pr-review`, `debug`, `refactor` |

**8종 일괄 출시 근거**:
- 4종으로 줄이면 차별화 신호("워크플로우 부트스트래퍼") 약화
- 8종 모두 자연어 본문 위주의 가벼운 산출물 — 구현 복잡도가 비례 증가하지 않음
- 사용자는 한 번에 충분한 카탈로그를 보고 가치를 판단함 — 부족한 카탈로그는 "장난감"으로 인식될 위험

**스택별 스킬 (new-component, vitest-setup 등) Phase B 분리 근거**:
- 스택별 분기 로직 필요 → 구현 복잡도 ↑
- Phase A는 스택 무관 범용으로 가치 검증 우선

### `.claude/skills/` 경로 채택 근거

1. **Cursor 레거시 호환 자동 인식** ([Cursor Skills Docs](https://cursor.com/help/customization/skills)): `.claude/skills/`, `.codex/skills/` 위치도 자동 인식. 즉 Cursor + Claude Code 동시 호환
2. **Codex도 인식**: Codex 표준은 `.agents/skills/`이나 사용자 안내 한 줄로 폴더명 변경 가능. 1순위는 호환 범위 ↑인 `.claude/skills/`
3. **단일 경로 정책 = UX 단순성**: 4개 도구마다 다른 경로를 안내하면 사용자 혼란

### frontmatter 공통 필드만 채택 근거

1. **agentskills.io 최소 요건**: `name`과 `description`이 표준에서 요구하는 최소 필드. 이것만으로도 모든 도구가 동작
2. **Phase A 사용자 학습 비용 최소화**: Claude 확장 필드는 도구별 차이 — 처음 접하는 사용자에게 부담
3. **확장성 보장**: Phase B에서 "고급 옵션 표시" 토글로 추가 — 기본 흐름을 망치지 않음
4. **호환성 위험 0**: Claude 확장 필드를 다른 도구가 만나도 단순히 무시. 에러 발생 X — 그럼에도 노출하지 않는 이유는 학습 비용 때문

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| 도구별 독자 표준 사용 (Claude/Cursor/Codex 분리) | 동일 콘텐츠 3번 반복, DRY 위배. 30+ 도구가 이미 agentskills.io 채택 |
| P0 4종으로 축소 (commit, pr-create, test-writer, debug) | "워크플로우 부트스트래퍼" 신호 약화. 사용자가 가치 인식 못함 |
| P0 16종으로 확대 (스택별 포함) | 스택 분기 로직 + 콘텐츠 큐레이션 부담 ↑. Phase A 출시 지연 위험 |
| `.cursor/skills/` 1순위 경로 | Codex와 Claude Code가 인식 못함. 호환 범위 ↓ |
| `.agents/skills/` 1순위 경로 (Codex 표준) | Cursor가 자동 인식하는 우선순위 경로가 `.claude/skills/`. 호환 범위 ↓ |
| Claude 확장 필드(`disable-model-invocation` 등) Phase A 노출 | 학습 비용 ↑, "공통 표준" 메시지 흐림. Phase B로 분리하는 것이 옳음 |
| 도구별 별도 SKILL.md 생성 (Claude용/Cursor용 분리) | 4배 콘텐츠 복제. 본 ADR의 "단일 SKILL.md → 다도구" 원칙 위배 |

## 결과 (Consequences)

### 긍정

- 단일 SKILL.md 한 번 작성 → 4개 도구 모두 활용 (AGENTS.md와 동일 패턴)
- agentskills.io 표준 채택으로 향후 Windsurf, Gemini CLI 등 추가 시에도 그대로 호환
- 8종 일괄 출시로 "워크플로우 부트스트래퍼" 포지셔닝 신호 명확
- 커뮤니티 자산(awesome-claude-skills, obra/superpowers) 콘텐츠 큐레이션 활용 가능

### 주의/리스크

- agentskills.io 표준 진화 시 SKILL.md frontmatter 변경 가능 → 분기별 모니터링 필요
- 8종 콘텐츠 품질 — 잘못 작성된 스킬은 잘못된 행동을 유발 → 1차는 검증된 패턴(공식 docs + 커뮤니티 큐레이션) 기반으로만 작성
- `.claude/skills/` 경로가 Codex 표준이 아니라는 점 → 안내 문구 명확화 필요
- 8종이 한국어/영어 양쪽 모두 자연스러워야 함 → 번역 품질 검증 추가 비용

### 후속 조치

- 8종 SKILL.md 콘텐츠 작성 (Phase A M2 마일스톤)
  - 출처: GitHub Blog 6대 섹션 + awesome-claude-skills 빈출 패턴 + Anthropic 공식 skills 리포 검증
  - 한/영 양쪽 작성 후 네이티브 검수
- agentskills.io 표준 변경 모니터링 체계 (분기 1회 확인)
- Phase B 고급 옵션 SPEC: Claude 확장 필드 노출, 스택별 스킬 추가
- `.agents/skills/` 폴더명 변경 안내 문구 UI 설계 (Codex 사용자 대상)
- 향후 사용자 피드백으로 카탈로그 8종 우선순위 재평가 (KPI: 가장 많이 다운로드된 스킬 Top 5)

## 참고 자료 (References)

### 표준 및 공식 문서

- [agentskills.io — Agent Skills 표준](https://agentskills.io) — SKILL.md 표준, 30+ 채택 도구
- [Claude Code Docs - Skills](https://code.claude.com/docs/en/skills) — frontmatter 풀 스펙, bundled skills, 호출 제어
- [Cursor Docs - Skills](https://cursor.com/help/customization/skills) — 2.4+ 지원, `.claude/skills/` 레거시 인식
- [OpenAI Codex - Agent Skills](https://developers.openai.com/codex/skills) — `$HOME/.agents/skills` 위치
- [VS Code - Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) — Copilot Custom Agents

### 카탈로그 출처

- [GitHub - anthropics/skills](https://github.com/anthropics/skills) — Anthropic 공식 (126K stars)
- [GitHub - openai/skills](https://github.com/openai/skills) — OpenAI Codex Skills Catalog
- [GitHub - travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — 커뮤니티 큐레이션
- [GitHub - obra/superpowers](https://github.com/obra/superpowers) — TDD/디버깅 검증된 스킬 20+

### 분석 자료

- [GitHub Blog - How to write a great agents.md (2,500+ repos)](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — 6대 핵심 섹션
- [RES-0003 §5 Agent Skills 표준](../../research/reports/RES-0003-ai-tool-config-files-2026-04.md) — 도구별 Skills 지원 매트릭스, 카탈로그 패턴

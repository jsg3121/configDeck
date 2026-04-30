/**
 * AI 도구 설정 파일 + Agent Skills 생성기에서 공유하는 타입을 정의한다.
 * SPEC-0005, ADR-0017, ADR-0018 참고.
 */

// ---------------------------------------------------------------------------
// 1. 입력 도메인 식별자 (엄격 유니온)
// ---------------------------------------------------------------------------

/** 1차 출시 지원 스택 (src/lib/data/stacks.ts STACK_DEFINITIONS와 일치) */
export type AiConfigStackSlug = 'react-vite-ts' | 'nextjs' | 'astro' | 'nodejs'

/** AI 코딩 도구 식별자 */
export type AiToolId = 'cursor' | 'copilot' | 'claude-code' | 'codex'

/** 베스트 프랙티스 / Skills 적용 범위. 'all'은 모든 스택 공통 */
export type AppliesTo = AiConfigStackSlug | 'tailwind' | 'typescript' | 'all'

/** 6대 핵심 섹션 — GitHub Blog의 2,500+ AGENTS.md 분석 (RES-0003 §2.2) */
export type BestPracticeCategory =
  | 'commands'
  | 'testing'
  | 'project-structure'
  | 'code-style'
  | 'git-workflow'
  | 'boundaries'

/** Boundaries 3-tier — GitHub Blog 권장 (RES-0003 §2.2) */
export type BoundaryTier = 'always-do' | 'ask-first' | 'never-do'

/** Skills P0 카탈로그 식별자 (ADR-0018 §1.2) */
export type SkillId =
  | 'commit'
  | 'pr-create'
  | 'pr-review'
  | 'test-writer'
  | 'debug'
  | 'refactor'
  | 'adr-create'
  | 'readme-update'

/** UI 로케일 */
export type AiConfigLocale = 'ko' | 'en'

// ---------------------------------------------------------------------------
// 2. 카탈로그 항목 (정적 데이터)
// ---------------------------------------------------------------------------

/**
 * 베스트 프랙티스 카탈로그 한 항목.
 * AI에게 전달할 outputText는 영어로 작성한다 (모델 정확도 ↑).
 * UI 라벨은 한국어 우선. 영어 UI 라벨은 M5 i18n에서 처리.
 */
export interface BestPracticeItem {
  /** kebab-case 식별자 */
  id: string
  /** UI에 표시할 한국어 라벨 */
  label: string
  /** AI 설정 파일에 삽입될 영어 문구. 자연어 한 줄로 작성 */
  outputText: string
  /** 분류 — 6대 핵심 섹션 매핑 */
  category: BestPracticeCategory
  /** 적용 스택. 'all'은 모든 프로젝트 공통, 그 외는 해당 스택 선택 시에만 노출 */
  appliesTo: readonly AppliesTo[]
}

/**
 * Boundaries 3-tier 카탈로그 한 항목.
 * AGENTS.md/CLAUDE.md의 Boundaries 섹션을 ✅/⚠️/🚫로 구성한다.
 */
export interface BoundaryItem {
  /** kebab-case 식별자 */
  id: string
  /** UI에 표시할 한국어 라벨 */
  label: string
  /** AI 설정 파일에 삽입될 영어 문구 */
  outputText: string
  /** 3-tier 분류 */
  tier: BoundaryTier
  /** 적용 스택 */
  appliesTo: readonly AppliesTo[]
}

/**
 * Skills 카탈로그 한 항목.
 * SKILL.md frontmatter는 agentskills.io 표준 최소 요건(name, description)만 사용 (CP-4).
 * 본문은 함수형 템플릿으로 작성 — Phase B에서 스택별 분기 확장 가능 (ADR-0018).
 */
export interface SkillCatalogItem {
  /** SKILL.md 디렉토리명 (kebab-case) */
  id: SkillId
  /** UI에 표시할 한국어 표시명 */
  displayName: string
  /** UI에 표시할 한국어 설명 (1~2줄) */
  summary: string
  /** SKILL.md frontmatter에 들어갈 영어 description (agentskills.io 표준) */
  description: string
  /** SKILL.md 본문 생성 함수. 입력에 따라 본문이 분기될 수 있음 */
  bodyTemplate: (input: AiConfigInput) => string
}

// ---------------------------------------------------------------------------
// 3. 사용자 입력 모델
// ---------------------------------------------------------------------------

/** 1단계 — 스택 선택 */
export interface AiConfigStackInput {
  /** 선택한 스택 */
  stack: AiConfigStackSlug
}

/** 2단계 — 베스트 프랙티스 (카탈로그 + 자유 텍스트, CP-1) */
export interface AiConfigBestPracticesInput {
  /** 선택된 카탈로그 항목 ID 목록 */
  selectedIds: readonly string[]
  /** 자유 텍스트 추가 지시사항 (Additional Notes 섹션으로 삽입) */
  additionalNotes: string
}

/** 3단계 — Boundaries 3-tier */
export interface AiConfigBoundariesInput {
  /** Tier별 선택된 카탈로그 항목 ID 목록 */
  alwaysDoIds: readonly string[]
  askFirstIds: readonly string[]
  neverDoIds: readonly string[]
}

/** 4단계 — 사용 도구 (CP-3 핵심: claudeCodeOnly 토글) */
export interface AiConfigToolsInput {
  /** 사용자가 사용 중인 AI 도구 목록 */
  enabledTools: readonly AiToolId[]
  /**
   * Claude Code 단독 사용 여부.
   * true: CLAUDE.md를 단일 진실원으로 작성 (@AGENTS.md 임포트 생략)
   * false: CLAUDE.md에 @AGENTS.md 자동 임포트 (CP-3, ADR-0017)
   */
  claudeCodeOnly: boolean
}

/** 통합 입력 모델 — 모든 단계의 입력을 한 곳에 모음 */
export interface AiConfigInput {
  stack: AiConfigStackInput
  bestPractices: AiConfigBestPracticesInput
  boundaries: AiConfigBoundariesInput
  tools: AiConfigToolsInput
  /** 선택된 Skills ID 목록 */
  selectedSkillIds: readonly SkillId[]
  /** UI 로케일. AI 출력 본문은 항상 영어이므로 영향 없음 */
  locale: AiConfigLocale
}

// ---------------------------------------------------------------------------
// 4. 출력 모델
// ---------------------------------------------------------------------------

/** Cursor MDC 파일의 frontmatter (RES-0003 §1.1) */
export interface CursorMdcFrontmatter {
  /** Agent의 적용 판단에 사용 */
  description?: string
  /** 파일 패턴 (쉼표 구분 문자열). 매칭 파일이 컨텍스트에 있을 때 자동 적용 */
  globs?: string
  /** true이면 모든 채팅 세션에 무조건 포함 */
  alwaysApply?: boolean
}

/** Cursor MDC 단일 파일 */
export interface CursorMdcFile {
  /** 파일명 (확장자 포함). 예: 'core.mdc' */
  fileName: string
  /** 출력 경로의 끝 부분. 예: '.cursor/rules/core.mdc' */
  outputPath: string
  /** YAML frontmatter (없으면 undefined) */
  frontmatter: CursorMdcFrontmatter
  /** Markdown 본문 */
  body: string
}

/** Cursor MDC 3파일 묶음 (CP-2: 자동 분리 고정) */
export interface CursorMdcOutput {
  /** alwaysApply: true 전역 룰 */
  core: CursorMdcFile
  /** globs 기반 스택별 룰 */
  stack: CursorMdcFile
  /** description만 있는 Boundaries 룰 */
  boundaries: CursorMdcFile
}

/** AGENTS.md 출력 (자유 형식 Markdown, frontmatter 없음) */
export interface AgentsMdOutput {
  fileName: 'AGENTS.md'
  outputPath: 'AGENTS.md'
  body: string
}

/** CLAUDE.md 출력. importAgentsMd가 true이면 본문 첫 줄에 `@AGENTS.md` 삽입 */
export interface ClaudeMdOutput {
  fileName: 'CLAUDE.md'
  outputPath: 'CLAUDE.md'
  /** @AGENTS.md 임포트 라인 자동 삽입 여부 (CP-3) */
  importAgentsMd: boolean
  body: string
}

/** GitHub Copilot 저장소 인스트럭션 (RES-0003 §1.2) */
export interface CopilotInstructionsOutput {
  fileName: 'copilot-instructions.md'
  outputPath: '.github/copilot-instructions.md'
  body: string
}

/** SKILL.md frontmatter (Phase A 공통 필드만, CP-4) */
export interface SkillMdFrontmatter {
  /** 디렉토리명과 일치 권장 */
  name: string
  /** Agent 자동 트리거 판단에 사용 */
  description: string
}

/** SKILL.md 단일 파일 */
export interface SkillMdFile {
  /** Skills 카탈로그 ID */
  id: SkillId
  /** 파일명 — 항상 'SKILL.md' */
  fileName: 'SKILL.md'
  /** 출력 경로. 예: '.claude/skills/commit/SKILL.md' (ADR-0018 §1.3) */
  outputPath: string
  frontmatter: SkillMdFrontmatter
  body: string
}

/**
 * 통합 출력 모델.
 * 사용자가 enabledTools로 선택하지 않은 도구의 출력은 undefined.
 */
export interface AiConfigOutput {
  /** AGENTS.md — 항상 생성 (모든 도구의 1순위 산출물, ADR-0017) */
  agentsMd: AgentsMdOutput
  /** CLAUDE.md — Claude Code 사용 시에만 생성 */
  claudeMd?: ClaudeMdOutput
  /** Cursor MDC 3파일 — Cursor 사용 시에만 생성 */
  cursorMdc?: CursorMdcOutput
  /** Copilot 인스트럭션 — Copilot 사용 시에만 생성 */
  copilotInstructions?: CopilotInstructionsOutput
  /** Skills SKILL.md 목록 — selectedSkillIds 기반 */
  skills: readonly SkillMdFile[]
}

/**
 * AI Config 도구별 SEO 랜딩 페이지 메타데이터.
 *
 * 5개 랜딩 페이지(`/[locale]/ai-config/{slug}`)가 공유하는 정적 데이터를 정의한다.
 * Astro 페이지가 i18n 키 prefix를 받아 콘텐츠를 렌더링하고, 출력 예시는
 * 실제 generator의 출력 형식을 발췌하여 보여준다.
 */

/** 랜딩 페이지 식별자 (URL slug와 동일) */
export type AiConfigLandingSlug =
  | 'agents-md'
  | 'cursor'
  | 'copilot'
  | 'claude-code'
  | 'agent-skills'

export interface AiConfigLandingMeta {
  /** URL slug */
  slug: AiConfigLandingSlug
  /** i18n 키 prefix — `aiConfig.landing.{key}` */
  i18nKey: 'agentsMd' | 'cursor' | 'copilot' | 'claudeCode' | 'agentSkills'
  /** 외부 공식 문서 URL */
  docsUrl: string
  /** 출력 예시 파일명 (코드 블록 헤더에 표시) */
  exampleFileName: string
  /** 출력 예시 코드 (15~30줄) */
  exampleCode: string
  /** SEO 메타 i18n 키 (seo.{key}) */
  seoTitleKey: string
  seoDescriptionKey: string
}

const AGENTS_MD_EXAMPLE = `# Agent Instructions

This file provides shared instructions for AI coding agents.
Following the AGENTS.md open standard (https://agents.md).

## Code Style

- Never use the \`any\` type in TypeScript. Prefer \`unknown\` with type narrowing.
- Use functional components exclusively. Manage state with hooks.

## Git Workflow

- All commit messages must follow Conventional Commits: \`<type>(<scope>): <description>\`.

## Boundaries

### ✅ Always do

- Always run the test suite after making changes.

### 🚫 Never do

- Never commit secrets, API keys, tokens, or credentials.
`

const CURSOR_CORE_EXAMPLE = `---
description: "Core project conventions (always applied)"
alwaysApply: true
---

## Code Style

- Never use the \`any\` type in TypeScript. Prefer \`unknown\` with type narrowing.
- Use functional components exclusively. Manage state with hooks.

## Git Workflow

- All commit messages must follow Conventional Commits.
`

const COPILOT_EXAMPLE = `# Repository Custom Instructions

These instructions guide GitHub Copilot for this repository.

## Code Style

- Never use the \`any\` type in TypeScript. Prefer \`unknown\` with type narrowing.
- Use named exports for React components, not default exports.

## Testing

- All tests must pass locally before opening a pull request.
- Every new feature or bug fix must include corresponding tests.

## Boundaries

### ⚠️ Ask first

- Ask before adding any new npm dependency.
`

const CLAUDE_MD_EXAMPLE = `@AGENTS.md

# Claude Code Notes

This project shares its core agent instructions via AGENTS.md (imported above).
Add Claude-specific guidance below if needed; otherwise the imported content is sufficient.
`

const SKILL_MD_EXAMPLE = `---
name: commit
description: "Stage and commit the current changes with a Conventional Commits message."
---

# Commit Skill

Stage the current changes and create a commit using the Conventional Commits specification.

## Steps

1. Inspect the working tree — Run \`git status\` and \`git diff\`.
2. Group related changes — Split unrelated concerns into separate commits.
3. Draft a commit message following the Conventional Commits format.
4. Stage the relevant files with \`git add <specific-files>\`.
5. Create the commit with the drafted message.
6. Verify with \`git status\` and \`git log -1\`.
`

/** 5개 랜딩 페이지 메타데이터 — 노출 순서: agents-md → cursor → copilot → claude-code → agent-skills */
export const AI_CONFIG_LANDING_META: Readonly<Record<AiConfigLandingSlug, AiConfigLandingMeta>> = {
  'agents-md': {
    slug: 'agents-md',
    i18nKey: 'agentsMd',
    docsUrl: 'https://agents.md/',
    exampleFileName: 'AGENTS.md',
    exampleCode: AGENTS_MD_EXAMPLE,
    seoTitleKey: 'seo.aiConfigAgentsMdTitle',
    seoDescriptionKey: 'seo.aiConfigAgentsMdDescription',
  },
  cursor: {
    slug: 'cursor',
    i18nKey: 'cursor',
    docsUrl: 'https://cursor.com/docs/context/rules',
    exampleFileName: '.cursor/rules/core.mdc',
    exampleCode: CURSOR_CORE_EXAMPLE,
    seoTitleKey: 'seo.aiConfigCursorTitle',
    seoDescriptionKey: 'seo.aiConfigCursorDescription',
  },
  copilot: {
    slug: 'copilot',
    i18nKey: 'copilot',
    docsUrl:
      'https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot',
    exampleFileName: '.github/copilot-instructions.md',
    exampleCode: COPILOT_EXAMPLE,
    seoTitleKey: 'seo.aiConfigCopilotTitle',
    seoDescriptionKey: 'seo.aiConfigCopilotDescription',
  },
  'claude-code': {
    slug: 'claude-code',
    i18nKey: 'claudeCode',
    docsUrl: 'https://code.claude.com/docs/en/memory',
    exampleFileName: 'CLAUDE.md',
    exampleCode: CLAUDE_MD_EXAMPLE,
    seoTitleKey: 'seo.aiConfigClaudeCodeTitle',
    seoDescriptionKey: 'seo.aiConfigClaudeCodeDescription',
  },
  'agent-skills': {
    slug: 'agent-skills',
    i18nKey: 'agentSkills',
    docsUrl: 'https://agentskills.io/',
    exampleFileName: '.claude/skills/commit/SKILL.md',
    exampleCode: SKILL_MD_EXAMPLE,
    seoTitleKey: 'seo.aiConfigAgentSkillsTitle',
    seoDescriptionKey: 'seo.aiConfigAgentSkillsDescription',
  },
}

/** 랜딩 페이지 노출 순서 (관련 도구 링크에서도 동일 순서 사용) */
export const AI_CONFIG_LANDING_ORDER: readonly AiConfigLandingSlug[] = [
  'agents-md',
  'cursor',
  'copilot',
  'claude-code',
  'agent-skills',
]

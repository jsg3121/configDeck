/**
 * 1차 출시 4개 AI 코딩 도구 메타데이터.
 * 출력 산출물 매핑 + UI 표시 정보 + 공식 문서 링크를 담는다.
 *
 * 참고:
 * - ADR-0017 (AGENTS.md 1순위 + 도구별 네이티브 형식)
 * - RES-0003 §1 (도구별 파일 스펙)
 */

import type { AiToolId } from '@/types/aiConfig'

/**
 * AI 도구 한 항목.
 * 사용자에게 도구 선택 UI에서 노출하고, 산출물 생성 로직(M2 이후)이 참조한다.
 */
export interface AiToolMeta {
  /** 도구 식별자 */
  id: AiToolId
  /** UI 표시명 */
  displayName: string
  /** 한국어 짧은 설명 */
  descriptionKo: string
  /** 영어 짧은 설명 */
  descriptionEn: string
  /** 공식 문서 URL — UI에 "자세히 보기"로 링크 */
  docsUrl: string
  /** 이 도구가 사용하는 1차 설정 파일 경로 (안내 문구용) */
  primaryConfigPaths: readonly string[]
}

export const AI_TOOLS: readonly AiToolMeta[] = [
  {
    id: 'cursor',
    displayName: 'Cursor',
    descriptionKo: '`.cursor/rules/*.mdc` 형식의 룰 파일을 사용하는 AI 코드 에디터.',
    descriptionEn: 'AI code editor using `.cursor/rules/*.mdc` MDC rule files.',
    docsUrl: 'https://cursor.com/docs/context/rules',
    primaryConfigPaths: ['.cursor/rules/core.mdc', '.cursor/rules/stack.mdc', '.cursor/rules/boundaries.mdc'],
  },
  {
    id: 'copilot',
    displayName: 'GitHub Copilot',
    descriptionKo: '`.github/copilot-instructions.md`로 저장소 전반의 인스트럭션을 관리한다.',
    descriptionEn: 'GitHub Copilot uses `.github/copilot-instructions.md` for repository-wide instructions.',
    docsUrl: 'https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot',
    primaryConfigPaths: ['.github/copilot-instructions.md'],
  },
  {
    id: 'claude-code',
    displayName: 'Claude Code',
    descriptionKo:
      'Claude Code는 AGENTS.md를 직접 읽지 않으므로 CLAUDE.md에서 `@AGENTS.md`로 임포트해야 한다.',
    descriptionEn:
      'Claude Code reads CLAUDE.md (not AGENTS.md). Import AGENTS.md via `@AGENTS.md` to share content across tools.',
    docsUrl: 'https://code.claude.com/docs/en/memory#agentsmd',
    primaryConfigPaths: ['CLAUDE.md'],
  },
  {
    id: 'codex',
    displayName: 'OpenAI Codex',
    descriptionKo: 'AGENTS.md를 1순위로 인식하는 OpenAI의 코딩 에이전트.',
    descriptionEn: 'OpenAI coding agent that natively reads AGENTS.md as the primary configuration source.',
    docsUrl: 'https://developers.openai.com/codex/guides/agents-md',
    primaryConfigPaths: ['AGENTS.md'],
  },
]

/** ID로 빠른 조회 */
export const AI_TOOLS_BY_ID: Readonly<Record<AiToolId, AiToolMeta>> = {
  cursor: AI_TOOLS[0],
  copilot: AI_TOOLS[1],
  'claude-code': AI_TOOLS[2],
  codex: AI_TOOLS[3],
}

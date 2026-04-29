/**
 * Prettier 2.x 설정을 3.x로 변환한다.
 *
 * 변환 대상(공식 노트 기반):
 *   - jsxBracketSameLine → bracketSameLine (v2.4 deprecated, v3 제거)
 *   - pluginSearchDirs   → 제거 + 경고 (v3 제거, plugins 직접 명시 필요)
 *
 * trailingComma 기본값 변경(v2 "es5" → v3 "all")은 audit info로 안내하며
 * 자동 변환 대상이 아니다. 사용자가 명시적으로 선택해야 의미가 있다.
 *
 * 출력 형식은 JSON(.prettierrc.json 호환)으로 통일한다. Prettier 설정의
 * 표준 형식이며 가장 안전하다. 입력이 CommonJS/ESM이어도 동일하게 JSON으로
 * 출력하므로, 사용자는 출력을 .prettierrc 파일에 그대로 저장할 수 있다.
 *
 * SPEC-0004 §3.2.1 ConfigInspector 인터페이스의 migrate 구현체로 사용된다.
 */
import type { PrettierConfig } from './prettierParser'
import type { MigrationResult, MigrationWarning } from './types'

/** v2 키 → v3 키 단순 리네임 매핑 */
const RENAME_MAP: Record<string, string> = {
  jsxBracketSameLine: 'bracketSameLine',
}

/**
 * v3에서 제거된 옵션. 자동 변환할 수 없으므로 결과에서 제거하고 경고로 안내한다.
 * key: 옵션명, value: { 영문/한글 안내 메시지 }
 */
const DROP_WITH_WARNING: Record<string, { en: string; ko: string }> = {
  pluginSearchDirs: {
    en: 'pluginSearchDirs has been removed in Prettier 3.x. Add the plugins directly to the "plugins" option.',
    ko: 'pluginSearchDirs는 Prettier 3.x에서 제거되었습니다. "plugins" 옵션에 플러그인을 직접 명시하세요.',
  },
}

/** Prettier 2.x → 3.x 변환 */
export const migratePrettierConfig = (
  legacyConfig: PrettierConfig,
): MigrationResult<PrettierConfig> => {
  const warnings: MigrationWarning[] = []
  const next: PrettierConfig = {}

  for (const [key, value] of Object.entries(legacyConfig)) {
    // 제거 대상
    if (key in DROP_WITH_WARNING) {
      const dropMsg = DROP_WITH_WARNING[key]
      warnings.push({ message: dropMsg.en, messageKo: dropMsg.ko })
      continue
    }

    // 단순 리네임
    const renamed = RENAME_MAP[key]
    if (renamed) {
      next[renamed] = value
      continue
    }

    // 그 외는 보존
    next[key] = value
  }

  // JSON 형식으로 직렬화 (Prettier 자체 포맷에 가깝게 2칸 들여쓰기)
  const output = JSON.stringify(next, null, 2)

  return {
    output,
    config: next,
    warnings,
  }
}

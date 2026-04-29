<script lang="ts">
  /**
   * 도구별 마이그레이션 패널 (범용화).
   * ESLint / Prettier / TSConfig 등 ConfigInspector 인터페이스를 따르는 도구라면
   * 동일한 패널 UI에서 detect → audit → migrate 흐름을 처리한다.
   *
   * SPEC-0004 §3.2.2 Phase C 10단계.
   *
   * 입력 흐름:
   *   - 사용자 입력은 300ms debounce 후 자동으로 audit + migrate를 실행한다 (결정 3 — A안)
   *   - isLegacyConfig=true → migrate 흐름 (변환 결과 미리보기 + 변환 결과 기준 audit)
   *   - isLegacyConfig=false → audit 흐름 (입력 그대로 미리보기 + 입력 기준 audit)
   *
   * ESLint 전용 로직:
   *   - 권장 규칙 [적용] 버튼은 toolType === 'eslint' 일 때만 활성화한다.
   *   - tsconfig/prettier는 onapplyrule 미사용 (자동 규칙 적용은 ESLint에 한해 의미가 있음).
   */
  import MigrationFeedback from '@/components/generator/MigrationFeedback.svelte'
  import type { ConfigInspector } from '@/lib/migration'
  import { type AuditResult, type MigrationResult, type MigrationWarning } from '@/lib/migration'
  import { detectToolType } from '@/lib/migration/toolSignature'

  type ToolType = 'eslint' | 'prettier' | 'tsconfig'

  interface Props {
    locale: string
    toolType: ToolType
    inspector: ConfigInspector<unknown, unknown>
    acceptExtensions: string
    placeholder: string
    supportedFormatsLabel: string
    onmigrationresult?: (result: MigrationResult | null) => void
    onapplyrule?: (ruleName: string, ruleValue: string) => void
    /** 입력이 다른 도구의 설정으로 추정될 때 부모에게 알린다. null이면 일치/판별불가. */
    ondetectedmismatch?: (detectedTool: ToolType | null) => void
  }

  let {
    locale,
    toolType,
    inspector,
    acceptExtensions,
    placeholder,
    supportedFormatsLabel,
    onmigrationresult,
    onapplyrule,
    ondetectedmismatch,
  }: Props = $props()

  /** 패널 동작 모드 */
  type PanelMode = 'migrate' | 'audit'

  let inputCode = $state('')
  let detectedFormat = $derived(inputCode.length > 0 ? inspector.detect(inputCode) : 'unknown')
  let warnings = $state<MigrationWarning[]>([])
  let errorMessage = $state<string | null>(null)
  let auditResult = $state<AuditResult | null>(null)
  let currentOutputCode = $state('')
  let panelMode = $state<PanelMode>('migrate')
  let fileInputRef = $state<HTMLInputElement | null>(null)
  let uploadedFileName = $state('')

  /** 입력 debounce 타이머 (결정 3 — A안: 300ms 자동 실행) */
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  const DEBOUNCE_MS = 300

  /**
   * 입력 코드를 분석하고 audit + migrate를 실행한다.
   * inspector.audit 결과의 isLegacyConfig 값에 따라 흐름이 분기된다.
   */
  const runMigration = () => {
    if (inputCode.trim().length < 5) {
      onmigrationresult?.(null)
      ondetectedmismatch?.(null)
      warnings = []
      auditResult = null
      errorMessage = null
      panelMode = 'migrate'
      currentOutputCode = ''
      return
    }

    // 도구 유형 검증 — 다른 도구의 설정으로 추정되면 변환을 차단한다.
    const detected = detectToolType(inputCode)
    if (
      (detected === 'eslint' || detected === 'prettier' || detected === 'tsconfig') &&
      detected !== toolType
    ) {
      ondetectedmismatch?.(detected)
      onmigrationresult?.(null)
      warnings = []
      auditResult = null
      errorMessage = null
      panelMode = 'migrate'
      currentOutputCode = ''
      return
    }
    ondetectedmismatch?.(null)

    // 입력 코드를 먼저 진단해 Legacy 여부를 판정한다.
    const inputAudit = inspector.audit(inputCode)

    if (!inputAudit.isLegacyConfig) {
      // Audit-only 모드: 입력을 그대로 미리보기에 노출하고 진단 결과만 표시한다.
      panelMode = 'audit'
      warnings = []
      errorMessage = null
      currentOutputCode = inputCode
      auditResult = inputAudit
      onmigrationresult?.({ output: inputCode, warnings: [] })
      return
    }

    // Legacy: 마이그레이션 흐름.
    panelMode = 'migrate'
    try {
      const format = inspector.detect(inputCode)
      const parsed = inspector.parse(inputCode, format)
      const result = inspector.migrate(parsed)
      warnings = result.warnings
      errorMessage = null
      currentOutputCode = result.output
      onmigrationresult?.(result)

      // 변환된 코드에 대해 분석 실행
      auditResult = inspector.audit(result.output)
    } catch {
      onmigrationresult?.(null)
      warnings = []
      auditResult = null
      errorMessage = getMigrationErrorMessage(toolType, locale)
    }
  }

  /**
   * 도구별 마이그레이션 실패 메시지를 반환한다.
   * 지원 형식 안내를 도구별로 제공한다.
   */
  const getMigrationErrorMessage = (tool: ToolType, lang: string): string => {
    if (lang === 'ko') {
      switch (tool) {
        case 'eslint':
          return '변환에 실패했습니다. 지원되는 형식(.eslintrc JSON 또는 CommonJS)인지 확인해주세요.'
        case 'prettier':
          return '변환에 실패했습니다. .prettierrc / prettier.config.mjs 형식인지 확인해주세요.'
        case 'tsconfig':
          return '진단에 실패했습니다. tsconfig.json 형식(JSON with comments)인지 확인해주세요.'
      }
    }
    switch (tool) {
      case 'eslint':
        return 'Migration failed. Please check if the file is in a supported format (.eslintrc JSON or CommonJS).'
      case 'prettier':
        return 'Migration failed. Please check if the file is in a supported format (.prettierrc or prettier.config.mjs).'
      case 'tsconfig':
        return 'Audit failed. Please check if the file is valid tsconfig.json (JSON with comments).'
    }
  }

  /**
   * 입력 변경 핸들러 — debounce 적용.
   * 빠른 타이핑 중에 매 키스트로크마다 audit/migrate를 실행하면
   * 큰 설정 파일에서 UI가 느려지므로 300ms로 묶는다.
   */
  const handleInputChange = () => {
    uploadedFileName = ''
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      runMigration()
      debounceTimer = null
    }, DEBOUNCE_MS)
  }

  /**
   * 파일 업로드 핸들러.
   * 업로드는 즉시 실행하고 debounce를 우회한다 (사용자 의도가 명시적이므로).
   */
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    uploadedFileName = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      inputCode = (e.target?.result as string) ?? ''
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
      runMigration()
    }
    reader.readAsText(file)
  }

  const triggerFileUpload = () => {
    fileInputRef?.click()
  }

  const handleClear = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    inputCode = ''
    uploadedFileName = ''
    warnings = []
    errorMessage = null
    auditResult = null
    panelMode = 'migrate'
    currentOutputCode = ''
    onmigrationresult?.(null)
    if (fileInputRef) fileInputRef.value = ''
  }

  /** 분석 항목 닫기 */
  const handleDismissAuditItem = (message: string) => {
    if (!auditResult) return
    auditResult = {
      ...auditResult,
      items: auditResult.items.filter((item) => item.message !== message),
      summary: {
        errors: auditResult.items.filter((i) => i.message !== message && i.severity === 'error')
          .length,
        warnings: auditResult.items.filter((i) => i.message !== message && i.severity === 'warning')
          .length,
        infos: auditResult.items.filter((i) => i.message !== message && i.severity === 'info')
          .length,
      },
    }
  }

  // ─── ESLint 전용 로직 ──────────────────────────────────────────────────────
  // toolType === 'eslint' 일 때만 활성화된다.
  // Prettier/TSConfig는 권장 규칙 자동 적용 의미가 약하므로 비활성화.

  /**
   * 문자열 끝에 trailing comma를 보장한다.
   * 마지막 줄이 한 줄 주석(`// ...`)인 경우 주석 앞 의미 있는 위치를 찾아 쉼표를 삽입해야
   * 주석 뒤에 쉼표가 붙는 문법 오류(예: `// comment,`)를 피할 수 있다.
   */
  const ensureTrailingComma = (input: string): string => {
    const lines = input.split('\n')
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i]
      const trimmedLine = line.trim()
      if (trimmedLine.length === 0) continue
      if (trimmedLine.startsWith('//')) continue

      const commentIdx = findInlineCommentStart(line)
      if (commentIdx !== -1) {
        const before = line.slice(0, commentIdx).replace(/,?\s*$/, '')
        const after = line.slice(commentIdx)
        lines[i] = `${before}, ${after.trimStart()}`.trimEnd()
        return lines.join('\n')
      }

      lines[i] = line.replace(/,?\s*$/, ',')
      return lines.join('\n')
    }

    return input
  }

  /**
   * 한 줄에서 인라인 한 줄 주석(`//`) 시작 인덱스를 찾는다.
   * 문자열 리터럴 내부의 `//`는 무시한다.
   */
  const findInlineCommentStart = (line: string): number => {
    let inString: '"' | "'" | '`' | null = null
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      const prev = line[i - 1]
      if (inString) {
        if (ch === inString && prev !== '\\') inString = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = ch
        continue
      }
      if (ch === '/' && line[i + 1] === '/') return i
    }
    return -1
  }

  /**
   * rules 블록의 시작 `{`부터 매칭되는 닫는 `}` 위치를 찾는다.
   * 단순 정규식으로는 중첩 객체(예: ["error", { options }])를 처리할 수 없어
   * 괄호 균형을 직접 카운트한다.
   */
  const findRulesBlock = (code: string): { start: number; end: number; indent: string } | null => {
    const rulesMatch = code.match(/^(\s*)rules:\s*\{/m)
    if (!rulesMatch || rulesMatch.index === undefined) return null

    const indent = rulesMatch[1]
    const openBraceIdx = code.indexOf('{', rulesMatch.index)
    if (openBraceIdx === -1) return null

    let depth = 1
    let i = openBraceIdx + 1
    while (i < code.length && depth > 0) {
      if (code[i] === '{') depth++
      else if (code[i] === '}') depth--
      i++
    }
    if (depth !== 0) return null

    return { start: openBraceIdx, end: i - 1, indent }
  }

  /**
   * ESLint 권장 규칙 적용 (info 항목).
   * 비-ESLint 도구에서는 호출되지 않아야 한다 (MigrationFeedback의 onapplyrule prop을
   * 조건부로 전달하므로 버튼 자체가 비노출됨).
   */
  const handleApplyRule = (ruleName: string, ruleValue: string) => {
    if (toolType !== 'eslint') return

    const currentCode = currentOutputCode
    const rulesBlock = findRulesBlock(currentCode)

    let newCode: string
    if (rulesBlock) {
      const baseIndent = rulesBlock.indent
      const innerIndent = baseIndent + '  '
      const innerContent = currentCode.slice(rulesBlock.start + 1, rulesBlock.end)
      const trimmed = innerContent.replace(/^\s*\n|\n\s*$/g, '')
      const newEntry = `"${ruleName}": "${ruleValue}"`

      let updatedInner: string
      if (trimmed.length === 0) {
        updatedInner = `\n${innerIndent}${newEntry}\n${baseIndent}`
      } else {
        const withComma = ensureTrailingComma(trimmed)
        updatedInner = `\n${withComma}\n${innerIndent}${newEntry}\n${baseIndent}`
      }

      newCode =
        currentCode.slice(0, rulesBlock.start + 1) +
        updatedInner +
        currentCode.slice(rulesBlock.end)
    } else {
      const insertion = `  {\n    rules: {\n      "${ruleName}": "${ruleValue}",\n    },\n  },\n`
      newCode = currentCode.replace(/export default \[\n?/, (match) => match + insertion)
    }

    currentOutputCode = newCode

    onmigrationresult?.({
      output: newCode,
      warnings,
    })

    // 부모에 알림 (페이지가 미리보기 상태를 별도로 관리하는 경우 사용)
    onapplyrule?.(ruleName, ruleValue)

    // Audit 모드에서는 적용 결과를 기준으로 진단을 재계산해
    // "권장 규칙 추가" 항목이 자동으로 사라지고 새 상태에 대한 진단이 노출되도록 한다.
    if (panelMode === 'audit') {
      auditResult = inspector.audit(newCode)
    } else {
      handleDismissAuditItem(`Consider adding "${ruleName}" rule`)
    }
  }

  /**
   * MigrationFeedback에 규칙 적용 콜백을 전달할지 결정.
   * ESLint에 한해 권장 규칙 자동 적용을 활성화한다.
   */
  const feedbackOnApplyRule = $derived(toolType === 'eslint' ? handleApplyRule : undefined)

  // ─── 라벨 ──────────────────────────────────────────────────────────────────

  let titleLabel = $derived(
    locale === 'ko'
      ? toolType === 'eslint'
        ? 'ESLint 설정 파일을 붙여넣거나 업로드하세요'
        : toolType === 'prettier'
          ? 'Prettier 설정 파일을 붙여넣거나 업로드하세요'
          : 'tsconfig.json을 붙여넣거나 업로드하세요'
      : toolType === 'eslint'
        ? 'Paste or upload your ESLint config file'
        : toolType === 'prettier'
          ? 'Paste or upload your Prettier config file'
          : 'Paste or upload your tsconfig.json',
  )
  let uploadLabel = $derived(locale === 'ko' ? '파일 업로드' : 'Upload file')
  let clearLabel = $derived(locale === 'ko' ? '초기화' : 'Clear')
  let formatLabel = $derived(locale === 'ko' ? '감지된 형식' : 'Detected format')
  let auditModeBadge = $derived(locale === 'ko' ? '진단 모드' : 'Audit only')
  let auditModeNotice = $derived(getAuditNotice(toolType, locale))

  /**
   * 도구별 audit 모드 안내문.
   * Phase C에서 prettier/tsconfig는 isLegacyConfig=false → audit-only 동작이 자연스럽다.
   */
  function getAuditNotice(tool: ToolType, lang: string): string {
    if (lang === 'ko') {
      switch (tool) {
        case 'eslint':
          return 'Flat config가 감지되었습니다. 변환 없이 진단 결과만 표시합니다. 권장 규칙을 적용하면 미리보기에만 반영되며, 실제 파일은 변경되지 않습니다.'
        case 'prettier':
          return 'deprecated 옵션이 감지되지 않았습니다. 입력을 그대로 미리보기에 노출하고 권장 옵션 진단만 표시합니다.'
        case 'tsconfig':
          return 'deprecated 옵션이 감지되지 않았습니다. 입력을 그대로 미리보기에 노출하고 권장 옵션 진단만 표시합니다.'
      }
    }
    switch (tool) {
      case 'eslint':
        return 'Flat config detected. Showing audit results only (no migration). Applying recommended rules updates the preview only — your original file is unchanged.'
      case 'prettier':
        return 'No deprecated options detected. Showing your input as preview with audit results only.'
      case 'tsconfig':
        return 'No deprecated options detected. Showing your input as preview with audit results only.'
    }
  }
</script>

<div class="flex flex-col gap-4">
  <div>
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-gray-700">
        {titleLabel}
      </p>
      <div class="flex items-center gap-2">
        {#if inputCode.trim().length > 0}
          <button
            type="button"
            class="text-xs text-gray-400 hover:text-gray-600"
            onclick={handleClear}
          >
            {clearLabel}
          </button>
        {/if}
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-gray-600 hover:border-primary hover:text-primary"
          onclick={triggerFileUpload}
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          {uploadLabel}
        </button>
        <input
          bind:this={fileInputRef}
          type="file"
          accept={acceptExtensions}
          class="hidden"
          onchange={handleFileUpload}
        />
      </div>
    </div>

    <p class="mt-1 text-xs text-gray-400">{supportedFormatsLabel}</p>

    {#if uploadedFileName}
      <div
        class="mt-2 flex items-center gap-2 rounded-md bg-primary/5 px-3 py-1.5 text-xs text-primary"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {uploadedFileName}
      </div>
    {/if}

    <textarea
      rows="10"
      class="mt-2 block w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      {placeholder}
      bind:value={inputCode}
      oninput={handleInputChange}
    ></textarea>
  </div>

  {#if inputCode.trim().length > 0}
    <div class="flex items-center gap-2 text-xs text-gray-500">
      <span class="font-medium">{formatLabel}:</span>
      <span class="rounded bg-gray-100 px-2 py-0.5 font-mono">
        {detectedFormat === 'unknown' ? '?' : detectedFormat}
      </span>
      {#if panelMode === 'audit'}
        <span class="rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
          {auditModeBadge}
        </span>
      {/if}
    </div>

    {#if panelMode === 'audit'}
      <div class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
        {auditModeNotice}
      </div>
    {/if}
  {/if}

  <MigrationFeedback
    {locale}
    {errorMessage}
    {warnings}
    {auditResult}
    ondismiss={handleDismissAuditItem}
    onapplyrule={feedbackOnApplyRule}
  />
</div>

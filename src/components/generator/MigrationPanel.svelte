<script lang="ts">
  /**
   * 마이그레이션 탭 UI를 렌더링한다.
   * 레거시 설정 파일을 붙여넣기 또는 파일 업로드로 입력받아
   * 형식을 감지하고 변환 결과를 부모에게 전달한다.
   * 변환 결과에 분석(audit) 결과도 함께 표시한다.
   */
  import {
    auditEslintConfig,
    detectConfigFormat,
    migrateEslintConfig,
    parseEslintLegacyConfig,
    type AuditResult,
    type MigrationResult,
    type MigrationWarning,
  } from '@/lib/migration'

  import MigrationFeedback from './MigrationFeedback.svelte'

  interface Props {
    locale: string
    onmigrationresult: (result: MigrationResult | null) => void
  }

  let { locale, onmigrationresult }: Props = $props()

  /** 패널 동작 모드 */
  type PanelMode = 'migrate' | 'audit'

  let inputCode = $state('')
  let detectedFormat = $derived(detectConfigFormat(inputCode))
  let warnings = $state<MigrationWarning[]>([])
  let errorMessage = $state<string | null>(null)
  let auditResult = $state<AuditResult | null>(null)
  let currentOutputCode = $state('')
  let panelMode = $state<PanelMode>('migrate')
  let fileInputRef = $state<HTMLInputElement | null>(null)
  let uploadedFileName = $state('')

  const runMigration = () => {
    if (inputCode.trim().length < 5) {
      onmigrationresult(null)
      warnings = []
      auditResult = null
      panelMode = 'migrate'
      return
    }

    // 입력 코드를 먼저 진단해 Legacy/Flat 여부를 판정한다.
    // Legacy → 기존 마이그레이션 흐름, Flat → audit-only 흐름으로 분기한다.
    const inputAudit = auditEslintConfig(inputCode)

    if (!inputAudit.isLegacyConfig) {
      // Audit-only 모드: 입력을 그대로 미리보기에 노출하고 진단 결과만 표시한다.
      panelMode = 'audit'
      warnings = []
      errorMessage = null
      currentOutputCode = inputCode
      auditResult = inputAudit
      onmigrationresult({ output: inputCode, warnings: [] })
      return
    }

    // Legacy: 기존 마이그레이션 흐름.
    panelMode = 'migrate'
    try {
      const parsed = parseEslintLegacyConfig(inputCode, detectedFormat)
      const result = migrateEslintConfig(parsed)
      warnings = result.warnings
      errorMessage = null
      currentOutputCode = result.output
      onmigrationresult(result)

      // 변환된 코드에 대해 분석 실행
      auditResult = auditEslintConfig(result.output)
    } catch {
      onmigrationresult(null)
      warnings = []
      auditResult = null
      errorMessage =
        locale === 'ko'
          ? '변환에 실패했습니다. 지원되는 형식(.eslintrc JSON 또는 CommonJS)인지 확인해주세요.'
          : 'Migration failed. Please check if the file is in a supported format (.eslintrc JSON or CommonJS).'
    }
  }

  const handleInputChange = () => {
    uploadedFileName = ''
    runMigration()
  }

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    uploadedFileName = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      inputCode = (e.target?.result as string) ?? ''
      runMigration()
    }
    reader.readAsText(file)
  }

  const triggerFileUpload = () => {
    fileInputRef?.click()
  }

  const handleClear = () => {
    inputCode = ''
    uploadedFileName = ''
    warnings = []
    errorMessage = null
    auditResult = null
    onmigrationresult(null)
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

  /**
   * 문자열 끝에 trailing comma를 보장한다.
   * 마지막 줄이 한 줄 주석(`// ...`)인 경우 주석 앞 의미 있는 위치를 찾아 쉼표를 삽입해야
   * 주석 뒤에 쉼표가 붙는 문법 오류(예: `// comment,`)를 피할 수 있다.
   */
  const ensureTrailingComma = (input: string): string => {
    const lines = input.split('\n')
    // 끝에서부터 의미 있는 라인을 찾는다 (공백/주석만 있는 라인은 건너뜀)
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i]
      const trimmedLine = line.trim()
      if (trimmedLine.length === 0) continue

      // 한 줄 주석으로만 이루어진 라인은 건너뛴다
      if (trimmedLine.startsWith('//')) continue

      // 코드 + 한 줄 주석 (예: `"a": "b" // comment`) — 주석 앞 부분에 쉼표 삽입
      const commentIdx = findInlineCommentStart(line)
      if (commentIdx !== -1) {
        const before = line.slice(0, commentIdx).replace(/,?\s*$/, '')
        const after = line.slice(commentIdx)
        // 주석 앞 코드와 주석 사이에 한 칸 공백을 두고 쉼표 부착
        lines[i] = `${before}, ${after.trimStart()}`.trimEnd()
        return lines.join('\n')
      }

      // 일반 코드 라인 — 끝에 쉼표 보장
      lines[i] = line.replace(/,?\s*$/, ',')
      return lines.join('\n')
    }

    // 의미 있는 라인을 못 찾으면 원본 유지
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

  /** 권장 규칙 적용 (info 항목) */
  const handleApplyRule = (ruleName: string, ruleValue: string) => {
    const currentCode = currentOutputCode
    const rulesBlock = findRulesBlock(currentCode)

    let newCode: string
    if (rulesBlock) {
      // 기존 rules 블록에 규칙 추가
      // rules 블록의 들여쓰기(indent)를 기준으로 내부 키는 indent + 2칸
      const baseIndent = rulesBlock.indent
      const innerIndent = baseIndent + '  '
      const innerContent = currentCode.slice(rulesBlock.start + 1, rulesBlock.end)
      const trimmed = innerContent.replace(/^\s*\n|\n\s*$/g, '')
      const newEntry = `"${ruleName}": "${ruleValue}"`

      let updatedInner: string
      if (trimmed.length === 0) {
        updatedInner = `\n${innerIndent}${newEntry}\n${baseIndent}`
      } else {
        // 마지막 엔트리에 trailing comma 보장.
        // 단순 `replace(/,?\s*$/, ',')`는 마지막 줄이 한 줄 주석(// ...)인 경우
        // 주석 뒤에 쉼표가 붙어 문법 오류가 발생한다.
        // 마지막 non-주석/non-공백 위치를 찾아 그 뒤에 쉼표를 삽입한다.
        const withComma = ensureTrailingComma(trimmed)
        updatedInner = `\n${withComma}\n${innerIndent}${newEntry}\n${baseIndent}`
      }

      newCode =
        currentCode.slice(0, rulesBlock.start + 1) +
        updatedInner +
        currentCode.slice(rulesBlock.end)
    } else {
      // rules 블록이 없으면 export default [ ... ] 의 첫 config 객체에 rules 추가
      // 가장 단순한 케이스: 새 config 객체를 추가
      const insertion = `  {\n    rules: {\n      "${ruleName}": "${ruleValue}",\n    },\n  },\n`
      newCode = currentCode.replace(/export default \[\n?/, (match) => match + insertion)
    }

    currentOutputCode = newCode

    onmigrationresult({
      output: newCode,
      warnings,
    })

    handleDismissAuditItem(`Consider adding "${ruleName}" rule`)
  }

  let titleLabel = $derived(
    locale === 'ko'
      ? '기존 .eslintrc 파일을 붙여넣거나 업로드하세요'
      : 'Paste or upload your legacy .eslintrc file',
  )
  let uploadLabel = $derived(locale === 'ko' ? '파일 업로드' : 'Upload file')
  let clearLabel = $derived(locale === 'ko' ? '초기화' : 'Clear')
  let formatLabel = $derived(locale === 'ko' ? '감지된 형식' : 'Detected format')
  let supportedLabel = $derived(
    locale === 'ko'
      ? '지원 형식: .eslintrc (JSON), .eslintrc.js (CommonJS)'
      : 'Supported: .eslintrc (JSON), .eslintrc.js (CommonJS)',
  )
  const placeholder =
    '{\n  "extends": ["eslint:recommended"],\n  "rules": {\n    "no-console": "warn"\n  }\n}'
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
          accept=".eslintrc,.eslintrc.json,.eslintrc.js,.eslintrc.cjs,.eslintrc.yml,.eslintrc.yaml,.json,.js,.cjs"
          class="hidden"
          onchange={handleFileUpload}
        />
      </div>
    </div>

    <p class="mt-1 text-xs text-gray-400">{supportedLabel}</p>

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
    </div>
  {/if}

  <MigrationFeedback
    {locale}
    {errorMessage}
    {warnings}
    {auditResult}
    ondismiss={handleDismissAuditItem}
    onapplyrule={handleApplyRule}
  />
</div>

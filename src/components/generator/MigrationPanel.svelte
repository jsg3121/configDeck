<script lang="ts">
  /**
   * 마이그레이션/분석 탭 UI를 렌더링한다.
   * ESLint 설정 파일을 붙여넣기 또는 파일 업로드로 입력받아
   * 마이그레이션 또는 분석을 수행한다.
   */
  import {
    auditEslintConfig,
    detectConfigFormat,
    migrateEslintConfig,
    parseEslintLegacyConfig,
    type AuditResult,
    type MigrationResult,
  } from '@/lib/migration'

  import AuditFeedback from './AuditFeedback.svelte'
  import MigrationFeedback from './MigrationFeedback.svelte'

  type PanelMode = 'migrate' | 'audit'

  interface Props {
    locale: string
    onmigrationresult: (result: MigrationResult | null) => void
  }

  let { locale, onmigrationresult }: Props = $props()

  let mode = $state<PanelMode>('migrate')
  let inputCode = $state('')
  let detectedFormat = $derived(detectConfigFormat(inputCode))
  let warnings = $state<string[]>([])
  let errorMessage = $state<string | null>(null)
  let auditResult = $state<AuditResult | null>(null)
  let fileInputRef = $state<HTMLInputElement | null>(null)
  let uploadedFileName = $state('')

  const runMigration = () => {
    if (inputCode.trim().length < 5) {
      onmigrationresult(null)
      warnings = []
      return
    }

    try {
      const parsed = parseEslintLegacyConfig(inputCode, detectedFormat)
      const result = migrateEslintConfig(parsed)
      warnings = result.warnings
      errorMessage = null
      onmigrationresult(result)
    } catch {
      onmigrationresult(null)
      warnings = []
      errorMessage =
        locale === 'ko'
          ? '변환에 실패했습니다. 지원되는 형식(.eslintrc JSON 또는 CommonJS)인지 확인해주세요.'
          : 'Migration failed. Please check if the file is in a supported format (.eslintrc JSON or CommonJS).'
    }
  }

  const runAudit = () => {
    if (inputCode.trim().length < 5) {
      auditResult = null
      return
    }
    auditResult = auditEslintConfig(inputCode)
  }

  const handleInputChange = () => {
    uploadedFileName = ''
    if (mode === 'migrate') {
      runMigration()
    } else {
      runAudit()
    }
  }

  const handleModeChange = (newMode: PanelMode) => {
    mode = newMode
    if (inputCode.trim().length >= 5) {
      if (newMode === 'migrate') {
        auditResult = null
        runMigration()
      } else {
        onmigrationresult(null)
        warnings = []
        errorMessage = null
        runAudit()
      }
    }
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
    onmigrationresult(null)
    if (fileInputRef) fileInputRef.value = ''
  }

  let migrateTabLabel = $derived(locale === 'ko' ? '마이그레이션' : 'Migrate')
  let auditTabLabel = $derived(locale === 'ko' ? '분석' : 'Audit')
  let titleLabel = $derived(
    mode === 'migrate'
      ? locale === 'ko'
        ? '기존 .eslintrc 파일을 붙여넣거나 업로드하세요'
        : 'Paste or upload your legacy .eslintrc file'
      : locale === 'ko'
        ? 'ESLint 설정 파일을 붙여넣거나 업로드하세요'
        : 'Paste or upload your ESLint config file',
  )
  let uploadLabel = $derived(locale === 'ko' ? '파일 업로드' : 'Upload file')
  let clearLabel = $derived(locale === 'ko' ? '초기화' : 'Clear')
  let formatLabel = $derived(locale === 'ko' ? '감지된 형식' : 'Detected format')
  let supportedLabel = $derived(
    mode === 'migrate'
      ? locale === 'ko'
        ? '지원 형식: .eslintrc (JSON), .eslintrc.js (CommonJS)'
        : 'Supported: .eslintrc (JSON), .eslintrc.js (CommonJS)'
      : locale === 'ko'
        ? '지원 형식: .eslintrc, eslint.config.mjs (flat config 포함)'
        : 'Supported: .eslintrc, eslint.config.mjs (including flat config)',
  )
  const placeholder =
    '{\n  "extends": ["eslint:recommended"],\n  "rules": {\n    "no-console": "warn"\n  }\n}'
</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-1 rounded-lg bg-gray-100 p-1">
    <button
      type="button"
      class="flex-1 rounded-md px-4 py-2 text-sm font-medium {mode === 'migrate'
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-500 hover:text-gray-700'}"
      onclick={() => handleModeChange('migrate')}
    >
      {migrateTabLabel}
    </button>
    <button
      type="button"
      class="flex-1 rounded-md px-4 py-2 text-sm font-medium {mode === 'audit'
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-500 hover:text-gray-700'}"
      onclick={() => handleModeChange('audit')}
    >
      {auditTabLabel}
    </button>
  </div>

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

  {#if mode === 'migrate'}
    <MigrationFeedback {locale} {errorMessage} {warnings} />
  {:else}
    <AuditFeedback {locale} result={auditResult} />
  {/if}
</div>

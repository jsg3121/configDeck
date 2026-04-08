<script lang="ts">
  /**
   * 마이그레이션 탭 UI를 렌더링한다.
   * 레거시 설정 파일을 붙여넣으면 형식을 감지하고 변환 결과를 부모에게 전달한다.
   */
  import {
    detectConfigFormat,
    migrateEslintConfig,
    parseEslintLegacyConfig,
    type MigrationResult,
  } from '@/lib/migration'

  interface Props {
    locale: string
    onmigrationresult: (result: MigrationResult | null) => void
  }

  let { locale, onmigrationresult }: Props = $props()

  /** 사용자 입력 코드 */
  let inputCode = $state('')
  /** 감지된 형식 */
  let detectedFormat = $derived(detectConfigFormat(inputCode))
  /** 변환 경고 목록 */
  let warnings = $state<string[]>([])

  /** 입력 변경 시 마이그레이션을 실행한다 */
  const handleInputChange = () => {
    if (inputCode.trim().length < 5) {
      onmigrationresult(null)
      warnings = []
      return
    }

    try {
      const parsed = parseEslintLegacyConfig(inputCode, detectedFormat)
      const result = migrateEslintConfig(parsed)
      warnings = result.warnings
      onmigrationresult(result)
    } catch {
      onmigrationresult(null)
      warnings = []
    }
  }

  const pasteLabel =
    locale === 'ko' ? '레거시 설정 파일을 붙여넣으세요' : 'Paste your legacy config file'
  const formatLabel = locale === 'ko' ? '감지된 형식' : 'Detected format'
  const warningLabel = locale === 'ko' ? '수동 확인 필요' : 'Manual review needed'
  const placeholder =
    '{\n  "extends": ["eslint:recommended"],\n  "rules": {\n    "no-console": "warn"\n  }\n}'
</script>

<div class="flex flex-col gap-4">
  <div>
    <label class="block text-sm font-medium text-gray-700">
      {pasteLabel}
    </label>
    <textarea
      rows="10"
      class="mt-1.5 block w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
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

  {#if warnings.length > 0}
    <div class="rounded-md border border-amber-200 bg-amber-50 p-3">
      <h4 class="text-xs font-semibold text-amber-800">{warningLabel}</h4>
      <ul class="mt-1.5 flex flex-col gap-1">
        {#each warnings as warning}
          <li class="text-xs text-amber-700">• {warning}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

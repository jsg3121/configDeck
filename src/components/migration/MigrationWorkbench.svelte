<script lang="ts">
  /**
   * 마이그레이션 페이지의 부모 아일랜드.
   * MigrationPanel(좌)와 MigrationResultPreview(우)를 단일 client:load 아일랜드로 묶어
   * 결과 상태를 공유한다 (가이드라인 2 — 부모 아일랜드 1개 + 자식 컴포넌트 2개).
   *
   * SPEC-0004 §3.2.2 / Phase C 10단계.
   */
  import type { Locale } from '@/i18n'

  import {
    eslintInspector,
    prettierInspector,
    tsconfigInspector,
    type ConfigInspector,
    type MigrationResult,
  } from '@/lib/migration'

  import MigrationPanel from './MigrationPanel.svelte'
  import MigrationResultPreview from './MigrationResultPreview.svelte'
  import ToolMismatchBanner from './ToolMismatchBanner.svelte'
  import TSConfigDisclaimer from './TSConfigDisclaimer.svelte'

  type ToolType = 'eslint' | 'prettier' | 'tsconfig'

  interface Props {
    locale: Locale
    toolType: ToolType
    /** 미리보기 헤더에 표시될 도구별 출력 파일명 (예: eslint.config.mjs) */
    outputFileName: string
    placeholder: string
    supportedFormatsLabel: string
    acceptExtensions: string
  }

  let {
    locale,
    toolType,
    outputFileName,
    placeholder,
    supportedFormatsLabel,
    acceptExtensions,
  }: Props = $props()

  /**
   * 도구별 인스펙터 매핑.
   * 각 인스펙터는 ConfigInspector 인터페이스를 따르므로 페이지에서는 toolType만 보면 된다.
   */
  const inspectorMap: Record<ToolType, ConfigInspector<unknown, unknown>> = {
    eslint: eslintInspector as ConfigInspector<unknown, unknown>,
    prettier: prettierInspector as ConfigInspector<unknown, unknown>,
    tsconfig: tsconfigInspector as ConfigInspector<unknown, unknown>,
  }

  const inspector = inspectorMap[toolType]

  /** MigrationPanel에서 받은 변환/감사 결과 — 미리보기에 그대로 흘려보낸다. */
  let migrationResult = $state<MigrationResult | null>(null)

  /** 입력이 다른 도구의 설정으로 추정되면 배너를 노출하고 미리보기를 비운다. */
  let detectedMismatch = $state<ToolType | null>(null)

  let previewCode = $derived(detectedMismatch ? '' : (migrationResult?.output ?? ''))

  const handleMigrationResult = (result: MigrationResult | null) => {
    migrationResult = result
  }

  const handleDetectedMismatch = (detected: ToolType | null) => {
    detectedMismatch = detected
  }
</script>

<div class="mx-auto flex h-full w-full flex-col lg:flex-row">
  <!-- 좌측: 입력 + 진단 -->
  <div class="w-full lg:w-1/2 lg:overflow-y-auto">
    <div class="mx-auto max-w-full px-6 py-8">
      {#if toolType === 'tsconfig'}
        <div class="mb-4">
          <TSConfigDisclaimer {locale} variant="top" />
        </div>
      {/if}

      {#if detectedMismatch}
        <div class="mb-4">
          <ToolMismatchBanner {locale} currentTool={toolType} detectedTool={detectedMismatch} />
        </div>
      {/if}

      <MigrationPanel
        {locale}
        {toolType}
        {inspector}
        {acceptExtensions}
        {placeholder}
        {supportedFormatsLabel}
        onmigrationresult={handleMigrationResult}
        ondetectedmismatch={handleDetectedMismatch}
      />
    </div>
  </div>

  <!-- 우측: 미리보기 -->
  <div
    class="w-full border-t border-border lg:w-[calc(100%-444px)] lg:h-full lg:border-t-0 lg:border-l lg:overflow-hidden"
  >
    <MigrationResultPreview {locale} code={previewCode} fileName={outputFileName}>
      {#snippet headerSlot()}
        {#if toolType === 'tsconfig' && previewCode.length > 0}
          <TSConfigDisclaimer {locale} variant="result" />
        {/if}
      {/snippet}
    </MigrationResultPreview>
  </div>
</div>

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

  let previewCode = $derived(migrationResult?.output ?? '')

  const handleMigrationResult = (result: MigrationResult | null) => {
    migrationResult = result
  }
</script>

<div class="flex h-full w-full flex-col gap-6 lg:flex-row lg:gap-8">
  <!-- 좌측: 입력 + 진단 -->
  <div class="w-full lg:w-1/2">
    {#if toolType === 'tsconfig'}
      <div class="mb-4">
        <TSConfigDisclaimer {locale} variant="top" />
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
    />
  </div>

  <!-- 우측: 미리보기 (lg 이상 sticky) -->
  <div class="w-full lg:w-1/2">
    <div class="lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)]">
      <MigrationResultPreview {locale} code={previewCode} fileName={outputFileName}>
        {#snippet headerSlot()}
          {#if toolType === 'tsconfig' && previewCode.length > 0}
            <TSConfigDisclaimer {locale} variant="result" />
          {/if}
        {/snippet}
      </MigrationResultPreview>
    </div>
  </div>
</div>

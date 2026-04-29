<script lang="ts">
  /**
   * 도구 유형 불일치 경고 배너.
   *
   * 사용처: MigrationWorkbench가 입력 도구 추정 결과와 페이지 toolType이
   * 불일치할 때 좌측 영역 상단에 노출한다. 변환은 차단되며, 사용자가 추정된
   * 도구 페이지로 이동할 수 있는 링크를 제공한다.
   *
   * SPEC-0004 §3.2.3 — Phase C 10단계 후속 (도구 유형 검증 + UX 안내).
   */
  import { buildLocalizedPath, getTranslation, type Locale } from '@/i18n'

  type Tool = 'eslint' | 'prettier' | 'tsconfig'

  interface Props {
    locale: Locale
    currentTool: Tool
    detectedTool: Tool
  }

  let { locale, currentTool, detectedTool }: Props = $props()

  const detectedToolName = $derived(getTranslation(locale, `migration.toolNames.${detectedTool}`))
  const currentToolName = $derived(getTranslation(locale, `migration.toolNames.${currentTool}`))

  const description = $derived(
    getTranslation(locale, 'migration.mismatchWarning.description')
      .replace('{detectedTool}', detectedToolName)
      .replace('{currentTool}', currentToolName),
  )
  const goToToolLabel = $derived(
    getTranslation(locale, 'migration.mismatchWarning.goToTool').replace(
      '{detectedTool}',
      detectedToolName,
    ),
  )
  const targetHref = $derived(buildLocalizedPath(locale, `/migration/${detectedTool}`))
</script>

<aside
  class="rounded-md border border-red-200 bg-red-50 p-4 text-red-800"
  role="alert"
  aria-live="polite"
>
  <div class="flex items-start gap-3">
    <svg
      class="mt-0.5 h-5 w-5 shrink-0 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <div class="flex-1">
      <h3 class="text-sm font-semibold text-red-900">
        {getTranslation(locale, 'migration.mismatchWarning.title')}
      </h3>
      <p class="mt-1 text-sm leading-relaxed">{description}</p>
      <p class="mt-2 text-xs font-medium">
        {getTranslation(locale, 'migration.mismatchWarning.blockedNotice')}
      </p>
      <a
        href={targetHref}
        class="mt-3 inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:text-red-900"
      >
        {goToToolLabel}
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</aside>

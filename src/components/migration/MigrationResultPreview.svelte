<script lang="ts">
  /**
   * 마이그레이션 결과 미리보기 + 복사/다운로드 컴포넌트.
   * MigrationPanel과 형제 관계로 부모(페이지 아일랜드)에서 상태를 공유받는다.
   *
   * SPEC-0004 §3.2.3 단계 6~7 — 변환 결과 미리보기 + 복사/다운로드.
   *
   * 빈 상태(입력 전):
   *   가이드 텍스트로 채워 CLS(Cumulative Layout Shift)를 방지한다 (가이드라인 4).
   */
  import { getTranslation } from '@/i18n'
  import type { Locale } from '@/i18n'
  import type { Snippet } from 'svelte'

  import { copyToClipboard, downloadAsFile } from '@/components/generator/modules/codePreviewLogic'

  interface Props {
    locale: Locale
    /** 미리보기에 표시할 코드. 빈 문자열이면 빈 상태 가이드를 노출한다. */
    code: string
    /** 다운로드 시 저장될 파일명. 도구별로 부모가 결정한다 (예: eslint.config.mjs). */
    fileName: string
    /** 미리보기 영역 위에 표시할 추가 슬롯 콘텐츠 (예: TSConfig 결과 디스클레이머). */
    headerSlot?: Snippet
  }

  let { locale, code, fileName, headerSlot }: Props = $props()

  let copyFeedbackVisible = $state(false)
  let downloadFeedbackVisible = $state(false)

  const handleCopy = async () => {
    if (!code) return
    await copyToClipboard(code)
    copyFeedbackVisible = true
    setTimeout(() => {
      copyFeedbackVisible = false
    }, 2000)
  }

  const handleDownload = () => {
    if (!code) return
    downloadAsFile(code, fileName)
    downloadFeedbackVisible = true
    setTimeout(() => {
      downloadFeedbackVisible = false
    }, 3000)
  }

  let copyLabel = $derived(getTranslation(locale, 'migration.previewActions.copyButton'))
  let copiedLabel = $derived(getTranslation(locale, 'migration.previewActions.copiedLabel'))
  let downloadLabel = $derived(getTranslation(locale, 'migration.previewActions.downloadButton'))
  let downloadedLabel = $derived(getTranslation(locale, 'migration.previewActions.downloadedLabel'))
  let previewHeading = $derived(getTranslation(locale, 'migration.page.previewHeading'))
  let emptyMessage = $derived(getTranslation(locale, 'migration.page.emptyPreview'))

  let hasCode = $derived(code.trim().length > 0)
</script>

<section class="flex h-full flex-col bg-code-bg" aria-label={previewHeading}>
  <!-- 상단 액션 바 -->
  <header class="flex items-center justify-between border-b border-gray-700 px-5 py-3">
    <span class="font-mono text-sm text-gray-300">{fileName}</span>
    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick={handleCopy}
        disabled={!hasCode}
        aria-label={copyFeedbackVisible ? copiedLabel : `${copyLabel} ${fileName}`}
        class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-300"
      >
        {copyFeedbackVisible ? copiedLabel : copyLabel}
      </button>
      <button
        type="button"
        onclick={handleDownload}
        disabled={!hasCode}
        aria-label={downloadFeedbackVisible ? downloadedLabel : `${downloadLabel} ${fileName}`}
        class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-300"
      >
        {downloadFeedbackVisible ? downloadedLabel : downloadLabel}
      </button>
    </div>
  </header>

  {#if headerSlot}
    <div class="border-b border-gray-700 px-5 py-3">
      {@render headerSlot()}
    </div>
  {/if}

  <!-- 코드 미리보기 -->
  <div class="flex-1 overflow-auto p-5" aria-live="polite">
    {#if hasCode}
      <pre class="font-mono text-sm leading-relaxed text-gray-300"><code>{code}</code></pre>
    {:else}
      <div class="flex h-full items-center justify-center">
        <p class="max-w-sm text-center text-sm text-gray-500">{emptyMessage}</p>
      </div>
    {/if}
  </div>
</section>

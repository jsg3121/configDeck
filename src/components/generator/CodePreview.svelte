<script lang="ts">
  /**
   * 코드 미리보기 + 복사/다운로드 버튼을 렌더링한다.
   * 부모에서 전달받는 code가 변경되면 자동으로 반영된다.
   */

  interface Props {
    fileName: string
    code: string
    locale: string
    showZipDownload?: boolean
    ondownloadzip?: () => void
  }

  let { fileName, code, locale, showZipDownload = false, ondownloadzip }: Props = $props()

  /** 복사 피드백 표시 상태 */
  let copyFeedbackVisible = $state(false)

  /** 코드를 클립보드에 복사하고 피드백을 표시한다 */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    copyFeedbackVisible = true
    setTimeout(() => {
      copyFeedbackVisible = false
    }, 2000)
  }

  /** 코드를 파일로 다운로드한다 */
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const copyLabel = locale === 'ko' ? '복사' : 'Copy'
  const copiedLabel = locale === 'ko' ? '복사됨!' : 'Copied!'
  const downloadLabel = locale === 'ko' ? '다운로드' : 'Download'
  const downloadAllLabel = locale === 'ko' ? '전체 다운로드' : 'Download All'
</script>

<div
  class="w-full border-t border-border lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:border-t-0 lg:border-l"
>
  <div class="flex h-full flex-col bg-code-bg">
    <slot name="file-tabs" />

    <!-- 상단 액션 바 -->
    <div class="flex items-center justify-between border-b border-gray-700 px-5 py-3">
      <span class="font-mono text-sm text-gray-300">{fileName}</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={handleCopy}
          class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          {copyFeedbackVisible ? copiedLabel : copyLabel}
        </button>
        <button
          type="button"
          onclick={handleDownload}
          class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          {downloadLabel}
        </button>
        {#if showZipDownload && ondownloadzip}
          <button
            type="button"
            onclick={ondownloadzip}
            class="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-white hover:bg-accent/90"
          >
            {downloadAllLabel}
          </button>
        {/if}
      </div>
    </div>

    <!-- 코드 미리보기 -->
    <div class="flex-1 overflow-auto p-5">
      <pre class="font-mono text-sm leading-relaxed text-gray-300"><code>{code}</code></pre>
    </div>
  </div>
</div>

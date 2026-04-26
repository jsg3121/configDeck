<script lang="ts">
  /**
   * 코드 미리보기 + 복사/다운로드/공유 버튼을 렌더링한다.
   * 부모에서 전달받는 code가 변경되면 자동으로 반영된다.
   */

  interface Props {
    fileName: string
    code: string
    locale: string
    showZipDownload?: boolean
    ondownloadzip?: () => void
    shareUrl?: string
    shareWarning?: string
  }

  let {
    fileName,
    code,
    locale,
    showZipDownload = false,
    ondownloadzip,
    shareUrl,
    shareWarning,
  }: Props = $props()

  /** 복사 피드백 표시 상태 */
  let copyFeedbackVisible = $state(false)
  /** 다운로드 완료 피드백 표시 상태 */
  let downloadFeedbackVisible = $state(false)
  /** 공유 링크 복사 피드백 표시 상태 */
  let shareFeedbackVisible = $state(false)

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
    // application/octet-stream을 사용하여 브라우저가 파일명을 변경하지 않도록 한다
    const blob = new Blob([code], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    downloadFeedbackVisible = true
    setTimeout(() => {
      downloadFeedbackVisible = false
    }, 3000)
  }

  /** 공유 링크를 클립보드에 복사한다 */
  const handleShare = async () => {
    if (!shareUrl) return

    if (navigator.share && 'canShare' in navigator) {
      try {
        await navigator.share({ url: shareUrl })
        return
      } catch {
        // 사용자 취소 또는 미지원 — 클립보드 복사로 폴백
      }
    }

    await navigator.clipboard.writeText(shareUrl)
    shareFeedbackVisible = true
    setTimeout(() => {
      shareFeedbackVisible = false
    }, 2000)
  }

  let copyLabel = $derived(locale === 'ko' ? '복사' : 'Copy')
  let copiedLabel = $derived(locale === 'ko' ? '복사됨!' : 'Copied!')
  let downloadLabel = $derived(locale === 'ko' ? '다운로드' : 'Download')
  let downloadedLabel = $derived(locale === 'ko' ? '완료!' : 'Done!')
  let downloadAllLabel = $derived(locale === 'ko' ? '전체 다운로드' : 'Download All')
  let downloadGuideLabel = $derived(
    locale === 'ko' ? '프로젝트 루트에 저장하세요' : 'Save to your project root',
  )
  let shareLabel = $derived(locale === 'ko' ? '공유' : 'Share')
  let sharedLabel = $derived(locale === 'ko' ? '복사됨!' : 'Copied!')
</script>

<div class="flex h-full flex-col bg-code-bg">
  <!-- 상단 액션 바 -->
  <div class="flex items-center justify-between border-b border-gray-700 px-5 py-3">
    <span class="font-mono text-sm text-gray-300">{fileName}</span>
    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick={handleCopy}
        aria-label={copyFeedbackVisible ? copiedLabel : `${copyLabel} ${fileName}`}
        class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {copyFeedbackVisible ? copiedLabel : copyLabel}
      </button>
      <button
        type="button"
        onclick={handleDownload}
        aria-label={downloadFeedbackVisible ? downloadedLabel : `${downloadLabel} ${fileName}`}
        class="inline-flex items-center gap-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {downloadFeedbackVisible ? downloadedLabel : downloadLabel}
      </button>
      {#if showZipDownload && ondownloadzip}
        <button
          type="button"
          onclick={ondownloadzip}
          aria-label={downloadAllLabel}
          class="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {downloadAllLabel}
        </button>
      {/if}
      {#if shareUrl}
        <button
          type="button"
          onclick={handleShare}
          aria-label={shareFeedbackVisible ? sharedLabel : shareLabel}
          class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {shareFeedbackVisible ? sharedLabel : shareLabel}
        </button>
      {/if}
    </div>
  </div>

  <!-- 공유 링크 경고 토스트 -->
  {#if shareFeedbackVisible && shareWarning}
    <div
      class="mx-5 mt-3 flex items-center gap-2 rounded-md bg-yellow-900/50 px-3 py-2 text-xs text-yellow-300"
      role="alert"
    >
      <svg
        class="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{shareWarning}</span>
    </div>
  {/if}

  <!-- 다운로드 가이드 토스트 -->
  {#if downloadFeedbackVisible}
    <div
      class="mx-5 mt-3 flex items-center gap-2 rounded-md bg-green-900/50 px-3 py-2 text-xs text-green-300"
      role="status"
      aria-live="polite"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>{downloadGuideLabel}</span>
    </div>
  {/if}

  <!-- 코드 미리보기 -->
  <section
    class="flex-1 overflow-auto p-5"
    aria-live="polite"
    aria-label={locale === 'ko' ? '생성된 코드' : 'Generated code'}
  >
    <pre class="font-mono text-sm leading-relaxed text-gray-300"><code>{code}</code></pre>
  </section>
</div>

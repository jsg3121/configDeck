/**
 * CodePreview 전용 비즈니스 로직 모듈
 * 클립보드 복사, 파일 다운로드, 공유 기능 로직을 담당한다.
 */

/**
 * 코드를 클립보드에 복사한다.
 * @param code - 복사할 코드 문자열
 * @returns 복사 성공 여부
 */
export const copyToClipboard = async (code: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(code)
    return true
  } catch {
    return false
  }
}

/**
 * 코드를 파일로 다운로드한다.
 * @param code - 다운로드할 코드 문자열
 * @param fileName - 저장할 파일명
 */
export const downloadAsFile = (code: string, fileName: string): void => {
  const blob = new Blob([code], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

/**
 * 공유 링크를 클립보드에 복사하고, Web Share API가 지원되면 네이티브 공유 시트를 연다.
 * @param shareUrl - 공유할 URL
 * @returns 복사 성공 여부
 */
export const shareLink = async (shareUrl: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(shareUrl)

    if (navigator.share && 'canShare' in navigator) {
      try {
        await navigator.share({ url: shareUrl })
      } catch {
        // 사용자 취소 — 무시
      }
    }

    return true
  } catch {
    return false
  }
}

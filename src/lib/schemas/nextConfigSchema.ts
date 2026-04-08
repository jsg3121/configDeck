/**
 * Next.js 설정 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** Next.js 생성 옵션 */
export interface NextConfigOptions {
  strictMode: boolean
  images: boolean
  standalone: boolean
  headers: boolean
  redirects: boolean
  webpack: boolean
}

/** 프리셋별 Next.js 기본 옵션을 반환한다 */
export const getNextConfigPresetDefaults = (presetName: string): NextConfigOptions => {
  switch (presetName) {
    case 'Minimal':
      return {
        strictMode: true,
        images: false,
        standalone: false,
        headers: false,
        redirects: false,
        webpack: false,
      }
    case 'Advanced':
      return {
        strictMode: true,
        images: true,
        standalone: true,
        headers: true,
        redirects: true,
        webpack: true,
      }
    default:
      return {
        strictMode: true,
        images: true,
        standalone: false,
        headers: false,
        redirects: false,
        webpack: false,
      }
  }
}

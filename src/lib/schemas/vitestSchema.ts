/**
 * Vitest 설정 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** Vitest 생성 옵션 */
export interface VitestOptions {
  environment: 'node' | 'jsdom' | 'happy-dom'
  globals: boolean
  coverage: boolean
  setupFile: boolean
}

/** 프리셋별 Vitest 기본 옵션을 반환한다 */
export const getVitestPresetDefaults = (presetName: string): VitestOptions => {
  switch (presetName) {
    case 'Minimal':
      return { environment: 'node', globals: false, coverage: false, setupFile: false }
    case 'React':
      return { environment: 'jsdom', globals: true, coverage: false, setupFile: true }
    case 'Node':
      return { environment: 'node', globals: true, coverage: true, setupFile: false }
    default:
      return { environment: 'node', globals: true, coverage: false, setupFile: false }
  }
}

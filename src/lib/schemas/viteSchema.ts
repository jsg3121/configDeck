/**
 * Vite 설정 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** Vite 생성 옵션 */
export interface ViteOptions {
  framework: 'none' | 'react' | 'vue' | 'svelte'
  pathAlias: boolean
  devPort: boolean
  sourcemap: boolean
}

/** 프리셋별 Vite 기본 옵션을 반환한다 */
export const getVitePresetDefaults = (presetName: string): ViteOptions => {
  switch (presetName) {
    case 'Minimal':
      return { framework: 'none', pathAlias: false, devPort: false, sourcemap: false }
    case 'React':
      return { framework: 'react', pathAlias: true, devPort: false, sourcemap: false }
    case 'Vue':
      return { framework: 'vue', pathAlias: true, devPort: false, sourcemap: false }
    default:
      return { framework: 'none', pathAlias: true, devPort: false, sourcemap: false }
  }
}

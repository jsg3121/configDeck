/**
 * ESLint 설정 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** ESLint 생성 옵션 */
export interface EslintOptions {
  language: 'javascript' | 'typescript'
  framework: 'none' | 'react' | 'vue' | 'nextjs' | 'node'
  rules: {
    importSorting: boolean
    noConsole: boolean
    preferConst: boolean
    noUnusedVars: boolean
  }
  integrations: {
    prettier: boolean
    svelte: boolean
    astro: boolean
  }
}

/** 프리셋별 ESLint 기본 옵션을 반환한다 */
export const getEslintPresetDefaults = (presetName: string): EslintOptions => {
  switch (presetName) {
    case 'Minimal':
      return {
        language: 'javascript',
        framework: 'none',
        rules: { importSorting: false, noConsole: false, preferConst: false, noUnusedVars: false },
        integrations: { prettier: false, svelte: false, astro: false },
      }
    case 'Strict':
      return {
        language: 'typescript',
        framework: 'none',
        rules: { importSorting: true, noConsole: true, preferConst: true, noUnusedVars: true },
        integrations: { prettier: true, svelte: false, astro: false },
      }
    default:
      return {
        language: 'typescript',
        framework: 'none',
        rules: { importSorting: true, noConsole: true, preferConst: true, noUnusedVars: false },
        integrations: { prettier: true, svelte: false, astro: false },
      }
  }
}

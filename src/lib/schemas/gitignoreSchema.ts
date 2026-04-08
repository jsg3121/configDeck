/**
 * .gitignore 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** .gitignore 생성 옵션 */
export interface GitignoreOptions {
  node: boolean
  macos: boolean
  vscode: boolean
  jetbrains: boolean
  build: boolean
  env: boolean
  nextjs: boolean
  astro: boolean
}

/** 프리셋별 .gitignore 기본 옵션을 반환한다 */
export const getGitignorePresetDefaults = (presetName: string): GitignoreOptions => {
  switch (presetName) {
    case 'Node':
      return {
        node: true,
        macos: true,
        vscode: true,
        jetbrains: false,
        build: true,
        env: true,
        nextjs: false,
        astro: false,
      }
    case 'Full Stack':
      return {
        node: true,
        macos: true,
        vscode: true,
        jetbrains: true,
        build: true,
        env: true,
        nextjs: false,
        astro: false,
      }
    default:
      return {
        node: true,
        macos: true,
        vscode: true,
        jetbrains: false,
        build: true,
        env: false,
        nextjs: false,
        astro: false,
      }
  }
}

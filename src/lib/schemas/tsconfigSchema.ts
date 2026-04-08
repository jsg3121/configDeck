/**
 * TypeScript 설정 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** tsconfig 생성 옵션 */
export interface TsconfigOptions {
  target: 'ES2020' | 'ES2022' | 'ESNext'
  module: 'ESNext' | 'NodeNext' | 'CommonJS'
  moduleResolution: 'bundler' | 'NodeNext' | 'node'
  strict: boolean
  skipLibCheck: boolean
  esModuleInterop: boolean
  pathAlias: boolean
  jsx: 'none' | 'react-jsx' | 'preserve'
}

/** 프리셋별 tsconfig 기본 옵션을 반환한다 */
export const getTsconfigPresetDefaults = (presetName: string): TsconfigOptions => {
  switch (presetName) {
    case 'Minimal':
      return {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: false,
        skipLibCheck: true,
        esModuleInterop: true,
        pathAlias: false,
        jsx: 'none',
      }
    case 'Strict':
      return {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        pathAlias: true,
        jsx: 'none',
      }
    default:
      return {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        pathAlias: true,
        jsx: 'none',
      }
  }
}

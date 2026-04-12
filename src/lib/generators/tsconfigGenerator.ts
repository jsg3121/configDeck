/**
 * tsconfig.json 코드를 생성한다.
 * 신규 옵션 구조 기반으로, 사용자가 설정한(touched) 옵션만 출력한다.
 */

/** tsconfig.json의 compilerOptions에 직접 매핑되는 키 목록 */
const COMPILER_OPTION_KEYS = [
  'target',
  'module',
  'moduleResolution',
  'jsx',
  'lib',
  'strict',
  'noUncheckedIndexedAccess',
  'noUnusedLocals',
  'noUnusedParameters',
  'exactOptionalPropertyTypes',
  'noFallthroughCasesInSwitch',
  'resolveJsonModule',
  'allowImportingTsExtensions',
  'baseUrl',
  'paths',
  'noEmit',
  'declaration',
  'declarationMap',
  'sourceMap',
  'outDir',
  'rootDir',
  'esModuleInterop',
  'allowSyntheticDefaultImports',
  'forceConsistentCasingInFileNames',
  'isolatedModules',
  'verbatimModuleSyntax',
  'skipLibCheck',
]

/** tsconfig.json 전체 코드를 생성한다 */
export const generateTsconfigJson = (options: Record<string, unknown>): string => {
  const compilerOptions: Record<string, unknown> = {}

  for (const key of COMPILER_OPTION_KEYS) {
    if (!(key in options)) continue
    const value = options[key]

    // 빈 문자열, false, 빈 배열, 빈 객체�� 생략
    if (value === '' || value === false) continue
    if (Array.isArray(value) && value.length === 0) continue
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    )
      continue

    // paths의 값은 배열로 감싸야 ���다 ({ "@/*": "src/*" } → { "@/*": ["src/*"] })
    if (key === 'paths' && typeof value === 'object' && value !== null) {
      const pathsObj: Record<string, string[]> = {}
      for (const [k, v] of Object.entries(value as Record<string, string>)) {
        if (k && v) {
          pathsObj[k] = [v]
        }
      }
      if (Object.keys(pathsObj).length > 0) {
        compilerOptions.paths = pathsObj
      }
      continue
    }

    compilerOptions[key] = value
  }

  const tsconfig: Record<string, unknown> = {}

  if (Object.keys(compilerOptions).length > 0) {
    tsconfig.compilerOptions = compilerOptions
  }

  // include / exclude (최상위 속성)
  if ('include' in options && Array.isArray(options.include) && options.include.length > 0) {
    tsconfig.include = options.include
  }
  if ('exclude' in options && Array.isArray(options.exclude) && options.exclude.length > 0) {
    tsconfig.exclude = options.exclude
  }

  return JSON.stringify(tsconfig, null, 2)
}

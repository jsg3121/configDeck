/**
 * tsconfig.json 코드를 생성한다.
 */
import type { TsconfigOptions } from '@/lib/schemas'

/** tsconfig.json 전체 코드를 생성한다 */
export const generateTsconfigJson = (options: TsconfigOptions): string => {
  const compilerOptions: Record<string, unknown> = {
    target: options.target,
    module: options.module,
    moduleResolution: options.moduleResolution,
  }

  if (options.strict) compilerOptions.strict = true
  if (options.jsx !== 'none') compilerOptions.jsx = options.jsx
  if (options.esModuleInterop) compilerOptions.esModuleInterop = true
  if (options.skipLibCheck) compilerOptions.skipLibCheck = true

  if (options.pathAlias) {
    compilerOptions.baseUrl = '.'
    compilerOptions.paths = { '@/*': ['src/*'] }
  }

  const tsconfig: Record<string, unknown> = {
    compilerOptions,
    include: ['src'],
    exclude: ['node_modules', 'dist'],
  }

  return JSON.stringify(tsconfig, null, 2)
}

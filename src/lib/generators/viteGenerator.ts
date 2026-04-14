/**
 * Vite config 코드를 생성한다.
 * 신규 옵션 구조 기반으로, 사용자가 설정한(touched) 옵션만 출력한다.
 */

/** Vite config 전체 코드를 생성한다 */
export const generateViteConfig = (options: Record<string, unknown>): string => {
  const importLines: string[] = []
  const pluginEntries: string[] = []
  const configEntries: string[] = []

  const framework = options.framework as string | undefined

  // 프레임워크 플러그인
  if (framework === 'react') {
    importLines.push("import react from '@vitejs/plugin-react'")
    pluginEntries.push('react()')
  } else if (framework === 'vue') {
    importLines.push("import vue from '@vitejs/plugin-vue'")
    pluginEntries.push('vue()')
  } else if (framework === 'svelte') {
    importLines.push("import { svelte } from '@sveltejs/vite-plugin-svelte'")
    pluginEntries.push('svelte()')
  }

  // path alias
  if (options.pathAlias === true) {
    importLines.push("import { resolve } from 'path'")
  }

  importLines.push("import { defineConfig } from 'vite'")

  // plugins
  if (pluginEntries.length > 0) {
    configEntries.push(`  plugins: [${pluginEntries.join(', ')}],`)
  }

  // resolve alias
  if (options.pathAlias === true) {
    configEntries.push('  resolve: {')
    configEntries.push('    alias: {')
    configEntries.push("      '@': resolve(__dirname, 'src'),")
    configEntries.push('    },')
    configEntries.push('  },')
  }

  // server 옵션
  const serverEntries: string[] = []
  if ('serverPort' in options && options.serverPort !== null) {
    serverEntries.push(`    port: ${options.serverPort},`)
  }
  if (options.serverStrictPort === true) {
    serverEntries.push('    strictPort: true,')
  }
  if (options.serverOpen === true) {
    serverEntries.push('    open: true,')
  }
  if ('serverHost' in options && options.serverHost !== '') {
    serverEntries.push(`    host: '${options.serverHost}',`)
  }
  if (options.serverProxy === true) {
    serverEntries.push('    proxy: {')
    serverEntries.push("      '/api': {")
    serverEntries.push("        target: 'http://localhost:3001',")
    serverEntries.push('        changeOrigin: true,')
    serverEntries.push('      },')
    serverEntries.push('    },')
  }

  if (serverEntries.length > 0) {
    configEntries.push('  server: {')
    configEntries.push(...serverEntries)
    configEntries.push('  },')
  }

  // build 옵션
  const buildEntries: string[] = []
  if (options.buildSourcemap === true) {
    buildEntries.push('    sourcemap: true,')
  }
  if ('buildOutDir' in options && options.buildOutDir !== '') {
    buildEntries.push(`    outDir: '${options.buildOutDir}',`)
  }
  if ('buildTarget' in options && options.buildTarget !== 'modules') {
    buildEntries.push(`    target: '${options.buildTarget}',`)
  }

  if (buildEntries.length > 0) {
    configEntries.push('  build: {')
    configEntries.push(...buildEntries)
    configEntries.push('  },')
  }

  const lines: string[] = []
  lines.push(...importLines)
  lines.push('')
  lines.push('export default defineConfig({')
  lines.push(...configEntries)
  lines.push('})')

  return lines.join('\n')
}

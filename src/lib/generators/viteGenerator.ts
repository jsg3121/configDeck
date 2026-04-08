/**
 * Vite config 코드를 생성한다.
 */
import type { ViteOptions } from '@/lib/schemas'

/** Vite config 전체 코드를 생성한다 */
export const generateViteConfig = (options: ViteOptions): string => {
  const importLines: string[] = []
  const pluginEntries: string[] = []
  const configEntries: string[] = []

  // 프레임워크 플러그인
  if (options.framework === 'react') {
    importLines.push("import react from '@vitejs/plugin-react'")
    pluginEntries.push('react()')
  } else if (options.framework === 'vue') {
    importLines.push("import vue from '@vitejs/plugin-vue'")
    pluginEntries.push('vue()')
  } else if (options.framework === 'svelte') {
    importLines.push("import { svelte } from '@sveltejs/vite-plugin-svelte'")
    pluginEntries.push('svelte()')
  }

  // path alias
  if (options.pathAlias) {
    importLines.push("import { resolve } from 'path'")
  }

  importLines.push("import { defineConfig } from 'vite'")

  // plugins
  if (pluginEntries.length > 0) {
    configEntries.push(`  plugins: [${pluginEntries.join(', ')}],`)
  }

  // resolve alias
  if (options.pathAlias) {
    configEntries.push('  resolve: {')
    configEntries.push('    alias: {')
    configEntries.push("      '@': resolve(__dirname, 'src'),")
    configEntries.push('    },')
    configEntries.push('  },')
  }

  // dev server port
  if (options.devPort) {
    configEntries.push('  server: {')
    configEntries.push('    port: 3000,')
    configEntries.push('  },')
  }

  // sourcemap
  if (options.sourcemap) {
    configEntries.push('  build: {')
    configEntries.push('    sourcemap: true,')
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

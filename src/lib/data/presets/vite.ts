/**
 * Vite 프리셋 목록.
 * 프리셋은 core 옵션 위주로 포함한다.
 */
import type { Preset } from '@/types/generator'

export const vitePresets: Preset[] = [
  {
    name: 'React',
    description: 'React + Vite 기본 설정. @vitejs/plugin-react와 경로 별칭을 포함합니다.',
    source: 'https://vite.dev/guide/#scaffolding-your-first-vite-project',
    values: {
      framework: 'react',
      pathAlias: true,
      buildSourcemap: false,
    },
  },
  {
    name: 'Vue',
    description: 'Vue + Vite 기본 설정. @vitejs/plugin-vue와 경로 별칭을 포함합니다.',
    source: 'https://vite.dev/guide/#scaffolding-your-first-vite-project',
    values: {
      framework: 'vue',
      pathAlias: true,
      buildSourcemap: false,
    },
  },
  {
    name: 'Svelte',
    description: 'Svelte + Vite 기본 설정. @sveltejs/vite-plugin-svelte와 경로 별칭을 포함합니다.',
    source: 'https://svelte.dev/docs/introduction',
    values: {
      framework: 'svelte',
      pathAlias: true,
      buildSourcemap: false,
    },
  },
  {
    name: 'Minimal',
    description: '프레임워크 없는 순수 Vite 설정입니다.',
    source: 'https://vite.dev/config/',
    values: {
      framework: 'none',
      pathAlias: false,
      buildSourcemap: false,
    },
  },
]

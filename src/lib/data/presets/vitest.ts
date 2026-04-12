/**
 * Vitest 프리셋 목록.
 * 프리셋은 core 옵션 위주로 포함한다.
 */
import type { Preset } from '@/types/generator'

export const vitestPresets: Preset[] = [
  {
    name: 'React',
    description: 'React 컴포넌트 테스트 설정. jsdom 환경과 전역 API를 사용합니다.',
    source: 'https://vitest.dev/guide/#configuring-vitest',
    values: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
      coverageEnabled: false,
    },
  },
  {
    name: 'Node',
    description: 'Node.js 백엔드/유틸리티 테스트 설정. 커버리지를 포함합니다.',
    source: 'https://vitest.dev/guide/#configuring-vitest',
    values: {
      environment: 'node',
      globals: true,
      coverageEnabled: true,
    },
  },
  {
    name: 'Vue',
    description: 'Vue 컴포넌트 테스트 설정. happy-dom 환경으로 빠른 DOM 시뮬레이션을 사용합니다.',
    source: 'https://vitest.dev/guide/#configuring-vitest',
    values: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: './src/test/setup.ts',
      coverageEnabled: false,
    },
  },
  {
    name: 'Minimal',
    description: '최소 설정. Node 환경에서 기본값으로 실행합니다.',
    source: 'https://vitest.dev/config/',
    values: {
      environment: 'node',
      globals: false,
      coverageEnabled: false,
    },
  },
]

/**
 * Next.js 프리셋 목록.
 * 프리셋은 core 옵션 위주로 포함한다.
 */
import type { Preset } from '@/types/generator'

export const nextConfigPresets: Preset[] = [
  {
    name: 'Standard',
    description: 'Next.js 기본 설정. Strict Mode와 이미지 최적화를 포함합니다.',
    source: 'https://nextjs.org/docs/getting-started/installation',
    values: {
      reactStrictMode: true,
      imagesEnabled: true,
    },
  },
  {
    name: 'Docker',
    description: 'Docker 배포용 설정. standalone 출력과 이미지 최적화를 포함합니다.',
    source: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/output',
    values: {
      reactStrictMode: true,
      output: 'standalone',
      imagesEnabled: true,
    },
  },
  {
    name: 'Static Export',
    description: '정적 HTML 출력 설정. SSG로 배포하는 프로젝트에 적합합니다.',
    source: 'https://nextjs.org/docs/app/building-your-application/deploying/static-exports',
    values: {
      reactStrictMode: true,
      output: 'export',
    },
  },
  {
    name: 'Minimal',
    description: '최소 설정. Strict Mode만 활성화합니다.',
    source: 'https://nextjs.org/docs/getting-started/installation',
    values: {
      reactStrictMode: true,
    },
  },
]

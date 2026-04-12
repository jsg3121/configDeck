/**
 * .env 프리셋 목록.
 */
import type { Preset } from '@/types/generator'

export const envExamplePresets: Preset[] = [
  {
    name: 'Frontend',
    description: '프론트엔드 프로젝트. 앱 기본 변수와 API 키를 포함합니다.',
    source: 'https://vite.dev/guide/env-and-mode',
    values: {
      app: true,
      apiKeys: true,
    },
  },
  {
    name: 'Backend',
    description: '백엔드 프로젝트. 앱, 데이터베이스, 인증 변수를 포함합니다.',
    source: 'https://12factor.net/config',
    values: {
      app: true,
      database: true,
      auth: true,
    },
  },
  {
    name: 'Full Stack',
    description: '풀스택 프로젝트. 모든 주요 환경 변수를 포함합니다.',
    source: 'https://12factor.net/config',
    values: {
      app: true,
      database: true,
      auth: true,
      apiKeys: true,
      aws: true,
    },
  },
]

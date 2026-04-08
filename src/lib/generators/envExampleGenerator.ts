/**
 * .env.example 코드를 생성한다.
 * 선택된 섹션별 환경 변수 블록을 조합한다.
 */
import type { EnvExampleOptions } from '@/lib/schemas'

/** 섹션별 환경 변수 블록 */
const ENV_BLOCKS: Record<string, { header: string; variables: string[] }> = {
  app: {
    header: '# App',
    variables: ['PORT=3000', 'NODE_ENV=development'],
  },
  database: {
    header: '# Database',
    variables: ['DATABASE_URL=postgresql://user:password@localhost:5432/mydb'],
  },
  auth: {
    header: '# Auth',
    variables: ['JWT_SECRET=your-jwt-secret-here', 'SESSION_SECRET=your-session-secret-here'],
  },
  apiKeys: {
    header: '# API Keys',
    variables: ['API_KEY=your-api-key', 'API_SECRET=your-api-secret'],
  },
  aws: {
    header: '# AWS',
    variables: [
      'AWS_ACCESS_KEY_ID=your-access-key',
      'AWS_SECRET_ACCESS_KEY=your-secret-key',
      'AWS_REGION=us-east-1',
    ],
  },
}

/** .env.example 전체 코드를 생성한다 */
export const generateEnvExample = (options: EnvExampleOptions): string => {
  const blocks: string[] = []

  for (const [key, isEnabled] of Object.entries(options)) {
    if (isEnabled && ENV_BLOCKS[key]) {
      const block = ENV_BLOCKS[key]
      blocks.push(`${block.header}\n${block.variables.join('\n')}`)
    }
  }

  return blocks.join('\n\n')
}

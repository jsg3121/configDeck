/**
 * .env.example 코드를 생성한다.
 * 사용자가 선택한(touched) 섹션의 환경 변수 블록만 출력한다.
 */

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
  oauth: {
    header: '# OAuth',
    variables: [
      'OAUTH_CLIENT_ID=your-client-id',
      'OAUTH_CLIENT_SECRET=your-client-secret',
      'OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback',
    ],
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
  redis: {
    header: '# Redis',
    variables: ['REDIS_URL=redis://localhost:6379'],
  },
  email: {
    header: '# Email (SMTP)',
    variables: [
      'SMTP_HOST=smtp.example.com',
      'SMTP_PORT=587',
      'SMTP_USER=your-email@example.com',
      'SMTP_PASS=your-email-password',
    ],
  },
}

/** .env.example 전체 코드를 생성한다 */
export const generateEnvExample = (options: Record<string, unknown>): string => {
  const blocks: string[] = []

  for (const [key, value] of Object.entries(options)) {
    if (value === true && ENV_BLOCKS[key]) {
      const block = ENV_BLOCKS[key]
      blocks.push(`${block.header}\n${block.variables.join('\n')}`)
    }
  }

  return blocks.join('\n\n')
}

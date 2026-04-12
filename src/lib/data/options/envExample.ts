/**
 * .env.example 설정 파일의 옵션 정의.
 * 섹션별 환경 변수 블록을 선택하는 방식.
 */
import type { FileOptionDefinition } from '@/types/generator'

export const envExampleOptions: FileOptionDefinition = {
  slug: 'env',
  sections: [
    {
      title: '기본 변수',
      titleEn: 'Base Variables',
      description: '앱 실행에 필요한 기본 환경 변수입니다.',
      descriptionEn: 'Basic environment variables required for the app.',
      controls: [
        {
          type: 'checkbox',
          key: 'app',
          label: 'App (PORT, NODE_ENV)',
          labelEn: 'App (PORT, NODE_ENV)',
          description: '앱의 포트와 실행 환경을 설정하는 기본 변수입니다.',
          descriptionEn: 'Basic variables for app port and runtime environment.',
          tier: 'core',
          rationale: '거의 모든 프로젝트에서 필요한 기본 변수.',
          default: false,
        },
        {
          type: 'checkbox',
          key: 'database',
          label: 'Database (DATABASE_URL)',
          labelEn: 'Database (DATABASE_URL)',
          description: '데이터베이스 연결 문자열입니다. PostgreSQL, MySQL 등에 사용됩니다.',
          descriptionEn: 'Database connection string. Used for PostgreSQL, MySQL, etc.',
          tier: 'core',
          rationale: '백엔드 프로젝트의 필수 변수.',
          default: false,
        },
      ],
    },
    {
      title: '인증 & 보안',
      titleEn: 'Auth & Security',
      description: '인증과 보안 관련 환경 변수입니다.',
      descriptionEn: 'Authentication and security environment variables.',
      controls: [
        {
          type: 'checkbox',
          key: 'auth',
          label: 'Auth (JWT_SECRET, SESSION_SECRET)',
          labelEn: 'Auth (JWT_SECRET, SESSION_SECRET)',
          description: 'JWT 토큰 서명과 세션 암호화에 사용하는 시크릿 키입니다.',
          descriptionEn: 'Secret keys for JWT signing and session encryption.',
          tier: 'core',
          rationale: '인증 기능이 있는 프로젝트에서 필수.',
          default: false,
        },
        {
          type: 'checkbox',
          key: 'oauth',
          label: 'OAuth (CLIENT_ID, CLIENT_SECRET)',
          labelEn: 'OAuth (CLIENT_ID, CLIENT_SECRET)',
          description: 'Google, GitHub 등 OAuth 제공자의 클라이언트 인증 정보입니다.',
          descriptionEn: 'OAuth provider client credentials for Google, GitHub, etc.',
          tier: 'advanced',
          default: false,
        },
      ],
    },
    {
      title: '외부 서비스',
      titleEn: 'External Services',
      description: '외부 API와 클라우드 서비스 연결 변수입니다.',
      descriptionEn: 'Variables for external APIs and cloud services.',
      controls: [
        {
          type: 'checkbox',
          key: 'apiKeys',
          label: 'API Keys (API_KEY, API_SECRET)',
          labelEn: 'API Keys (API_KEY, API_SECRET)',
          description: '외부 API 연동에 필요한 키입니다.',
          descriptionEn: 'Keys required for external API integration.',
          tier: 'core',
          rationale: 'SaaS API 연동 시 필요.',
          default: false,
        },
        {
          type: 'checkbox',
          key: 'aws',
          label: 'AWS (ACCESS_KEY, SECRET_KEY, REGION)',
          labelEn: 'AWS (ACCESS_KEY, SECRET_KEY, REGION)',
          description: 'AWS 서비스 접근에 필요한 인증 정보입니다.',
          descriptionEn: 'AWS service credentials for S3, SES, etc.',
          tier: 'advanced',
          default: false,
        },
        {
          type: 'checkbox',
          key: 'redis',
          label: 'Redis (REDIS_URL)',
          labelEn: 'Redis (REDIS_URL)',
          description: 'Redis 캐시/세션 스토어 연결 문자열입니다.',
          descriptionEn: 'Redis cache/session store connection string.',
          tier: 'advanced',
          default: false,
        },
        {
          type: 'checkbox',
          key: 'email',
          label: 'Email (SMTP_HOST, SMTP_PORT)',
          labelEn: 'Email (SMTP_HOST, SMTP_PORT)',
          description: '이메일 발송을 위한 SMTP 서버 설정입니다.',
          descriptionEn: 'SMTP server settings for sending emails.',
          tier: 'advanced',
          default: false,
        },
      ],
    },
  ],
}

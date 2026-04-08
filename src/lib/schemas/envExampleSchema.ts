/**
 * .env.example 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** .env.example 생성 옵션 */
export interface EnvExampleOptions {
  app: boolean
  database: boolean
  auth: boolean
  apiKeys: boolean
  aws: boolean
}

/** 프리셋별 .env.example 기본 옵션을 반환한다 */
export const getEnvExamplePresetDefaults = (presetName: string): EnvExampleOptions => {
  switch (presetName) {
    case 'Frontend':
      return { app: true, database: false, auth: false, apiKeys: true, aws: false }
    case 'Backend':
      return { app: true, database: true, auth: true, apiKeys: false, aws: false }
    case 'Full Stack':
      return { app: true, database: true, auth: true, apiKeys: true, aws: true }
    default:
      return { app: true, database: false, auth: false, apiKeys: false, aws: false }
  }
}

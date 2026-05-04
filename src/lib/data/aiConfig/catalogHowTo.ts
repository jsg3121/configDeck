/**
 * AI Config 카탈로그 허브 페이지의 HowTo 데이터 헬퍼.
 *
 * 시각 컴포넌트(CatalogHowTo.astro)와 schema.org HowTo JSON-LD가 동일 데이터를 참조한다.
 * i18n 키 prefix(aiConfig.catalog.howTo)에서 5단계를 일괄 추출한다.
 *
 * Google 가이드라인: HowTo JSON-LD에 포함된 단계는 페이지에 시각적으로 노출되어야 한다.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/how-to
 */
import { getTranslation, type Locale } from '@/i18n'

export interface HowToStep {
  name: string
  text: string
}

export interface HowToContent {
  heading: string
  lead: string
  steps: readonly HowToStep[]
}

const HOWTO_STEP_COUNT = 5

/**
 * aiConfig.catalog.howTo prefix에서 헤딩/리드/5단계를 일괄 추출한다.
 */
export const getCatalogHowTo = (locale: Locale): HowToContent => {
  const t = (key: string) => getTranslation(locale, `aiConfig.catalog.howTo.${key}`)
  const steps: HowToStep[] = Array.from({ length: HOWTO_STEP_COUNT }, (_, index) => {
    const n = index + 1
    return {
      name: t(`step${n}Name`),
      text: t(`step${n}Text`),
    }
  })
  return {
    heading: t('heading'),
    lead: t('lead'),
    steps,
  }
}

/**
 * HowTo 콘텐츠를 schema.org HowTo JSON-LD로 변환한다.
 *
 * @see https://schema.org/HowTo
 */
export const buildHowToJsonLd = (content: HowToContent) => ({
  '@type': 'HowTo',
  name: content.heading,
  description: content.lead,
  step: content.steps.map((step) => ({
    '@type': 'HowToStep',
    name: step.name,
    text: step.text,
  })),
})

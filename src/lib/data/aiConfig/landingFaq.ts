/**
 * AI Config 자식 랜딩 페이지의 FAQ 데이터 헬퍼.
 *
 * 시각 컴포넌트(LandingFaq.astro)와 JSON-LD(FAQPage 스키마)가 동일 데이터를 참조하도록
 * i18n 키 prefix(aiConfig.landing.{i18nKey}.faq)에서 5문항을 일괄 추출한다.
 *
 * Google 가이드라인: FAQPage JSON-LD에 포함된 질문/답변은 페이지에 시각적으로 노출되어야 한다.
 * 따라서 시각 표시와 JSON-LD가 같은 텍스트를 참조하도록 헬퍼를 통해 한 곳에서 lookup한다.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
import { getTranslation, type Locale } from '@/i18n'

export interface FaqItem {
  question: string
  answer: string
}

const FAQ_QUESTION_COUNT = 5

/**
 * 자식 랜딩 페이지의 i18n 키 prefix(aiConfig.landing.{i18nKey})에서 FAQ 5문항을 추출한다.
 *
 * @param locale 한국어/영어 로케일
 * @param i18nKey aiConfig.landing 하위의 도구 키 (예: 'cursor', 'agentsMd')
 */
export const getLandingFaqItems = (locale: Locale, i18nKey: string): readonly FaqItem[] => {
  return Array.from({ length: FAQ_QUESTION_COUNT }, (_, index) => {
    const n = index + 1
    return {
      question: getTranslation(locale, `aiConfig.landing.${i18nKey}.faq.q${n}Question`),
      answer: getTranslation(locale, `aiConfig.landing.${i18nKey}.faq.q${n}Answer`),
    }
  })
}

/**
 * FAQ 항목 배열을 schema.org FAQPage JSON-LD로 변환한다.
 *
 * @see https://schema.org/FAQPage
 */
export const buildFaqPageJsonLd = (items: readonly FaqItem[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})

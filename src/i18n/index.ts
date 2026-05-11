import englishTranslations from './en.json'
import koreanTranslations from './ko.json'

export const SUPPORTED_LOCALES = ['en', 'ko'] as const
export const DEFAULT_LOCALE = 'en' as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

const translationsByLocale: Record<Locale, typeof englishTranslations> = {
  en: englishTranslations,
  ko: koreanTranslations,
}

/**
 * 점(.) 구분 경로로 중첩 객체의 값을 가져온다.
 * 예: getNestedValueByPath(obj, "nav.generator") → obj.nav.generator
 */
const getNestedValueByPath = (
  targetObject: Record<string, unknown>,
  dotSeparatedPath: string,
): unknown => {
  return dotSeparatedPath.split('.').reduce<unknown>((currentLevel, pathSegment) => {
    if (
      currentLevel !== null &&
      typeof currentLevel === 'object' &&
      pathSegment in (currentLevel as Record<string, unknown>)
    ) {
      return (currentLevel as Record<string, unknown>)[pathSegment]
    }
    return undefined
  }, targetObject)
}

/**
 * 번역 문자열의 `{{name}}` placeholder를 values 객체로 치환한다.
 * 값에 없는 placeholder는 그대로 유지되어 누락 디버깅에 도움이 된다.
 */
const interpolate = (template: string, values: Record<string, string>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in values ? values[key] : match))

/**
 * 번역 문자열을 키 경로로 가져온다 (예: "nav.generator").
 * 해당 locale에 없으면 영어 폴백, 영어에도 없으면 키 자체를 반환한다.
 *
 * 세 번째 인자 `values`를 전달하면 문자열 안의 `{{name}}` placeholder가 치환된다.
 * 예: getTranslation('en', 'article.commentaryLabel', { source: 'Next.js Blog' })
 *     → "Commentary on a Next.js Blog announcement"
 */
export const getTranslation = (
  locale: Locale,
  translationKey: string,
  values?: Record<string, string>,
): string => {
  const translatedValue = getNestedValueByPath(
    translationsByLocale[locale] as unknown as Record<string, unknown>,
    translationKey,
  )
  if (typeof translatedValue === 'string') {
    return values ? interpolate(translatedValue, values) : translatedValue
  }

  const englishFallbackValue = getNestedValueByPath(
    translationsByLocale.en as unknown as Record<string, unknown>,
    translationKey,
  )
  if (typeof englishFallbackValue === 'string') {
    return values ? interpolate(englishFallbackValue, values) : englishFallbackValue
  }

  return translationKey
}

/**
 * 배열이나 객체 형태의 번역 데이터를 가져온다 (예: "home.steps", "home.faqs").
 * 문자열이 아닌 복합 데이터 구조가 필요할 때 사용한다.
 */
export const getTranslationRaw = (locale: Locale, translationKey: string): unknown => {
  const translatedValue = getNestedValueByPath(
    translationsByLocale[locale] as unknown as Record<string, unknown>,
    translationKey,
  )
  if (translatedValue !== undefined) {
    return translatedValue
  }

  return getNestedValueByPath(
    translationsByLocale.en as unknown as Record<string, unknown>,
    translationKey,
  )
}

/**
 * locale을 포함한 경로를 생성한다.
 * 예: buildLocalizedPath("ko", "/generator") → "/ko/generator"
 */
export const buildLocalizedPath = (locale: Locale, pagePath: string = '/'): string => {
  const normalizedPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`
  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`
}

/**
 * hreflang 태그에 사용할 모든 locale별 경로를 반환한다.
 * 예: getAllLocaleAlternates("/generator") → [{ locale: "en", href: "/en/generator" }, ...]
 */
export const getAllLocaleAlternates = (
  pagePath: string,
): Array<{ locale: Locale; href: string }> => {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    href: buildLocalizedPath(locale, pagePath),
  }))
}

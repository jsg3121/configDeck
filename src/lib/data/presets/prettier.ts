/**
 * Prettier 프리셋 목록.
 * 프리셋은 core 옵션만 포함한다. advanced 옵션은 사용자가 직접 설정한다.
 */
import type { Preset } from '@/types/generator'

export const prettierPresets: Preset[] = [
  {
    name: 'Prettier Default',
    description: 'Prettier 공��� 기본값. 별도 설정 ���이 바로 사용할 수 있습니다.',
    source: 'https://prettier.io/docs/en/options.html',
    values: {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'all',
      arrowParens: 'always',
      endOfLine: 'lf',
    },
  },
  {
    name: 'Standard JS',
    description: 'Standard JS 스타일. 세미콜론 없음, 작은따옴표 사용, ���끔한 코드를 ���호합��다.',
    source: 'https://standardjs.com/',
    values: {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
      trailingComma: 'none',
      arrowParens: 'always',
      endOfLine: 'lf',
    },
  },
  {
    name: 'Airbnb-like',
    description:
      'Airbnb JavaScript Style Guide에 맞춘 설정. 작은따옴표, 후행 쉼표, 넉넉한 ��� 너비를 사용합니다.',
    source: 'https://github.com/airbnb/javascript',
    values: {
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      arrowParens: 'always',
      endOfLine: 'lf',
    },
  },
  {
    name: 'Minimal',
    description: '최소한의 설정만 포함합니다. 기본값에서 크게 ��어나지 않는 보수적인 스타일입니다.',
    source: 'https://prettier.io/docs/en/options.html',
    values: {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      arrowParens: 'always',
      endOfLine: 'lf',
    },
  },
]

// @ts-check
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.claude/**'],
  },
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  // Svelte 전용 설정 — 전역 rules 이후에 선언하여 오버라이드
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Svelte 5 Runes($state, $derived, $props)는 let 선언이 필수
      // → 표준 prefer-const 대신 Svelte 전용 규칙으로 교체
      'prefer-const': 'off',
      'svelte/prefer-const': [
        'error',
        { excludedRunes: ['$props', '$derived', '$state'] },
      ],
    },
  },
]

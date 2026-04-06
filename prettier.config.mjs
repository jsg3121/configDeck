/** @type {import("prettier").Config} */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-svelte',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/layouts/(.*)$',
    '^@/components/(.*)$',
    '^@/lib/(.*)$',
    '^@/types/(.*)$',
    '^@/styles/(.*)$',
    '^@/i18n/(.*)$',
    '',
    '^\\.\\.\\//',
    '^\\./',
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
}

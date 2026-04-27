import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.d.ts', 'src/lib/**/index.ts'],
      reportsDirectory: './coverage',
    },
    reporters: ['default', 'json'],
    outputFile: {
      json: './tests/results/unit-results.json',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

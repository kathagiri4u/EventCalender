import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules/**', '.next/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      exclude: [
        'node_modules/**',
        '.next/**',
        'coverage/**',
        'playwright-report/**',
        'test-results/**',
        'vitest.config.ts',
        'playwright.config.ts',
        'next.config.mjs',
        'tailwind.config.ts',
        'postcss.config.mjs',
        '**/*.d.ts',
        'scripts/**',
        'data/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})

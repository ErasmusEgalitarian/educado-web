import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      include: ['src/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/setupTests.ts'],
        reporter: ['text', 'html', 'json-summary'],
      },
    },
  })
)

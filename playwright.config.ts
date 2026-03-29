import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-320',
      use: { ...devices['iPhone SE'], viewport: { width: 320, height: 568 } },
    },
    {
      name: 'chromium-375',
      use: { ...devices['iPhone 12'], viewport: { width: 375, height: 812 } },
    },
    {
      name: 'chromium-768',
      use: { ...devices['iPad Mini'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'chromium-1024',
      use: { browserName: 'chromium', viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'chromium-1280',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'chromium-1536',
      use: { browserName: 'chromium', viewport: { width: 1536, height: 864 } },
    },
  ],
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})

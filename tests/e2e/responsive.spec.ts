import { test, expect } from '@playwright/test'

const VIEWPORTS = [
  { name: '320px', width: 320, height: 568 },
  { name: '375px', width: 375, height: 812 },
  { name: '414px', width: 414, height: 896 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1536px', width: 1536, height: 864 },
]

const PAGES = ['/', '/calendar', '/schedule']

for (const viewport of VIEWPORTS) {
  test.describe(`Viewport ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    for (const path of PAGES) {
      test(`${path} — no horizontal scroll at ${viewport.name}`, async ({ page }) => {
        await page.goto(path)
        await page.waitForLoadState('networkidle')

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // 1px tolerance
      })
    }
  })
}

import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('Navbar renders at 1280px', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('SportsCal').first()).toBeVisible()
    await expect(page.getByText('Calendar')).toBeVisible()
    await expect(page.getByText('Schedule')).toBeVisible()
  })

  test('Mobile drawer opens and closes at 375px', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
    const page = await context.newPage()
    await page.goto('/')

    await page.getByLabel('Open menu').click()
    await expect(page.getByRole('complementary', { name: /navigation menu/i })).toBeVisible()

    await page.getByLabel('Close menu').click()
    await expect(
      page.getByRole('complementary', { name: /navigation menu/i })
    ).not.toBeVisible()

    await context.close()
  })

  test('Drawer has all sport links', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
    const page = await context.newPage()
    await page.goto('/')

    await page.getByLabel('Open menu').click()
    await expect(page.getByText('NFL')).toBeVisible()
    await expect(page.getByText('NBA')).toBeVisible()
    await expect(page.getByText('Golf')).toBeVisible()
    await expect(page.getByText('NASCAR')).toBeVisible()

    await context.close()
  })

  test('Footer is visible', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByText('Austin, TX')).toBeVisible()
    await expect(page.getByText(/Central Time/i)).toBeVisible()
  })
})

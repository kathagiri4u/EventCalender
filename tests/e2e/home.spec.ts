import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('home page loads with hero section', async ({ page }) => {
    await page.goto('/')
    // Page should not show errors
    await expect(page.locator('main')).toBeVisible()
  })

  test('Sport quick nav renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Browse by Sport')).toBeVisible()
  })

  test("Today's Games section exists", async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/today.*games/i)).toBeVisible()
  })

  test('footer is accessible after scrolling', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByText('Austin, TX')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Calendar Page', () => {
  test('calendar page loads', async ({ page }) => {
    await page.goto('/calendar')
    await expect(page.getByText('Sports Calendar')).toBeVisible()
  })

  test('calendar legend renders sport colors', async ({ page }) => {
    await page.goto('/calendar')
    await expect(page.getByLabel('Sport color legend')).toBeVisible()
  })
})

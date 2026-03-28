import { test, expect } from '@playwright/test'

test.describe('Schedule Page', () => {
  test('schedule page loads', async ({ page }) => {
    await page.goto('/schedule')
    await expect(page.getByText('Schedule')).toBeVisible()
  })

  test('event count is shown', async ({ page }) => {
    await page.goto('/schedule')
    await expect(page.getByText(/events? found/i)).toBeVisible()
  })
})

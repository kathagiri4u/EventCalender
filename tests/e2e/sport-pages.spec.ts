import { test, expect } from '@playwright/test'

test.describe('Sport Pages', () => {
  test('/sport/nfl loads hero banner', async ({ page }) => {
    await page.goto('/sport/nfl')
    await expect(page.getByText('NFL')).toBeVisible()
  })

  test('/sport/ufc loads without standings', async ({ page }) => {
    await page.goto('/sport/ufc')
    await expect(page.getByText('UFC')).toBeVisible()
    // UFC should not show a standings card
    await expect(page.getByText(/standings/i)).not.toBeVisible()
  })

  test('invalid sport returns 404', async ({ page }) => {
    const response = await page.goto('/sport/foobar')
    expect(response?.status()).toBe(404)
  })
})

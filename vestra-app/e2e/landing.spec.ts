import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads and shows hero with Connect Wallet CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /global crypto payroll/i })).toBeVisible()
    await expect(page.getByRole('main').getByRole('link', { name: /connect wallet/i })).toBeVisible()
  })

  test('Connect Wallet links to dashboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('main').getByRole('link', { name: /connect wallet/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})

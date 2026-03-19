import { test, expect } from '@playwright/test'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

test.describe('Auth', () => {
  test('Login-Seite lädt korrekt (Formular vorhanden)', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('Redirect zu Login wenn nicht eingeloggt und geschützte Route', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Login mit gültigen Credentials (skippt wenn .env leer)', async ({ page }) => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      test.skip(true, '.env nicht konfiguriert — Supabase-Credentials fehlen')
      return
    }
    await page.goto('/auth')
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || '')
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || '')
    await page.click('button[type="submit"]')
    await expect(page).not.toHaveURL(/\/auth/, { timeout: 5000 })
  })
})

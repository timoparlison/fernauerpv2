import { test, expect } from '@playwright/test'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const TEST_EMAIL = process.env.TEST_EMAIL || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''

async function loginIfConfigured(page: import('@playwright/test').Page) {
  if (!SUPABASE_URL || !TEST_EMAIL || !TEST_PASSWORD) {
    return false
  }
  await page.goto('/auth')
  await page.fill('input[type="email"]', TEST_EMAIL)
  await page.fill('input[type="password"]', TEST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/^(?!.*\/auth).*$/, { timeout: 10000 })
  return true
}

test.describe('Navigation (requires auth)', () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await loginIfConfigured(page)
    if (!loggedIn) {
      test.skip(true, 'Navigation-Tests benötigen TEST_EMAIL und TEST_PASSWORD in .env')
    }
  })

  test('Nach Login sind Sidebar-Menüpunkte sichtbar', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Buchhaltung')).toBeVisible()
    await expect(page.getByText('Einkauf')).toBeVisible()
    await expect(page.getByText('Personal')).toBeVisible()
  })

  test('Home-Menüpunkte sind klickbar und zeigen Seite', async ({ page }) => {
    const homeLinks = [
      { label: 'KPI Dashboard', url: '/kpi-dashboard' },
      { label: 'Kalender', url: '/calendar' },
      { label: 'Benachrichtigungen', url: '/notifications' },
      { label: 'Glossar', url: '/glossary' },
    ]

    for (const link of homeLinks) {
      await page.getByRole('link', { name: link.label }).first().click()
      await expect(page).toHaveURL(new RegExp(link.url))
      // Kein leerer Screen: Mindestens eine Überschrift vorhanden
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('Aktiver Menüpunkt ist visuell hervorgehoben', async ({ page }) => {
    await page.goto('/kpi-dashboard')
    // Aktiver Link hat bg-sidebar-primary Klasse
    const activeLink = page.locator('a.bg-sidebar-primary, a[class*="bg-sidebar-primary"]').first()
    await expect(activeLink).toBeVisible()
  })

  test('Accounting Modul öffnet sich und Links funktionieren', async ({ page }) => {
    await page.getByText('Buchhaltung').click()
    await expect(page.getByRole('link', { name: 'Ausgangsrechnungen' })).toBeVisible()
    await page.getByRole('link', { name: 'Ausgangsrechnungen' }).click()
    await expect(page).toHaveURL(/\/accounting\/customer-invoices/)
    await expect(page.locator('h1')).toBeVisible()
  })
})

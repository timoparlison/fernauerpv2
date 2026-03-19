import { test, expect, Page } from '@playwright/test'

const TEST_EMAIL = process.env.TEST_EMAIL || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''

const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)

async function login(page: Page) {
  await page.goto('/auth')
  await page.fill('input[type="email"]', TEST_EMAIL)
  await page.fill('input[type="password"]', TEST_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/^(?!.*\/auth).*$/, { timeout: 15000 })
}

async function gotoEmployees(page: Page) {
  await page.goto('/hr/employees')
  await page.waitForLoadState('networkidle')
}

async function openNewEmployeeDialog(page: Page) {
  await page.click('[data-testid="open-employee-dialog"]')
  await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
}

async function fillRequiredFields(page: Page, suffix: string) {
  await page.fill('[data-testid="input-first-name"]', `Max${suffix}`)
  await page.fill('[data-testid="input-last-name"]', `Mustermann${suffix}`)
  await page.fill('[data-testid="input-employee-number"]', `MA-${suffix}`)
  await page.fill('[data-testid="input-birth-date"]', '1985-06-15')
  await page.fill('[data-testid="input-entry-date"]', '2020-01-01')
  await page.fill('[data-testid="input-email"]', `max.${suffix}@test.de`)
}

test.describe('Mitarbeiter', () => {
  test.beforeEach(async ({ page }) => {
    if (!SUPABASE_URL || !TEST_EMAIL || !TEST_PASSWORD) {
      test.skip(true, 'Supabase-Credentials fehlen (.env nicht konfiguriert)')
    }
    await login(page)
    await gotoEmployees(page)
  })

  // ---------- Seite lädt ----------------------------------------

  test('Mitarbeiter-Seite lädt korrekt', async ({ page }) => {
    await expect(page.locator('[data-testid="page-title"]')).toContainText('Mitarbeiter')
    await expect(page.locator('[data-testid="open-employee-dialog"]')).toBeVisible()
  })

  // ---------- Anlegen: Pflichtfelder ----------------------------

  test('Neuen Mitarbeiter mit Pflichtfeldern anlegen', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })).toBeVisible({ timeout: 5000 })
  })

  // ---------- Anlegen: Alle Felder + Daten werden gespeichert ---

  test('Neuen Mitarbeiter mit allen Feldern anlegen und Daten werden gespeichert', async ({ page }) => {
    const ts = timestamp()

    await openNewEmployeeDialog(page)
    await page.fill('[data-testid="input-first-name"]', `Anna${ts}`)
    await page.fill('[data-testid="input-last-name"]', `Schmidt${ts}`)
    await page.fill('[data-testid="input-employee-number"]', `MA-FULL-${ts}`)
    await page.fill('[data-testid="input-position"]', 'Leiterin Qualität')
    await page.locator('[data-testid="select-employment-type"]').click()
    await page.getByRole('option', { name: 'Teilzeit' }).click()
    await page.fill('[data-testid="input-birth-date"]', '1988-03-20')
    await page.fill('[data-testid="input-entry-date"]', '2019-06-01')
    await page.fill('[data-testid="input-vacation-days"]', '28')
    await page.fill('[data-testid="input-salary"]', '3500')
    await page.fill('[data-testid="input-phone"]', '+49 89 123456')
    await page.fill('[data-testid="input-mobile"]', '+49 170 9876543')
    await page.fill('[data-testid="input-email"]', `anna.${ts}@test.de`)
    await page.fill('[data-testid="input-emergency-name"]', 'Peter Schmidt')
    await page.fill('[data-testid="input-address"]', 'Musterstraße 5, 80333 München')
    await page.fill('[data-testid="input-account-holder"]', `Anna Schmidt${ts}`)
    await page.fill('[data-testid="input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="input-bic"]', 'COBADEFFXXX')

    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const listItem = page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Schmidt${ts}` })
    await expect(listItem).toBeVisible({ timeout: 5000 })
    await listItem.click()

    await expect(page.locator('[data-testid="detail-name"]')).toContainText(`Anna${ts}`)
    await expect(page.locator('[data-testid="detail-employee-number"]')).toContainText(`MA-FULL-${ts}`)
    await expect(page.getByText('Leiterin Qualität').first()).toBeVisible()
    await expect(page.getByText('Teilzeit').first()).toBeVisible()
    await expect(page.getByText(`anna.${ts}@test.de`).first()).toBeVisible()
    await expect(page.getByText('+49 89 123456').first()).toBeVisible()
    await expect(page.getByText('COBADEFFXXX').first()).toBeVisible()
  })

  // ---------- Validierung ----------------------------------------

  test('Validierung: Leerer Vorname blockiert Submit', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await page.fill('[data-testid="input-last-name"]', `Nachname${ts}`)
    await page.fill('[data-testid="input-employee-number"]', `MA-${ts}`)
    await page.fill('[data-testid="input-birth-date"]', '1990-01-01')
    await page.fill('[data-testid="input-entry-date"]', '2020-01-01')
    await page.fill('[data-testid="input-email"]', `test.${ts}@test.de`)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  test('Validierung: Ungültige E-Mail blockiert Submit', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await page.fill('[data-testid="input-first-name"]', `Max${ts}`)
    await page.fill('[data-testid="input-last-name"]', `Muster${ts}`)
    await page.fill('[data-testid="input-employee-number"]', `MA-${ts}`)
    await page.fill('[data-testid="input-birth-date"]', '1990-01-01')
    await page.fill('[data-testid="input-entry-date"]', '2020-01-01')
    await page.fill('[data-testid="input-email"]', 'keine-email')
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Bearbeiten + Wiederauslesen ----------------------

  test('Mitarbeiter bearbeiten und Daten werden gespeichert', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const listItem = page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })
    await listItem.click()
    await page.click('[data-testid="edit-employee-btn"]')

    await page.fill('[data-testid="input-position"]', `Geänderte Position ${ts}`)
    await page.fill('[data-testid="input-phone"]', '+49 30 999888')
    await page.fill('[data-testid="input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="input-bic"]', 'COBADEFFXXX')
    await page.fill('[data-testid="input-account-holder"]', `Kontoinhaber ${ts}`)

    await page.click('[data-testid="submit-employee-edit"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'aktualisiert' })).toBeVisible({ timeout: 10000 })

    await expect(page.getByText(`Geänderte Position ${ts}`).first()).toBeVisible()
    await expect(page.getByText('+49 30 999888').first()).toBeVisible()
    await expect(page.getByText('COBADEFFXXX').first()).toBeVisible()
  })

  // ---------- Status umschalten --------------------------------

  test('Mitarbeiter-Status deaktivieren und reaktivieren', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const listItem = page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })
    await expect(listItem.locator('[data-testid="employee-status-badge"]')).toContainText('Aktiv')

    await listItem.click()
    await page.click('[data-testid="toggle-status-btn"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'deaktiviert' })).toBeVisible({ timeout: 5000 })
    await expect(listItem.locator('[data-testid="employee-status-badge"]')).toContainText('Inaktiv')

    await page.click('[data-testid="toggle-status-btn"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'aktiviert' })).toBeVisible({ timeout: 5000 })
    await expect(listItem.locator('[data-testid="employee-status-badge"]')).toContainText('Aktiv')
  })

  // ---------- Logische Validierungen --------------------------

  test('Logisch: Neuer Mitarbeiter ist standardmäßig aktiv', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const listItem = page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })
    await expect(listItem.locator('[data-testid="employee-status-badge"]')).toContainText('Aktiv')
  })

  test('Logisch: Reload behält Mitarbeiter-Daten (Persistenz)', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })).toBeVisible()

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })).toBeVisible({ timeout: 5000 })
  })

  // ---------- Abwesenheiten ------------------------------------

  test('Abwesenheit anlegen und in Tabelle anzeigen', async ({ page }) => {
    const ts = timestamp()
    await openNewEmployeeDialog(page)
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const listItem = page.locator('[data-testid="employee-list-item"]').filter({ hasText: `Mustermann${ts}` })
    await listItem.click()

    await page.getByRole('tab', { name: 'Abwesenheiten' }).click()
    await page.click('[data-testid="add-absence-btn"]')
    await expect(page.locator('[data-testid="absence-form"]')).toBeVisible()

    await page.locator('[data-testid="select-absence-type"]').click()
    await page.getByRole('option', { name: 'Urlaub', exact: true }).click()

    await page.fill('[data-testid="input-absence-start"]', '2026-07-01')
    await page.fill('[data-testid="input-absence-end"]', '2026-07-14')
    await page.fill('[data-testid="input-absence-days"]', '10')
    await page.fill('[data-testid="input-absence-notes"]', `Sommerurlaub ${ts}`)

    await page.click('[data-testid="submit-absence"]')

    await expect(page.locator('[data-testid="absence-row"]').filter({ hasText: 'Urlaub' })).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-testid="absence-row"]').filter({ hasText: '01.07.2026' })).toBeVisible()
  })
})

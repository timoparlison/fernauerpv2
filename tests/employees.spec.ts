import { test, expect, Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@fernau-erp.de'
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Test1234!'

async function login(page: Page) {
  await page.goto(`${BASE_URL}/auth`)
  await page.fill('[data-testid="email-input"]', TEST_EMAIL)
  await page.fill('[data-testid="password-input"]', TEST_PASSWORD)
  await page.click('[data-testid="login-button"]')
  await page.waitForURL(`${BASE_URL}/`)
}

async function navigateToEmployees(page: Page) {
  await page.goto(`${BASE_URL}/hr/employees`)
  await expect(page.getByTestId('page-title')).toBeVisible()
}

async function openCreateDialog(page: Page) {
  await page.click('[data-testid="open-employee-dialog"]')
  await expect(page.getByTestId('dialog-title')).toBeVisible()
}

async function fillRequiredFields(page: Page, suffix: string) {
  await page.fill('[data-testid="input-first-name"]', `Max${suffix}`)
  await page.fill('[data-testid="input-last-name"]', `Mustermann${suffix}`)
  await page.fill('[data-testid="input-employee-number"]', `MA-${suffix}`)
  await page.fill('[data-testid="input-birth-date"]', '1985-06-15')
  await page.fill('[data-testid="input-entry-date"]', '2020-01-01')
  await page.fill('[data-testid="input-email"]', `max.${suffix}@example.com`)
}

test.describe('Employees – Seitenladen', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
  })

  test('Seite lädt und zeigt Überschrift', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Mitarbeiter')
    await expect(page.getByTestId('open-employee-dialog')).toBeVisible()
  })
})

test.describe('Employees – Anlegen (minimal)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)
  })

  test('Mitarbeiter mit Pflichtfeldern anlegen', async ({ page }) => {
    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })).toBeVisible()
  })

  test('Validierung: leerer Vorname wird abgelehnt', async ({ page }) => {
    const ts = String(Date.now())
    await page.fill('[data-testid="input-last-name"]', `Nachname${ts}`)
    await page.fill('[data-testid="input-employee-number"]', `MA-${ts}`)
    await page.fill('[data-testid="input-birth-date"]', '1990-01-01')
    await page.fill('[data-testid="input-entry-date"]', '2020-01-01')
    await page.fill('[data-testid="input-email"]', `test.${ts}@example.com`)
    await page.click('[data-testid="submit-employee"]')
    // Should show toast error, dialog stays open
    await expect(page.getByTestId('dialog-title')).toBeVisible()
  })

  test('Validierung: ungültige E-Mail wird abgelehnt', async ({ page }) => {
    const ts = String(Date.now())
    await page.fill('[data-testid="input-first-name"]', `Max${ts}`)
    await page.fill('[data-testid="input-last-name"]', `Muster${ts}`)
    await page.fill('[data-testid="input-employee-number"]', `MA-${ts}`)
    await page.fill('[data-testid="input-birth-date"]', '1990-01-01')
    await page.fill('[data-testid="input-entry-date"]', '2020-01-01')
    await page.fill('[data-testid="input-email"]', 'keine-email')
    await page.click('[data-testid="submit-employee"]')
    await expect(page.getByTestId('dialog-title')).toBeVisible()
  })
})

test.describe('Employees – Alle Felder speichern und auslesen', () => {
  test('Alle Felder werden gespeichert und in Details angezeigt', async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await page.fill('[data-testid="input-first-name"]', `Anna${ts}`)
    await page.fill('[data-testid="input-last-name"]', `Schmidt${ts}`)
    await page.fill('[data-testid="input-employee-number"]', `MA-FULL-${ts}`)
    await page.fill('[data-testid="input-position"]', 'Leiterin Qualität')
    // Beschäftigungsart
    await page.click('[data-testid="select-employment-type"]')
    await page.click('[data-value="parttime"]')
    await page.fill('[data-testid="input-birth-date"]', '1988-03-20')
    await page.fill('[data-testid="input-entry-date"]', '2019-06-01')
    await page.fill('[data-testid="input-vacation-days"]', '28')
    await page.fill('[data-testid="input-salary"]', '3500')
    await page.fill('[data-testid="input-hourly-rate"]', '22.50')
    await page.fill('[data-testid="input-phone"]', '+49 89 123456')
    await page.fill('[data-testid="input-mobile"]', '+49 170 9876543')
    await page.fill('[data-testid="input-email"]', `anna.${ts}@example.com`)
    await page.fill('[data-testid="input-emergency-name"]', 'Peter Schmidt')
    await page.fill('[data-testid="input-emergency-phone"]', '+49 89 654321')
    await page.fill('[data-testid="input-address"]', 'Musterstraße 5, 80333 München')
    await page.fill('[data-testid="input-account-holder"]', `Anna Schmidt${ts}`)
    await page.fill('[data-testid="input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="input-bic"]', 'COBADEFFXXX')

    await page.click('[data-testid="submit-employee"]')

    // Verify in list
    const listItem = page.getByTestId('employee-list-item').filter({ hasText: `Schmidt${ts}` })
    await expect(listItem).toBeVisible()
    await listItem.click()

    // Verify details
    await expect(page.getByTestId('detail-name')).toContainText(`Anna${ts}`)
    await expect(page.getByTestId('detail-employee-number')).toContainText(`MA-FULL-${ts}`)
    await expect(page.getByText('Leiterin Qualität').first()).toBeVisible()
    await expect(page.getByText('Teilzeit').first()).toBeVisible()
    await expect(page.getByText(`anna.${ts}@example.com`).first()).toBeVisible()
    await expect(page.getByText('+49 89 123456').first()).toBeVisible()
    await expect(page.getByText('COBADEFFXXX').first()).toBeVisible()
  })
})

test.describe('Employees – Beschäftigungsarten', () => {
  test.each([
    ['fulltime', 'Vollzeit'],
    ['parttime', 'Teilzeit'],
    ['minijob', 'Minijob'],
  ])('Beschäftigungsart %s zeigt Label "%s"', async ({ page }, type, label) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="select-employment-type"]')
    await page.click(`[data-value="${type}"]`)
    await page.click('[data-testid="submit-employee"]')

    const listItem = page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })
    await listItem.click()
    await expect(page.getByText(label).first()).toBeVisible()
  })
})

test.describe('Employees – Bearbeiten und Rücklesen', () => {
  test('Mitarbeiter bearbeiten und Änderungen werden gespeichert', async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')

    const listItem = page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })
    await listItem.click()

    await page.click('[data-testid="edit-employee-btn"]')

    // Update position
    await page.fill('[data-testid="input-position"]', `Geänderte Position ${ts}`)
    await page.fill('[data-testid="input-phone"]', '+49 30 999888')
    await page.fill('[data-testid="input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="input-bic"]', 'COBADEFFXXX')
    await page.fill('[data-testid="input-account-holder"]', `Kontoinhaber ${ts}`)

    await page.click('[data-testid="submit-employee-edit"]')

    await expect(page.getByText(`Geänderte Position ${ts}`).first()).toBeVisible()
    await expect(page.getByText('+49 30 999888').first()).toBeVisible()
    await expect(page.getByText('COBADEFFXXX').first()).toBeVisible()
  })
})

test.describe('Employees – Status umschalten', () => {
  test('Aktiv → Inaktiv → Aktiv', async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')

    const listItem = page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })
    await expect(listItem.getByTestId('employee-status-badge')).toContainText('Aktiv')

    // Select to see toggle button
    await listItem.click()
    await page.click('[data-testid="toggle-status-btn"]')
    await expect(listItem.getByTestId('employee-status-badge')).toContainText('Inaktiv')

    await page.click('[data-testid="toggle-status-btn"]')
    await expect(listItem.getByTestId('employee-status-badge')).toContainText('Aktiv')
  })
})

test.describe('Employees – Logische Validierungen', () => {
  test('Neuer Mitarbeiter ist standardmäßig aktiv', async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')

    const listItem = page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })
    await expect(listItem.getByTestId('employee-status-badge')).toContainText('Aktiv')
  })

  test('Mitarbeiter bleibt nach Seitenreload erhalten', async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')
    await expect(page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })).toBeVisible()

    await page.reload()
    await expect(page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })).toBeVisible()
  })
})

test.describe('Employees – Abwesenheiten', () => {
  test('Abwesenheit anlegen und in Tabelle anzeigen', async ({ page }) => {
    await login(page)
    await navigateToEmployees(page)
    await openCreateDialog(page)

    const ts = String(Date.now())
    await fillRequiredFields(page, ts)
    await page.click('[data-testid="submit-employee"]')

    const listItem = page.getByTestId('employee-list-item').filter({ hasText: `Mustermann${ts}` })
    await listItem.click()

    // Switch to absences tab
    await page.click('[value="absences"]')
    await page.click('[data-testid="add-absence-btn"]')
    await expect(page.getByTestId('absence-form')).toBeVisible()

    // Select absence type
    await page.click('[data-testid="select-absence-type"]')
    await page.click('[data-value="urlaub"]')

    await page.fill('[data-testid="input-absence-start"]', '2026-07-01')
    await page.fill('[data-testid="input-absence-end"]', '2026-07-14')
    await page.fill('[data-testid="input-absence-days"]', '10')
    await page.fill('[data-testid="input-absence-notes"]', `Sommerurlaub ${ts}`)

    await page.click('[data-testid="submit-absence"]')

    // Verify in table
    await expect(page.getByTestId('absence-row').filter({ hasText: 'Urlaub' })).toBeVisible()
    await expect(page.getByTestId('absence-row').filter({ hasText: '01.07.2026' })).toBeVisible()
  })
})

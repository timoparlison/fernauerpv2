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

async function navigateToCustomers(page: Page) {
  await page.goto(`${BASE_URL}/sales/customers`)
  await expect(page.getByTestId('page-title')).toBeVisible()
}

async function openCreateDialog(page: Page) {
  await page.click('[data-testid="open-customer-dialog"]')
  await expect(page.getByTestId('dialog-title')).toBeVisible()
}

async function selectCustomerType(page: Page, type: string, testId = 'select-customer-type') {
  await page.click(`[data-testid="${testId}"]`)
  await page.click(`[data-value="${type}"]`)
}

test.describe('Customers – Seitenladen', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
  })

  test('Seite lädt und zeigt Überschrift', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Kundenstamm')
    await expect(page.getByTestId('open-customer-dialog')).toBeVisible()
    await expect(page.getByTestId('search-input')).toBeVisible()
    await expect(page.getByTestId('export-btn')).toBeVisible()
  })
})

test.describe('Customers – Anlegen (minimal)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)
  })

  test('Kunde mit Pflichtfeldern anlegen', async ({ page }) => {
    await page.fill('[data-testid="input-name"]', 'Minimaltest GmbH')
    await selectCustomerType(page, 'retail')
    await page.click('[data-testid="submit-customer"]')
    await expect(page.getByTestId('customer-row').filter({ hasText: 'Minimaltest GmbH' })).toBeVisible()
  })

  test('Validierung: leerer Name schlägt fehl', async ({ page }) => {
    await selectCustomerType(page, 'other')
    await page.click('[data-testid="submit-customer"]')
    // Form should not submit (HTML5 required)
    await expect(page.getByTestId('dialog-title')).toBeVisible()
  })

  test('Validierung: fehlender Typ schlägt fehl', async ({ page }) => {
    await page.fill('[data-testid="input-name"]', 'Ohne Typ GmbH')
    await page.click('[data-testid="submit-customer"]')
    await expect(page.getByTestId('dialog-title')).toBeVisible()
  })
})

test.describe('Customers – Alle Felder speichern und auslesen', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)
  })

  test('Alle Felder werden gespeichert und ausgelesen', async ({ page }) => {
    const ts = Date.now()
    const customerName = `Vollständiger Kunde ${ts}`

    await page.fill('[data-testid="input-name"]', customerName)
    await selectCustomerType(page, 'wholesale')
    await page.fill('[data-testid="input-contact-person"]', 'Max Mustermann')
    await page.fill('[data-testid="input-email"]', `max.${ts}@example.com`)
    await page.fill('[data-testid="input-phone"]', '+49 123 456789')
    await page.fill('[data-testid="input-vat-id"]', `DE${ts}`)
    await page.fill('[data-testid="input-supplier-number-at-customer"]', `LNR-${ts}`)
    await page.fill('[data-testid="input-discount"]', '5.5')
    await page.fill('[data-testid="input-address"]', 'Hauptstraße 1\n12345 Musterstadt')
    await page.fill('[data-testid="input-billing-address"]', 'Rechnungsweg 2\n12345 Musterstadt')
    await page.fill('[data-testid="input-delivery-address"]', 'Lieferstraße 3\n12345 Musterstadt')
    await page.fill('[data-testid="input-payment-terms"]', '30 Tage netto')
    await page.fill('[data-testid="input-delivery-terms"]', 'DAP Werk')
    await page.fill('[data-testid="input-delivery-days"]', 'Mo, Mi, Fr')
    await page.fill('[data-testid="input-account-holder"]', 'Vollständiger Kunde GmbH')
    await page.fill('[data-testid="input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="input-bic"]', 'COBADEFFXXX')
    await page.fill('[data-testid="input-payment-reference"]', `REF-${ts}`)
    await page.fill('[data-testid="input-payment-purpose"]', `Verwendungszweck ${ts}`)
    await page.fill('[data-testid="input-notes"]', `Testnotiz ${ts}`)

    await page.click('[data-testid="submit-customer"]')
    await expect(page.getByTestId('customer-row').filter({ hasText: customerName })).toBeVisible()

    // Open detail view and verify fields
    const row = page.getByTestId('customer-row').filter({ hasText: customerName })
    await row.getByTestId('view-customer-btn').click()
    await expect(page.getByTestId('detail-dialog-title')).toContainText(customerName)

    // Verify in master data tab
    await expect(page.getByText('Max Mustermann').first()).toBeVisible()
    await expect(page.getByText(`max.${ts}@example.com`).first()).toBeVisible()
    await expect(page.getByText('+49 123 456789').first()).toBeVisible()
    await expect(page.getByText('30 Tage netto').first()).toBeVisible()
    await expect(page.getByText('DAP Werk').first()).toBeVisible()
  })
})

test.describe('Customers – Kundentypus-Badge', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
  })

  test.each([
    ['retail', 'Einzelhandel'],
    ['wholesale', 'Großhandel'],
    ['service', 'Dienstleistung'],
    ['other', 'Sonstige'],
  ])('Typ %s zeigt Label "%s" in der Tabelle', async ({ page }, type, label) => {
    await openCreateDialog(page)
    await page.fill('[data-testid="input-name"]', `Typ-Test ${type} ${Date.now()}`)
    await selectCustomerType(page, type)
    await page.click('[data-testid="submit-customer"]')
    const rows = page.getByTestId('customer-row')
    const latestRow = rows.last()
    await expect(latestRow.getByTestId('customer-type-badge')).toContainText(label)
  })
})

test.describe('Customers – Bearbeiten und Rücklesen', () => {
  test('Kunde bearbeiten und Werte werden gespeichert', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const ts = Date.now()
    const name = `Edit-Kunde ${ts}`
    await page.fill('[data-testid="input-name"]', name)
    await selectCustomerType(page, 'retail')
    await page.click('[data-testid="submit-customer"]')
    const row = page.getByTestId('customer-row').filter({ hasText: name })
    await row.getByTestId('view-customer-btn').click()

    // Click edit
    await page.click('[data-testid="edit-customer-btn"]')
    await expect(page.getByTestId('customer-edit-form')).toBeVisible()

    // Change fields
    await page.fill('[data-testid="edit-input-name"]', `${name} Aktualisiert`)
    await page.fill('[data-testid="edit-input-contact-person"]', 'Neue Person')
    await page.fill('[data-testid="edit-input-email"]', `neu.${ts}@example.com`)
    await page.fill('[data-testid="edit-input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="edit-input-bic"]', 'COBADEFFXXX')
    await page.fill('[data-testid="edit-input-account-holder"]', 'Kontoinhaber GmbH')
    await page.fill('[data-testid="edit-input-invoice-email-1"]', `rechnung.${ts}@example.com`)
    await page.fill('[data-testid="edit-input-invoice-email-2"]', `buch.${ts}@example.com`)
    await page.click('[data-testid="edit-submit-customer"]')

    // Verify updated values shown in view
    await expect(page.getByText(`${name} Aktualisiert`).first()).toBeVisible()
    await expect(page.getByText('Neue Person').first()).toBeVisible()
    await expect(page.getByText('COBADEFFXXX').first()).toBeVisible()
  })
})

test.describe('Customers – Status umschalten', () => {
  test('Aktiv → Inaktiv → Aktiv', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const ts = Date.now()
    const name = `Status-Kunde ${ts}`
    await page.fill('[data-testid="input-name"]', name)
    await selectCustomerType(page, 'other')
    await page.click('[data-testid="submit-customer"]')

    const row = page.getByTestId('customer-row').filter({ hasText: name })
    await expect(row.getByTestId('customer-status-badge')).toContainText('Aktiv')

    // Deactivate
    await row.getByTestId('toggle-status-btn').click()
    await expect(row.getByTestId('customer-status-badge')).toContainText('Inaktiv')

    // Reactivate
    await row.getByTestId('toggle-status-btn').click()
    await expect(row.getByTestId('customer-status-badge')).toContainText('Aktiv')
  })
})

test.describe('Customers – Logische Validierungen', () => {
  test('Neu angelegter Kunde ist standardmäßig aktiv', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const name = `Aktiv-Default ${Date.now()}`
    await page.fill('[data-testid="input-name"]', name)
    await selectCustomerType(page, 'service')
    await page.click('[data-testid="submit-customer"]')

    const row = page.getByTestId('customer-row').filter({ hasText: name })
    await expect(row.getByTestId('customer-status-badge')).toContainText('Aktiv')
  })

  test('Kundennummer-Feld ist deaktiviert (auto)', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const numberInput = page.getByTestId('input-customer-number')
    await expect(numberInput).toBeDisabled()
  })

  test('Kunde bleibt nach Seitenreload erhalten', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const name = `Reload-Kunde ${Date.now()}`
    await page.fill('[data-testid="input-name"]', name)
    await selectCustomerType(page, 'retail')
    await page.click('[data-testid="submit-customer"]')
    await expect(page.getByTestId('customer-row').filter({ hasText: name })).toBeVisible()

    // Reload
    await page.reload()
    await expect(page.getByTestId('customer-row').filter({ hasText: name })).toBeVisible()
  })

  test('Suche filtert Kunden nach Name', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const ts = Date.now()
    const name = `Suchtest-Kunde-${ts}`
    await page.fill('[data-testid="input-name"]', name)
    await selectCustomerType(page, 'other')
    await page.click('[data-testid="submit-customer"]')

    await page.fill('[data-testid="search-input"]', name)
    await page.waitForTimeout(500)

    const rows = page.getByTestId('customer-row')
    await expect(rows.filter({ hasText: name })).toBeVisible()
  })
})

test.describe('Customers – Kontakte CRUD', () => {
  test('Kontakt anlegen und anzeigen', async ({ page }) => {
    await login(page)
    await navigateToCustomers(page)
    await openCreateDialog(page)

    const ts = Date.now()
    const name = `Kontakt-Kunde ${ts}`
    await page.fill('[data-testid="input-name"]', name)
    await selectCustomerType(page, 'wholesale')
    await page.click('[data-testid="submit-customer"]')

    const row = page.getByTestId('customer-row').filter({ hasText: name })
    await row.getByTestId('view-customer-btn').click()

    // Switch to contacts tab
    await page.click('[value="contacts"]')
    await page.click('[data-testid="add-contact-btn"]')
    await expect(page.getByTestId('contact-form')).toBeVisible()

    await page.fill('[data-testid="input-contact-person"]', 'Maria Muster')
    await page.fill('[data-testid="input-contact-phone"]', '+49 987 654321')
    await page.fill('[data-testid="input-contact-email"]', `maria.${ts}@example.com`)
    await page.fill('[data-testid="input-contact-availability"]', 'Mo-Fr 9-17 Uhr')
    await page.click('[data-testid="submit-contact"]')

    await expect(page.getByText('Maria Muster').first()).toBeVisible()
    await expect(page.getByText('+49 987 654321').first()).toBeVisible()
  })
})

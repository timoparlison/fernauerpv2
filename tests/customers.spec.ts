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

async function showAllRows(page: Page) {
  const pageSizeSelect = page.locator('[data-testid="page-size-select"]')
  if (await pageSizeSelect.isVisible().catch(() => false)) {
    await pageSizeSelect.click()
    await page.getByRole('option', { name: '100' }).click()
    await page.waitForLoadState('networkidle')
  }
}

async function gotoCustomers(page: Page) {
  await page.goto('/sales/customers')
  await page.waitForLoadState('networkidle')
  await showAllRows(page)
}

async function openNewCustomerDialog(page: Page) {
  await page.click('[data-testid="open-customer-dialog"]')
  await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
}

async function selectCustomerType(page: Page, label: string) {
  await page.locator('[data-testid="select-customer-type"]').click()
  await page.getByRole('option', { name: label }).click()
}

async function fillCustomerForm(page: Page, data: {
  name?: string
  type?: string  // german label: 'Einzelhandel' | 'Großhandel' | 'Dienstleistung' | 'Sonstige'
  contact_person?: string
  email?: string
  phone?: string
  vat_id?: string
  our_supplier_number_at_customer?: string
  default_discount_percent?: string
  address?: string
  billing_address?: string
  delivery_address?: string
  payment_terms?: string
  delivery_terms?: string
  delivery_days?: string
  account_holder?: string
  iban?: string
  bic?: string
  payment_reference?: string
  payment_purpose?: string
  notes?: string
}) {
  if (data.name !== undefined) await page.fill('[data-testid="input-name"]', data.name)
  if (data.type) await selectCustomerType(page, data.type)
  if (data.contact_person) await page.fill('[data-testid="input-contact-person"]', data.contact_person)
  if (data.email) await page.fill('[data-testid="input-email"]', data.email)
  if (data.phone) await page.fill('[data-testid="input-phone"]', data.phone)
  if (data.vat_id) await page.fill('[data-testid="input-vat-id"]', data.vat_id)
  if (data.our_supplier_number_at_customer) await page.fill('[data-testid="input-supplier-number-at-customer"]', data.our_supplier_number_at_customer)
  if (data.default_discount_percent) await page.fill('[data-testid="input-discount"]', data.default_discount_percent)
  if (data.address) await page.fill('[data-testid="input-address"]', data.address)
  if (data.billing_address) await page.fill('[data-testid="input-billing-address"]', data.billing_address)
  if (data.delivery_address) await page.fill('[data-testid="input-delivery-address"]', data.delivery_address)
  if (data.payment_terms) await page.fill('[data-testid="input-payment-terms"]', data.payment_terms)
  if (data.delivery_terms) await page.fill('[data-testid="input-delivery-terms"]', data.delivery_terms)
  if (data.delivery_days) await page.fill('[data-testid="input-delivery-days"]', data.delivery_days)
  if (data.account_holder) await page.fill('[data-testid="input-account-holder"]', data.account_holder)
  if (data.iban) await page.fill('[data-testid="input-iban"]', data.iban)
  if (data.bic) await page.fill('[data-testid="input-bic"]', data.bic)
  if (data.payment_reference) await page.fill('[data-testid="input-payment-reference"]', data.payment_reference)
  if (data.payment_purpose) await page.fill('[data-testid="input-payment-purpose"]', data.payment_purpose)
  if (data.notes) await page.fill('[data-testid="input-notes"]', data.notes)
}

test.describe('Kunden', () => {
  test.beforeEach(async ({ page }) => {
    if (!SUPABASE_URL || !TEST_EMAIL || !TEST_PASSWORD) {
      test.skip(true, 'Supabase-Credentials fehlen (.env nicht konfiguriert)')
    }
    await login(page)
    await gotoCustomers(page)
  })

  // ---------- Seite lädt ----------------------------------------

  test('Kunden-Seite lädt korrekt', async ({ page }) => {
    await expect(page.locator('[data-testid="page-title"]')).toContainText('Kundenstamm')
    await expect(page.locator('[data-testid="open-customer-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="export-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
  })

  // ---------- Anlegen: Pflichtfelder ----------------------------

  test('Neuen Kunden mit Pflichtfeldern anlegen', async ({ page }) => {
    const name = `E2E-Test Minimal ${timestamp()}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Einzelhandel' })
    await page.click('[data-testid="submit-customer"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="customer-row"]').filter({ hasText: name })).toBeVisible({ timeout: 5000 })
  })

  // ---------- Anlegen: Alle Felder + Daten werden gespeichert ---

  test('Neuen Kunden mit allen Feldern anlegen und Daten werden gespeichert', async ({ page }) => {
    const ts = timestamp()
    const name = `E2E-Test Vollständig ${ts}`

    await openNewCustomerDialog(page)
    await fillCustomerForm(page, {
      name,
      type: 'Großhandel',
      contact_person: 'Max Mustermann',
      email: `e2e-${ts}@test.de`,
      phone: '+49 30 12345678',
      vat_id: 'DE123456789',
      our_supplier_number_at_customer: `LNR-${ts}`,
      default_discount_percent: '5.5',
      address: 'Hauptstraße 1\n10115 Berlin',
      billing_address: 'Rechnungsstraße 5\n10117 Berlin',
      delivery_address: 'Lagerstraße 10\n10119 Berlin',
      payment_terms: '30 Tage netto',
      delivery_terms: 'DAP Werk',
      delivery_days: 'Mo, Mi, Fr',
      account_holder: `Kunde ${ts} GmbH`,
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      payment_reference: `REF-${ts}`,
      payment_purpose: `Verwendung-${ts}`,
      notes: `E2E-Test Notiz ${ts}`,
    })
    await page.click('[data-testid="submit-customer"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Details öffnen und alle Felder prüfen
    const row = page.locator('[data-testid="customer-row"]').filter({ hasText: name })
    await row.locator('[data-testid="view-customer-btn"]').click()
    await expect(page.locator('[data-testid="detail-dialog-title"]')).toContainText(name)

    // Grunddaten
    await expect(page.locator('[data-testid="detail-name"]')).toContainText(name)
    await expect(page.locator('[data-testid="detail-contact-person"]')).toContainText('Max Mustermann')
    await expect(page.locator('[data-testid="detail-email"]')).toContainText(`e2e-${ts}@test.de`)
    await expect(page.locator('[data-testid="detail-phone"]')).toContainText('+49 30 12345678')
    await expect(page.locator('[data-testid="detail-vat-id"]')).toContainText('DE123456789')
    await expect(page.locator('[data-testid="detail-supplier-number-at-customer"]')).toContainText(`LNR-${ts}`)
    await expect(page.locator('[data-testid="detail-discount"]')).toContainText('5.5%')

    // Adressen
    await expect(page.locator('[data-testid="detail-address"]')).toContainText('Hauptstraße 1')
    await expect(page.locator('[data-testid="detail-billing-address"]')).toContainText('Rechnungsstraße 5')
    await expect(page.locator('[data-testid="detail-delivery-address"]')).toContainText('Lagerstraße 10')

    // Konditionen
    await expect(page.locator('[data-testid="detail-payment-terms"]')).toContainText('30 Tage netto')
    await expect(page.locator('[data-testid="detail-delivery-terms"]')).toContainText('DAP Werk')
    await expect(page.locator('[data-testid="detail-delivery-days"]')).toContainText('Mo, Mi, Fr')

    // Bankdaten
    await expect(page.locator('[data-testid="detail-account-holder"]')).toContainText(`Kunde ${ts} GmbH`)
    await expect(page.locator('[data-testid="detail-iban"]')).toContainText('DE89370400440532013000')
    await expect(page.locator('[data-testid="detail-bic"]')).toContainText('COBADEFFXXX')
    await expect(page.locator('[data-testid="detail-payment-reference"]')).toContainText(`REF-${ts}`)
    await expect(page.locator('[data-testid="detail-payment-purpose"]')).toContainText(`Verwendung-${ts}`)

    // Notizen
    await expect(page.locator('[data-testid="detail-notes"]')).toContainText(`E2E-Test Notiz ${ts}`)
  })

  // ---------- Validierung ----------------------------------------

  test('Validierung: Leerer Name blockiert Submit', async ({ page }) => {
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name: '', type: 'Sonstige' })
    const nameInput = page.locator('[data-testid="input-name"]')
    const isRequired = await nameInput.evaluate((el: HTMLInputElement) => el.required)
    expect(isRequired).toBe(true)
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  test('Validierung: Ungültige E-Mail blockiert Submit', async ({ page }) => {
    const name = `E2E-InvalidEmail ${timestamp()}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Sonstige' })
    await page.fill('[data-testid="input-email"]', 'keine-email')
    const emailInput = page.locator('[data-testid="input-email"]')
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBe(false)
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  test('Validierung: Fehlender Typ blockiert Submit', async ({ page }) => {
    const name = `E2E-KeinTyp ${timestamp()}`
    await openNewCustomerDialog(page)
    await page.fill('[data-testid="input-name"]', name)
    // Typ NICHT auswählen
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Kundennummer-Feld deaktiviert --------------------

  test('Kundennummer-Feld ist deaktiviert (auto)', async ({ page }) => {
    await openNewCustomerDialog(page)
    await expect(page.locator('[data-testid="input-customer-number"]')).toBeDisabled()
  })

  // ---------- Bearbeiten + Wiederauslesen ----------------------

  test('Kunden bearbeiten und alle Daten werden korrekt gespeichert', async ({ page }) => {
    const ts = timestamp()
    const originalName = `E2E-Edit-Orig ${ts}`
    const updatedName = `E2E-Edit-Updated ${ts}`

    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name: originalName, type: 'Einzelhandel' })
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('[data-testid="customer-row"]').filter({ hasText: originalName })
    await row.locator('[data-testid="view-customer-btn"]').click()
    await expect(page.locator('[data-testid="detail-dialog-title"]')).toContainText(originalName)

    await page.click('[data-testid="edit-customer-btn"]')
    await expect(page.locator('[data-testid="customer-edit-form"]')).toBeVisible()

    await page.fill('[data-testid="edit-input-name"]', updatedName)
    await page.fill('[data-testid="edit-input-contact-person"]', 'Neue Person')
    await page.fill('[data-testid="edit-input-phone"]', '+49 89 9999999')
    await page.fill('[data-testid="edit-input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="edit-input-bic"]', 'COBADEFFXXX')
    await page.fill('[data-testid="edit-input-account-holder"]', 'Test GmbH')
    await page.fill('[data-testid="edit-input-invoice-email-1"]', `rechnung.${ts}@test.de`)
    await page.fill('[data-testid="edit-input-invoice-email-2"]', `buchhaltung.${ts}@test.de`)
    await page.fill('[data-testid="edit-input-invoice-email-3"]', `kopie.${ts}@test.de`)
    await page.click('[data-testid="edit-submit-customer"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'aktualisiert' })).toBeVisible({ timeout: 10000 })

    // Alle bearbeiteten Felder prüfen
    await expect(page.locator('[data-testid="detail-name"]')).toContainText(updatedName)
    await expect(page.locator('[data-testid="detail-contact-person"]')).toContainText('Neue Person')
    await expect(page.locator('[data-testid="detail-phone"]')).toContainText('+49 89 9999999')
    await expect(page.locator('[data-testid="detail-iban"]')).toContainText('DE89370400440532013000')
    await expect(page.locator('[data-testid="detail-bic"]')).toContainText('COBADEFFXXX')
    await expect(page.locator('[data-testid="detail-account-holder"]')).toContainText('Test GmbH')
    await expect(page.locator('[data-testid="detail-invoice-email-1"]')).toContainText(`rechnung.${ts}@test.de`)
    await expect(page.locator('[data-testid="detail-invoice-email-2"]')).toContainText(`buchhaltung.${ts}@test.de`)
    await expect(page.locator('[data-testid="detail-invoice-email-3"]')).toContainText(`kopie.${ts}@test.de`)
  })

  // ---------- Status umschalten --------------------------------

  test('Kunden-Status deaktivieren und reaktivieren', async ({ page }) => {
    const name = `E2E-Status ${timestamp()}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Sonstige' })
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('[data-testid="customer-row"]').filter({ hasText: name })
    await expect(row.locator('[data-testid="customer-status-badge"]')).toContainText('Aktiv')

    await row.locator('[data-testid="toggle-status-btn"]').click()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'deaktiviert' })).toBeVisible({ timeout: 5000 })
    await expect(row.locator('[data-testid="customer-status-badge"]')).toContainText('Inaktiv')

    await row.locator('[data-testid="toggle-status-btn"]').click()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'aktiviert' })).toBeVisible({ timeout: 5000 })
    await expect(row.locator('[data-testid="customer-status-badge"]')).toContainText('Aktiv')
  })

  // ---------- Logische Validierungen --------------------------

  test('Logisch: Neu angelegter Kunde ist standardmäßig aktiv', async ({ page }) => {
    const name = `E2E-AktivDefault ${timestamp()}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Dienstleistung' })
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('[data-testid="customer-row"]').filter({ hasText: name })
    await expect(row.locator('[data-testid="customer-status-badge"]')).toContainText('Aktiv')
  })

  test('Logisch: Reload behält Kunden-Daten (Persistenz)', async ({ page }) => {
    const name = `E2E-Persist ${timestamp()}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Einzelhandel', notes: 'Persistenz-Test' })
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    await page.reload()
    await page.waitForLoadState('networkidle')
    await showAllRows(page)
    await expect(page.locator('[data-testid="customer-row"]').filter({ hasText: name })).toBeVisible({ timeout: 5000 })
  })

  test('Logisch: Suche filtert Kunden nach Name', async ({ page }) => {
    const ts = timestamp()
    const name = `E2E-Suche-${ts}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Sonstige' })
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    await page.fill('[data-testid="search-input"]', name)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('[data-testid="customer-row"]').filter({ hasText: name })).toBeVisible()
  })

  // ---------- Kontakte CRUD ------------------------------------

  test('Kontakt anlegen und anzeigen', async ({ page }) => {
    const ts = timestamp()
    const name = `E2E-Kontakt ${ts}`
    await openNewCustomerDialog(page)
    await fillCustomerForm(page, { name, type: 'Großhandel' })
    await page.click('[data-testid="submit-customer"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('[data-testid="customer-row"]').filter({ hasText: name })
    await row.locator('[data-testid="view-customer-btn"]').click()

    await page.getByRole('tab', { name: 'Kontakte' }).click()
    await page.click('[data-testid="add-contact-btn"]')
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible()

    await page.fill('[data-testid="input-contact-person"]', 'Maria Muster')
    await page.fill('[data-testid="input-contact-phone"]', '+49 987 654321')
    await page.fill('[data-testid="input-contact-email"]', `maria.${ts}@test.de`)
    await page.fill('[data-testid="input-contact-availability"]', 'Mo-Fr 9-17 Uhr')
    await page.click('[data-testid="submit-contact"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Maria Muster').first()).toBeVisible()
    await expect(page.getByText('+49 987 654321').first()).toBeVisible()
  })
})

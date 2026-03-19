import { test, expect, Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

async function gotoSuppliers(page: Page) {
  await page.goto('/procurement/suppliers')
  await page.waitForLoadState('networkidle')
  await showAllRows(page)
}

async function openNewSupplierDialog(page: Page) {
  await page.click('[data-testid="open-supplier-dialog"]')
  await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
}

async function fillSupplierForm(page: Page, data: {
  name: string
  supplier_type?: 'material' | 'service' | 'both'
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  delivery_address?: string
  customer_number?: string
  vat_id?: string
  payment_terms?: string
  delivery_terms?: string
  notes?: string
}) {
  if (data.name !== undefined) {
    await page.fill('[data-testid="input-name"]', data.name)
  }
  if (data.supplier_type) {
    await page.locator('[data-testid="select-supplier-type"]').click()
    await page.getByRole('option', {
      name: data.supplier_type === 'material' ? 'Material' : data.supplier_type === 'service' ? 'Dienstleistung' : 'Beides'
    }).click()
  }
  if (data.contact_person) {
    await page.fill('[data-testid="input-contact-person"]', data.contact_person)
  }
  if (data.email) {
    await page.fill('[data-testid="input-email"]', data.email)
  }
  if (data.phone) {
    await page.fill('[data-testid="input-phone"]', data.phone)
  }
  if (data.address) {
    await page.fill('[data-testid="input-address"]', data.address)
  }
  if (data.delivery_address) {
    await page.fill('[data-testid="input-delivery-address"]', data.delivery_address)
  }
  if (data.customer_number) {
    await page.fill('[data-testid="input-customer-number"]', data.customer_number)
  }
  if (data.vat_id) {
    await page.fill('[data-testid="input-vat-id"]', data.vat_id)
  }
  if (data.payment_terms) {
    await page.fill('[data-testid="input-payment-terms"]', data.payment_terms)
  }
  if (data.delivery_terms) {
    await page.fill('[data-testid="input-delivery-terms"]', data.delivery_terms)
  }
  if (data.notes) {
    await page.fill('[data-testid="input-notes"]', data.notes)
  }
}

async function openSupplierDetails(page: Page, name: string) {
  const row = page.locator('tr').filter({ hasText: name })
  await row.locator('[data-testid="btn-view"]').click()
  await expect(page.locator('[data-testid="supplier-details-dialog"]')).toBeVisible()
  // Stammdaten-Tab ist default
  await expect(page.locator('[data-testid="details-dialog-title"]')).toContainText(name)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Lieferanten', () => {
  test.beforeEach(async ({ page }) => {
    if (!SUPABASE_URL || !TEST_EMAIL || !TEST_PASSWORD) {
      test.skip(true, 'Supabase-Credentials fehlen (.env nicht konfiguriert)')
    }
    await login(page)
    await gotoSuppliers(page)
  })

  // ---------- Seite lädt ----------------------------------------

  test('Lieferanten-Seite lädt korrekt', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Lieferantenstamm' })).toBeVisible()
    await expect(page.locator('[data-testid="open-supplier-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-export"]')).toBeVisible()
  })

  // ---------- Anlegen: Pflichtfelder ----------------------------

  test('Neuen Lieferanten mit Pflichtfeldern anlegen', async ({ page }) => {
    const name = `E2E-Test Minimal ${timestamp()}`

    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name, supplier_type: 'material' })
    await page.click('[data-testid="submit-supplier"]')

    // Erfolgs-Toast
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Dialog geschlossen
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Lieferant in Tabelle sichtbar
    await expect(page.locator('tr').filter({ hasText: name })).toBeVisible({ timeout: 5000 })
  })

  // ---------- Anlegen: Alle Felder + Daten werden gespeichert ---

  test('Neuen Lieferanten mit allen Feldern anlegen und Daten werden gespeichert', async ({ page }) => {
    const ts = timestamp()
    const supplierData = {
      name: `E2E-Test Vollständig ${ts}`,
      supplier_type: 'both' as const,
      contact_person: 'Max Mustermann',
      email: `e2e-${ts}@test.de`,
      phone: '+49 30 12345678',
      address: 'Hauptstraße 1\n10115 Berlin',
      delivery_address: 'Lagerstraße 5\n10115 Berlin',
      customer_number: `CUST-${ts}`,
      vat_id: 'DE123456789',
      payment_terms: '30 Tage netto',
      delivery_terms: 'DAP Werk',
      notes: `E2E-Test Notiz ${ts}`,
    }

    await openNewSupplierDialog(page)
    await fillSupplierForm(page, supplierData)
    await page.click('[data-testid="submit-supplier"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Details öffnen und alle Felder prüfen
    await openSupplierDetails(page, supplierData.name)

    await expect(page.locator('[data-testid="detail-name"]')).toContainText(supplierData.name)
    await expect(page.locator('[data-testid="detail-contact-person"]')).toContainText(supplierData.contact_person)
    await expect(page.locator('[data-testid="detail-email"]')).toContainText(supplierData.email)
    await expect(page.locator('[data-testid="detail-phone"]')).toContainText(supplierData.phone)
    await expect(page.locator('[data-testid="detail-address"]')).toContainText('Hauptstraße 1')
    await expect(page.locator('[data-testid="detail-delivery-address"]')).toContainText('Lagerstraße 5')
    await expect(page.locator('[data-testid="detail-customer-number"]')).toContainText(supplierData.customer_number)
    await expect(page.locator('[data-testid="detail-vat-id"]')).toContainText(supplierData.vat_id)
    await expect(page.locator('[data-testid="detail-payment-terms"]')).toContainText(supplierData.payment_terms)
    await expect(page.locator('[data-testid="detail-delivery-terms"]')).toContainText(supplierData.delivery_terms)
    await expect(page.locator('[data-testid="detail-notes"]')).toContainText(supplierData.notes)
  })

   // ---------- Validierung: Leerer Name --------------------------

  test('Validierung: Leerer Firmenname blockiert Submit', async ({ page }) => {
    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name: '', supplier_type: 'material' })

    const nameInput = page.locator('[data-testid="input-name"]')
    const isRequired = await nameInput.evaluate((el: HTMLInputElement) => el.required)
    expect(isRequired).toBe(true)

    await page.click('[data-testid="submit-supplier"]')
    // Dialog bleibt offen
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    // Kein Toast
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Validierung: Ungültige E-Mail ---------------------

  test('Validierung: Ungültige E-Mail blockiert Submit', async ({ page }) => {
    const name = `E2E-Invalid-Email ${timestamp()}`
    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name, supplier_type: 'material', email: 'keine-at-zeichen' })

    const emailInput = page.locator('[data-testid="input-email"]')
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBe(false)

    await page.click('[data-testid="submit-supplier"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Validierung: Fehlender Typ ------------------------

  test('Validierung: Fehlender Lieferantentyp blockiert Submit', async ({ page }) => {
    const name = `E2E-Kein-Typ ${timestamp()}`
    await openNewSupplierDialog(page)
    await page.fill('[data-testid="input-name"]', name)
    // Typ NICHT auswählen
    await page.click('[data-testid="submit-supplier"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Bearbeiten + Wiederauslesen -----------------------

  test('Lieferant bearbeiten und alle Daten werden korrekt gespeichert und wiederausgelesen', async ({ page }) => {
    const ts = timestamp()
    const originalName = `E2E-Edit-Orig ${ts}`
    const updatedName = `E2E-Edit-Updated ${ts}`

    // Anlegen
    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name: originalName, supplier_type: 'material' })
    await page.click('[data-testid="submit-supplier"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Bearbeiten
    const row = page.locator('tr').filter({ hasText: originalName })
    await row.locator('[data-testid="btn-edit"]').click()
    await expect(page.locator('[data-testid="dialog-title"]')).toContainText('Lieferant bearbeiten')

    await page.fill('[data-testid="input-name"]', updatedName)
    await page.fill('[data-testid="input-phone"]', '+49 89 9999999')
    await page.fill('[data-testid="input-iban"]', 'DE89370400440532013000')
    await page.fill('[data-testid="input-bic"]', 'COBADEFFXXX')
    await page.fill('[data-testid="input-account-holder"]', 'Test GmbH')
    await page.click('[data-testid="submit-supplier"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Wiederauslesen über Detail-Dialog
    await openSupplierDetails(page, updatedName)
    await expect(page.locator('[data-testid="detail-name"]')).toContainText(updatedName)
    await expect(page.locator('[data-testid="detail-phone"]')).toContainText('+49 89 9999999')
    await expect(page.locator('[data-testid="detail-iban"]')).toContainText('DE89370400440532013000')
    await expect(page.locator('[data-testid="detail-bic"]')).toContainText('COBADEFFXXX')
    await expect(page.locator('[data-testid="detail-account-holder"]')).toContainText('Test GmbH')
  })

  // ---------- Status umschalten ---------------------------------

  test('Lieferant-Status sperren und entsperren', async ({ page }) => {
    const name = `E2E-Status ${timestamp()}`

    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name, supplier_type: 'service' })
    await page.click('[data-testid="submit-supplier"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('tr').filter({ hasText: name })

    // Sperren
    await row.locator('[data-testid="btn-toggle-status"]').click()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'gesperrt' })).toBeVisible({ timeout: 5000 })
    await expect(row.locator('[data-testid="supplier-status"]')).toContainText('Inaktiv')

    // Entsperren
    await row.locator('[data-testid="btn-toggle-status"]').click()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'entsperrt' })).toBeVisible({ timeout: 5000 })
    await expect(row.locator('[data-testid="supplier-status"]')).toContainText('Aktiv')
  })

  // ---------- Logische Validierungen ---------------------------

  test('Logisch: Supplier-Typ wird korrekt in DB gespeichert und zurückgegeben', async ({ page }) => {
    const ts = timestamp()
    const types: Array<{ type: 'material' | 'service' | 'both'; label: string }> = [
      { type: 'material', label: 'Material' },
      { type: 'service', label: 'Dienstleistung' },
      { type: 'both', label: 'Beides' },
    ]

    for (const { type, label } of types) {
      const name = `E2E-Typ-${type}-${ts}`
      await openNewSupplierDialog(page)
      await fillSupplierForm(page, { name, supplier_type: type })
      await page.click('[data-testid="submit-supplier"]')
      await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

      const row = page.locator('tr').filter({ hasText: name })
      await expect(row).toBeVisible()
      // Badge zeigt korrektes Label
      await expect(row.locator('[data-testid="supplier-type"]')).toContainText(label)
    }
  })

  test('Logisch: Neu angelegter Lieferant ist standardmäßig Aktiv', async ({ page }) => {
    const name = `E2E-AktivDefault ${timestamp()}`
    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name, supplier_type: 'material' })
    await page.click('[data-testid="submit-supplier"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('tr').filter({ hasText: name })
    await expect(row.locator('[data-testid="supplier-status"]')).toContainText('Aktiv')
  })

  test('Logisch: Reload behält Lieferanten-Daten (Persistenz)', async ({ page }) => {
    const name = `E2E-Persist ${timestamp()}`
    await openNewSupplierDialog(page)
    await fillSupplierForm(page, { name, supplier_type: 'material', notes: 'Persistenz-Test' })
    await page.click('[data-testid="submit-supplier"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Seite neu laden
    await page.reload()
    await page.waitForLoadState('networkidle')
    await showAllRows(page)

    // Lieferant ist noch da
    await expect(page.locator('tr').filter({ hasText: name })).toBeVisible({ timeout: 5000 })

    // Details prüfen
    await openSupplierDetails(page, name)
    await expect(page.locator('[data-testid="detail-notes"]')).toContainText('Persistenz-Test')
  })
})

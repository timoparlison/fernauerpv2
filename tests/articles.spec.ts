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

async function gotoArticles(page: Page) {
  await page.goto('/inventory/article-master')
  await page.waitForLoadState('networkidle')
}

async function openNewArticleDialog(page: Page) {
  await page.click('[data-testid="open-article-dialog"]')
  await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
}

async function fillArticleForm(page: Page, data: {
  article_name?: string
  article_type?: 'article' | 'testEquipment' | 'material' | 'tool'
  unit?: 'piece' | 'mm' | 'kg' | 'meter' | 'liter'
  additional_description?: string
  net_weight?: string
  material?: string
  country_of_origin?: string
  customs_tariff_number?: string
  drawing_number?: string
  drawing_revision?: string
  default_price?: string
  manufacturing_cost?: string
  warranty_months?: string
  supplier_article_number?: string
  tracking_mode?: 'serial' | 'batch' | 'none'
}) {
  if (data.article_type) {
    await page.locator('[data-testid="select-article-type"]').click()
    const typeLabels: Record<string, string> = {
      article: 'Artikel',
      testEquipment: 'Prüfmittel',
      material: 'Material',
      tool: 'Werkzeug',
    }
    await page.getByRole('option', { name: typeLabels[data.article_type] }).click()
  }
  if (data.article_name !== undefined) {
    await page.fill('[data-testid="input-article-name"]', data.article_name)
  }
  if (data.additional_description) {
    await page.fill('[data-testid="input-additional-description"]', data.additional_description)
  }
  if (data.unit) {
    await page.locator('[data-testid="select-unit"]').click()
    const unitLabels: Record<string, string> = {
      piece: 'Stück', mm: 'mm', kg: 'kg', meter: 'Meter', liter: 'Liter',
    }
    await page.getByRole('option', { name: unitLabels[data.unit] }).click()
  }
  if (data.net_weight) {
    await page.fill('[data-testid="input-net-weight"]', data.net_weight)
  }
  if (data.material) {
    await page.fill('[data-testid="input-material"]', data.material)
  }
  if (data.country_of_origin) {
    await page.locator('[data-testid="select-country"]').click()
    await page.getByRole('option', { name: data.country_of_origin }).click()
  }
  if (data.customs_tariff_number) {
    await page.fill('[data-testid="input-customs-tariff"]', data.customs_tariff_number)
  }
  if (data.drawing_number) {
    await page.fill('[data-testid="input-drawing-number"]', data.drawing_number)
  }
  if (data.drawing_revision) {
    await page.fill('[data-testid="input-drawing-revision"]', data.drawing_revision)
  }
  if (data.default_price) {
    await page.fill('[data-testid="input-default-price"]', data.default_price)
  }
  if (data.manufacturing_cost) {
    await page.fill('[data-testid="input-manufacturing-cost"]', data.manufacturing_cost)
  }
  if (data.warranty_months) {
    await page.fill('[data-testid="input-warranty-months"]', data.warranty_months)
  }
  if (data.supplier_article_number) {
    await page.fill('[data-testid="input-supplier-article-number"]', data.supplier_article_number)
  }
  if (data.tracking_mode) {
    await page.locator('[data-testid="select-tracking-mode"]').click()
    const trackingLabels: Record<string, string> = {
      serial: 'Seriennummer', batch: 'Charge', none: 'Keine',
    }
    await page.getByRole('option', { name: trackingLabels[data.tracking_mode] }).click()
  }
}

async function openArticleDetails(page: Page, name: string) {
  const row = page.locator('tr').filter({ hasText: name })
  await row.locator('[data-testid="btn-view"]').click()
  await expect(page.locator('[data-testid="article-details-dialog"]')).toBeVisible()
  await expect(page.locator('[data-testid="details-dialog-title"]')).toContainText(name)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Artikelstamm', () => {
  test.beforeEach(async ({ page }) => {
    if (!SUPABASE_URL || !TEST_EMAIL || !TEST_PASSWORD) {
      test.skip(true, 'Supabase-Credentials fehlen (.env nicht konfiguriert)')
    }
    await login(page)
    await gotoArticles(page)
  })

  // ---------- Seite lädt ----------------------------------------

  test('Artikelstamm-Seite lädt korrekt', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Artikelstamm' })).toBeVisible()
    await expect(page.locator('[data-testid="open-article-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-export"]')).toBeVisible()
  })

  // ---------- Anlegen: Pflichtfelder ----------------------------

  test('Neuen Artikel mit Pflichtfeldern anlegen', async ({ page }) => {
    const name = `E2E-Test Artikel ${timestamp()}`

    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'article' })
    await page.click('[data-testid="submit-article"]')

    // Erfolgs-Toast
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Dialog geschlossen
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Artikel in Tabelle sichtbar
    await expect(page.locator('tr').filter({ hasText: name })).toBeVisible({ timeout: 5000 })
  })

  // ---------- Anlegen: Alle Felder + Daten werden gespeichert ---

  test('Neuen Artikel mit allen Feldern anlegen und Daten werden gespeichert', async ({ page }) => {
    const ts = timestamp()
    const articleData = {
      article_name: `E2E-Test Vollständig ${ts}`,
      article_type: 'material' as const,
      unit: 'kg' as const,
      additional_description: `Testbeschreibung ${ts}`,
      net_weight: '150.5',
      material: 'Aluminium',
      country_of_origin: 'Deutschland',
      customs_tariff_number: '7604291090',
      drawing_number: `ZNR-${ts}`,
      drawing_revision: 'Rev. B',
      default_price: '12.50',
      manufacturing_cost: '8.75',
      warranty_months: '24',
      supplier_article_number: `SA-${ts}`,
      tracking_mode: 'batch' as const,
    }

    await openNewArticleDialog(page)
    await fillArticleForm(page, articleData)
    await page.click('[data-testid="submit-article"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Details öffnen und alle Felder prüfen
    await openArticleDetails(page, articleData.article_name)

    await expect(page.locator('[data-testid="detail-article-name"]')).toContainText(articleData.article_name)
    await expect(page.locator('[data-testid="detail-article-type"]')).toContainText('Material')
    await expect(page.locator('[data-testid="detail-unit"]')).toContainText('kg')
    await expect(page.locator('[data-testid="detail-additional-description"]')).toContainText(articleData.additional_description)
    await expect(page.locator('[data-testid="detail-net-weight"]')).toContainText('150.5')
    await expect(page.locator('[data-testid="detail-material"]')).toContainText('Aluminium')
    await expect(page.locator('[data-testid="detail-country"]')).toContainText('Deutschland')
    await expect(page.locator('[data-testid="detail-customs-tariff"]')).toContainText('7604291090')
    await expect(page.locator('[data-testid="detail-drawing-number"]')).toContainText(articleData.drawing_number)
    await expect(page.locator('[data-testid="detail-drawing-revision"]')).toContainText('Rev. B')
    await expect(page.locator('[data-testid="detail-default-price"]')).toContainText('12.50')
    await expect(page.locator('[data-testid="detail-manufacturing-cost"]')).toContainText('8.75')
    await expect(page.locator('[data-testid="detail-warranty-months"]')).toContainText('24')
    await expect(page.locator('[data-testid="detail-supplier-article-number"]')).toContainText(articleData.supplier_article_number)
    await expect(page.locator('[data-testid="detail-tracking-mode"]')).toContainText('Charge')
  })

  // ---------- Anlegen: Material-Artikel -------------------------

  test('Material-Artikel anlegen', async ({ page }) => {
    const name = `E2E-Material ${timestamp()}`
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'material', unit: 'kg' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Badge zeigt "Material" und Artikelnummer beginnt mit M-
    const row = page.locator('tr').filter({ hasText: name })
    await expect(row.locator('[data-testid="article-type"]')).toContainText('Material')
    await expect(row.locator('[data-testid="article-number"]')).toContainText('M-')
  })

  // ---------- Anlegen: Prüfmittel-Artikel -----------------------

  test('Prüfmittel-Artikel anlegen', async ({ page }) => {
    const name = `E2E-Prüfmittel ${timestamp()}`
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'testEquipment' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('tr').filter({ hasText: name })
    await expect(row.locator('[data-testid="article-type"]')).toContainText('Prüfmittel')
    await expect(row.locator('[data-testid="article-number"]')).toContainText('P-')
  })

  // ---------- Anlegen: Werkzeug-Artikel -------------------------

  test('Werkzeug-Artikel anlegen', async ({ page }) => {
    const name = `E2E-Werkzeug ${timestamp()}`
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'tool' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('tr').filter({ hasText: name })
    await expect(row.locator('[data-testid="article-type"]')).toContainText('Werkzeug')
    await expect(row.locator('[data-testid="article-number"]')).toContainText('W-')
  })

  // ---------- Validierung: Leerer Name --------------------------

  test('Validierung: Leere Artikelbezeichnung blockiert Submit', async ({ page }) => {
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: '', article_type: 'article' })

    const nameInput = page.locator('[data-testid="input-article-name"]')
    const isRequired = await nameInput.evaluate((el: HTMLInputElement) => el.required)
    expect(isRequired).toBe(true)

    await page.click('[data-testid="submit-article"]')
    // Dialog bleibt offen
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    // Kein Toast
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Validierung: Fehlender Typ ------------------------

  test('Validierung: Fehlender Artikeltyp blockiert Submit', async ({ page }) => {
    const name = `E2E-Kein-Typ ${timestamp()}`
    await openNewArticleDialog(page)
    await page.fill('[data-testid="input-article-name"]', name)
    // Typ NICHT auswählen
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-testid="dialog-title"]')).toBeVisible()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).not.toBeVisible({ timeout: 2000 })
  })

  // ---------- Bearbeiten + Wiederauslesen -----------------------

  test('Artikel bearbeiten und Daten werden korrekt gespeichert und wiederausgelesen', async ({ page }) => {
    const ts = timestamp()
    const originalName = `E2E-Edit-Orig ${ts}`
    const updatedName = `E2E-Edit-Updated ${ts}`

    // Anlegen
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: originalName, article_type: 'article' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Bearbeiten
    const row = page.locator('tr').filter({ hasText: originalName })
    await row.locator('[data-testid="btn-edit"]').click()
    await expect(page.locator('[data-testid="dialog-title"]')).toContainText('Artikel bearbeiten')

    await page.fill('[data-testid="input-article-name"]', updatedName)
    await page.fill('[data-testid="input-drawing-number"]', 'ZNR-UPDATE-001')
    await page.fill('[data-testid="input-default-price"]', '99.99')
    await page.click('[data-testid="submit-article"]')

    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="dialog-title"]')).not.toBeVisible()

    // Wiederauslesen über Detail-Dialog
    await openArticleDetails(page, updatedName)
    await expect(page.locator('[data-testid="detail-article-name"]')).toContainText(updatedName)
    await expect(page.locator('[data-testid="detail-drawing-number"]')).toContainText('ZNR-UPDATE-001')
    await expect(page.locator('[data-testid="detail-default-price"]')).toContainText('99.99')
  })

  // ---------- Status umschalten ---------------------------------

  test('Artikel-Status deaktivieren und aktivieren', async ({ page }) => {
    const name = `E2E-Status ${timestamp()}`

    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'article' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('tr').filter({ hasText: name })

    // Deaktivieren
    await row.locator('[data-testid="btn-toggle-status"]').click()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'deaktiviert' })).toBeVisible({ timeout: 5000 })
    await expect(row.locator('[data-testid="article-status"]')).toContainText('Inaktiv')

    // Aktivieren
    await row.locator('[data-testid="btn-toggle-status"]').click()
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'aktiviert' })).toBeVisible({ timeout: 5000 })
    await expect(row.locator('[data-testid="article-status"]')).toContainText('Aktiv')
  })

  // ---------- Logische Validierungen ---------------------------

  test('Logisch: Artikeltypen werden korrekt mit Prefixen erstellt', async ({ page }) => {
    const ts = timestamp()
    const types: Array<{ type: 'article' | 'testEquipment' | 'material' | 'tool'; label: string; prefix: string }> = [
      { type: 'article', label: 'Artikel', prefix: 'A-' },
      { type: 'testEquipment', label: 'Prüfmittel', prefix: 'P-' },
      { type: 'material', label: 'Material', prefix: 'M-' },
      { type: 'tool', label: 'Werkzeug', prefix: 'W-' },
    ]

    for (const { type, label, prefix } of types) {
      const name = `E2E-Typ-${type}-${ts}`
      await openNewArticleDialog(page)
      await fillArticleForm(page, { article_name: name, article_type: type })
      await page.click('[data-testid="submit-article"]')
      await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

      const row = page.locator('tr').filter({ hasText: name })
      await expect(row).toBeVisible()
      await expect(row.locator('[data-testid="article-type"]')).toContainText(label)
      await expect(row.locator('[data-testid="article-number"]')).toContainText(prefix)
    }
  })

  test('Logisch: Neu angelegter Artikel ist standardmäßig Aktiv', async ({ page }) => {
    const name = `E2E-AktivDefault ${timestamp()}`
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'article' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    const row = page.locator('tr').filter({ hasText: name })
    await expect(row.locator('[data-testid="article-status"]')).toContainText('Aktiv')
  })

  test('Logisch: Reload behält Artikel-Daten (Persistenz)', async ({ page }) => {
    const name = `E2E-Persist ${timestamp()}`
    await openNewArticleDialog(page)
    await fillArticleForm(page, {
      article_name: name,
      article_type: 'article',
      drawing_number: 'ZNR-PERSIST-001',
      default_price: '42.50',
    })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    // Seite neu laden
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Artikel ist noch da
    await expect(page.locator('tr').filter({ hasText: name })).toBeVisible({ timeout: 5000 })

    // Details prüfen
    await openArticleDetails(page, name)
    await expect(page.locator('[data-testid="detail-drawing-number"]')).toContainText('ZNR-PERSIST-001')
    await expect(page.locator('[data-testid="detail-default-price"]')).toContainText('42.50')
  })

  // ---------- Einheiten-Test ------------------------------------

  test('Logisch: Verschiedene Einheiten werden korrekt gespeichert', async ({ page }) => {
    const ts = timestamp()
    const name = `E2E-Einheit-kg ${ts}`
    await openNewArticleDialog(page)
    await fillArticleForm(page, { article_name: name, article_type: 'material', unit: 'kg' })
    await page.click('[data-testid="submit-article"]')
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'erfolgreich' })).toBeVisible({ timeout: 10000 })

    await openArticleDetails(page, name)
    await expect(page.locator('[data-testid="detail-unit"]')).toContainText('kg')
  })
})

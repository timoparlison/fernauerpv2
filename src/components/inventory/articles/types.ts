export type ArticleType = 'article' | 'testEquipment' | 'material' | 'tool'
export type ArticleUnit = 'piece' | 'mm' | 'kg' | 'meter' | 'liter'
export type TrackingMode = 'serial' | 'batch' | 'none'

export interface Article {
  id: string
  article_number: string
  article_type: ArticleType
  article_name: string
  additional_description: string | null
  unit: ArticleUnit
  net_weight: number | null
  material: string | null
  country_of_origin: string | null
  customs_tariff_number: string | null
  drawing_number: string | null
  drawing_revision: string | null
  drawing_file_path: string | null
  drawing_file_name: string | null
  customer_qr_code_path: string | null
  default_price: number | null
  manufacturing_cost: number | null
  default_warranty_months: number | null
  purchase_account: string | null
  supplier_id: string | null
  supplier_article_number: string | null
  raw_material_id: string | null
  raw_material_quantity: number | null
  requires_calibration: boolean | null
  requires_certificate: boolean | null
  requires_expiry_tracking: boolean | null
  requires_incoming_inspection: boolean | null
  tracking_mode: TrackingMode | null
  vision_inspection_enabled: boolean | null
  version: number
  active: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ArticleFormData {
  article_type: ArticleType
  article_name: string
  additional_description?: string | null
  unit: ArticleUnit
  net_weight?: number | null
  material?: string | null
  country_of_origin?: string | null
  customs_tariff_number?: string | null
  drawing_number?: string | null
  drawing_revision?: string | null
  default_price?: number | null
  manufacturing_cost?: number | null
  default_warranty_months?: number | null
  supplier_article_number?: string | null
  tracking_mode?: TrackingMode | null
  requires_calibration?: boolean | null
  requires_certificate?: boolean | null
  requires_expiry_tracking?: boolean | null
  requires_incoming_inspection?: boolean | null
}

// Article type prefixes for auto-numbering
export const articleTypePrefixes: Record<ArticleType, string> = {
  article: 'A',
  testEquipment: 'P',
  material: 'M',
  tool: 'W',
}

// German labels
export const articleTypeLabels: Record<ArticleType, string> = {
  article: 'Artikel',
  testEquipment: 'Prüfmittel',
  material: 'Material',
  tool: 'Werkzeug',
}

export const articleUnitLabels: Record<ArticleUnit, string> = {
  piece: 'Stück',
  mm: 'mm',
  kg: 'kg',
  meter: 'Meter',
  liter: 'Liter',
}

export const trackingModeLabels: Record<TrackingMode, string> = {
  serial: 'Seriennummer',
  batch: 'Charge',
  none: 'Keine',
}

export function getArticleTypeLabel(type: ArticleType): string {
  return articleTypeLabels[type] || type
}

export function getArticleUnitLabel(unit: ArticleUnit): string {
  return articleUnitLabels[unit] || unit
}

export function getTrackingModeLabel(mode: TrackingMode): string {
  return trackingModeLabels[mode] || mode
}

export function parseArticleTypeFromImport(value: string): ArticleType {
  const normalized = value.toLowerCase()
  if (normalized.includes('prüf') || normalized === 'testequipment') return 'testEquipment'
  if (normalized.includes('material') || normalized === 'material') return 'material'
  if (normalized.includes('werkzeug') || normalized === 'tool') return 'tool'
  return 'article'
}

export function parseArticleUnitFromImport(value: string): ArticleUnit {
  const normalized = value.toLowerCase()
  if (normalized === 'mm') return 'mm'
  if (normalized === 'kg') return 'kg'
  if (normalized.includes('meter') || normalized === 'm') return 'meter'
  if (normalized.includes('liter') || normalized === 'l') return 'liter'
  return 'piece'
}

// European countries for country_of_origin
export const europeanCountries = [
  'Belgien', 'Bulgarien', 'Dänemark', 'Deutschland', 'Estland',
  'Finnland', 'Frankreich', 'Griechenland', 'Irland', 'Italien',
  'Kroatien', 'Lettland', 'Litauen', 'Luxemburg', 'Malta',
  'Niederlande', 'Norwegen', 'Österreich', 'Polen', 'Portugal',
  'Rumänien', 'Schweden', 'Schweiz', 'Slowakei', 'Slowenien',
  'Spanien', 'Tschechien', 'Ungarn', 'Zypern',
]

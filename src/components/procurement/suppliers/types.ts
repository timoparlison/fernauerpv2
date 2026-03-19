export interface Supplier {
  id: string
  supplier_number?: string
  name: string
  supplier_type: 'material' | 'service' | 'both'
  contact_person?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  billing_address?: string | null
  delivery_address?: string | null
  payment_terms?: string | null
  delivery_terms?: string | null
  customer_number_at_supplier?: string | null
  vat_id?: string | null
  iban?: string | null
  bic?: string | null
  bank_name?: string | null
  account_holder?: string | null
  payment_reference?: string | null
  payment_purpose?: string | null
  notes?: string | null
  average_lead_time_days?: number | null
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface SupplierFormData {
  name: string
  supplier_type: 'material' | 'service' | 'both'
  contact_person?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  billing_address?: string | null
  delivery_address?: string | null
  payment_terms?: string | null
  delivery_terms?: string | null
  customer_number_at_supplier?: string | null
  vat_id?: string | null
  iban?: string | null
  bic?: string | null
  bank_name?: string | null
  account_holder?: string | null
  payment_reference?: string | null
  payment_purpose?: string | null
  notes?: string | null
  active?: boolean
}

export interface SupplierContact {
  id: string
  supplier_id: string
  contact_person: string
  phone: string | null
  email: string | null
  birthday: string | null
  availability: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SupplierDocument {
  id: string
  supplier_id: string
  document_name: string
  document_type: string
  file_path: string
  notes: string | null
  created_at: string
}

export function getSupplierTypeLabel(type: Supplier['supplier_type']): string {
  switch (type) {
    case 'material': return 'Material'
    case 'service': return 'Dienstleistung'
    case 'both': return 'Beides'
    default: return type
  }
}

export function parseSupplierTypeFromImport(value: string): Supplier['supplier_type'] {
  const normalized = value.toLowerCase()
  if (normalized.includes('dienst') || normalized === 'service') return 'service'
  if (normalized.includes('beides') || normalized === 'both') return 'both'
  return 'material'
}

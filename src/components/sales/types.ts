export type CustomerType = 'retail' | 'wholesale' | 'service' | 'other'

export interface Customer {
  id: string
  customer_number: string | null
  name: string
  customer_type: CustomerType
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  billing_address: string | null
  delivery_address: string | null
  payment_terms: string | null
  delivery_terms: string | null
  delivery_days: string | null
  vat_id: string | null
  our_supplier_number_at_customer: string | null
  default_discount_percent: number | null
  iban: string | null
  bic: string | null
  account_holder: string | null
  payment_reference: string | null
  payment_purpose: string | null
  invoice_email_1: string | null
  invoice_email_2: string | null
  invoice_email_3: string | null
  notes: string | null
  active: boolean
  blocked: boolean
  block_reason: string | null
  created_at: string
  updated_at: string
}

export interface CustomerFormData {
  name: string
  customer_type: CustomerType
  customer_number?: string | null
  contact_person?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  billing_address?: string | null
  delivery_address?: string | null
  payment_terms?: string | null
  delivery_terms?: string | null
  delivery_days?: string | null
  vat_id?: string | null
  our_supplier_number_at_customer?: string | null
  default_discount_percent?: number | null
  iban?: string | null
  bic?: string | null
  account_holder?: string | null
  payment_reference?: string | null
  payment_purpose?: string | null
  invoice_email_1?: string | null
  invoice_email_2?: string | null
  invoice_email_3?: string | null
  notes?: string | null
}

export interface CustomerContact {
  id: string
  customer_id: string
  contact_person: string
  phone: string | null
  email: string | null
  birthday: string | null
  availability: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export function getCustomerTypeLabel(type: CustomerType): string {
  const labels: Record<CustomerType, string> = {
    retail: 'Einzelhandel',
    wholesale: 'Großhandel',
    service: 'Dienstleistung',
    other: 'Sonstige',
  }
  return labels[type] ?? type
}

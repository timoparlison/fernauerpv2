/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client'
import type { Supplier, SupplierFormData, SupplierContact, SupplierDocument } from '@/components/procurement/suppliers/types'

const SUPPLIER_FIELDS =
  'id, supplier_number, name, supplier_type, contact_person, email, phone, address, billing_address, delivery_address, payment_terms, delivery_terms, customer_number_at_supplier, vat_id, iban, bic, bank_name, account_holder, payment_reference, payment_purpose, notes, average_lead_time_days, active, created_at, updated_at'

const CONTACT_FIELDS = 'id, supplier_id, contact_person, phone, email, birthday, availability, notes, created_at, updated_at'

const DOCUMENT_FIELDS = 'id, supplier_id, document_name, document_type, file_path, notes, created_at'

const db = supabase as any

// ---------------------------------------------------------------------------
// Suppliers
// ---------------------------------------------------------------------------

export async function fetchSuppliers(): Promise<Supplier[]> {
  const { data, error } = await db
    .from('suppliers')
    .select(SUPPLIER_FIELDS)
    .is('deleted_at', null)
    .order('name')
  if (error) throw error
  return (data ?? []) as Supplier[]
}

export async function createSupplier(supplierData: SupplierFormData): Promise<Supplier> {
  const { data, error } = await db
    .from('suppliers')
    .insert([{ ...supplierData, active: true }])
    .select(SUPPLIER_FIELDS)
    .single()
  if (error) throw error
  return data as Supplier
}

export async function updateSupplier(
  id: string,
  updates: Partial<SupplierFormData> & { active?: boolean }
): Promise<Supplier> {
  const { data, error } = await db
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select(SUPPLIER_FIELDS)
    .single()
  if (error) throw error
  return data as Supplier
}

export async function toggleSupplierStatus(id: string, active: boolean): Promise<Supplier> {
  const { data, error } = await db
    .from('suppliers')
    .update({ active })
    .eq('id', id)
    .select(SUPPLIER_FIELDS)
    .single()
  if (error) throw error
  return data as Supplier
}

export async function importSuppliersBatch(batch: Record<string, unknown>[]): Promise<void> {
  const { error } = await db.from('suppliers').insert(batch)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Supplier Contacts
// ---------------------------------------------------------------------------

export async function fetchSupplierContacts(supplierId: string): Promise<SupplierContact[]> {
  const { data, error } = await db
    .from('supplier_contacts')
    .select(CONTACT_FIELDS)
    .eq('supplier_id', supplierId)
    .order('contact_person')
  if (error) throw error
  return (data ?? []) as SupplierContact[]
}

export async function createSupplierContact(supplierId: string, contactData: Record<string, unknown>): Promise<SupplierContact> {
  const { data, error } = await db
    .from('supplier_contacts')
    .insert([{ ...contactData, supplier_id: supplierId }])
    .select(CONTACT_FIELDS)
    .single()
  if (error) throw error
  return data as SupplierContact
}

export async function updateSupplierContact(id: string, updates: Record<string, unknown>): Promise<SupplierContact> {
  const { data, error } = await db
    .from('supplier_contacts')
    .update(updates)
    .eq('id', id)
    .select(CONTACT_FIELDS)
    .single()
  if (error) throw error
  return data as SupplierContact
}

export async function deleteSupplierContact(id: string): Promise<void> {
  const { error } = await db
    .from('supplier_contacts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Supplier Documents
// ---------------------------------------------------------------------------

export async function fetchSupplierDocuments(supplierId: string): Promise<SupplierDocument[]> {
  const { data, error } = await db
    .from('supplier_documents')
    .select(DOCUMENT_FIELDS)
    .eq('supplier_id', supplierId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as SupplierDocument[]
}

export async function uploadSupplierDocument(
  supplierId: string,
  file: File,
  documentType: string,
  notes?: string
): Promise<SupplierDocument> {
  const filePath = `${supplierId}/${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('supplier-documents')
    .upload(filePath, file)
  if (uploadError) throw uploadError

  const { data, error } = await db
    .from('supplier_documents')
    .insert([{
      supplier_id: supplierId,
      document_name: file.name,
      document_type: documentType,
      file_path: filePath,
      notes: notes || null,
    }])
    .select(DOCUMENT_FIELDS)
    .single()
  if (error) throw error
  return data as SupplierDocument
}

export async function deleteSupplierDocument(id: string, filePath: string): Promise<void> {
  await supabase.storage.from('supplier-documents').remove([filePath])
  const { error } = await db
    .from('supplier_documents')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export function getSupplierDocumentUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('supplier-documents')
    .getPublicUrl(filePath)
  return data.publicUrl
}

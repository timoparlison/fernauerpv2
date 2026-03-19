/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client'
import type { Supplier, SupplierFormData } from '@/components/procurement/suppliers/types'

const SUPPLIER_FIELDS =
  'id, supplier_number, name, supplier_type, contact_person, email, phone, address, delivery_address, payment_terms, delivery_terms, customer_number_at_supplier, vat_id, iban, bic, account_holder, payment_reference, payment_purpose, notes, active, created_at, updated_at'

const db = supabase as any

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

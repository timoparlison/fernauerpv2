/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client'
import type { Customer, CustomerContact, CustomerFormData } from '@/components/sales/types'

const CUSTOMER_FIELDS =
  'id, customer_number, name, customer_type, contact_person, email, phone, address, billing_address, delivery_address, payment_terms, delivery_terms, delivery_days, vat_id, our_supplier_number_at_customer, default_discount_percent, iban, bic, account_holder, payment_reference, payment_purpose, invoice_email_1, invoice_email_2, invoice_email_3, notes, active, blocked, block_reason, created_at, updated_at'

const db = supabase as any

export async function fetchCustomers(searchTerm?: string): Promise<Customer[]> {
  let query = db
    .from('customers')
    .select(CUSTOMER_FIELDS)
    .is('deleted_at', null)
    .order('name')
    .limit(200)

  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,customer_number.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Customer[]
}

export async function createCustomer(customerData: CustomerFormData): Promise<Customer> {
  const { data, error } = await db
    .from('customers')
    .insert([{ ...customerData, active: true, blocked: false }])
    .select(CUSTOMER_FIELDS)
    .single()
  if (error) throw error
  return data as Customer
}

export async function updateCustomer(
  id: string,
  updates: Partial<CustomerFormData> & { active?: boolean; blocked?: boolean; block_reason?: string | null }
): Promise<Customer> {
  const { data, error } = await db
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select(CUSTOMER_FIELDS)
    .single()
  if (error) throw error
  return data as Customer
}

export async function toggleCustomerStatus(id: string, active: boolean): Promise<Customer> {
  const { data, error } = await db
    .from('customers')
    .update({ active })
    .eq('id', id)
    .select(CUSTOMER_FIELDS)
    .single()
  if (error) throw error
  return data as Customer
}

export async function importCustomersBatch(batch: Record<string, unknown>[]): Promise<void> {
  const { error } = await db.from('customers').insert(batch)
  if (error) throw error
}

// Customer Contacts
const CONTACT_FIELDS = 'id, customer_id, contact_person, phone, email, birthday, availability, notes, created_at, updated_at'

export async function fetchCustomerContacts(customerId: string): Promise<CustomerContact[]> {
  const { data, error } = await db
    .from('customer_contacts')
    .select(CONTACT_FIELDS)
    .eq('customer_id', customerId)
    .order('contact_person')
  if (error) throw error
  return (data ?? []) as CustomerContact[]
}

export async function createCustomerContact(customerId: string, contactData: Record<string, unknown>): Promise<CustomerContact> {
  const { data, error } = await db
    .from('customer_contacts')
    .insert([{ ...contactData, customer_id: customerId }])
    .select(CONTACT_FIELDS)
    .single()
  if (error) throw error
  return data as CustomerContact
}

export async function updateCustomerContact(id: string, updates: Record<string, unknown>): Promise<CustomerContact> {
  const { data, error } = await db
    .from('customer_contacts')
    .update(updates)
    .eq('id', id)
    .select(CONTACT_FIELDS)
    .single()
  if (error) throw error
  return data as CustomerContact
}

export async function deleteCustomerContact(id: string): Promise<void> {
  const { error } = await db
    .from('customer_contacts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

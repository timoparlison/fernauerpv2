/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client'
import type { Employee, EmployeeAbsence } from '@/components/hr/types'

const EMPLOYEE_FIELDS =
  'id, employee_number, first_name, last_name, position, employment_type, birth_date, entry_date, vacation_days_per_year, contact_phone, mobile_phone, contact_email, emergency_contact_name, emergency_contact_phone, address, iban, bic, account_holder, monthly_gross_salary, hourly_rate, status, time_tracking_enabled, flextime_enabled, bde_terminal_enabled, weekly_hours, time_account_hours, remaining_vacation_days, user_id, created_at, updated_at'

const db = supabase as any

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await db
    .from('employees')
    .select(EMPLOYEE_FIELDS)
    .is('deleted_at', null)
    .order('last_name')
    .limit(500)
  if (error) throw error
  return (data ?? []) as Employee[]
}

export async function createEmployee(employeeData: Record<string, unknown>): Promise<Employee> {
  const { data, error } = await db
    .from('employees')
    .insert([{ ...employeeData, status: 'active' }])
    .select(EMPLOYEE_FIELDS)
    .single()
  if (error) throw error
  return data as Employee
}

export async function updateEmployee(id: string, updates: Record<string, unknown>): Promise<Employee> {
  const { data, error } = await db
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select(EMPLOYEE_FIELDS)
    .single()
  if (error) throw error
  return data as Employee
}

// Absences
const ABSENCE_FIELDS = 'id, employee_id, absence_type, start_date, end_date, days_count, notes, created_at'

export async function fetchEmployeeAbsences(employeeId: string): Promise<EmployeeAbsence[]> {
  const { data, error } = await db
    .from('employee_absences')
    .select(ABSENCE_FIELDS)
    .eq('employee_id', employeeId)
    .order('start_date', { ascending: false })
  if (error) throw error
  return (data ?? []) as EmployeeAbsence[]
}

export async function createEmployeeAbsence(absenceData: Record<string, unknown>): Promise<EmployeeAbsence> {
  const { data, error } = await db
    .from('employee_absences')
    .insert([absenceData])
    .select(ABSENCE_FIELDS)
    .single()
  if (error) throw error
  return data as EmployeeAbsence
}

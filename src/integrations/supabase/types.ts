export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Relationships: []
        Row: {
          id: string
          employee_number: string
          first_name: string
          last_name: string
          position: string | null
          employment_type: 'fulltime' | 'parttime' | 'minijob' | null
          birth_date: string | null
          entry_date: string | null
          vacation_days_per_year: number | null
          contact_phone: string | null
          mobile_phone: string | null
          contact_email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          address: string | null
          iban: string | null
          bic: string | null
          account_holder: string | null
          monthly_gross_salary: number | null
          hourly_rate: number | null
          status: string
          time_tracking_enabled: boolean | null
          flextime_enabled: boolean | null
          bde_terminal_enabled: boolean | null
          weekly_hours: Record<string, number> | null
          time_account_hours: number | null
          remaining_vacation_days: number | null
          user_id: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_number: string
          first_name: string
          last_name: string
          position?: string | null
          employment_type?: 'fulltime' | 'parttime' | 'minijob' | null
          birth_date?: string | null
          entry_date?: string | null
          vacation_days_per_year?: number | null
          contact_phone?: string | null
          mobile_phone?: string | null
          contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          address?: string | null
          iban?: string | null
          bic?: string | null
          account_holder?: string | null
          monthly_gross_salary?: number | null
          hourly_rate?: number | null
          status?: string
          time_tracking_enabled?: boolean | null
          flextime_enabled?: boolean | null
          bde_terminal_enabled?: boolean | null
          weekly_hours?: Record<string, number> | null
          user_id?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_number?: string
          first_name?: string
          last_name?: string
          position?: string | null
          employment_type?: 'fulltime' | 'parttime' | 'minijob' | null
          birth_date?: string | null
          entry_date?: string | null
          vacation_days_per_year?: number | null
          contact_phone?: string | null
          mobile_phone?: string | null
          contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          address?: string | null
          iban?: string | null
          bic?: string | null
          account_holder?: string | null
          monthly_gross_salary?: number | null
          hourly_rate?: number | null
          status?: string
          time_tracking_enabled?: boolean | null
          flextime_enabled?: boolean | null
          bde_terminal_enabled?: boolean | null
          weekly_hours?: Record<string, number> | null
          user_id?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employee_absences: {
        Relationships: []
        Row: {
          id: string
          employee_id: string
          absence_type: string
          start_date: string
          end_date: string
          days_count: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          absence_type: string
          start_date: string
          end_date: string
          days_count?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          absence_type?: string
          start_date?: string
          end_date?: string
          days_count?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      bde_sessions: {
        Row: {
          id: string
          employee_id: string
          workstation_id: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          workstation_id: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          workstation_id?: string
          is_active?: boolean
          created_at?: string
        }
      }
      workstations: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      suppliers: {
        Relationships: []
        Row: {
          id: string
          supplier_number: string | null
          name: string
          supplier_type: 'material' | 'service' | 'both'
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          delivery_address: string | null
          payment_terms: string | null
          delivery_terms: string | null
          customer_number_at_supplier: string | null
          vat_id: string | null
          iban: string | null
          bic: string | null
          account_holder: string | null
          payment_reference: string | null
          payment_purpose: string | null
          notes: string | null
          active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_number?: string | null
          name: string
          supplier_type: 'material' | 'service' | 'both'
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          delivery_address?: string | null
          payment_terms?: string | null
          delivery_terms?: string | null
          customer_number_at_supplier?: string | null
          vat_id?: string | null
          iban?: string | null
          bic?: string | null
          account_holder?: string | null
          payment_reference?: string | null
          payment_purpose?: string | null
          notes?: string | null
          active?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_number?: string | null
          name?: string
          supplier_type?: 'material' | 'service' | 'both'
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          delivery_address?: string | null
          payment_terms?: string | null
          delivery_terms?: string | null
          customer_number_at_supplier?: string | null
          vat_id?: string | null
          iban?: string | null
          bic?: string | null
          account_holder?: string | null
          payment_reference?: string | null
          payment_purpose?: string | null
          notes?: string | null
          active?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Relationships: []
        Row: {
          id: string
          customer_number: string | null
          name: string
          customer_type: 'retail' | 'wholesale' | 'service' | 'other'
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
          credit_limit: number | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_number?: string | null
          name: string
          customer_type: 'retail' | 'wholesale' | 'service' | 'other'
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
          active?: boolean
          blocked?: boolean
          block_reason?: string | null
          credit_limit?: number | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_number?: string | null
          name?: string
          customer_type?: 'retail' | 'wholesale' | 'service' | 'other'
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
          active?: boolean
          blocked?: boolean
          block_reason?: string | null
          credit_limit?: number | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_contacts: {
        Relationships: []
        Row: {
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
        Insert: {
          id?: string
          customer_id: string
          contact_person: string
          phone?: string | null
          email?: string | null
          birthday?: string | null
          availability?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          contact_person?: string
          phone?: string | null
          email?: string | null
          birthday?: string | null
          availability?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

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
          billing_address: string | null
          delivery_address: string | null
          payment_terms: string | null
          delivery_terms: string | null
          customer_number_at_supplier: string | null
          vat_id: string | null
          iban: string | null
          bic: string | null
          bank_name: string | null
          account_holder: string | null
          payment_reference: string | null
          payment_purpose: string | null
          notes: string | null
          average_lead_time_days: number | null
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
      articles: {
        Relationships: []
        Row: {
          id: string
          article_number: string
          article_type: string
          article_name: string
          additional_description: string | null
          unit: string
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
          price_breaks: Json | null
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
          tracking_mode: string | null
          vision_inspection_enabled: boolean | null
          vision_inspection_criteria: Json | null
          version: number
          active: boolean
          organization_id: string | null
          deleted_at: string | null
          deletion_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_number: string
          article_type: string
          article_name: string
          additional_description?: string | null
          unit: string
          net_weight?: number | null
          material?: string | null
          country_of_origin?: string | null
          customs_tariff_number?: string | null
          drawing_number?: string | null
          drawing_revision?: string | null
          drawing_file_path?: string | null
          drawing_file_name?: string | null
          customer_qr_code_path?: string | null
          default_price?: number | null
          manufacturing_cost?: number | null
          price_breaks?: Json | null
          default_warranty_months?: number | null
          purchase_account?: string | null
          supplier_id?: string | null
          supplier_article_number?: string | null
          raw_material_id?: string | null
          raw_material_quantity?: number | null
          requires_calibration?: boolean | null
          requires_certificate?: boolean | null
          requires_expiry_tracking?: boolean | null
          requires_incoming_inspection?: boolean | null
          tracking_mode?: string | null
          vision_inspection_enabled?: boolean | null
          vision_inspection_criteria?: Json | null
          version?: number
          active?: boolean
          organization_id?: string | null
          deleted_at?: string | null
          deletion_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_number?: string
          article_type?: string
          article_name?: string
          additional_description?: string | null
          unit?: string
          net_weight?: number | null
          material?: string | null
          country_of_origin?: string | null
          customs_tariff_number?: string | null
          drawing_number?: string | null
          drawing_revision?: string | null
          drawing_file_path?: string | null
          drawing_file_name?: string | null
          customer_qr_code_path?: string | null
          default_price?: number | null
          manufacturing_cost?: number | null
          price_breaks?: Json | null
          default_warranty_months?: number | null
          purchase_account?: string | null
          supplier_id?: string | null
          supplier_article_number?: string | null
          raw_material_id?: string | null
          raw_material_quantity?: number | null
          requires_calibration?: boolean | null
          requires_certificate?: boolean | null
          requires_expiry_tracking?: boolean | null
          requires_incoming_inspection?: boolean | null
          tracking_mode?: string | null
          vision_inspection_enabled?: boolean | null
          vision_inspection_criteria?: Json | null
          version?: number
          active?: boolean
          organization_id?: string | null
          deleted_at?: string | null
          deletion_reason?: string | null
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

-- ============================================================
-- Fernau-ERP v2 — Initial Schema
-- ============================================================

-- --------------------------------------------------------
-- Helper: update updated_at on every row update
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_number     TEXT UNIQUE,
  name                TEXT NOT NULL,
  customer_type       TEXT NOT NULL DEFAULT 'einzelhandel',  -- einzelhandel | grosshandel | industrie | dienstleister
  active              BOOLEAN NOT NULL DEFAULT true,
  address             TEXT,
  billing_address     TEXT,
  delivery_address    TEXT,
  contact_person      TEXT,
  phone               TEXT,
  email               TEXT,
  invoice_email_1     TEXT,
  invoice_email_2     TEXT,
  invoice_email_3     TEXT,
  vat_id              TEXT,
  payment_terms       TEXT,
  delivery_terms      TEXT,
  iban                TEXT,
  bic                 TEXT,
  account_holder      TEXT,
  payment_reference   TEXT,
  payment_purpose     TEXT,
  notes               TEXT,
  deleted_at          TIMESTAMP WITH TIME ZONE,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on customers"
  ON public.customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------------------
-- CUSTOMER CONTACTS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  contact_person  TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  birthday        DATE,
  availability    TEXT,
  notes           TEXT,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on customer_contacts"
  ON public.customer_contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER trg_customer_contacts_updated_at
  BEFORE UPDATE ON public.customer_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- EMPLOYEES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID UNIQUE,
  employee_number         TEXT UNIQUE NOT NULL,
  first_name              TEXT NOT NULL,
  last_name               TEXT NOT NULL,
  position                TEXT,
  employment_type         TEXT CHECK (employment_type IN ('fulltime', 'parttime', 'minijob')),
  birth_date              DATE,
  entry_date              DATE,
  termination_date        DATE,
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  vacation_days_per_year  INTEGER DEFAULT 30,
  remaining_vacation_days DECIMAL(5,2) DEFAULT 0,
  contact_phone           TEXT,
  mobile_phone            TEXT,
  contact_email           TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  address                 TEXT,
  iban                    TEXT,
  bic                     TEXT,
  account_holder          TEXT,
  monthly_gross_salary    DECIMAL(10,2) DEFAULT 0,
  hourly_rate             DECIMAL(10,2) DEFAULT 0,
  time_tracking_enabled   BOOLEAN DEFAULT true,
  flextime_enabled        BOOLEAN DEFAULT true,
  bde_terminal_enabled    BOOLEAN DEFAULT true,
  weekly_hours            JSONB DEFAULT '{"monday":8,"tuesday":8,"wednesday":8,"thursday":8,"friday":8,"saturday":0,"sunday":0}'::jsonb,
  time_account_hours      DECIMAL(10,2) DEFAULT 0,
  deleted_at              TIMESTAMP WITH TIME ZONE,
  created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on employees"
  ON public.employees FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status) WHERE deleted_at IS NULL;

-- --------------------------------------------------------
-- EMPLOYEE ABSENCES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employee_absences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  absence_type  TEXT NOT NULL,  -- urlaub | krank | kind_krank | gleitzeit | elternzeit | ...
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  days_count    DECIMAL(5,2),
  notes         TEXT,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_absences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on employee_absences"
  ON public.employee_absences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_employee_absences_employee_id ON public.employee_absences(employee_id);

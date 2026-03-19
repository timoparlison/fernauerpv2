-- ============================================================
-- Fernau-ERP v2 — Schema Alignment Migration
-- Ergänzt fehlende Tabellen und Spalten, damit die DB
-- mit den TypeScript-Types übereinstimmt.
-- ============================================================

-- ============================================================
-- 1. CUSTOMERS: Fehlende Spalten ergänzen
-- ============================================================

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS delivery_days                    TEXT,
  ADD COLUMN IF NOT EXISTS our_supplier_number_at_customer  TEXT,
  ADD COLUMN IF NOT EXISTS default_discount_percent         DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS blocked                          BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS block_reason                     TEXT,
  ADD COLUMN IF NOT EXISTS credit_limit                     DECIMAL(12,2);

-- --------------------------------------------------------
-- customer_type Werte korrigieren: deutsch → englisch
-- --------------------------------------------------------
UPDATE public.customers SET customer_type = 'retail'    WHERE customer_type = 'einzelhandel';
UPDATE public.customers SET customer_type = 'wholesale' WHERE customer_type = 'grosshandel';
UPDATE public.customers SET customer_type = 'service'   WHERE customer_type = 'dienstleister';
UPDATE public.customers SET customer_type = 'other'     WHERE customer_type = 'industrie';

-- Default-Wert anpassen
ALTER TABLE public.customers
  ALTER COLUMN customer_type SET DEFAULT 'retail';

-- ============================================================
-- 2. SUPPLIERS (komplett neue Tabelle)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_number               TEXT UNIQUE,
  name                          TEXT NOT NULL,
  supplier_type                 TEXT NOT NULL DEFAULT 'material'
                                  CHECK (supplier_type IN ('material', 'service', 'both')),
  contact_person                TEXT,
  email                         TEXT,
  phone                         TEXT,
  address                       TEXT,
  delivery_address              TEXT,
  payment_terms                 TEXT,
  delivery_terms                TEXT,
  customer_number_at_supplier   TEXT,
  vat_id                        TEXT,
  iban                          TEXT,
  bic                           TEXT,
  account_holder                TEXT,
  payment_reference             TEXT,
  payment_purpose               TEXT,
  notes                         TEXT,
  active                        BOOLEAN NOT NULL DEFAULT true,
  deleted_at                    TIMESTAMP WITH TIME ZONE,
  created_at                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on suppliers"
  ON public.suppliers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER trg_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3. WORKSTATIONS (komplett neue Tabelle)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workstations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workstations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on workstations"
  ON public.workstations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. BDE_SESSIONS (komplett neue Tabelle)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bde_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  workstation_id  UUID NOT NULL REFERENCES public.workstations(id) ON DELETE CASCADE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bde_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on bde_sessions"
  ON public.bde_sessions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bde_sessions_employee_id ON public.bde_sessions(employee_id);
CREATE INDEX IF NOT EXISTS idx_bde_sessions_active      ON public.bde_sessions(is_active) WHERE is_active = true;

-- ============================================================
-- 5. USER_ROLES (komplett neue Tabelle)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  role        TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on user_roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

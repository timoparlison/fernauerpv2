-- ============================================================
-- Add missing columns to suppliers table
-- ============================================================
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS billing_address        TEXT,
  ADD COLUMN IF NOT EXISTS bank_name              TEXT,
  ADD COLUMN IF NOT EXISTS average_lead_time_days INTEGER;

-- ============================================================
-- Supplier Contacts (Ansprechpartner)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.supplier_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id     UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  contact_person  TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  birthday        DATE,
  availability    TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_contacts_supplier_id ON public.supplier_contacts(supplier_id);

ALTER TABLE public.supplier_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on supplier_contacts"
  ON public.supplier_contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER trg_supplier_contacts_updated_at
  BEFORE UPDATE ON public.supplier_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Supplier Documents (Dokumente & E-Mails)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.supplier_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id     UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  document_name   TEXT NOT NULL,
  document_type   TEXT NOT NULL DEFAULT 'sonstiges',
  file_path       TEXT NOT NULL,
  notes           TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_documents_supplier_id ON public.supplier_documents(supplier_id);

ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users full access on supplier_documents"
  ON public.supplier_documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Supabase Storage Bucket for supplier documents
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('supplier-documents', 'supplier-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated upload to supplier-documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'supplier-documents');

CREATE POLICY "Allow authenticated read from supplier-documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'supplier-documents');

CREATE POLICY "Allow authenticated delete from supplier-documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'supplier-documents');

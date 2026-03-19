-- Fix: Add missing columns to suppliers table that exist in types but not in DB
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS billing_address        TEXT,
  ADD COLUMN IF NOT EXISTS bank_name              TEXT,
  ADD COLUMN IF NOT EXISTS average_lead_time_days INTEGER;

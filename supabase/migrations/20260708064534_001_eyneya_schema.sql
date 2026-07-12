/*
# Eyneya Business Solutions — Core Schema

1. Overview
This migration creates the complete schema for the Eyneya tax advisory platform:
services catalog, pricing tiers, clients, availability, bookings, payments,
email logs, contact submissions, Google Calendar config, and admin settings.

2. New Tables
- `services` — service catalog (slug, name, category, duration, buffer)
- `service_tiers` — pricing tiers per service (price, fixed/recurring, stripe ids)
- `clients` — client profiles (email, name, phone, business, tax situation)
- `availability_schedule` — recurring weekly availability (day_of_week, start/end)
- `availability_overrides` — date-specific overrides (blocked or custom hours)
- `bookings` — appointment bookings with intake fields, payment, calendar sync
- `payments` — Stripe payment records
- `email_logs` — Resend transactional email log
- `contact_submissions` — contact form submissions
- `google_calendar_config` — OAuth tokens for Google Calendar sync
- `admin_settings` — key/value JSONB settings

3. Security (RLS)
The public website has NO client sign-in screen. Client-facing writes
(bookings, clients, contact_submissions) must be writable by the anon role.
Admin tables (availability, google config, admin settings) are restricted to
authenticated (admin). Public reads: services + service_tiers only.
Bookings/clients/payments/email_logs reads are authenticated-only (confirmation
delivered via email, no client portal).

4. Notes
- uses gen_random_uuid() (pgcrypto via Supabase default).
- idempotent: IF NOT EXISTS on tables/indexes; DROP POLICY before CREATE.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Services catalog
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  buffer_minutes integer NOT NULL DEFAULT 15,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Service pricing tiers
CREATE TABLE IF NOT EXISTS service_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  name text NOT NULL,
  best_for text NOT NULL,
  price_cents integer NOT NULL DEFAULT 0,
  price_display text NOT NULL,
  is_fixed_price boolean DEFAULT false,
  stripe_price_id text,
  stripe_product_id text,
  is_recurring boolean DEFAULT false,
  recurring_interval text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  address_city text,
  address_state text,
  business_name text,
  tax_situation text,
  source text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Availability schedule (recurring weekly)
CREATE TABLE IF NOT EXISTS availability_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true
);

-- Availability overrides (specific dates)
CREATE TABLE IF NOT EXISTS availability_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  override_date date NOT NULL,
  is_blocked boolean NOT NULL,
  custom_start time,
  custom_end time,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  service_tier_id uuid REFERENCES service_tiers(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  tier_name text NOT NULL,
  price_display text NOT NULL,
  status text DEFAULT 'pending',
  appointment_start timestamptz NOT NULL,
  appointment_end timestamptz NOT NULL,
  timezone text DEFAULT 'America/New_York',
  client_notes text,
  admin_notes text,
  filing_status text,
  tax_year text,
  has_business_income boolean DEFAULT false,
  has_investments boolean DEFAULT false,
  has_rental_income boolean DEFAULT false,
  has_prior_year_issues boolean DEFAULT false,
  additional_context text,
  payment_status text DEFAULT 'unpaid',
  stripe_payment_intent_id text,
  stripe_session_id text,
  amount_paid_cents integer DEFAULT 0,
  google_calendar_event_id text,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  stripe_payment_intent_id text UNIQUE,
  stripe_session_id text,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Email log
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  template_name text NOT NULL,
  subject text NOT NULL,
  resend_message_id text,
  status text DEFAULT 'sent',
  error_message text,
  sent_at timestamptz DEFAULT now()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  service_interest text,
  message text NOT NULL,
  source_page text,
  status text DEFAULT 'new',
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

-- Google Calendar tokens (admin only)
CREATE TABLE IF NOT EXISTS google_calendar_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text,
  refresh_token text,
  token_expiry timestamptz,
  calendar_id text DEFAULT 'primary',
  is_connected boolean DEFAULT false,
  connected_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Admin settings
CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_service_tiers_service ON service_tiers(service_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(appointment_start);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_availability_overrides_date ON availability_overrides(override_date);

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- services: public read, admin write
DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE TO authenticated USING (true);

-- service_tiers: public read, admin write
DROP POLICY IF EXISTS "public_read_service_tiers" ON service_tiers;
CREATE POLICY "public_read_service_tiers" ON service_tiers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_service_tiers" ON service_tiers;
CREATE POLICY "admin_insert_service_tiers" ON service_tiers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_service_tiers" ON service_tiers;
CREATE POLICY "admin_update_service_tiers" ON service_tiers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_service_tiers" ON service_tiers;
CREATE POLICY "admin_delete_service_tiers" ON service_tiers FOR DELETE TO authenticated USING (true);

-- availability_schedule: authenticated CRUD
DROP POLICY IF EXISTS "admin_read_availability_schedule" ON availability_schedule;
CREATE POLICY "admin_read_availability_schedule" ON availability_schedule FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_availability_schedule" ON availability_schedule;
CREATE POLICY "admin_insert_availability_schedule" ON availability_schedule FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_availability_schedule" ON availability_schedule;
CREATE POLICY "admin_update_availability_schedule" ON availability_schedule FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_availability_schedule" ON availability_schedule;
CREATE POLICY "admin_delete_availability_schedule" ON availability_schedule FOR DELETE TO authenticated USING (true);

-- availability_overrides: authenticated CRUD
DROP POLICY IF EXISTS "admin_read_availability_overrides" ON availability_overrides;
CREATE POLICY "admin_read_availability_overrides" ON availability_overrides FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_availability_overrides" ON availability_overrides;
CREATE POLICY "admin_insert_availability_overrides" ON availability_overrides FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_availability_overrides" ON availability_overrides;
CREATE POLICY "admin_update_availability_overrides" ON availability_overrides FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_availability_overrides" ON availability_overrides;
CREATE POLICY "admin_delete_availability_overrides" ON availability_overrides FOR DELETE TO authenticated USING (true);

-- clients: anon INSERT (created during booking), authenticated read/update
DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_clients" ON clients;
CREATE POLICY "admin_read_clients" ON clients FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_clients" ON clients;
CREATE POLICY "admin_update_clients" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- bookings: anon INSERT (created during booking), authenticated read/update
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_bookings" ON bookings;
CREATE POLICY "admin_read_bookings" ON bookings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- payments: authenticated read + insert (service_role handles webhook inserts; admin can record manual)
DROP POLICY IF EXISTS "admin_read_payments" ON payments;
CREATE POLICY "admin_read_payments" ON payments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_payments" ON payments;
CREATE POLICY "admin_insert_payments" ON payments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_payments" ON payments;
CREATE POLICY "admin_update_payments" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- email_logs: authenticated read + insert (service_role via edge functions; admin can resend)
DROP POLICY IF EXISTS "admin_read_email_logs" ON email_logs;
CREATE POLICY "admin_read_email_logs" ON email_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_email_logs" ON email_logs;
CREATE POLICY "admin_insert_email_logs" ON email_logs FOR INSERT TO authenticated WITH CHECK (true);

-- contact_submissions: anon INSERT, authenticated read/update
DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions" ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_contact_submissions" ON contact_submissions;
CREATE POLICY "admin_read_contact_submissions" ON contact_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_contact_submissions" ON contact_submissions;
CREATE POLICY "admin_update_contact_submissions" ON contact_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- google_calendar_config: authenticated only
DROP POLICY IF EXISTS "admin_read_google_config" ON google_calendar_config;
CREATE POLICY "admin_read_google_config" ON google_calendar_config FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_google_config" ON google_calendar_config;
CREATE POLICY "admin_insert_google_config" ON google_calendar_config FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_google_config" ON google_calendar_config;
CREATE POLICY "admin_update_google_config" ON google_calendar_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- admin_settings: authenticated only
DROP POLICY IF EXISTS "admin_read_admin_settings" ON admin_settings;
CREATE POLICY "admin_read_admin_settings" ON admin_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_admin_settings" ON admin_settings;
CREATE POLICY "admin_insert_admin_settings" ON admin_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_admin_settings" ON admin_settings;
CREATE POLICY "admin_update_admin_settings" ON admin_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- updated_at trigger for bookings + clients
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS clients_updated_at ON clients;
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();

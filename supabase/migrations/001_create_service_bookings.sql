-- Migration: 001_create_service_bookings.sql
-- Description: Creates the service_bookings table for storing booking requests.

CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  service TEXT NOT NULL,
  custom_service_name TEXT,
  project_requirements TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  estimated_budget NUMERIC NOT NULL,
  reference_link TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT true,
  privacy_accepted BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment on table & columns
COMMENT ON TABLE service_bookings IS 'Stores customer service booking requests and reservations.';
COMMENT ON COLUMN service_bookings.booking_id IS 'Human-readable unique booking ID in format PBM-YYYY-XXXXX';
COMMENT ON COLUMN service_bookings.status IS 'Allowed statuses: REQUESTED, UNDER_REVIEW, CONFIRMED, COMPLETED, CANCELLED';

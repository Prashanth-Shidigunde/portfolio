-- Migration: 002_create_booking_files.sql
-- Description: Creates the booking_files table for reference file metadata.

CREATE TABLE IF NOT EXISTS booking_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES service_bookings(id) ON DELETE CASCADE,
  booking_code TEXT,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE booking_files IS 'Stores metadata for reference files uploaded to Supabase Storage bucket booking-reference-files.';

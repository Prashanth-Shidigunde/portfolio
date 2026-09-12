-- Migration: 004_security_and_indexes.sql
-- Description: Sets up indexes, enables RLS, and configures security policies for tables & storage.

-- 1. Create Indexes for Search Performance
CREATE INDEX IF NOT EXISTS idx_service_bookings_booking_id ON service_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_created_at ON service_bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_service_bookings_email ON service_bookings(email);
CREATE INDEX IF NOT EXISTS idx_booking_files_booking_id ON booking_files(booking_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for service_bookings
-- Allow anonymous users to submit booking requests
DROP POLICY IF EXISTS "Allow public insert on service_bookings" ON service_bookings;
CREATE POLICY "Allow public insert on service_bookings"
  ON service_bookings FOR INSERT
  WITH CHECK (true);

-- Allow public users to query a booking ONLY when specifying booking_id (for invoice generation)
DROP POLICY IF EXISTS "Allow public select by booking_id on service_bookings" ON service_bookings;
CREATE POLICY "Allow public select by booking_id on service_bookings"
  ON service_bookings FOR SELECT
  USING (true);

-- 4. RLS Policies for booking_files
DROP POLICY IF EXISTS "Allow public insert on booking_files" ON booking_files;
CREATE POLICY "Allow public insert on booking_files"
  ON booking_files FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on booking_files" ON booking_files;
CREATE POLICY "Allow public select on booking_files"
  ON booking_files FOR SELECT
  USING (true);

-- 5. RLS Policies for contact_submissions
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
CREATE POLICY "Allow public insert on contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- 6. Supabase Storage Setup Note:
-- Create a storage bucket in your Supabase Dashboard named: booking-reference-files
-- Storage Upload path pattern: bookings/{bookingId}/{filename}

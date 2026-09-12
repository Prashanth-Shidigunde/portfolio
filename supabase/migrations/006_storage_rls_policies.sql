-- Migration: 006_storage_rls_policies.sql
-- Description: Enables public upload and signed URL read access for the private client-files Supabase Storage bucket.

-- 1. Ensure uploaded_files JSONB column exists on service_bookings table
ALTER TABLE service_bookings 
ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]'::jsonb;

-- 2. Storage RLS Policy: Allow public anonymous uploads to client-files bucket
DROP POLICY IF EXISTS "Allow public uploads to client-files" ON storage.objects;

CREATE POLICY "Allow public uploads to client-files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'client-files');

-- 3. Storage RLS Policy: Allow public/signed-url select access to client-files bucket
DROP POLICY IF EXISTS "Allow public select on client-files" ON storage.objects;

CREATE POLICY "Allow public select on client-files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'client-files');

-- Migration: 005_client_files_storage.sql
-- Description: Adds uploaded_files JSONB column to service_bookings table and configures storage policies for client-files bucket.

-- 1. Add uploaded_files column to service_bookings table
ALTER TABLE service_bookings 
ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN service_bookings.uploaded_files IS 'Stores JSON array of uploaded client reference file objects: [{ name, path, type, size, uploaded_at }]';

-- 2. Storage Setup Notes for Supabase Dashboard:
-- Bucket Name: client-files
-- Public: FALSE (Private bucket)
-- Folder path pattern: client-files/{booking_id}/{filename}

-- 3. Storage Policies (Run in Supabase SQL Editor if storage policies needed):
/*
-- Allow public insert/upload of client files
CREATE POLICY "Allow public upload to client-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-files');

-- Allow authenticated users / owners to view/select client files
CREATE POLICY "Allow authenticated select on client-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-files');
*/

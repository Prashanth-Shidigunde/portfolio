-- Migration: 003_create_contact_submissions.sql
-- Description: Creates the contact_submissions table for contact form enquiries.

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE contact_submissions IS 'Stores user contact form submissions.';

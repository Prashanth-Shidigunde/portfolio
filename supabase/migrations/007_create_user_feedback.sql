-- Migration: 007_create_user_feedback.sql
-- Description: Creates the user_feedback table with RLS policies and indexes for public feedback submissions & moderation.

-- 1. Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NULL,
  service TEXT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  role TEXT NULL,
  display_consent BOOLEAN NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Indexes for Query & Moderation Performance
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow public/anonymous users to insert feedback
DROP POLICY IF EXISTS "Allow public insert on user_feedback" ON user_feedback;
CREATE POLICY "Allow public insert on user_feedback"
  ON user_feedback FOR INSERT
  WITH CHECK (true);

-- Allow public/anonymous users to SELECT ONLY APPROVED feedback
DROP POLICY IF EXISTS "Allow public select approved user_feedback" ON user_feedback;
CREATE POLICY "Allow public select approved user_feedback"
  ON user_feedback FOR SELECT
  USING (status = 'APPROVED');

-- UPDATE and DELETE operations are restricted to authenticated service_role / Supabase Dashboard admins.

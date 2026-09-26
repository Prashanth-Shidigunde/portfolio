-- Migration 008: Add Excel Synchronization columns and retry tracking table

ALTER TABLE service_bookings 
ADD COLUMN IF NOT EXISTS sync_status VARCHAR(50) DEFAULT 'EXCEL_SYNC_PENDING',
ADD COLUMN IF NOT EXISTS excel_synced_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS excel_sync_error TEXT DEFAULT NULL;

-- Create table for tracking Excel sync retries and audit log
CREATE TABLE IF NOT EXISTS booking_excel_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(100) NOT NULL,
    sync_status VARCHAR(50) NOT NULL DEFAULT 'EXCEL_SYNC_PENDING',
    attempt_count INT DEFAULT 1,
    last_attempt TIMESTAMPTZ DEFAULT NOW(),
    last_error TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_excel_sync_id ON booking_excel_sync_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_sync_status ON service_bookings(sync_status);

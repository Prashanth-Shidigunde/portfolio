/**
 * Node Server Environment Configuration
 */
module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  OWNER_WHATSAPP: process.env.OWNER_WHATSAPP || '+91 6304834605',

  // Personal Microsoft Account & Excel Server Configuration (Secrets)
  MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID || 'consumers',
  MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || '',
  MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET || '',
  MICROSOFT_REDIRECT_URI: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:5000/api/auth/microsoft/callback',
  EXCEL_DRIVE_ID: process.env.EXCEL_DRIVE_ID || '',
  EXCEL_WORKBOOK_ID: process.env.EXCEL_WORKBOOK_ID || '',
  EXCEL_WORKSHEET_NAME: process.env.EXCEL_WORKSHEET_NAME || 'Bookings',
  EXCEL_TABLE_NAME: process.env.EXCEL_TABLE_NAME || 'BookingsTable'
};


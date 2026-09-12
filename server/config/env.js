/**
 * Node Server Environment Configuration
 */
module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  OWNER_WHATSAPP: process.env.OWNER_WHATSAPP || '+91 6304834605'
};

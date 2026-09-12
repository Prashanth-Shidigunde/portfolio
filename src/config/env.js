/**
 * Centralized Environment Configuration
 * Safe abstraction for accessing Vite environment variables with fallback defaults.
 */
export const ENV = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Pulse_Blend_Media',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '+91 6304834605',
  WHATSAPP_WEBHOOK_URL: import.meta.env.VITE_WHATSAPP_WEBHOOK_URL || '',
  IS_DEV: import.meta.env.DEV || false,
  IS_PROD: import.meta.env.PROD || false
};

export default ENV;

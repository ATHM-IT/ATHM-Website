import { createClient } from '@supabase/supabase-js';

// These environment variables will be provided by you later in a .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If keys are missing, we won't crash, but requests will fail (or we can add checks)
// We cast null to any to avoid TS errors in typical usage patterns where we guard with isSupabaseConfigured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as any);

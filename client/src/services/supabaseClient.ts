import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or fallback demo endpoints for prototype
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mock-supabase-hams.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-sih-2026';

export const isSupabaseConfigured = Boolean(
  (import.meta as any).env?.VITE_SUPABASE_URL && 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
);

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const checkSupabaseHealth = async (): Promise<{ connected: boolean; message: string }> => {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Demo / Local Mode (Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for live cloud DB)'
    };
  }

  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { connected: false, message: `Connection Error: ${error.message}` };
    }
    return { connected: true, message: 'Connected to Supabase PostgreSQL Database' };
  } catch (err: any) {
    return { connected: false, message: `Offline / Error: ${err?.message || 'Unknown'}` };
  }
};

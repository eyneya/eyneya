import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ammcejsokaivxalfhyan.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbWNlanNva2FpdnhhbGZoeWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTgwMjQsImV4cCI6MjA5OTM5NDAyNH0.mHAs_jTF8YbPMzm4weRwDnQvr_zoNNad7U6Unf0135Q';

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL not loaded from .env — using fallback. ' +
      'Restart the dev server so Vite picks up .env automatically.',
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

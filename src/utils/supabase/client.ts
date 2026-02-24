import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey, isSupabaseConfigured } from '../../../utils/supabase/info';

// Re-export so call sites can import from one place.
export { isSupabaseConfigured };

// If env vars are missing the app will not function, but we avoid a module-
// level throw so React can still mount and show a proper error state.
// Always guard calls to supabase with `isSupabaseConfigured` first.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, publicAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Explicitly use PKCE so the code_verifier is stored in localStorage
        // rather than a partitioned cookie, avoiding Chrome's cross-site state
        // deletion warning during the Google OAuth redirect chain.
        flowType: 'pkce',
      },
    })
  : null as never;

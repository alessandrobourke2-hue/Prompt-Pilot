import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from '../../../utils/supabase/info';

// If env vars are missing the app will not function, but we avoid a module-
// level throw so React can still mount and show a proper error state.
export const supabase = supabaseUrl && publicAnonKey
  ? createClient(supabaseUrl, publicAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null as never;

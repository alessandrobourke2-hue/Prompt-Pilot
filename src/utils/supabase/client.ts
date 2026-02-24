import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from '../../../utils/supabase/info';

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

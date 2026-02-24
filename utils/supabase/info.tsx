const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[PromptPilot] Missing Supabase environment variables.\n' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Derive project ID from URL for edge function endpoints
export const projectId = new URL(supabaseUrl).hostname.split('.')[0];
export const publicAnonKey = supabaseAnonKey;
export { supabaseUrl };

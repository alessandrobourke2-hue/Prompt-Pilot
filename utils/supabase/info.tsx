const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[PromptPilot] Missing Supabase environment variables.\n' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Vercel project settings.'
  );
}

// Derive project ID from URL for edge function endpoints
export const projectId = supabaseUrl
  ? new URL(supabaseUrl).hostname.split('.')[0]
  : '';
export const publicAnonKey = supabaseAnonKey ?? '';
export { supabaseUrl };

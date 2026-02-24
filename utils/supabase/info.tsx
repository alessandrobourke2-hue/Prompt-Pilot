const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// True when both vars were injected at build time. Use this before calling
// any supabase method so the app fails gracefully rather than crashing.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    '[PromptPilot] Missing Supabase environment variables.\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel → Project Settings → Environment Variables,\n' +
    'then redeploy so Vite can inject them at build time.'
  );
}

// Derive project ID from URL for edge function endpoints
export const projectId = supabaseUrl
  ? new URL(supabaseUrl).hostname.split('.')[0]
  : '';
export const publicAnonKey = supabaseAnonKey ?? '';
export { supabaseUrl };

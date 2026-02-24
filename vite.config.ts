import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Warn (but don't fail) if Supabase env vars are absent at build time.
// On Vercel the vars are in process.env; locally they come from .env.local.
function supabaseEnvCheck(env: Record<string, string>) {
  return {
    name: 'supabase-env-check',
    buildStart() {
      const missing = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'].filter(
        (k) => !env[k] && !process.env[k],
      );
      if (missing.length) {
        console.warn(
          `\n⚠️  [PromptPilot] Build warning — missing env var(s): ${missing.join(', ')}\n` +
          '   The built app will render an error state instead of the auth UI.\n' +
          '   Fix: Vercel → Project Settings → Environment Variables → add the missing keys → Redeploy.\n',
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      supabaseEnvCheck(env),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },
    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  };
})

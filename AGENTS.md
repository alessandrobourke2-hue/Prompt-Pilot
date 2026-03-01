# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

PromptPilot is a React + Vite frontend SPA. The backend is entirely hosted Supabase (cloud) — no local backend, database, or Docker is needed. See `CLAUDE.md` for full architecture details.

### Services

| Service | How to run | Port |
|---------|-----------|------|
| Vite dev server (frontend) | `npm run dev` | 5173 |

The Supabase backend (auth, DB, edge functions) runs in the cloud at `nkdohzkcyovwuktdhmyd.supabase.co` — no local setup required.

### Environment variables

The frontend requires a `.env.local` file with two public Supabase keys:

```
VITE_SUPABASE_URL=https://nkdohzkcyovwuktdhmyd.supabase.co
VITE_SUPABASE_ANON_KEY=<public anon key — retrieve from git history: git show 3cdcff8d^:utils/supabase/info.tsx>
```

These are public (anon) keys, not secrets. If `.env.local` is missing, the app still renders but shows an error state for auth features.

### Lint / Build / Test

- **No ESLint config or lint script** in the main project. The `promptpilot/` subdirectory has one but it is a separate scaffold, not the main app.
- **Build**: `npm run build` — validates TypeScript via Vite bundling.
- **No automated test suite** is configured in this project.
- **Dev server**: `npm run dev` — starts Vite with HMR on port 5173.

### Gotchas

- The `promptpilot/` subdirectory at the repo root is a separate React + Vite starter scaffold, not part of the main app. The main app entry is `/workspace/index.html` → `src/main.tsx`.
- Supabase Edge Functions (in `supabase/functions/`) run on Deno, not Node. They are deployed to the cloud — do not try to run them locally with Node.
- The enhance feature calls the remote Supabase Edge Function (`server/enhance`). If the `ANTHROPIC_API_KEY` Supabase secret is not set, the endpoint returns a static fallback response.

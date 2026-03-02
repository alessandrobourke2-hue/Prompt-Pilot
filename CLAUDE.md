# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build (localhost:4173)

# Edge Functions
supabase functions serve                        # Serve all functions locally
supabase functions deploy server                # Deploy the main enhance/questions endpoint
supabase functions deploy workflow-engine       # Deploy workflow engine
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...  # Set server-side API key

# Database
supabase db push     # Apply migrations
```

## Local Environment

Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API in Supabase dashboard). The build warns but does not fail if these are missing.

`ANTHROPIC_API_KEY` is a Supabase Edge Function secret only — never put it in `.env.local` or Vercel env vars.

## Architecture

### Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router 7, Zustand 5, Tailwind CSS 4, Vite 6 |
| Animations | `motion/react` (the `motion` package) — **not** `framer-motion` |
| Backend | Supabase Edge Functions (Deno + Hono) |
| AI | Anthropic Claude `claude-sonnet-4-6` via REST |
| Auth / DB | Supabase (`nkdohzkcyovwuktdhmyd`) |

### No TypeScript type-checking

TypeScript is not in `devDependencies`. Vite/esbuild strips types but does not type-check. `npx tsc --noEmit` will not work. Rely on editor inference only.

### Frontend flow

The main user flow lives entirely in `src/app/pages/LandingPage.tsx` using a `Phase` state machine:

```
'input' → (Enhance clicked) → ElevateBottomPanel opens
       → (depth chosen or skipped) → 'questioning'
       → (AI generates questions) → QuestionFlow shown
       → (user answers/skips) → 'processing' → 'result'
```

Key functions:
- `handleSearch()` — validates input, shows `ElevateBottomPanel`
- `proceedToQuestions(depth?)` — sets phase, fetches questions from `/generate-questions`, shows `QuestionFlow`
- `performEnhance(answers, depth?)` — builds enriched prompt (appends Q&A as `--- Additional context ---` block), calls `/enhance`, sets result

`QuestionFlow` is a self-contained component (`src/app/components/QuestionFlow.tsx`) that emits `onComplete(answers)` or `onSkipAll()`.

### State management

`usePilotStore` (Zustand, persisted to `localStorage` as `prompt-pilot-storage`) holds:
- `usage` — enhance/copy counts
- `flags` — UI nudge dismissal state
- `account` — `isAuthed`, `tier`, `userId`, `onboardingComplete`
- `prompts.saved` — max 20, synced to `saved_prompts` table on write when authed
- `savedWorkflowResults` — max 10

`authReady` is non-persisted — starts `false` on every page load, set to `true` once `App.tsx` finishes the initial `getSession()` check. Route guards (`RequireAuth`, `RequireOnboarded`) render `null` until `authReady` is true to prevent redirect flicker.

### Auth flow

Global listener in `App.tsx` via `supabase.auth.onAuthStateChange`. On session start: calls `setAuth()`, fetches `saved_prompts` and `user_onboarding_profile` from Supabase.

OAuth flow: `signInWithOAuth` → redirect to provider → back to `/auth/callback` → `onAuthStateChange` fires → navigate to `/app`.

Route guards:
- `RequireAuth` — must be authenticated
- `RequireOnboarded` — must be authenticated **and** `onboardingComplete: true`

### Edge Functions (Supabase / Deno / Hono)

All in `supabase/functions/`. Each is a separate Deno process.

**`server/index.ts`** — primary endpoint, path prefix `/make-server-e52adb92/`:
- `POST /make-server-e52adb92/enhance` — main enhancement. Intent detection (keyword rules → override → `tech`), level resolution (`standard`/`advanced`/`expert`), retry with stricter prompt on quality-check failure, static fallback if API key missing.
- `POST /make-server-e52adb92/generate-questions` — takes `{ input }`, returns `{ questions: Question[] }` (3–5 clarifying questions). Falls back to `{ questions: [] }` on any error.
- `POST /make-server-e52adb92/signup`

**`workflow-engine/index.ts`** — chains multiple Claude calls:
- `POST /workflow-engine/execute` — runs steps sequentially, interpolates `{{variable}}` placeholders from prior step outputs.

### Database

`saved_prompts` table (RLS enabled — users see only their own rows):

| Column | Notes |
|--------|-------|
| `id` | uuid PK |
| `user_id` | FK → auth.users, cascade delete |
| `enhanced_prompt` | maps to `SavedPrompt.enhancedPrompt` (camelCase in store) |
| `improvements` | jsonb string array |

`user_onboarding_profile` — fetched on login; gate for `/app/*` routes.

### Design conventions

- CSS custom properties for all colours: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`, `var(--surface)`, `var(--surface-elevated)`, `var(--border-subtle)`, `var(--border-default)`, `var(--background)`, `var(--accent)`. Use these rather than Tailwind colour utilities on main UI surfaces.
- Dark overlays/panels use `rgba(255,255,255,0.x)` tinting over dark backgrounds, not hard colours.
- All animations via `motion/react` (`AnimatePresence`, `motion.div`). Import from `'motion/react'`, never `'framer-motion'`.
- `@` alias resolves to `./src` (configured in `vite.config.ts`).

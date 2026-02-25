-- =============================================================================
-- Lock down public.extension_handoff_tokens
--
-- This table contains sensitive short-lived tokens used by the browser
-- extension handoff flow. It must never be directly accessible from the
-- client (anon or authenticated roles). All access goes through Edge
-- Functions that use the service_role key, which bypasses RLS.
-- =============================================================================

-- 1. Enable Row Level Security.
--    With RLS enabled and NO policies defined, the default is DENY ALL for
--    every non-superuser role. service_role bypasses RLS automatically.
ALTER TABLE public.extension_handoff_tokens ENABLE ROW LEVEL SECURITY;

-- 2. Explicitly revoke all direct table privileges from client-facing roles.
--    This is defence-in-depth: even if someone mistakenly adds a permissive
--    policy later, the underlying GRANT is already absent.
REVOKE ALL ON public.extension_handoff_tokens FROM anon;
REVOKE ALL ON public.extension_handoff_tokens FROM authenticated;

-- 3. Ensure the owning role (postgres / service_role) retains full access.
--    This line is a no-op in standard Supabase projects but makes intent
--    explicit and safe to re-run.
GRANT ALL ON public.extension_handoff_tokens TO service_role;

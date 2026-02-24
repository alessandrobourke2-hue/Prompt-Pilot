import { useEffect } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { supabase, isSupabaseConfigured } from '../../utils/supabase/client';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If Supabase isn't configured (missing env vars at build time), bail out
    // immediately — the OAuth flow could never have started in the first place.
    if (!isSupabaseConfigured) {
      navigate('/login', { replace: true });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // PKCE flow: exchange the one-time code for a session.
      // The code_verifier was stored in localStorage by the supabase client
      // when signInWithOAuth was called, so this works without cookies and
      // avoids Chrome's cross-site state partitioning warning.
      supabase.auth.exchangeCodeForSession(code).then(async ({ data: { session }, error }) => {
        if (error || !session?.user) {
          console.error('[PromptPilot] OAuth code exchange failed:', error?.message);
          navigate('/login', { replace: true });
          return;
        }
        // Fetch the onboarding profile BEFORE navigating so RequireOnboarded
        // sees the correct onboardingComplete value on the very first render.
        // (App.tsx's onAuthStateChange also fetches this, but fire-and-forget —
        // this explicit await eliminates the race that sent users to /onboarding
        // even when they had already completed it.)
        const { data: profile } = await supabase
          .from('user_onboarding_profile')
          .select('onboarding_complete')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (profile?.onboarding_complete) {
          navigate('/app', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      });
      return;
    }

    // Fallback: implicit flow or page refresh — check for an existing session.
    // App.tsx onAuthStateChange handles setAuth + prompt hydration in parallel.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/app', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/app', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-lg mx-auto mb-4"
          style={{ backgroundColor: '#1a1a1a', color: '#fff' }}
        >
          P
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Signing you in…</p>
      </div>
    </div>
  );
}

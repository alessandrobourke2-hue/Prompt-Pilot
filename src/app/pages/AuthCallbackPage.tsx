import { useEffect } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { supabase } from '../../utils/supabase/client';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase detects the token from the URL hash automatically (detectSessionInUrl: true).
    // onAuthStateChange in App.tsx handles setAuth + prompt hydration.
    // We just need to wait for the session to be established then redirect.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/app', { replace: true });
      } else {
        // Session not ready yet — listen for it
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            subscription.unsubscribe();
            navigate('/app', { replace: true });
          }
        });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-text-secondary text-[15px]">Signing you in…</p>
    </div>
  );
}

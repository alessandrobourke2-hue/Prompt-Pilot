import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { supabase } from "../utils/supabase/client";
import { usePilotStore } from "./state/pilotStore";
import type { SavedPrompt } from "./state/pilotStore";

async function fetchAndHydratePrompts(userId: string, hydratePrompts: (p: SavedPrompt[]) => void) {
  const { data, error } = await supabase
    .from('saved_prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Failed to fetch saved prompts:', error.message);
    return;
  }

  if (data) {
    const prompts: SavedPrompt[] = data.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      title: row.title,
      input: row.input,
      enhancedPrompt: row.enhanced_prompt,
      improvements: row.improvements ?? [],
      structure: row.structure ?? undefined,
      lastUsed: row.last_used ?? undefined,
    }));
    hydratePrompts(prompts);
  }
}

export default function App() {
  const setAuth = usePilotStore((s) => s.setAuth);
  const logout = usePilotStore((s) => s.logout);
  const hydratePrompts = usePilotStore((s) => s.hydratePrompts);

  useEffect(() => {
    // Handle existing session on mount (e.g. after OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined;
        setAuth(user.id, user.email, 'free', name);
        fetchAndHydratePrompts(user.id, hydratePrompts);
      }
    });

    // Listen for future auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined;
        setAuth(user.id, user.email, 'free', name);
        fetchAndHydratePrompts(user.id, hydratePrompts);
      } else {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, logout, hydratePrompts]);

  return <RouterProvider router={router} />;
}

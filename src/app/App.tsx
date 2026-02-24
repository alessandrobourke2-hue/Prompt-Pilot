import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { supabase } from "../utils/supabase/client";
import { usePilotStore } from "./state/pilotStore";
import type { SavedPrompt, OnboardingProfile } from "./state/pilotStore";

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

function mapProfile(row: Record<string, unknown>): OnboardingProfile {
  return {
    role: row.role as OnboardingProfile['role'],
    roleOther: row.role_other as string | undefined,
    useCases: (row.use_cases as OnboardingProfile['useCases']) ?? [],
    aiExperience: row.ai_experience as OnboardingProfile['aiExperience'],
    tools: (row.tools as OnboardingProfile['tools']) ?? [],
    tonePreference: row.tone_preference as OnboardingProfile['tonePreference'],
    primaryGoal: row.primary_goal as OnboardingProfile['primaryGoal'],
    displayName: row.display_name as string,
    orgName: row.org_name as string | undefined,
    workspaceName: row.workspace_name as string | undefined,
    onboardingComplete: Boolean(row.onboarding_complete),
  };
}

async function fetchAndHydrateOnboardingProfile(
  userId: string,
  setOnboardingProfile: (profile: OnboardingProfile) => void,
) {
  const { data, error } = await supabase
    .from('user_onboarding_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch onboarding profile:', error.message);
    return;
  }

  if (data?.onboarding_complete) {
    setOnboardingProfile(mapProfile(data));
  }
}

export default function App() {
  const setAuth = usePilotStore((s) => s.setAuth);
  const logout = usePilotStore((s) => s.logout);
  const hydratePrompts = usePilotStore((s) => s.hydratePrompts);
  const setAuthReady = usePilotStore((s) => s.setAuthReady);
  const setOnboardingProfile = usePilotStore((s) => s.setOnboardingProfile);

  useEffect(() => {
    // Listen for future auth state changes (login, logout, token refresh).
    // Set up BEFORE getSession so we never miss an event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined;
        setAuth(user.id, user.email, 'free', name);
        // Fire-and-forget — we already awaited this in getSession for the initial load
        fetchAndHydratePrompts(user.id, hydratePrompts);
        fetchAndHydrateOnboardingProfile(user.id, setOnboardingProfile);
      } else {
        logout();
      }
    });

    // Check for an existing session on mount (e.g. returning user, post-OAuth redirect).
    // Await onboarding profile fetch before setAuthReady so RequireOnboarded has correct state.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined;
        setAuth(user.id, user.email, 'free', name);
        // Await profile so the onboarding gate has accurate state on first render
        await fetchAndHydrateOnboardingProfile(user.id, setOnboardingProfile);
        // Fire-and-forget — prompts don't gate routing
        fetchAndHydratePrompts(user.id, hydratePrompts);
      }
      setAuthReady();
    });

    return () => subscription.unsubscribe();
  }, [setAuth, logout, hydratePrompts, setAuthReady, setOnboardingProfile]);

  return <RouterProvider router={router} />;
}

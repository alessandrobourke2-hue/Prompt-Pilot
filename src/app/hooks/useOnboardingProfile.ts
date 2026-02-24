import { supabase } from '../../utils/supabase/client';
import { usePilotStore } from '../state/pilotStore';
import type { OnboardingProfile } from '../state/pilotStore';

export function useOnboardingProfile() {
  const setOnboardingProfile = usePilotStore((s) => s.setOnboardingProfile);
  const userId = usePilotStore((s) => s.account.userId);

  async function saveOnboardingProfile(profile: OnboardingProfile): Promise<void> {
    if (!userId) throw new Error('Not authenticated');

    const { error } = await supabase.from('user_onboarding_profile').upsert({
      user_id: userId,
      role: profile.role,
      role_other: profile.roleOther ?? null,
      use_cases: profile.useCases,
      ai_experience: profile.aiExperience,
      tools: profile.tools,
      tone_preference: profile.tonePreference,
      primary_goal: profile.primaryGoal,
      display_name: profile.displayName,
      org_name: profile.orgName ?? null,
      workspace_name: profile.workspaceName ?? null,
      onboarding_complete: true,
    }, { onConflict: 'user_id' });

    if (error) throw new Error(error.message);

    setOnboardingProfile({ ...profile, onboardingComplete: true });
  }

  return { saveOnboardingProfile };
}

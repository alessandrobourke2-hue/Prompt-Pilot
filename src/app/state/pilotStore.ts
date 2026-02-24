import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../utils/supabase/client';

export type PricingTier = "free" | "pro" | "team";

export type SavedPrompt = {
  id: string;
  createdAt: string;
  title: string;
  input: string;
  enhancedPrompt: string;
  improvements: string[];
  structure?: string; // e.g., "LinkedIn", "Email", "Blog"
  lastUsed?: string;
};

export type WorkflowResult = {
  id: string;
  workflowId: string;
  createdAt: string;
  outputs: Record<string, string>;
  trace: Array<{ step_id: string; status: string; latency_ms: number }>;
};

export type OnboardingProfile = {
  role: 'solo_professional' | 'small_business' | 'team_lead' | 'enterprise' | 'public_sector' | 'other';
  roleOther?: string;
  useCases: Array<'writing_comms' | 'policy_compliance' | 'client_reports' | 'team_briefs' | 'meeting_summaries' | 'research_analysis' | 'customer_service'>;
  aiExperience: 'beginner' | 'occasional' | 'regular' | 'power_user';
  tools: Array<'microsoft_365' | 'google_workspace' | 'notion' | 'slack' | 'email' | 'gov_systems' | 'none'>;
  tonePreference: 'formal' | 'professional_approachable' | 'concise_direct' | 'warm_conversational';
  primaryGoal: 'save_time' | 'quality_documents' | 'compliance_risk' | 'team_adoption' | 'less_overwhelmed';
  displayName: string;
  orgName?: string;
  workspaceName?: string;
  onboardingComplete: boolean;
};

type PersistedStateV1 = {
  version: 1;
  usage: {
    enhanceCount: number;
    copyCount: number;
    lastUsedAtISO?: string;
  };
  flags: {
    hasSeenImprovementsOnce: boolean;
    dismissedExtensionNudgeAtCount?: number;
    dismissedSignupNudgeAtCount?: number;
  };
  account: {
    isAuthed: boolean;
    tier: PricingTier;
    userId?: string;
    email?: string;
    userName?: string;
    onboardingComplete: boolean;
  };
  prompts: {
    saved: SavedPrompt[];
    lastPromptId?: string;
  };
  savedWorkflowResults: WorkflowResult[];
  onboardingProfile?: OnboardingProfile;
};

type Actions = {
  incrementEnhance: () => void;
  incrementCopy: () => void;
  markImprovementsSeen: () => void;
  dismissExtensionNudge: () => void;
  dismissSignupNudge: () => void;
  setAuth: (userId: string, email?: string, tier?: PricingTier, userName?: string) => void;
  logout: () => void;
  updateTier: (tier: PricingTier) => void;
  savePrompt: (prompt: SavedPrompt) => void;
  setLastPrompt: (promptId: string) => void;
  getRecentPrompts: () => SavedPrompt[];
  getLastPrompt: () => SavedPrompt | null;
  saveWorkflowResult: (result: WorkflowResult) => void;
  hydratePrompts: (prompts: SavedPrompt[]) => void;
  setOnboardingProfile: (profile: OnboardingProfile) => void;
  setOnboardingComplete: () => void;
  // authReady: true once the initial session check in App.tsx has completed.
  // Not persisted — always starts false on each page load.
  authReady: boolean;
  setAuthReady: () => void;
};

export type PilotStore = PersistedStateV1 & Actions;

const initialState: Omit<PersistedStateV1, 'version'> = {
  usage: {
    enhanceCount: 0,
    copyCount: 0,
  },
  flags: {
    hasSeenImprovementsOnce: false,
  },
  account: {
    isAuthed: false,
    tier: "free",
    onboardingComplete: false,
  },
  prompts: {
    saved: [],
  },
  savedWorkflowResults: [],
  onboardingProfile: undefined,
};

export const usePilotStore = create<PilotStore>()(
  persist(
    (set, get) => ({
      version: 1,
      ...initialState,
      authReady: false,
      setAuthReady: () => set({ authReady: true }),
      incrementEnhance: () =>
        set((state) => ({
          usage: {
            ...state.usage,
            enhanceCount: state.usage.enhanceCount + 1,
            lastUsedAtISO: new Date().toISOString(),
          },
        })),
      incrementCopy: () =>
        set((state) => ({
          usage: {
            ...state.usage,
            copyCount: state.usage.copyCount + 1,
            lastUsedAtISO: new Date().toISOString(),
          },
        })),
      markImprovementsSeen: () =>
        set((state) => ({
          flags: { ...state.flags, hasSeenImprovementsOnce: true },
        })),
      dismissExtensionNudge: () =>
        set((state) => ({
          flags: {
            ...state.flags,
            dismissedExtensionNudgeAtCount: state.usage.enhanceCount,
          },
        })),
      dismissSignupNudge: () =>
        set((state) => ({
          flags: {
            ...state.flags,
            dismissedSignupNudgeAtCount: state.usage.enhanceCount,
          },
        })),
      setAuth: (userId, email, tier = "free", userName) =>
        set((state) => ({
          account: { ...state.account, isAuthed: true, userId, email, tier, userName },
        })),
      logout: () =>
        set(() => ({
          account: { ...initialState.account },
          prompts: { ...initialState.prompts },
          savedWorkflowResults: [],
          onboardingProfile: undefined,
        })),
      updateTier: (tier) =>
        set((state) => ({
          account: { ...state.account, tier },
        })),
      savePrompt: (prompt) => {
        set((state) => ({
          prompts: {
            ...state.prompts,
            saved: [prompt, ...state.prompts.saved.filter(p => p.id !== prompt.id)].slice(0, 20),
          },
        }));
        // Fire-and-forget sync to Supabase when authenticated
        const { account } = get();
        if (account.isAuthed && account.userId) {
          supabase.from('saved_prompts').upsert({
            id: prompt.id,
            user_id: account.userId,
            title: prompt.title,
            input: prompt.input,
            enhanced_prompt: prompt.enhancedPrompt,
            improvements: prompt.improvements,
            structure: prompt.structure ?? null,
            created_at: prompt.createdAt,
            last_used: prompt.lastUsed ?? null,
          }).then(({ error }) => {
            if (error) console.error('Failed to sync prompt to Supabase:', error.message);
          });
        }
      },
      setLastPrompt: (promptId) =>
        set((state) => ({
          prompts: {
            ...state.prompts,
            lastPromptId: promptId,
          },
        })),
      getRecentPrompts: () => {
        const state = get();
        return state.prompts.saved.slice(0, 3);
      },
      getLastPrompt: () => {
        const state = get();
        if (!state.prompts.lastPromptId) return null;
        return state.prompts.saved.find(p => p.id === state.prompts.lastPromptId) || null;
      },
      saveWorkflowResult: (result) =>
        set((state) => ({
          savedWorkflowResults: [result, ...state.savedWorkflowResults].slice(0, 10),
        })),
      hydratePrompts: (prompts) =>
        set((state) => ({
          prompts: {
            ...state.prompts,
            saved: prompts,
          },
        })),
      setOnboardingProfile: (profile) =>
        set(() => ({
          onboardingProfile: profile,
          account: {
            ...get().account,
            onboardingComplete: profile.onboardingComplete,
          },
        })),
      setOnboardingComplete: () =>
        set((state) => ({
          account: { ...state.account, onboardingComplete: true },
          onboardingProfile: state.onboardingProfile
            ? { ...state.onboardingProfile, onboardingComplete: true }
            : undefined,
        })),
    }),
    {
      name: 'prompt-pilot-storage',
      partialize: (state) => ({
        version: state.version,
        usage: state.usage,
        flags: state.flags,
        account: state.account,
        prompts: state.prompts,
        savedWorkflowResults: state.savedWorkflowResults,
        onboardingProfile: state.onboardingProfile,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    userName?: string; // Add user name for welcome message
  };
  prompts: {
    saved: SavedPrompt[];
    lastPromptId?: string; // Track the last worked-on prompt
  };
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
  },
  prompts: {
    saved: [],
  },
};

export const usePilotStore = create<PilotStore>()(
  persist(
    (set, get) => ({
      version: 1,
      ...initialState,
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
        set((state) => ({
          account: { ...initialState.account },
        })),
      updateTier: (tier) =>
        set((state) => ({
          account: { ...state.account, tier },
        })),
      savePrompt: (prompt) =>
        set((state) => ({
          prompts: {
            ...state.prompts,
            saved: [prompt, ...state.prompts.saved.filter(p => p.id !== prompt.id)].slice(0, 20), // Keep max 20
          },
        })),
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
    }),
    {
      name: 'prompt-pilot-storage',
      partialize: (state) => ({
        version: state.version,
        usage: state.usage,
        flags: state.flags,
        account: state.account,
        prompts: state.prompts,
      }),
    }
  )
);
import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { PromptInputPage } from "./pages/PromptInputPage";
import { ProcessingPage } from "./pages/ProcessingPage";
import { ResultsPage } from "./pages/ResultsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { PricingPage } from "./pages/PricingPage";
import { CommandCenter } from "./pages/CommandCenterNew";
import { UsagePage } from "./pages/PlaceholderPages";
import { HistoryPage } from "./pages/HistoryPage";
import { AccountPage } from "./pages/AccountPage";
import { PromptLibrary } from "./pages/PromptLibraryNew";
import { AuthPage } from "./pages/AuthPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { usePilotStore } from "./state/pilotStore";

// Guards the route: user must be authenticated.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthed = usePilotStore((s) => s.account.isAuthed);
  const authReady = usePilotStore((s) => s.authReady);

  // Wait for App.tsx to finish the initial getSession() check before
  // deciding to redirect. Without this, a logged-in user gets bounced
  // to /login on every page load because isAuthed is briefly false.
  if (!authReady) {
    return null;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Guards the route: user must be authenticated AND have completed onboarding.
// Used for /dashboard and all /app/* routes so new users always see onboarding first.
function RequireOnboarded({ children }: { children: React.ReactNode }) {
  const isAuthed = usePilotStore((s) => s.account.isAuthed);
  const authReady = usePilotStore((s) => s.authReady);
  const onboardingComplete = usePilotStore((s) => s.account.onboardingComplete);

  if (!authReady) {
    return null;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  // Onboarding requires auth but NOT onboarding completion (avoids infinite redirect)
  {
    path: "/onboarding",
    element: <RequireAuth><OnboardingPage /></RequireAuth>,
  },
  {
    path: "/input",
    element: <PromptInputPage />,
  },
  {
    path: "/processing",
    element: <ProcessingPage />,
  },
  {
    path: "/results",
    element: <ResultsPage />,
  },
  {
    path: "/design-system",
    element: <DesignSystemPage />,
  },
  // Dashboard requires full onboarding
  {
    path: "/dashboard",
    element: <RequireOnboarded><DashboardPage /></RequireOnboarded>,
  },
  // Authenticated + onboarded app routes
  {
    path: "/app",
    element: <RequireOnboarded><CommandCenter /></RequireOnboarded>,
  },
  {
    path: "/app/input",
    element: <RequireOnboarded><PromptInputPage /></RequireOnboarded>,
  },
  {
    path: "/app/library",
    element: <RequireOnboarded><PromptLibrary /></RequireOnboarded>,
  },
  {
    path: "/app/workflows",
    element: <RequireOnboarded><Navigate to="/app" replace /></RequireOnboarded>,
  },
  {
    path: "/app/workflow-processing",
    element: <RequireOnboarded><ProcessingPage useWorkflow /></RequireOnboarded>,
  },
  {
    path: "/app/history",
    element: <RequireOnboarded><HistoryPage /></RequireOnboarded>,
  },
  {
    path: "/app/usage",
    element: <RequireOnboarded><UsagePage /></RequireOnboarded>,
  },
  {
    path: "/app/account",
    element: <RequireOnboarded><AccountPage /></RequireOnboarded>,
  },
]);

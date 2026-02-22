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
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
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
    path: "/app/workflow-processing",
    element: <ProcessingPage useWorkflow />,
  },
  {
    path: "/results",
    element: <ResultsPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/design-system",
    element: <DesignSystemPage />,
  },
  // New authenticated app routes
  {
    path: "/app",
    element: <CommandCenter />,
  },
  {
    path: "/app/input",
    element: <PromptInputPage />,
  },
  {
    path: "/app/library",
    element: <PromptLibrary />,
  },
  {
    path: "/app/workflows",
    element: <Navigate to="/app" replace />,
  },
  {
    path: "/app/history",
    element: <HistoryPage />,
  },
  {
    path: "/app/usage",
    element: <UsagePage />,
  },
  {
    path: "/app/account",
    element: <AccountPage />,
  },
]);
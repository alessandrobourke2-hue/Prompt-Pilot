import { useMemo } from 'react';
import { usePilotStore } from '../state/pilotStore';

export type TemplateRecommendation = {
  id: string;
  title: string;
  description: string;
};

// Maps use case keys to blueprint IDs from PromptLibraryNew
const USE_CASE_MAP: Record<string, string[]> = {
  writing_comms:      ['long-form-outline', 'executive-brief', 'campaign-strategy'],
  policy_compliance:  ['decision-matrix', 'risk-mapping', 'competitive-landscape'],
  client_reports:     ['executive-brief', 'prd-builder', 'market-entry-strategy'],
  team_briefs:        ['decision-matrix', 'user-story-expansion', 'roadmap-prioritization'],
  meeting_summaries:  ['executive-brief', 'user-story-expansion'],
  research_analysis:  ['swot-analysis', 'data-analysis', 'competitive-landscape'],
  customer_service:   ['icp-builder', 'messaging-positioning', 'campaign-strategy'],
};

// Metadata for display (subset of blueprints from PromptLibraryNew)
const BLUEPRINT_META: Record<string, { title: string; description: string }> = {
  'decision-matrix':       { title: 'Decision Matrix', description: 'Evaluate options against weighted criteria' },
  'market-entry-strategy': { title: 'Market Entry Strategy', description: 'Structured analysis for entering new markets' },
  'competitive-landscape': { title: 'Competitive Landscape', description: 'Map competitor positioning and gaps' },
  'risk-mapping':          { title: 'Risk Mapping', description: 'Identify and prioritise strategic risks' },
  'prd-builder':           { title: 'PRD Builder', description: 'Product requirements document scaffold' },
  'user-story-expansion':  { title: 'User Story Expansion', description: 'Elaborate user stories with acceptance criteria' },
  'roadmap-prioritization':{ title: 'Roadmap Prioritisation', description: 'Rank features by impact and effort' },
  'campaign-strategy':     { title: 'Campaign Strategy', description: 'Full-funnel marketing campaign framework' },
  'icp-builder':           { title: 'ICP Definition', description: 'Define your ideal customer profile' },
  'messaging-positioning': { title: 'Messaging Positioning', description: 'Craft differentiated messaging by segment' },
  'landing-page-brief':    { title: 'Landing Page Brief', description: 'Brief for a conversion-focused landing page' },
  'long-form-outline':     { title: 'Long-form Article', description: 'Structured outline for in-depth content' },
  'executive-brief':       { title: 'Executive Brief', description: 'Distill complex analysis into decision briefs' },
  'swot-analysis':         { title: 'SWOT Analysis', description: 'Strengths, weaknesses, opportunities, threats' },
  'data-analysis':         { title: 'Data Analysis', description: 'Framework for interpreting datasets' },
};

export function usePersonalisedPrompts(): TemplateRecommendation[] {
  const profile = usePilotStore((s) => s.onboardingProfile);

  return useMemo(() => {
    if (!profile) {
      // Fallback: show four general blueprints
      return ['executive-brief', 'decision-matrix', 'swot-analysis', 'campaign-strategy'].map(toRec);
    }

    // Collect blueprint IDs ordered by use case priority, deduplicate, cap at 4
    const seen = new Set<string>();
    const ids: string[] = [];

    for (const uc of profile.useCases) {
      for (const id of USE_CASE_MAP[uc] ?? []) {
        if (!seen.has(id)) {
          seen.add(id);
          ids.push(id);
        }
      }
    }

    // If fewer than 4, pad with general ones
    for (const id of ['executive-brief', 'decision-matrix', 'swot-analysis', 'campaign-strategy']) {
      if (ids.length >= 4) break;
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }

    return ids.slice(0, 4).map(toRec);
  }, [profile]);
}

function toRec(id: string): TemplateRecommendation {
  const meta = BLUEPRINT_META[id] ?? { title: id, description: '' };
  return { id, ...meta };
}

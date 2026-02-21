import { SavedPrompt } from '../state/pilotStore';

/**
 * Demo prompts for testing the Command Center
 */
export const DEMO_PROMPTS: SavedPrompt[] = [
  {
    id: 'demo-1',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    title: 'Cold Outreach Email Template',
    input: 'Write a cold outreach email for SaaS product',
    enhancedPrompt: 'Structure a professional cold outreach email template for a B2B SaaS product targeting enterprise decision-makers...',
    improvements: ['Added structure', 'Enhanced clarity', 'Applied persuasion framework'],
    structure: 'Email',
  },
  {
    id: 'demo-2',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    title: 'Product Feature PRD Structure',
    input: 'Create a PRD for new analytics dashboard',
    enhancedPrompt: 'Develop a comprehensive Product Requirements Document for an analytics dashboard feature...',
    improvements: ['Added technical framework', 'Enhanced specifications', 'Applied strategic structure'],
    structure: 'Product',
  },
  {
    id: 'demo-3',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Technical Debug Framework',
    input: 'Debug approach for API performance issues',
    enhancedPrompt: 'Structure a systematic debugging approach for API performance optimization...',
    improvements: ['Added diagnostic structure', 'Enhanced methodology', 'Applied technical framework'],
    structure: 'Tech',
  },
  {
    id: 'demo-4',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'LinkedIn Post Structure',
    input: 'Write about team productivity insights',
    enhancedPrompt: 'Craft an engaging LinkedIn post about team productivity insights with hook, body, and CTA...',
    improvements: ['Added engagement structure', 'Enhanced storytelling', 'Applied social framework'],
    structure: 'LinkedIn',
  },
];

/**
 * Seed demo data into the store
 * Call this function from the Command Center to populate with demo data
 */
export function seedDemoData(savePrompt: (prompt: SavedPrompt) => void, setLastPrompt: (id: string) => void) {
  DEMO_PROMPTS.forEach(prompt => savePrompt(prompt));
  setLastPrompt(DEMO_PROMPTS[0].id); // Set the most recent as last prompt
}

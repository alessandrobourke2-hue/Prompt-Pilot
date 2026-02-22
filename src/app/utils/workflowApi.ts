import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const WORKFLOW_ENGINE_URL = `https://${projectId}.supabase.co/functions/v1/workflow-engine/execute`;

// ============================================================================
// TYPES
// ============================================================================

export interface WorkflowStep {
  id: string;
  type: 'prompt';
  template: string;
  output_key: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface WorkflowDefinition {
  id: string;
  steps: WorkflowStep[];
}

export interface WorkflowExecuteResponse {
  success: boolean;
  workflow_id: string;
  outputs: Record<string, string>;
  trace: Array<{
    step_id: string;
    status: 'success' | 'failed';
    output_key: string;
    latency_ms: number;
    error: string | null;
  }>;
  total_latency_ms: number;
}

// ============================================================================
// SAMPLE WORKFLOW
// ============================================================================

export const SAMPLE_WORKFLOW: WorkflowDefinition = {
  id: 'prompt-enhancement-chain',
  steps: [
    {
      id: 'summarize',
      type: 'prompt',
      template: 'Summarize this in 2 sentences: {{input}}',
      output_key: 'summary',
    },
    {
      id: 'improve',
      type: 'prompt',
      template:
        'Based on this summary: {{summary}}\n\nSuggest 3 specific improvements to the original prompt.',
      output_key: 'improvements',
    },
  ],
};

// ============================================================================
// API HELPER
// ============================================================================

export async function executeWorkflow(
  workflow: WorkflowDefinition,
  inputs: Record<string, string>
): Promise<WorkflowExecuteResponse> {
  const response = await fetch(WORKFLOW_ENGINE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ workflow, inputs }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Workflow engine error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

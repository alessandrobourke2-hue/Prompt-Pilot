import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const DEFAULT_MODEL = "claude-sonnet-4-6";

// ============================================================================
// TYPES
// ============================================================================

interface WorkflowStep {
  id: string;
  type: "prompt";
  template: string;
  output_key: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface WorkflowDefinition {
  id: string;
  steps: WorkflowStep[];
}

interface ExecuteRequest {
  workflow: WorkflowDefinition;
  inputs: Record<string, string>;
}

interface StepTrace {
  step_id: string;
  status: "success" | "failed";
  output_key: string;
  latency_ms: number;
  error: string | null;
}

interface ExecuteResponse {
  success: boolean;
  workflow_id: string;
  outputs: Record<string, string>;
  trace: StepTrace[];
  total_latency_ms: number;
}

interface ClaudeOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// ============================================================================
// HELPERS
// ============================================================================

function interpolateTemplate(template: string, context: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    if (!(key in context)) {
      throw new Error(`Template references unknown variable: "{{${key}}}". Available keys: ${Object.keys(context).join(", ")}`);
    }
    return context[key];
  });
}

async function callClaude(prompt: string, options: ClaudeOptions = {}): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    max_tokens = 1024,
  } = options;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      system: "You are a helpful assistant. Respond clearly and concisely.",
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text;

  if (!text) {
    throw new Error("No content in Anthropic response");
  }

  return text;
}

async function executeWorkflow(
  workflow: WorkflowDefinition,
  inputs: Record<string, string>
): Promise<{ outputs: Record<string, string>; trace: StepTrace[] }> {
  const context: Record<string, string> = { ...inputs };
  const trace: StepTrace[] = [];
  const outputs: Record<string, string> = {};

  for (const step of workflow.steps) {
    const stepStart = Date.now();

    try {
      const interpolated = interpolateTemplate(step.template, context);

      const result = await callClaude(interpolated, {
        model: step.model,
        temperature: step.temperature,
        max_tokens: step.max_tokens,
      });

      context[step.output_key] = result;
      outputs[step.output_key] = result;

      trace.push({
        step_id: step.id,
        status: "success",
        output_key: step.output_key,
        latency_ms: Date.now() - stepStart,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      trace.push({
        step_id: step.id,
        status: "failed",
        output_key: step.output_key,
        latency_ms: Date.now() - stepStart,
        error: message,
      });

      // Stop execution on first failure
      break;
    }
  }

  return { outputs, trace };
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================================================================
// ROUTES
// ============================================================================

app.get("/workflow-engine/health", (c) => {
  return c.json({ status: "ok", service: "workflow-engine" });
});

app.post("/workflow-engine/execute", async (c) => {
  if (!ANTHROPIC_API_KEY) {
    return c.json({ error: "ANTHROPIC_API_KEY not configured" }, 500);
  }

  let body: ExecuteRequest;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const { workflow, inputs } = body;

  if (!workflow?.id || !Array.isArray(workflow?.steps) || workflow.steps.length === 0) {
    return c.json({ error: "workflow.id and non-empty workflow.steps are required" }, 400);
  }

  if (!inputs || typeof inputs !== "object") {
    return c.json({ error: "inputs must be an object" }, 400);
  }

  const totalStart = Date.now();
  const { outputs, trace } = await executeWorkflow(workflow, inputs);
  const allSucceeded = trace.length === workflow.steps.length && trace.every((t) => t.status === "success");

  const response: ExecuteResponse = {
    success: allSucceeded,
    workflow_id: workflow.id,
    outputs,
    trace,
    total_latency_ms: Date.now() - totalStart,
  };

  return c.json(response);
});

// ============================================================================
// ENTRY POINT
// ============================================================================

Deno.serve(app.fetch);

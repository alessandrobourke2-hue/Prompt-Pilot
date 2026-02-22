// Migrated from OpenAI to Anthropic Claude
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-4-6";

// ============================================================================
// TYPES
// ============================================================================

type Level = 'standard' | 'advanced' | 'expert';
type Intent = 'tech' | 'prd' | 'marketing' | 'strategy';

interface EnhanceRequest {
  input: string;
  context?: {
    intent_override?: string;
    mode?: string; // 'standard' | 'elevated' | 'expert'
    level?: Level;
    elevate_options?: {
      depth?: Level;
      tone?: string;
      structure?: string;
      extraNotes?: string;
    };
    framework?: string;
    audience?: string;
    channel?: string;
    tone?: string;
    goal?: string;
    constraints?: string[];
    emphasis?: string[];
  };
}

interface EnhanceResponse {
  success: boolean;
  title: string;
  enhanced_prompt: string;
  improvements: string[];
  assumptions: string[];
  follow_up_questions: string[];
  intent?: Intent;
  meta: {
    model: string;
    latency_ms: number;
    intent_detected: Intent;
    routed_by: 'override' | 'rule' | 'classifier' | 'default';
    confidence: number;
    level: Level;
    quality_retry: boolean;
  };
  blocks?: {
    role?: string;
    goal?: string;
    context?: string;
    output_format?: string;
    constraints?: string;
    validation?: string;
  };
}

// ============================================================================
// TOKEN OPTIMIZATION POLICY
// ============================================================================

const TOKEN_POLICY: Record<Level, { maxTokens: number; temperature: number }> = {
  standard: { maxTokens: 900, temperature: 0.4 },
  advanced: { maxTokens: 1400, temperature: 0.6 },
  expert: { maxTokens: 1800, temperature: 0.5 }
};

// ============================================================================
// LEVEL RESOLUTION
// ============================================================================

function resolveLevel(context: any): Level {
  // Priority order:
  // 1. context.level
  // 2. context.elevate_options.depth
  // 3. context.mode mapping
  
  if (context?.level && ['standard', 'advanced', 'expert'].includes(context.level)) {
    return context.level as Level;
  }
  
  if (context?.elevate_options?.depth && ['standard', 'advanced', 'expert'].includes(context.elevate_options.depth)) {
    return context.elevate_options.depth as Level;
  }
  
  if (context?.mode === 'elevated') {
    return 'advanced';
  }
  
  if (context?.mode === 'expert') {
    return 'expert';
  }
  
  return 'standard';
}

// ============================================================================
// FALLBACK RESPONSE
// ============================================================================

const getFallbackResponse = (input: string): EnhanceResponse => ({
  success: true,
  title: "Enhanced Prompt (Fallback)",
  enhanced_prompt: `**Role:** Act as an expert assistant.

**Goal:** ${input}

**Context:** Provide a clear, structured, and actionable response.

**Output format:**
- Clear and structured format
- Appropriate formatting

**Constraints:**
- Maintain a professional tone
- Be actionable and specific`,
  improvements: [
    "Added expert role assignment",
    "Clarified output expectations",
    "Defined professional tone",
    "Requested structured format"
  ],
  assumptions: [],
  follow_up_questions: [],
  meta: {
    model: "fallback",
    latency_ms: 0,
    intent_detected: 'tech' as Intent,
    routed_by: 'default',
    confidence: 0,
    level: 'standard',
    quality_retry: false
  }
});

// ============================================================================
// INTENT DETECTION
// ============================================================================

// Map frontend intent values to backend Intent type
function mapIntentOverride(intentOverride: string): Intent | null {
  const intentMap: Record<string, Intent> = {
    'tech': 'tech',
    'product': 'prd',
    'prd': 'prd',
    'marketing': 'marketing',
    'linkedin': 'marketing',
    'email': 'marketing',
    'outreach': 'marketing',
    'blog': 'marketing',
    'strategy': 'strategy'
  };
  
  return intentMap[intentOverride.toLowerCase()] || null;
}

function detectIntentByRules(input: string): Intent | null {
  const lowerInput = input.toLowerCase();
  
  // Tech
  if (lowerInput.includes('bug') || lowerInput.includes('error') || lowerInput.includes('debug') || lowerInput.includes('code') || lowerInput.includes('fix')) {
    return 'tech';
  }
  
  // PRD
  if (lowerInput.includes('product') || lowerInput.includes('prd') || lowerInput.includes('feature') || lowerInput.includes('user story')) {
    return 'prd';
  }
  
  // Marketing
  if (lowerInput.includes('marketing') || lowerInput.includes('advertising') || lowerInput.includes('sales') || lowerInput.includes('promotion') || lowerInput.includes('linkedin') || lowerInput.includes('email') || lowerInput.includes('outreach') || lowerInput.includes('blog')) {
    return 'marketing';
  }
  
  // Strategy
  if (lowerInput.includes('strategy') || lowerInput.includes('plan') || lowerInput.includes('roadmap') || lowerInput.includes('decision')) {
    return 'strategy';
  }
  
  return null;
}

// ============================================================================
// INTENT TEMPLATES
// ============================================================================

function getIntentTemplate(intent: Intent): string {
  const templates = {
    tech: `The enhanced prompt MUST include these labeled sections:

**Role:** [Define the expert role]
**Goal:** [State the clear objective]
**Context:** [Provide relevant background]
**Output format:**
- Problem diagnosis
- Likely causes
- Step-by-step fix instructions
- Code snippet (if relevant)
- Tests/validation steps
**Constraints:**
- Technically accurate
- Clear explanations
- Includes error handling
**Success criteria:**
- Reproducible solution
- Best practices followed
- Edge cases considered`,

    prd: `The enhanced prompt MUST include these labeled sections:

**Role:** [Define the expert role]
**Goal:** [State the clear objective]
**Context:** [Provide relevant background]
**Output format:**
- Problem statement
- Goals / non-goals
- User stories
- Acceptance criteria
- Edge cases
- Success metrics
**Constraints:**
- Specific and measurable
- User-focused
- Technical feasibility considered
**Success criteria:**
- Clear requirements
- Testable criteria
- Stakeholder alignment`,

    marketing: `The enhanced prompt MUST include these labeled sections:

**Role:** [Define the expert role]
**Goal:** [State the clear objective]
**Context:** [Provide relevant background]
**Output format:**
- Target audience
- Problem → value proposition
- Clear CTA
- Optional PS
**Constraints:**
- 120 words max
- No hype or pushy language
- Personalized approach
**Success criteria:**
- High response rate potential
- Clear value proposition
- Respectful and professional`,

    strategy: `The enhanced prompt MUST include these labeled sections:

**Role:** [Define the expert role]
**Goal:** [State the clear objective]
**Context:** [Provide relevant background]
**Output format:**
- Situation overview
- Key insights
- 3 strategic options
- Recommendation + rationale
- Risks and mitigations
- Next steps
**Constraints:**
- Data-driven
- Considers multiple perspectives
- Actionable recommendations
**Success criteria:**
- Clear decision framework
- Risk assessment
- Implementation path`
  };
  
  return templates[intent];
}

// ============================================================================
// ENABLE LOGGER
// ============================================================================

app.use('*', logger(console.log));

// ============================================================================
// ENABLE CORS
// ============================================================================

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

app.get("/make-server-e52adb92/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================================
// SIGNUP ENDPOINT
// ============================================================================

app.post("/make-server-e52adb92/signup", async (c) => {
  const { email, password } = await c.req.json();
  
  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    console.error("Signup error:", error);
    return c.json({ error: error.message }, 400);
  }

  // Auto sign-in to get session token
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    return c.json({ error: signInError.message }, 400);
  }

  return c.json(signInData);
});

// ============================================================================
// ENHANCEMENT ENDPOINT
// ============================================================================

app.post("/make-server-e52adb92/enhance", async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return c.json({ error: "Invalid JSON in request body" }, 400);
    }

    const { input, context = {} }: EnhanceRequest = body;

    console.log("Enhancement request received:", { input: input?.substring(0, 100), context });

    // Validation
    if (!input || typeof input !== "string") {
      console.error("Validation error: Input is required and must be a string");
      return c.json({ error: "Input is required and must be a string" }, 400);
    }

    if (input.length < 10) {
      console.error("Validation error: Input too short");
      return c.json({ error: "Input must be at least 10 characters" }, 400);
    }

    if (input.length > 8000) {
      console.error("Validation error: Input too long");
      return c.json({ error: "Input must be less than 8000 characters" }, 400);
    }

    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not configured, using fallback");
      return c.json(getFallbackResponse(input));
    }

    // Determine intent and routing
    let intent: Intent;
    let routedBy: 'override' | 'rule' | 'classifier' | 'default' = 'default';
    
    if (context.intent_override && context.intent_override !== 'auto') {
      // User forced an intent
      const mappedIntent = mapIntentOverride(context.intent_override);
      if (mappedIntent) {
        intent = mappedIntent;
        routedBy = 'override';
      } else {
        console.error("Invalid intent override provided");
        return c.json({ error: "Invalid intent override provided" }, 400);
      }
    } else {
      // Try keyword rules first
      const ruleBasedIntent = detectIntentByRules(input);
      if (ruleBasedIntent) {
        intent = ruleBasedIntent;
        routedBy = 'rule';
      } else {
        // Default to tech if no intent detected
        intent = 'tech';
        routedBy = 'default';
      }
    }

    console.log("Intent determined:", { intent, routedBy });

    // Resolve level and get token policy
    const level = resolveLevel(context);
    const tokenConfig = TOKEN_POLICY[level];
    
    console.log("Level resolved:", { level, tokenConfig });

    // Get intent-specific template
    const intentTemplate = getIntentTemplate(intent);

    // Build system prompt with intent-specific guidance
    const systemPrompt = `You are a prompt engineering expert specializing in ${intent} content. Your task is to transform user prompts into highly effective, structured prompts that get better results from AI models.

${intentTemplate}

Also include:
- 2-3 assumptions you're making about the user's needs
- 1-2 optional follow-up questions (ONLY if essential for clarification)

Return your response as JSON matching this exact structure:
{
  "title": "A concise title for this enhanced prompt (max 60 chars)",
  "enhanced_prompt": "The complete enhanced prompt with all required sections clearly labeled (Role, Goal, Context, Output format, Constraints, Success criteria, and optional Clarifying questions)",
  "improvements": ["List of 3-5 specific improvements you made", "Each as a short phrase"],
  "assumptions": ["Assumption 1", "Assumption 2", "Assumption 3"],
  "follow_up_questions": ["Question 1 (if needed)", "Question 2 (if needed)"]
}

CRITICAL: The enhanced_prompt MUST include labeled sections for:
- Role:
- Goal:
- Output format:
- Constraints:

Without these sections, the response is invalid.`;

    // Build user prompt with context
    let userPrompt = `Original prompt: "${input}"`;
    
    if (context.channel) {
      userPrompt += `\nIntended channel: ${context.channel}`;
    }
    if (context.tone) {
      userPrompt += `\nDesired tone: ${context.tone}`;
    }
    if (context.audience) {
      userPrompt += `\nTarget audience: ${context.audience}`;
    }
    if (context.goal) {
      userPrompt += `\nGoal: ${context.goal}`;
    }
    if (context.constraints && context.constraints.length > 0) {
      userPrompt += `\nConstraints: ${context.constraints.join(", ")}`;
    }
    if (context.emphasis && context.emphasis.length > 0) {
      userPrompt += `\nEmphasis: ${context.emphasis.join(", ")}`;
    }

    userPrompt += "\n\nEnhance this prompt following the intent-specific template.";

    const startTime = Date.now();

    // Helper function to check quality
    const checkQuality = (content: any): boolean => {
      if (!content || !content.enhanced_prompt || typeof content.enhanced_prompt !== 'string') {
        return false;
      }
      
      const prompt = content.enhanced_prompt.toLowerCase();
      const hasRole = prompt.includes('role:');
      const hasGoal = prompt.includes('goal:');
      const hasOutputFormat = prompt.includes('output format:');
      const hasConstraints = prompt.includes('constraints:');
      const hasEnoughImprovements = Array.isArray(content.improvements) && content.improvements.length >= 3;
      
      return hasRole && hasGoal && hasOutputFormat && hasConstraints && hasEnoughImprovements;
    };

    // Function to call Anthropic (can retry once for quality)
    const callAnthropic = async (isRetry: boolean = false): Promise<any> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        let systemPromptToUse = systemPrompt;

        if (isRetry) {
          systemPromptToUse += `\n\nIMPORTANT: Previous attempt failed quality checks. Please ensure the enhanced_prompt includes ALL required sections with proper labels: Role:, Goal:, Output format:, Constraints:, Success criteria:. And provide at least 3 improvements.`;
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: ANTHROPIC_MODEL,
            system: systemPromptToUse,
            messages: [
              { role: "user", content: userPrompt }
            ],
            temperature: tokenConfig.temperature,
            max_tokens: tokenConfig.maxTokens,
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Anthropic API error: ${response.status} - ${errorData}`);
          return null;
        }

        const data = await response.json();
        const aiContent = data.content[0]?.text;

        if (!aiContent) {
          console.error("No content in Anthropic response");
          return null;
        }

        try {
          const parsedContent = JSON.parse(aiContent);
          return parsedContent;
        } catch (parseError) {
          console.error("Failed to parse AI response as JSON:", parseError);
          return null;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          console.error("Anthropic request timeout");
        } else {
          console.error("Anthropic request failed:", fetchError);
        }

        return null;
      }
    };

    // Try to get a good response, with one retry if quality check fails
    let parsedContent = await callAnthropic(false);

    if (parsedContent && !checkQuality(parsedContent)) {
      console.log("Quality check failed, retrying with quality fix instruction...");
      const retryContent = await callAnthropic(true);
      if (retryContent && checkQuality(retryContent)) {
        parsedContent = retryContent;
      }
    }

    // If still no valid content, use fallback
    if (!parsedContent || !parsedContent.title || !parsedContent.enhanced_prompt) {
      console.error("Failed to generate valid content after retry");
      const fallback = getFallbackResponse(input);
      fallback.intent = intent;
      fallback.meta.routed_by = routedBy;
      return c.json(fallback);
    }

    const latency = Date.now() - startTime;

    // Build final response
    const enhancedResponse: EnhanceResponse = {
      success: true,
      title: parsedContent.title,
      intent: intent,
      enhanced_prompt: parsedContent.enhanced_prompt,
      improvements: Array.isArray(parsedContent.improvements) ? parsedContent.improvements.slice(0, 5) : [],
      assumptions: Array.isArray(parsedContent.assumptions) ? parsedContent.assumptions.slice(0, 3) : [],
      follow_up_questions: Array.isArray(parsedContent.follow_up_questions) ? parsedContent.follow_up_questions.slice(0, 2) : [],
      meta: {
        model: ANTHROPIC_MODEL,
        latency_ms: latency,
        intent_detected: intent,
        routed_by: routedBy,
        confidence: 0.95, // Placeholder confidence level
        level: level,
        quality_retry: parsedContent !== null
      },
      blocks: {
        role: parsedContent.enhanced_prompt.split('\n').find(line => line.startsWith('**Role:**'))?.replace('**Role:**', '').trim(),
        goal: parsedContent.enhanced_prompt.split('\n').find(line => line.startsWith('**Goal:**'))?.replace('**Goal:**', '').trim(),
        context: parsedContent.enhanced_prompt.split('\n').find(line => line.startsWith('**Context:**'))?.replace('**Context:**', '').trim(),
        output_format: parsedContent.enhanced_prompt.split('\n').find(line => line.startsWith('**Output format:**'))?.replace('**Output format:**', '').trim(),
        constraints: parsedContent.enhanced_prompt.split('\n').find(line => line.startsWith('**Constraints:**'))?.replace('**Constraints:**', '').trim(),
        validation: parsedContent.enhanced_prompt.split('\n').find(line => line.startsWith('**Validation:**'))?.replace('**Validation:**', '').trim()
      }
    };

    return c.json(enhancedResponse);

  } catch (error) {
    console.error("Enhancement error:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return c.json({ 
      error: "Internal server error",
      details: error?.message || "Unknown error"
    }, 500);
  }
});

Deno.serve(app.fetch);
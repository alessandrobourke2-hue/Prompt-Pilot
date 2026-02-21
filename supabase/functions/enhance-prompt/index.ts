const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";

interface EnhanceRequest {
  input: string;
  context?: {
    audience?: string;
    channel?: string;
    tone?: string;
    goal?: string;
    constraints?: string[];
  };
}

interface EnhanceResponse {
  title: string;
  enhanced_prompt: string;
  improvements: string[];
  meta: {
    model: string;
    latency_ms: number;
  };
}

// Fallback response if AI fails
const getFallbackResponse = (input: string): EnhanceResponse => ({
  title: "Enhanced Prompt (Fallback)",
  enhanced_prompt: `Act as an expert assistant. ${input}\n\nProvide a clear, structured, and actionable response. Use appropriate formatting and maintain a professional tone.`,
  improvements: [
    "Added expert role assignment",
    "Clarified output expectations",
    "Defined professional tone",
    "Requested structured format"
  ],
  meta: {
    model: "fallback",
    latency_ms: 0
  }
});

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { input, context = {} }: EnhanceRequest = await req.json();

    // Validation
    if (!input || typeof input !== "string") {
      return new Response(
        JSON.stringify({ error: "Input is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (input.length < 10) {
      return new Response(
        JSON.stringify({ error: "Input must be at least 10 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (input.length > 8000) {
      return new Response(
        JSON.stringify({ error: "Input must be less than 8000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify(getFallbackResponse(input)),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build system prompt
    const systemPrompt = `You are a prompt engineering expert. Your task is to transform user prompts into highly effective, structured prompts that get better results from AI models.

Analyze the input and enhance it by:
- Adding clear role definitions
- Structuring the request with explicit steps
- Defining output format expectations
- Adding relevant constraints for quality
- Specifying tone and style requirements
- Making implicit requirements explicit

Return your response as JSON matching this exact structure:
{
  "title": "A concise title for this enhanced prompt (max 60 chars)",
  "enhanced_prompt": "The complete enhanced prompt, ready to use",
  "improvements": ["List of 3-5 specific improvements you made", "Each as a short phrase"]
}`;

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

    userPrompt += "\n\nEnhance this prompt.";

    const startTime = Date.now();

    // Call OpenAI with timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`OpenAI API error: ${response.status} - ${errorData}`);
        
        return new Response(
          JSON.stringify(getFallbackResponse(input)),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      // Parse the AI response
      const aiContent = data.choices[0]?.message?.content;
      if (!aiContent) {
        console.error("No content in OpenAI response");
        return new Response(
          JSON.stringify(getFallbackResponse(input)),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let parsedContent;
      try {
        parsedContent = JSON.parse(aiContent);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        return new Response(
          JSON.stringify(getFallbackResponse(input)),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate response structure
      if (!parsedContent.title || !parsedContent.enhanced_prompt || !Array.isArray(parsedContent.improvements)) {
        console.error("Invalid response structure from AI");
        return new Response(
          JSON.stringify(getFallbackResponse(input)),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Build final response
      const enhancedResponse: EnhanceResponse = {
        title: parsedContent.title,
        enhanced_prompt: parsedContent.enhanced_prompt,
        improvements: parsedContent.improvements.slice(0, 5), // Max 5 improvements
        meta: {
          model: OPENAI_MODEL,
          latency_ms: latency
        }
      };

      return new Response(
        JSON.stringify(enhancedResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error("OpenAI request timeout");
      } else {
        console.error("OpenAI request failed:", fetchError);
      }
      
      return new Response(
        JSON.stringify(getFallbackResponse(input)),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Enhancement error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

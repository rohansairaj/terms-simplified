import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a legal-text simplifier. Your job is to read Terms & Conditions (or any legal document) and rewrite it so a 12-year-old can understand it. The simplified version must be readable in under 60 seconds.

You MUST respond using the following JSON structure exactly — no extra keys, no markdown, just valid JSON:

{
  "readingTime": "<estimated reading time, e.g. '~40 sec'>",
  "riskScore": <number from 1 to 10>,
  "verdict": "<one of: Safe, Caution, Risky>",
  "summary": ["<bullet 1>", "<bullet 2>", ... max 5 bullets],
  "agreements": ["<what user agrees to 1>", "<what user agrees to 2>", ...],
  "risks": ["<risk 1>", "<risk 2>", ...]
}

Rules:
- Use simple, everyday words a child would understand
- No legal jargon at all
- summary: max 5 bullet points covering the most important things
- agreements: list what the user is agreeing to
- risks: list hidden charges, auto-renewals, data sharing, lawsuit waivers, etc.
- riskScore: 1 = very safe, 10 = very risky
- verdict: "Safe" if score ≤ 3, "Caution" if 4-6, "Risky" if ≥ 7
- Keep each bullet under 25 words
- Be honest — if the terms are bad, say so clearly`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Please provide at least 20 characters of text to analyze." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Truncate very long texts to avoid token limits
    const truncated = text.trim().slice(0, 30000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze and simplify these terms & conditions:\n\n${truncated}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_analysis",
              description: "Return the structured analysis of the terms & conditions",
              parameters: {
                type: "object",
                properties: {
                  readingTime: { type: "string", description: "Estimated reading time" },
                  riskScore: { type: "number", minimum: 1, maximum: 10 },
                  verdict: { type: "string", enum: ["Safe", "Caution", "Risky"] },
                  summary: {
                    type: "array",
                    items: { type: "string" },
                    maxItems: 5,
                    description: "Max 5 bullet points summarizing the key points",
                  },
                  agreements: {
                    type: "array",
                    items: { type: "string" },
                    description: "What the user is agreeing to",
                  },
                  risks: {
                    type: "array",
                    items: { type: "string" },
                    description: "Risks like hidden charges, auto-renewals, data sharing",
                  },
                },
                required: ["readingTime", "riskScore", "verdict", "summary", "agreements", "risks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();

    // Extract from tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      // Fallback: try to parse content directly
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("No valid response from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("simplify-terms error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed to analyze terms" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

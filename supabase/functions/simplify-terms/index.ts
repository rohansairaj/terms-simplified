import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANALYSIS_SYSTEM_PROMPT = `You are a legal-text simplifier. Your job is to read Terms & Conditions (or any legal document) and rewrite it so a 12-year-old can understand it. The simplified version must be readable in under 60 seconds.

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

async function callAI(apiKey: string, model: string, system: string, user: string) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw { status: 429, message: "Rate limit reached. Please try again in a moment." };
    if (status === 402) throw { status: 402, message: "AI credits exhausted. Please add funds in Settings." };
    const errText = await response.text();
    console.error("AI gateway error:", status, errText);
    throw { status: 500, message: "AI gateway error" };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw { status: 500, message: "No valid response from AI" };
  return JSON.parse(content);
}

const translationPrompts: Record<string, string> = {
  hindi: `Translate all string values in this JSON to Hindi (हिन्दी) using Devanagari script. Keep JSON keys in English. Keep "verdict" and "readingTime" values in English. Use simple Hindi that a child would understand. Return ONLY valid JSON, no markdown.`,
  tamil: `Translate all string values in this JSON to Tamil (தமிழ்) using Tamil script. Keep JSON keys in English. Keep "verdict" and "readingTime" values in English. Use simple Tamil that a child would understand. Return ONLY valid JSON, no markdown.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = "english" } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Please provide at least 20 characters of text to analyze." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const truncated = text.trim().slice(0, 30000);

    // Step 1: Analyze in English
    let analysis = await callAI(
      LOVABLE_API_KEY,
      "google/gemini-2.5-flash",
      ANALYSIS_SYSTEM_PROMPT,
      `Analyze and simplify these terms & conditions:\n\n${truncated}`
    );

    // Step 2: Translate if needed
    if (language !== "english" && translationPrompts[language]) {
      console.log("Translating to:", language);
      analysis = await callAI(
        LOVABLE_API_KEY,
        "google/gemini-2.5-flash",
        translationPrompts[language],
        JSON.stringify(analysis)
      );
      console.log("Translation result sample:", JSON.stringify(analysis).substring(0, 200));
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("simplify-terms error:", e);
    const status = e.status || 500;
    const message = e.message || (e instanceof Error ? e.message : "Failed to analyze terms");
    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const buildPrompt = (language: string, text: string) => {
  const truncated = text.trim().slice(0, 30000);

  if (language === "hindi") {
    return {
      system: `आप एक कानूनी-पाठ सरलीकरणकर्ता हैं। आपका काम नियम और शर्तों को इतना सरल करना है कि एक 12 साल का बच्चा समझ सके।

आपको यह JSON ढांचा लौटाना होगा (कोई markdown नहीं, सिर्फ valid JSON):

{
  "readingTime": "~40 sec",
  "riskScore": 8,
  "verdict": "Risky",
  "summary": ["यह ऐप आपका नाम और फ़ोन नंबर विज्ञापनदाताओं को बेचता है।", "वे हर महीने अपने आप पैसे काट लेते हैं।"],
  "agreements": ["आप अपनी निजी जानकारी साझा करने के लिए सहमत हैं।"],
  "risks": ["आपकी जानकारी अजनबियों को बेची जाती है।"]
}

नियम:
- summary, agreements, risks के सभी string values हिन्दी में लिखें (देवनागरी लिपि)
- verdict हमेशा अंग्रेज़ी में: "Safe", "Caution", या "Risky"
- readingTime अंग्रेज़ी में: "~40 sec"
- सरल शब्द इस्तेमाल करें जो बच्चा समझ सके
- कोई कानूनी शब्दावली नहीं
- summary: अधिकतम 5 बिंदु
- ईमानदार रहें`,
      fewShot: {
        user: "इन नियम और शर्तों का विश्लेषण करें:\n\nWe collect your email and may share it with partners.",
        assistant: JSON.stringify({
          readingTime: "~10 sec",
          riskScore: 5,
          verdict: "Caution",
          summary: ["वे आपका ईमेल पता इकट्ठा करते हैं।", "वे आपका ईमेल दूसरी कंपनियों को दे सकते हैं।"],
          agreements: ["आप अपना ईमेल देने के लिए सहमत हैं।", "आप सहमत हैं कि वे इसे दूसरों को दे सकते हैं।"],
          risks: ["आपका ईमेल अजनबी कंपनियों को दिया जा सकता है।"],
        }),
      },
      user: `इन नियम और शर्तों का विश्लेषण करें और सरल बनाएं:\n\n${truncated}`,
    };
  }

  if (language === "tamil") {
    return {
      system: `நீங்கள் ஒரு சட்ட-உரை எளிமைப்படுத்துபவர். உங்கள் வேலை விதிமுறைகள் மற்றும் நிபந்தனைகளை 12 வயது குழந்தை புரிந்துகொள்ளும் அளவுக்கு எளிமையாக்குவது.

இந்த JSON கட்டமைப்பை திருப்பி அனுப்ப வேண்டும் (markdown இல்லை, valid JSON மட்டும்):

{
  "readingTime": "~40 sec",
  "riskScore": 8,
  "verdict": "Risky",
  "summary": ["இந்த ஆப் உங்கள் பெயரையும் தொலைபேசி எண்ணையும் விளம்பரதாரர்களுக்கு விற்கிறது.", "அவர்கள் ஒவ்வொரு மாதமும் தானாகவே பணம் எடுக்கிறார்கள்."],
  "agreements": ["உங்கள் தனிப்பட்ட தகவல்களைப் பகிர ஒப்புக்கொள்கிறீர்கள்."],
  "risks": ["உங்கள் தகவல்கள் அறிமுகமில்லாதவர்களுக்கு விற்கப்படுகிறது."]
}

விதிகள்:
- summary, agreements, risks இன் அனைத்து string மதிப்புகளும் தமிழில் எழுதவும் (தமிழ் எழுத்து)
- verdict எப்போதும் ஆங்கிலத்தில்: "Safe", "Caution", அல்லது "Risky"
- readingTime ஆங்கிலத்தில்: "~40 sec"
- குழந்தை புரிந்துகொள்ளும் எளிய வார்த்தைகளைப் பயன்படுத்தவும்
- சட்ட வார்த்தைகள் வேண்டாம்
- summary: அதிகபட்சம் 5 புள்ளிகள்
- நேர்மையாக இருங்கள்`,
      fewShot: {
        user: "இந்த விதிமுறைகளை பகுப்பாய்வு செய்யுங்கள்:\n\nWe collect your email and may share it with partners.",
        assistant: JSON.stringify({
          readingTime: "~10 sec",
          riskScore: 5,
          verdict: "Caution",
          summary: ["அவர்கள் உங்கள் மின்னஞ்சல் முகவரியை சேகரிக்கிறார்கள்.", "அவர்கள் உங்கள் மின்னஞ்சலை மற்ற நிறுவனங்களுக்கு கொடுக்கலாம்."],
          agreements: ["உங்கள் மின்னஞ்சலை கொடுக்க ஒப்புக்கொள்கிறீர்கள்.", "அவர்கள் அதை மற்றவர்களுக்கு பகிர ஒப்புக்கொள்கிறீர்கள்."],
          risks: ["உங்கள் மின்னஞ்சல் தெரியாத நிறுவனங்களுக்கு கொடுக்கப்படலாம்."],
        }),
      },
      user: `இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளை பகுப்பாய்வு செய்து எளிமையாக்கவும்:\n\n${truncated}`,
    };
  }

  // English
  return {
    system: `You are a legal-text simplifier. Your job is to read Terms & Conditions (or any legal document) and rewrite it so a 12-year-old can understand it. The simplified version must be readable in under 60 seconds.

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
- Be honest — if the terms are bad, say so clearly`,
    user: `Analyze and simplify these terms & conditions:\n\n${truncated}`,
  };
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
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = buildPrompt(language, text);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: language === "english" ? "google/gemini-2.5-flash" : "openai/gpt-5-mini",
        messages: [
          { role: "system", content: prompt.system },
          ...(prompt.fewShot ? [
            { role: "user", content: prompt.fewShot.user },
            { role: "assistant", content: prompt.fewShot.assistant },
          ] : []),
          { role: "user", content: prompt.user },
        ],
        response_format: { type: "json_object" },
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
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No valid response from AI");
    }

    const analysis = JSON.parse(content);

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

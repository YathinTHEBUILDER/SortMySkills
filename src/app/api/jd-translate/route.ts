import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { callGroqAIWithRepair } from "@/lib/ai/groq-router";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Rate-limit check: 3 requests per 10 minutes
  const ip = await getClientIp();
  const limitResult = await rateLimit(`jd-translate:${ip}`, 3, 10 * 60 * 1000);

  if (!limitResult.success) {
    const resetSeconds = Math.ceil((limitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      {
        error:
          "You have used all 3 translations for this 10 minute window.",
        remainingSeconds: resetSeconds > 0 ? resetSeconds : 600,
      },
      { status: 429 }
    );
  }

  // Parse body
  let body: { jobDescription?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { jobDescription } = body;

  if (!jobDescription || jobDescription.length < 100) {
    return NextResponse.json(
      { error: "Too short to analyze." },
      { status: 400 }
    );
  }

  try {
    const systemPrompt = "You are a brutally honest senior engineer who has hired people for 10 years. You have zero tolerance for corporate nonsense. You translate job descriptions into exactly what the company actually means. You are direct, specific, and always useful. You respond only in valid JSON with no markdown, no explanation.";
    const userPrompt = `Translate this job description into plain honest English for a college student.\n\nJob Description:\n${jobDescription}\n\nRespond ONLY with valid JSON matching this schema exactly:\n{\n  "roleTitle": "string",\n  "whatTheyActuallyWant": "string",\n  "whatYouWillActuallyDo": ["string array of 4 to 6 items"],\n  "experienceTranslation": "string",\n  "theMustHaveSkill": "string",\n  "theNiceToHaves": ["string array of 2 to 4 items"],\n  "salaryHonesty": "string",\n  "companyVibe": "string",\n  "redFlags": ["string array of 0 to 3 items"],\n  "greenFlags": ["string array of 0 to 3 items"],\n  "shouldYouApply": "yes | no | maybe",\n  "shouldYouApplyReason": "string",\n  "theHonestSummary": "string"\n}`;

    const aiResult = await callGroqAIWithRepair({
      featureName: "jd-translate",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 2000,
      jsonMode: true,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { error: aiResult.error || "Translation service returned an error. Try again." },
        { status: 500 }
      );
    }

    const parsed = aiResult.data as Record<string, unknown>;

    // Supabase Persistence (Step 8)
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("ai_generations").insert({
        user_id: user.id,
        feature_name: "jd-translate",
        prompt_inputs: { jobDescription },
        generated_output: parsed,
      });
    }

    return NextResponse.json({ translation: parsed });
  } catch (err: unknown) {
    console.error("[jd-translate] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}


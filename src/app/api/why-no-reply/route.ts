import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { callGroqAIWithRepair } from "@/lib/ai/groq-router";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Rate-limit check: 3 requests per 15 minutes
  const ip = await getClientIp();
  const limitResult = await rateLimit(`why-no-reply:${ip}`, 3, 15 * 60 * 1000);

  if (!limitResult.success) {
    const resetSeconds = Math.ceil((limitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: "3 diagnoses per 15 minutes. Read the feedback you already have.",
        remainingSeconds: resetSeconds > 0 ? resetSeconds : 900,
      },
      { status: 429 }
    );
  }

  // Parse body
  let body: { jobDescription?: string; resumeText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { jobDescription, resumeText } = body;

  if (
    !jobDescription ||
    jobDescription.length < 100 ||
    !resumeText ||
    resumeText.length < 100
  ) {
    return NextResponse.json(
      { error: "Please paste the full job description and your complete resume." },
      { status: 400 }
    );
  }

  try {
    const systemPrompt = "You are a senior recruiter and hiring manager who has reviewed over 15000 resumes across tech companies in India and globally. You are direct, specific, and honest. You have seen every mistake students make. You know exactly why resumes get ignored. You do not give generic advice. You look at the specific resume against the specific job and tell the truth. You respond only in valid JSON with no markdown fences.";
    const userPrompt = `A college student applied for this job and got no reply. Diagnose exactly why.

JOB DESCRIPTION:
---
${jobDescription}
---

STUDENT RESUME:
---
${resumeText}
---

Identify the single most likely reason this specific resume got no reply to this specific job. Not a list. One root cause. Then give one specific fix with exact words they can use immediately.

Respond ONLY with valid JSON matching this exact schema:

{
  "diagnosis": {
    "rootCause": "string — one sentence, brutally specific to this resume and this job, not generic",
    "evidence": "string — 2 sentences quoting actual words from both the resume and JD to support the diagnosis",
    "severity": "critical | major | minor",
    "category": "skills_mismatch | weak_projects | poor_resume_writing | overqualified | underqualified | wrong_role | ats_keywords | no_experience | formatting"
  },
  "theFix": {
    "whatToChange": "string — exactly which section and what to do, specific not vague",
    "exactWording": "string — the actual text they should paste into their resume right now, no hedging, no 'something like', the real words",
    "timeToFix": "string — realistic time estimate e.g. '20 minutes' or '2 days if you need to build the project first'"
  },
  "competitiveness": {
    "rating": "not_competitive | slightly_competitive | competitive | very_competitive",
    "honest": "string — 2 sentences on how this resume stacks up against other applicants for this role right now",
    "theirAdvantage": "string — one genuine thing this resume has going for it, or honest statement if nothing"
  },
  "oneMoreThing": "string — one additional specific observation a recruiter would notice, one sentence only"
}`;

    const aiResult = await callGroqAIWithRepair({
      featureName: "why-no-reply",
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
        { error: aiResult.error || "Failed to generate diagnosis. Please try again." },
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
        feature_name: "why-no-reply",
        prompt_inputs: { jobDescription, resumeText },
        generated_output: parsed,
      });
    }

    return NextResponse.json({ result: parsed });
  } catch (err: unknown) {
    console.error("[why-no-reply] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}


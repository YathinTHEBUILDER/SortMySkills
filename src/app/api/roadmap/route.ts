import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { callGroqAIWithRepair } from "@/lib/ai/groq-router";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { VERIFIED_RESOURCES, getRelevantResources, matchVerifiedResource } from "@/data/verified-resources";
import { roadmapResultSchema } from "@/lib/ai/roadmap-schema";

export async function POST(req: NextRequest) {
  // 1. Rate limiting check: 3 requests per 15 minutes
  const ip = await getClientIp();
  const limitResult = await rateLimit(`roadmap:${ip}`, 3, 15 * 60 * 1000);
  if (!limitResult.success) {
    const resetSeconds = Math.ceil((limitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { 
        error: "You have requested too many roadmaps. Limit is 3 requests per 15 minutes.",
        remainingSeconds: resetSeconds > 0 ? resetSeconds : 900
      },
      { status: 429 }
    );
  }

  // 2. Auth check before doing anything heavy (Phase 1)
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to generate a roadmap." },
      { status: 401 }
    );
  }

  // 3. Parse body
  let body: { resume?: string; jd?: string; date?: string; focus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { resume, jd, date, focus } = body;

  if (!resume || resume.length < 50) {
    return NextResponse.json(
      { error: "Please paste your complete resume (minimum 50 characters)." },
      { status: 400 }
    );
  }

  if (!jd || jd.length < 50) {
    return NextResponse.json(
      { error: "Please paste the target job description (minimum 50 characters)." },
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json(
      { error: "Please select a target job-ready date." },
      { status: 400 }
    );
  }

  // Calculate weeks available
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksAvailable = Math.max(1, Math.ceil(diffDays / 7));

  try {
    // Phase 3: Extract matching verified resources based on skill matching in resume & JD
    const textToMatch = `${resume} ${jd}`.toLowerCase();
    const allSkills = Array.from(new Set(
      VERIFIED_RESOURCES.flatMap(r => r.skills)
    ));
    const matchedSkills = allSkills.filter(skill => textToMatch.includes(skill.toLowerCase()));

    const relevantResources = getRelevantResources(matchedSkills);
    const resourcesToInject = relevantResources.length > 0 ? relevantResources : VERIFIED_RESOURCES.slice(0, 8);

    const resourcesFormatted = resourcesToInject
      .map(r => `- ${r.name} (${r.platform}): ${r.url} [Skills: ${r.skills.join(", ")}]`)
      .join("\n");

    const systemPrompt = `You are a ruthlessly honest career coach specializing in tech and design roles. You identify exactly why a resume isn't getting replies and build a rigorous improvement roadmap. You must ONLY recommend learning resources from the provided list of verified resources. Do NOT invent other URLs or resource names. Respond ONLY in valid JSON. No markdown, no preamble, no backticks.`;

    const userPrompt = `Resume: ---
${resume}
---
Target JD: ---
${jd}
---
Target date: ${date} (${weeksAvailable} weeks from today)
Focus: ${focus || "none"}

Verified Resources available to recommend:
${resourcesFormatted}

Generate this exact JSON structure:
{
  "why_no_reply": {
    "summary": "2-3 sentence honest diagnosis",
    "top_gaps": [{"gap": "name of gap", "severity": "critical|moderate|minor", "explanation": "why this is a gap"}]
  },
  "roadmap": [{
    "week_range": "Week X–Y",
    "theme": "Theme of this phase",
    "goal": "measurable outcome",
    "tasks": [{
      "task": "what to do",
      "type": "learn|build|apply|fix",
      "time_estimate": "estimated time",
      "resource": {"name": "resource title", "url": "valid url", "platform": "YouTube/Coursera/etc", "is_free": true}
    }],
    "milestone": "specific measurable checkbox"
  }],
  "success_metrics": ["By week X, you should be able to..."],
  "honest_warning": "one thing most people skip"
}
Distribute phases across ${weeksAvailable} weeks. Group into logical phases: Fix Resume → Build Skills → Build Projects → Apply & Network. Milestones must be measurable.`;

    const aiResult = await callGroqAIWithRepair({
      featureName: "roadmap",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 4000,
      jsonMode: true,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { error: aiResult.error || "Failed to generate roadmap. Please try again." },
        { status: 500 }
      );
    }

    const parsed = aiResult.data as Record<string, unknown>;

    // Phase 4: Zod Validation & Repair
    const validationResult = roadmapResultSchema.safeParse(parsed);
    if (!validationResult.success) {
      console.error("[roadmap-api] Zod validation failed:", validationResult.error.format());
      return NextResponse.json(
        { 
          error: "The AI response failed validation schema checks.",
          details: process.env.NODE_ENV === "development" ? validationResult.error.format() : undefined
        },
        { status: 502 }
      );
    }

    const validatedData = validationResult.data;

    // Clean and verify resource URLs in tasks (Phase 4 Hardening)
    for (const phase of validatedData.roadmap) {
      for (const task of phase.tasks) {
        if (task.resource) {
          const verified = matchVerifiedResource(task.resource);
          if (verified) {
            task.resource = {
              name: verified.name,
              url: verified.url,
              platform: verified.platform,
              is_free: verified.is_free,
            };
          } else {
            task.resource = undefined;
          }
        }
      }
    }

    // Supabase Persistence
    let savedSessionId: string | null = null;
    const { data: existingSessions } = await supabase
      .from("analysis_sessions")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const latestSession = existingSessions?.[0];

    if (latestSession) {
      savedSessionId = latestSession.id;
      await supabase
        .from("analysis_sessions")
        .update({
          resume_text: resume,
          jd_text: jd,
          target_date: date,
          focus_areas: focus || null,
          roadmap_result: validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", latestSession.id);
    } else {
      const { data: inserted } = await supabase
        .from("analysis_sessions")
        .insert({
          user_id: user.id,
          resume_text: resume,
          jd_text: jd,
          target_date: date,
          focus_areas: focus || null,
          roadmap_result: validatedData,
        })
        .select()
        .single();
      
      savedSessionId = inserted?.id || null;
    }

    return NextResponse.json({ result: validatedData, sessionId: savedSessionId });
  } catch (err: unknown) {
    console.error("[roadmap-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating the roadmap. Please try again." },
      { status: 500 }
    );
  }
}


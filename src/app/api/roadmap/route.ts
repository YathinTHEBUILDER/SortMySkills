import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting check: 3 requests per 15 minutes
  const ip = await getClientIp();
  const limitResult = rateLimit(`roadmap:${ip}`, 3, 15 * 60 * 1000);
  if (!limitResult.success) {
    // Calculate remaining seconds if possible, or just send general message
    const resetSeconds = Math.ceil((limitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { 
        error: "You have requested too many roadmaps. Limit is 3 requests per 15 minutes.",
        remainingSeconds: resetSeconds > 0 ? resetSeconds : 900
      },
      { status: 429 }
    );
  }

  // Parse body
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
  // Set to midnight for date-only comparison
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksAvailable = Math.max(1, Math.ceil(diffDays / 7));

  // Groq API key check
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Please add it to your environment." },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000); // 45 seconds timeout for roadmap generation

  try {
    const systemPrompt = `You are a ruthlessly honest career coach specializing in tech and design roles. You identify exactly why a resume isn't getting replies and build a rigorous improvement roadmap. Use web search to find real, currently available free resources — Coursera free audit, YouTube (freeCodeCamp, Fireship, Traversy Media, Kevin Powell), GitHub repos, official docs, roadmap.sh, The Odin Project, CS50. Never invent resource names or URLs. Respond ONLY in valid JSON. No markdown, no preamble, no backticks.`;

    const userPrompt = `Resume: ---
${resume}
---
Target JD: ---
${jd}
---
Target date: ${date} (${weeksAvailable} weeks from today)
Focus: ${focus || "none"}

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

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 4000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    clearTimeout(timeout);

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "Unknown error");
      console.error("[roadmap-api] Groq error:", groqRes.status, errText);
      return NextResponse.json(
        { error: `Roadmap service returned an error (${groqRes.status}). Try again.`, raw: errText },
        { status: 500 }
      );
    }

    const data = await groqRes.json();
    let rawContent: string = data?.choices?.[0]?.message?.content ?? "";

    // Strip markdown code fences if present
    rawContent = rawContent.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error("[roadmap-api] JSON parse failed. Raw content:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse roadmap output. The model returned invalid JSON.", raw: rawContent },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Generating the roadmap took longer than 45 seconds." },
        { status: 504 }
      );
    }
    console.error("[roadmap-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating the roadmap. Please try again." },
      { status: 500 }
    );
  }
}

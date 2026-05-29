import { NextRequest, NextResponse } from "next/server";

// ── In-memory rate-limit store (resets on server restart) ────────────────────
const rateLimitStore: Map<string, { count: number; resetAt: number }> =
  new Map();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function checkRateLimit(ip: string):
  | { allowed: true }
  | { allowed: false; remainingSeconds: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remainingSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true };
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate-limit check
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);

  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "You have used all 3 translations for this 10 minute window.",
        remainingSeconds: rl.remainingSeconds,
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

  // Groq API key check
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GROQ_API_KEY is not configured. Add it to your .env.local file to enable JD translation.",
      },
      { status: 500 }
    );
  }

  // Call Groq API
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
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
          max_tokens: 2000,
          messages: [
            {
              role: "system",
              content:
                "You are a brutally honest senior engineer who has hired people for 10 years. You have zero tolerance for corporate nonsense. You translate job descriptions into exactly what the company actually means. You are direct, specific, and always useful. You respond only in valid JSON with no markdown, no explanation.",
            },
            {
              role: "user",
              content: `Translate this job description into plain honest English for a college student.\n\nJob Description:\n${jobDescription}\n\nRespond ONLY with valid JSON matching this schema exactly:\n{\n  "roleTitle": "string",\n  "whatTheyActuallyWant": "string",\n  "whatYouWillActuallyDo": ["string array of 4 to 6 items"],\n  "experienceTranslation": "string",\n  "theMustHaveSkill": "string",\n  "theNiceToHaves": ["string array of 2 to 4 items"],\n  "salaryHonesty": "string",\n  "companyVibe": "string",\n  "redFlags": ["string array of 0 to 3 items"],\n  "greenFlags": ["string array of 0 to 3 items"],\n  "shouldYouApply": "yes | no | maybe",\n  "shouldYouApplyReason": "string",\n  "theHonestSummary": "string"\n}`,
            },
          ],
        }),
      }
    );

    clearTimeout(timeout);

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "Unknown error");
      console.error("[jd-translate] Groq API error:", groqRes.status, errText);
      return NextResponse.json(
        { error: "Translation service returned an error. Try again." },
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
      console.error("[jd-translate] JSON parse failed. Raw:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse response. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ translation: parsed });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. The AI took too long to respond." },
        { status: 504 }
      );
    }
    console.error("[jd-translate] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}

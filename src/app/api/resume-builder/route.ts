import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting check: 5 requests per 15 minutes
  const ip = await getClientIp();
  const limitResult = rateLimit(`resume-builder:${ip}`, 5, 15 * 60 * 1000);
  if (!limitResult.success) {
    const resetSeconds = Math.ceil((limitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { 
        error: "Too many requests. Limit is 5 resume builds/improvements per 15 minutes.",
        remainingSeconds: resetSeconds > 0 ? resetSeconds : 900
      },
      { status: 429 }
    );
  }

  let body: {
    mode?: "build" | "improve";
    // Build mode fields
    name?: string;
    title?: string;
    experienceYears?: string;
    status?: string;
    skills?: string;
    experience?: Array<{ jobTitle: string; company: string; duration: string; bullets: string }>;
    education?: { degree: string; institution: string; gradYear: string };
    certs?: string;
    projects?: Array<{ title: string; description: string }>;
    tone?: string;
    format?: string;
    instructions?: string;
    // Improve mode fields
    resumeText?: string;
    improvements?: string[];
    jd?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { mode } = body;
  if (!mode || (mode !== "build" && mode !== "improve")) {
    return NextResponse.json(
      { error: "Invalid or missing mode parameter. Must be 'build' or 'improve'." },
      { status: 400 }
    );
  }

  // Check Groq API key
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured in the environment." },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000); // 45 seconds timeout

  try {
    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "build") {
      const {
        name,
        title,
        experienceYears,
        status,
        skills,
        experience = [],
        education,
        certs,
        projects = [],
        tone = "Professional",
        format = "Chronological",
        instructions,
      } = body;

      if (!name || !title) {
        return NextResponse.json(
          { error: "Name and target job title are required for building a resume." },
          { status: 400 }
        );
      }

      systemPrompt = `You are an expert senior technical recruiter and professional resume writer.
Your job is to generate a highly polished, ATS-optimized, and professionally written resume in clean Markdown format based on the user's inputs.
The output MUST be a JSON object with a single key "resume".
Do not include any outer explanation, markdown code fences, or backticks in the response. It must be direct, parseable JSON.

JSON Structure:
{
  "resume": "# [Name]\\n\\n[Markdown body of the resume here...]"
}`;

      userPrompt = `Please generate a resume based on the following details:
- **Full Name**: ${name}
- **Target Title**: ${title}
- **Experience Level**: ${experienceYears} years
- **Current Status**: ${status}
- **Skills/Keywords**: ${skills || "None provided"}
- **Work History**:
${
  experience.length > 0
    ? experience
        .map(
          (exp, i) =>
            `  Role ${i + 1}: ${exp.jobTitle} at ${exp.company} (${exp.duration})\n  Bullets:\n${exp.bullets}`
        )
        .join("\n")
    : "  No professional experience (skip or structure as project-based)"
}
- **Education**: ${
        education
          ? `${education.degree} from ${education.institution} (Graduated/Graduating: ${education.gradYear})`
          : "None provided"
      }
- **Certifications**: ${certs || "None provided"}
- **Projects**:
${
  projects.length > 0
    ? projects.map((p, i) => `  Project ${i + 1}: ${p.title} - ${p.description}`).join("\n")
    : "  None provided"
}
- **Preferences**:
  - Tone: ${tone} (make it sound ${tone.toLowerCase()})
  - Format: ${format}
  - Special Instructions: ${instructions || "None"}`;

    } else {
      const { resumeText, improvements = [], jd, instructions } = body;

      if (!resumeText || resumeText.length < 30) {
        return NextResponse.json(
          { error: "A valid existing resume is required for improvement." },
          { status: 400 }
        );
      }

      systemPrompt = `You are an expert senior recruiter and resume editor.
Improve the user's resume based on the specified requirements. Focus on adding strong action verbs, removing passive phrases, formatting in a professional editorial style, and optionally tailoring to the target job description.
The output MUST be a JSON object containing exactly two keys:
1. "summary": A short markdown bulleted list (3-5 bullets) explaining what major changes were made.
2. "resume": The improved, rewritten resume in clean markdown.

Do not include any outer explanation, markdown code fences, or backticks in the response. It must be direct, parseable JSON.

JSON Structure:
{
  "summary": "* Summary of change 1\\n* Summary of change 2",
  "resume": "# [Name]\\n\\n[Markdown body of the improved resume here...]"
}`;

      userPrompt = `Existing Resume:
---
${resumeText}
---
Requested Improvements: ${improvements.join(", ") || "General polish"}
${jd ? `Target Job Description to tailor to:\n---\n${jd}\n---` : ""}
Special Instructions: ${instructions || "None"}`;
    }

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
          temperature: 0.6,
          max_tokens: 3500,
          response_format: { type: "json_object" },
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
      console.error("[resume-builder-api] Groq error:", groqRes.status, errText);
      return NextResponse.json(
        { error: `Resume builder service returned an error (${groqRes.status}). Try again.`, raw: errText },
        { status: 500 }
      );
    }

    const data = await groqRes.json();
    const rawContent: string = data?.choices?.[0]?.message?.content ?? "";

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error("[resume-builder-api] JSON parse failed. Raw content:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse generated resume. The model output was invalid.", raw: rawContent },
        { status: 500 }
      );
    }

    return NextResponse.json({
      resume: parsed.resume || "",
      summary: parsed.summary || undefined,
    });

  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Resume generation took longer than 45 seconds." },
        { status: 504 }
      );
    }
    console.error("[resume-builder-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating the resume. Please try again." },
      { status: 500 }
    );
  }
}

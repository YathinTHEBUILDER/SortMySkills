import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { callGroqAIWithRepair } from "@/lib/ai/groq-router";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Rate limiting check: 5 requests per 15 minutes
  const ip = await getClientIp();
  const limitResult = await rateLimit(`resume-builder:${ip}`, 5, 15 * 60 * 1000);
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

    const aiResult = await callGroqAIWithRepair({
      featureName: "resume-builder",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      maxTokens: 3500,
      jsonMode: true,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { error: aiResult.error || "Failed to generate resume. Please try again." },
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
        feature_name: "resume-builder",
        prompt_inputs: body,
        generated_output: parsed,
      });
    }

    return NextResponse.json({
      resume: (parsed.resume as string) || "",
      summary: (parsed.summary as string) || undefined,
    });

  } catch (err: unknown) {
    console.error("[resume-builder-api] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating the resume. Please try again." },
      { status: 500 }
    );
  }
}

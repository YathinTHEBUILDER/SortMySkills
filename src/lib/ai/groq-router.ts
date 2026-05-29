import { createServerSupabaseClient } from "@/lib/supabase/server";

export type FeatureName = "why-no-reply" | "roadmap" | "resume-builder" | "jd-translate";

export interface AIResponse {
  success: boolean;
  content: string;
  modelUsed: string;
  keyLabelUsed: string;
  fallbackUsed: boolean;
  errorCode?: string;
  latencyMs: number;
}

interface AttemptConfig {
  key: string | undefined;
  label: string;
  model: string;
}

/**
 * Shared utility for reliable Groq AI calls with automated key/model fallbacks,
 * timeout controls, JSON formatting enforcement, and database logging.
 */
export async function callGroqAI(params: {
  featureName: FeatureName;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  jsonMode?: boolean;
}): Promise<AIResponse> {
  const {
    featureName,
    messages,
    temperature = 0.7,
    maxTokens = 2000,
    timeoutMs,
    jsonMode = false,
  } = params;

  // 1. Resolve default timeouts per feature
  let defaultTimeout = 30_000;
  if (featureName === "why-no-reply") defaultTimeout = 20_000;
  else if (featureName === "roadmap" || featureName === "resume-builder") defaultTimeout = 50_000;

  const actualTimeout = timeoutMs || defaultTimeout;

  // 2. Fetch keys from env
  const legacyKey = process.env.GROQ_API_KEY;

  const keys: Record<string, string | undefined> = {};
  let primaryModel = "llama-3.3-70b-versatile";
  let fallbackModel = "openai/gpt-oss-120b";

  if (featureName === "why-no-reply") {
    keys.PRIMARY = process.env.GROQ_WHY_NO_REPLY_PRIMARY;
    keys.FALLBACK_1 = process.env.GROQ_WHY_NO_REPLY_FALLBACK_1;
    keys.FALLBACK_2 = process.env.GROQ_WHY_NO_REPLY_FALLBACK_2;
  } else if (featureName === "roadmap") {
    keys.PRIMARY = process.env.GROQ_ROADMAP_PRIMARY;
    keys.FALLBACK_1 = process.env.GROQ_ROADMAP_FALLBACK_1;
  } else if (featureName === "resume-builder") {
    keys.PRIMARY = process.env.GROQ_RESUME_BUILDER_PRIMARY;
    keys.FALLBACK_1 = process.env.GROQ_RESUME_BUILDER_FALLBACK_1;
  } else if (featureName === "jd-translate") {
    keys.PRIMARY = process.env.GROQ_JD_TRANSLATE_PRIMARY;
    keys.FALLBACK_1 = process.env.GROQ_JD_TRANSLATE_FALLBACK_1;
    primaryModel = "openai/gpt-oss-20b";
    fallbackModel = "llama-3.1-8b-instant";
  }

  // 3. Build ordered attempts (Step 4 logic)
  const attempts: AttemptConfig[] = [];

  // Attempt 1: Primary key with primary model
  if (keys.PRIMARY) {
    attempts.push({ key: keys.PRIMARY, label: "PRIMARY", model: primaryModel });
  }
  // Attempt 2: Fallback key 1 with primary model
  if (keys.FALLBACK_1) {
    attempts.push({ key: keys.FALLBACK_1, label: "FALLBACK_1", model: primaryModel });
  }
  // Attempt 3: Fallback key 2 with primary model
  if (keys.FALLBACK_2) {
    attempts.push({ key: keys.FALLBACK_2, label: "FALLBACK_2", model: primaryModel });
  }
  // Attempt 4: Primary key with fallback model
  if (keys.PRIMARY) {
    attempts.push({ key: keys.PRIMARY, label: "PRIMARY_FALLBACK_MODEL", model: fallbackModel });
  }
  // Attempt 5: Fallback key 1 with fallback model
  if (keys.FALLBACK_1) {
    attempts.push({ key: keys.FALLBACK_1, label: "FALLBACK_1_FALLBACK_MODEL", model: fallbackModel });
  }
  // Attempt 6: Legacy key with primary model (if not already used as primary)
  if (legacyKey && !attempts.some(a => a.key === legacyKey)) {
    attempts.push({ key: legacyKey, label: "LEGACY_FALLBACK", model: primaryModel });
  }

  // If we ended up with no keys configured, try using legacyKey as PRIMARY anyway
  if (attempts.length === 0 && legacyKey) {
    attempts.push({ key: legacyKey, label: "LEGACY_PRIMARY", model: primaryModel });
  }

  if (attempts.length === 0) {
    return {
      success: false,
      content: "",
      modelUsed: primaryModel,
      keyLabelUsed: "NONE",
      fallbackUsed: false,
      errorCode: "NO_KEYS_CONFIGURED",
      latencyMs: 0,
    };
  }

  // 4. Try configurations in sequence
  for (let i = 0; i < attempts.length; i++) {
    const { key, label, model } = attempts[i];
    if (!key) continue;

    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), actualTimeout);

    try {
      const responseFormat = jsonMode && !model.includes("gpt-oss")
        ? { type: "json_object" }
        : undefined;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          response_format: responseFormat,
          messages,
        }),
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown network error");
        console.warn(`[AI-ROUTER] Attempt ${i + 1} with ${label} failed. Status: ${res.status}. Error:`, errorText);
        
        await logAIRequest({
          featureName,
          modelUsed: model,
          fallbackUsed: i > 0,
          keyLabelUsed: label,
          status: "failure",
          errorCode: `HTTP_${res.status}`,
          latencyMs,
        });
        continue; // Try next fallback configuration
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? "";

      if (!content) {
        console.warn(`[AI-ROUTER] Attempt ${i + 1} returned empty content.`);
        await logAIRequest({
          featureName,
          modelUsed: model,
          fallbackUsed: i > 0,
          keyLabelUsed: label,
          status: "failure",
          errorCode: "EMPTY_CONTENT",
          latencyMs,
        });
        continue;
      }

      // Success log
      await logAIRequest({
        featureName,
        modelUsed: model,
        fallbackUsed: i > 0,
        keyLabelUsed: label,
        status: "success",
        latencyMs,
      });

      return {
        success: true,
        content,
        modelUsed: model,
        keyLabelUsed: label,
        fallbackUsed: i > 0,
        latencyMs,
      };

    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const latencyMs = Date.now() - start;
      const isTimeout = err instanceof DOMException && err.name === "AbortError";
      const errorCode = isTimeout ? "TIMEOUT" : "EXCEPTION";

      console.warn(`[AI-ROUTER] Attempt ${i + 1} with ${label} threw error. Timeout: ${isTimeout}.`, err);

      await logAIRequest({
        featureName,
        modelUsed: model,
        fallbackUsed: i > 0,
        keyLabelUsed: label,
        status: "failure",
        errorCode,
        latencyMs,
      });

      continue;
    }
  }

  // All attempts failed
  return {
    success: false,
    content: "",
    modelUsed: primaryModel,
    keyLabelUsed: "ALL_EXHAUSTED",
    fallbackUsed: true,
    errorCode: "ALL_ATTEMPTS_FAILED",
    latencyMs: 0,
  };
}

/**
 * System utility to log AI generation details anonymously or synced to authenticated users
 */
async function logAIRequest(log: {
  featureName: FeatureName;
  modelUsed: string;
  fallbackUsed: boolean;
  keyLabelUsed: string;
  status: "success" | "failure";
  errorCode?: string;
  latencyMs: number;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("ai_request_logs").insert({
      user_id: user?.id || null,
      feature_name: log.featureName,
      model_used: log.modelUsed,
      fallback_used: log.fallbackUsed,
      key_label_used: log.keyLabelUsed,
      status: log.status,
      error_code: log.errorCode || null,
      latency_ms: log.latencyMs,
    });
  } catch (dbErr) {
    console.error("[AI-ROUTER] Failed to save AI request log to Supabase:", dbErr);
  }
}

/**
 * Advanced JSON repair/retry helper. Enforces and repairs JSON outputs safely.
 */
export async function callGroqAIWithRepair(params: {
  featureName: FeatureName;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  jsonMode?: boolean;
}): Promise<{ success: boolean; data: unknown; rawResponse?: string; error?: string }> {
  // First attempt
  const result = await callGroqAI(params);

  if (!result.success) {
    return {
      success: false,
      data: null,
      error: `AI call failed (${result.errorCode}).`,
    };
  }

  // Attempt to parse JSON
  const cleaned = result.content
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return { success: true, data: parsed, rawResponse: cleaned };
  } catch (parseErr) {
    console.warn("[AI-ROUTER] First JSON parse attempt failed. Launching repair...", parseErr);

    // Strict JSON repair retry instruction (Step 5)
    const repairMessages = [
      ...params.messages,
      { role: "assistant", content: result.content },
      {
        role: "user",
        content: `Your previous response failed to parse as valid JSON. Here is the parse error: "${(parseErr as Error).message}".
Please fix any trailing commas, missing braces, mismatched tags, unescaped quote symbols inside strings, or formatting errors.
Respond ONLY with a 100% valid parseable JSON object matching the requested schema. No preamble, no postamble, no code blocks, no explanation.`,
      },
    ];

    const repairResult = await callGroqAI({
      ...params,
      messages: repairMessages,
    });

    if (!repairResult.success) {
      return {
        success: false,
        data: null,
        error: `JSON repair failed: AI retry service error (${repairResult.errorCode}).`,
        rawResponse: cleaned,
      };
    }

    const repairedCleaned = repairResult.content
      .replace(/```(?:json)?\s*/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const repairedParsed = JSON.parse(repairedCleaned);
      console.log("[AI-ROUTER] JSON repair successful!");
      return { success: true, data: repairedParsed, rawResponse: repairedCleaned };
    } catch (repairedParseErr) {
      console.error("[AI-ROUTER] JSON repair attempt also failed.", repairedParseErr);
      return {
        success: false,
        data: null,
        error: "Failed to parse final JSON response after self-repair retry.",
        rawResponse: repairedCleaned,
      };
    }
  }
}

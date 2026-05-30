import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Memory fallback store (Step 7)
const localStore = new Map<string, RateLimitRecord>();

function localRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; resetTime: number } {
  const now = Date.now();
  const record = localStore.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    localStore.set(key, newRecord);
    return { success: true, resetTime: newRecord.resetTime };
  }

  if (record.count >= limit) {
    return { success: false, resetTime: record.resetTime };
  }

  record.count += 1;
  return { success: true, resetTime: record.resetTime };
}

/**
 * Server-side utility to extract the user's IP address.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
  } catch (e) {
    console.warn("Failed to get client IP headers:", e);
  }
  return "127.0.0.1";
}

/**
 * Performs a persistent, Supabase-backed rate limit check with local in-memory fallback.
 * @param keyOrFeature The feature name (e.g. `roadmap`, `why-no-reply`, etc.)
 * @param limit Maximum allowed hits
 * @param windowMs Time window in milliseconds
 * @returns Object with success boolean and reset timestamp
 */
export async function rateLimit(
  keyOrFeature: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; resetTime: number }> {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const resetTime = windowStart.getTime() + windowMs;

  // Extract clean feature name and IP
  const cleanFeature = keyOrFeature.split(":")[0];
  const ip = await getClientIp();

  try {
    const supabase = await createServerSupabaseClient();
    
    // Check auth session
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Build the query to find existing rate limit record in this window
    let query = supabase
      .from("api_rate_limits")
      .select("id, request_count")
      .eq("feature_name", cleanFeature)
      .eq("window_start", windowStart.toISOString());

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.eq("ip_address", ip).is("user_id", null);
    }

    const { data: records, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    const record = records?.[0];

    if (record) {
      if (record.request_count >= limit) {
        return { success: false, resetTime };
      }

      const { error: updateError } = await supabase
        .from("api_rate_limits")
        .update({
          request_count: record.request_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", record.id);

      if (updateError) {
        throw updateError;
      }

      return { success: true, resetTime };
    } else {
      // Create new rate limit entry
      const { error: insertError } = await supabase.from("api_rate_limits").insert({
        user_id: userId || null,
        ip_address: ip,
        feature_name: cleanFeature,
        window_start: windowStart.toISOString(),
        request_count: 1,
      });

      if (insertError) {
        // Handle insert conflicts under high concurrency (e.g., duplicate key)
        // by retrying the select-then-update routine once.
        console.warn("[RATE-LIMIT] Supabase insert conflict, retrying fetch + update:", insertError.message);
        const { data: retryRecords, error: retryFetchError } = await query;
        if (!retryFetchError && retryRecords?.[0]) {
          const retryRecord = retryRecords[0];
          if (retryRecord.request_count >= limit) {
            return { success: false, resetTime };
          }
          const { error: retryUpdateError } = await supabase
            .from("api_rate_limits")
            .update({
              request_count: retryRecord.request_count + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", retryRecord.id);
          if (retryUpdateError) {
            console.error("[RATE-LIMIT] Supabase update retry failed:", retryUpdateError.message);
          }
        }
      }

      return { success: true, resetTime };
    }

  } catch (error) {
    console.error("[RATE-LIMIT] Supabase rate limiter failed. Falling back to local memory (best-effort only; resets on serverless cold starts):", error);
    // Safe memory fallback using combined key (IP + feature)
    return localRateLimit(`${cleanFeature}:${ip}`, limit, windowMs);
  }
}

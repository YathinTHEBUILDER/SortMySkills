import { headers } from "next/headers";

/**
 * WARNING: This is demo/local rate limiting using an in-memory Map store.
 * For production workloads, use a persistent/shared store like Redis (via Upstash or similar)
 * to avoid resetting limits when the server restarts or scales horizontally.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

/**
 * Performs a rate limit check.
 * @param key Unique key for the rate limit bucket (e.g. `ip:action` or `email:action`)
 * @param limit Maximum allowed hits
 * @param windowMs Time window in milliseconds
 * @returns Object with success boolean and reset timestamp
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; resetTime: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    store.set(key, newRecord);
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
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

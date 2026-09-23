import "server-only";

import { kv, kvConfigured } from "./kv";

/**
 * Fixed-window, per-IP rate limit for the public POST endpoints, backed by
 * the same Upstash/KV store that holds the Constant Contact tokens
 * (PROJECT.md §8). One INCR + one EXPIRE per request.
 *
 * Fails OPEN on purpose: if the store is unprovisioned or unreachable the
 * request goes through. A contact form that stops working because the
 * limiter is down is worse than a burst of spam — the honeypots and payload
 * caps in the routes still apply either way.
 */
export async function rateLimit({
  key,
  ip,
  limit,
  windowSeconds,
}: {
  key: string;
  ip: string;
  limit: number;
  windowSeconds: number;
}): Promise<boolean> {
  if (!kvConfigured()) return true;
  try {
    const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
    const bucketKey = `ratelimit:${key}:${ip}:${bucket}`;
    const count = await kv().incr(bucketKey);
    if (count === 1) await kv().expire(bucketKey, windowSeconds + 1);
    return count <= limit;
  } catch (error) {
    console.warn(`[rateLimit] store unavailable, allowing request (${key})`, error);
    return true;
  }
}

/** Client IP as Vercel's edge reports it; "unknown" bucket when absent (local dev). */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Simple in-memory rate limiter.
 * For production at scale, replace with Redis-backed solution (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + options.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: options.limit - 1, resetAt };
  }

  if (entry.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

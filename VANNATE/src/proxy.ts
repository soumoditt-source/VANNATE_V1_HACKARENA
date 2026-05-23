import { NextRequest, NextResponse } from "next/server";

/**
 * Vannate API Rate Limiter Middleware
 * Protects all /api/* routes from abuse.
 *
 * Limits:
 *  - General API:         60 requests / 60 seconds per IP
 *  - Community POST:       5 requests / 60 seconds per IP
 *  - TTS/STT (heavy AI): 10 requests / 60 seconds per IP
 */

type RateBucket = {
  count: number;
  resetAt: number;
};

// In-memory store — resets on server restart. Upgrade to Redis for production.
const store = new Map<string, RateBucket>();

function getLimit(pathname: string, method: string): number {
  if ((pathname.startsWith("/api/community") || pathname.startsWith("/api/emergency")) && method === "POST") {
    return 5;
  }
  if (pathname.startsWith("/api/tts") || pathname.startsWith("/api/stt")) {
    return 10;
  }
  return 60;
}

function checkRateLimit(key: string, limit: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window

  let bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    store.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  const limit = getLimit(pathname, request.method);
  const key = `${ip}:${pathname}:${request.method}`;
  const { allowed, remaining, resetAt } = checkRateLimit(key, limit);

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: `Rate limit exceeded. Try again in ${retryAfter}s.`,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};

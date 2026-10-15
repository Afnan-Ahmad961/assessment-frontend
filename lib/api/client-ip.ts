// Passes the browser's IP on to the Express API. On Vercel every call to the API comes from
// Vercel's servers, so without this the API's per-IP rate limits would treat all users as one.
// The shared secret proves to the API that the header came from this app (see the backend's
// lib/client-ip.ts).
import { env } from "@/config/env";

/** The browser's IP from the incoming request. Vercel sets x-forwarded-for itself. */
export function getClientIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headers.get("x-real-ip") || null;
}

/** Headers to add to an API call. Empty when there's no IP (local dev) or no secret configured. */
export function clientIpHeaders(clientIp: string | null): Record<string, string> {
  if (!clientIp || !env.BFF_SHARED_SECRET) return {};
  return { "X-Client-IP": clientIp, "X-BFF-Secret": env.BFF_SHARED_SECRET };
}

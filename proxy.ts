// Runs before every page request. Two jobs:
//   1. Keep the session alive: when the short-lived access cookie has expired but a refresh token
//      is present, get a new token pair from the API and set fresh cookies.
//   2. Optimistic route guard: send visitors with no session away from protected pages.
// This is a fast, cookie-only check. The real check happens in getCurrentUser() and in every
// Server Action, close to the data.
import { NextResponse, type NextRequest } from "next/server";

import { getClientIp } from "@/lib/api/client-ip";
import { refreshSession } from "@/lib/auth/refresh-session";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE_NAMES,
  buildSessionCookies,
} from "@/lib/auth/session-cookies";

const PROTECTED_PREFIXES = ["/chat", "/appointments"];

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let cookiesToSet: ReturnType<typeof buildSessionCookies> = [];
  let clearSession = false;

  if (!accessToken && refreshToken) {
    const outcome = await refreshSession(refreshToken, getClientIp(request.headers));

    if (outcome.status === "refreshed") {
      cookiesToSet = buildSessionCookies(outcome.tokens);
      // Also update this request's cookies, so the page rendering right now sees the new token.
      for (const cookie of cookiesToSet) request.cookies.set(cookie.name, cookie.value);
    } else if (outcome.status === "rejected") {
      clearSession = true;
      for (const name of SESSION_COOKIE_NAMES) request.cookies.delete(name);
    }
  }

  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE) || (!clearSession && Boolean(refreshToken));
  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  const response =
    isProtected && !hasSession
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next({ request: { headers: request.headers } });

  for (const cookie of cookiesToSet) response.cookies.set(cookie.name, cookie.value, cookie.options);
  if (clearSession) {
    for (const name of SESSION_COOKIE_NAMES) response.cookies.delete(name);
  }

  return response;
}

export const config = {
  // Pages and the /api Route Handlers (so their access token gets refreshed too), but not Next.js
  // internals or static files. Only pages are redirected; /api routes answer 401 themselves.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};

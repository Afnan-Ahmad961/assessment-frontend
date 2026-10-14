// Names and options for the two auth cookies. Both are httpOnly, so browser JavaScript can never
// read the tokens. Used by Server Actions (via cookies()) and by proxy.ts (via NextResponse), which
// set cookies through different APIs that accept the same options.
import { isProduction } from "@/config/env";
import type { AuthTokens } from "@/types/auth";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

// The access cookie expires slightly before the token does, so a request never carries a token
// that runs out on its way to the API. When the cookie is gone, proxy.ts refreshes the session.
const ACCESS_COOKIE_SAFETY_MARGIN_MS = 30_000;

type SessionCookie = {
  name: string;
  value: string;
  options: {
    httpOnly: true;
    secure: boolean;
    sameSite: "lax";
    path: "/";
    expires: Date;
  };
};

export function buildSessionCookies(tokens: AuthTokens): SessionCookie[] {
  const base = { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/" } as const;

  return [
    {
      name: ACCESS_TOKEN_COOKIE,
      value: tokens.accessToken,
      options: {
        ...base,
        expires: new Date(tokens.accessTokenExpiresAt.getTime() - ACCESS_COOKIE_SAFETY_MARGIN_MS),
      },
    },
    {
      name: REFRESH_TOKEN_COOKIE,
      value: tokens.refreshToken,
      options: { ...base, expires: tokens.refreshTokenExpiresAt },
    },
  ];
}

export const SESSION_COOKIE_NAMES = [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE] as const;

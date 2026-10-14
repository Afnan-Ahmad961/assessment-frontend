// Exchanges a refresh token for a new token pair, used by proxy.ts.
//
// The backend rotates refresh tokens, and treats a second use of the same token as theft (it then
// revokes every session). A page load can trigger several requests at once (the page plus
// prefetches), so concurrent refreshes for the same token share one in-flight call. This only
// dedupes within one server instance.
import * as authApi from "@/lib/api/auth-api";
import type { AuthTokens } from "@/types/auth";

export type RefreshOutcome =
  | { status: "refreshed"; tokens: AuthTokens }
  /** The token was rejected: the session is over and the cookies should be cleared. */
  | { status: "rejected" }
  /** The API couldn't be reached. Keep the cookies; the next request will try again. */
  | { status: "unavailable" };

const inFlight = new Map<string, Promise<RefreshOutcome>>();

export function refreshSession(refreshToken: string): Promise<RefreshOutcome> {
  const existing = inFlight.get(refreshToken);
  if (existing) return existing;

  const request = authApi
    .refresh(refreshToken)
    .then((result): RefreshOutcome => {
      if (result.ok) return { status: "refreshed", tokens: result.data.tokens };
      return result.error.status === 401 ? { status: "rejected" } : { status: "unavailable" };
    })
    .finally(() => inFlight.delete(refreshToken));

  inFlight.set(refreshToken, request);
  return request;
}

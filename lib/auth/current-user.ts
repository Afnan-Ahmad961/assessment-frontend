// Data Access Layer for the signed-in user. The one function Server Components use to get the
// current user; it checks the session with the API rather than trusting the cookie alone.
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import * as authApi from "@/lib/api/auth-api";
import type { User } from "@/types/auth";

import { ACCESS_TOKEN_COOKIE } from "./session-cookies";

/**
 * Returns the signed-in user, or redirects to /login if there is no valid session.
 * Must be rendered inside a <Suspense> boundary, because it reads request cookies.
 */
export async function getCurrentUser(): Promise<User> {
  // Cached per request and in the browser's router cache only, never on the server.
  "use cache: private";

  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    redirect("/login");
  }

  const result = await authApi.getMe(accessToken);

  if (!result.ok) {
    if (result.error.status === 401) {
      redirect("/login");
    }
    // The API is down or misbehaving: show the error boundary instead of pretending to be signed out.
    throw new Error(result.error.message);
  }

  return result.data.user;
}

// Used by the Route Handlers in app/api/: forwards a browser request to the Express API with the
// access token from the httpOnly cookie, and returns the API's response unchanged. The browser
// never sees the token. Each forwarded endpoint has its own route file, so only those endpoints
// are reachable (a catch-all would also expose /auth, whose responses contain tokens).
import { cookies } from "next/headers";

import { env } from "@/config/env";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session-cookies";

type ForwardOptions = {
  method: "GET" | "POST";
  /** Already-parsed JSON body to send on. */
  body?: unknown;
  searchParams?: URLSearchParams;
};

export async function forwardToBackend(path: string, { method, body, searchParams }: ForwardOptions): Promise<Response> {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return errorResponse(401, "UNAUTHORIZED", "Your session has expired. Please sign in again.");
  }

  const query = searchParams?.toString();
  let response: Response;
  try {
    response = await fetch(`${env.BACKEND_API_URL}${path}${query ? `?${query}` : ""}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return errorResponse(503, "BACKEND_UNREACHABLE", "We couldn't reach the server. Check your connection and try again.");
  }

  return new Response(response.status === 204 ? null : await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Reads a JSON request body, or undefined if it's missing or malformed (the API then rejects it). */
export async function readJsonBody(request: Request): Promise<unknown> {
  return request.json().catch(() => undefined);
}

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

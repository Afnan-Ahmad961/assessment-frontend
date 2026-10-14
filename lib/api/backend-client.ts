// The single place that calls the Express API. Server-side only by usage (Server Actions, the DAL,
// and proxy.ts); the browser never talks to the API directly. Not marked "server-only" because
// proxy.ts imports it.
//
// Every call returns a result object instead of throwing, so callers have to handle failure.
import type { z } from "zod";

import { env } from "@/config/env";
import { apiErrorBodySchema } from "@/schemas/api.schema";

export type BackendError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type BackendResult<T> = { ok: true; data: T } | { ok: false; error: BackendError };

type RequestOptions<T> = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string;
  /** Schema for the `data` field of a successful response. Omit for endpoints that return 204. */
  schema?: z.ZodType<T>;
};

const UNREACHABLE: BackendError = {
  status: 503,
  code: "BACKEND_UNREACHABLE",
  message: "We couldn't reach the server. Check your connection and try again.",
};

const UNEXPECTED_RESPONSE: BackendError = {
  status: 502,
  code: "UNEXPECTED_RESPONSE",
  message: "Something went wrong. Please try again.",
};

export async function backendRequest<T = undefined>(
  path: string,
  { method = "GET", body, accessToken, schema }: RequestOptions<T> = {},
): Promise<BackendResult<T>> {
  const headers = new Headers({ Accept: "application/json" });
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(`${env.BACKEND_API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: UNREACHABLE };
  }

  const json: unknown = response.status === 204 ? undefined : await response.json().catch(() => undefined);

  if (!response.ok) {
    const parsed = apiErrorBodySchema.safeParse(json);
    return {
      ok: false,
      error: parsed.success ? { status: response.status, ...parsed.data.error } : { ...UNEXPECTED_RESPONSE, status: response.status },
    };
  }

  if (!schema) {
    return { ok: true, data: undefined as T };
  }

  const parsed = schema.safeParse(isDataEnvelope(json) ? json.data : undefined);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: UNEXPECTED_RESPONSE };
}

function isDataEnvelope(value: unknown): value is { data: unknown } {
  return typeof value === "object" && value !== null && "data" in value;
}

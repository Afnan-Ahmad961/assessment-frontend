// Browser-side client for this app's own /api Route Handlers (which forward to Express). Parses
// every response with Zod and throws BffError on failure, the shape TanStack Query expects.
import type { z } from "zod";

import { apiErrorBodySchema } from "@/schemas/api.schema";

export class BffError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "BffError";
  }
}

const GENERIC_ERROR = "Something went wrong. Please try again.";

type BffRequestOptions<T> = {
  method?: "GET" | "POST";
  body?: unknown;
  schema: z.ZodType<T>;
};

export async function bffRequest<T>(path: string, { method = "GET", body, schema }: BffRequestOptions<T>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new BffError(0, "NETWORK_ERROR", "You appear to be offline. Check your connection and try again.");
  }

  const json: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    if (response.status === 401) {
      // The session is gone (refresh token expired or revoked): sign in again. A full page load on
      // purpose, so no cached data from the signed-out session survives.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
    const parsed = apiErrorBodySchema.safeParse(json);
    throw parsed.success
      ? new BffError(response.status, parsed.data.error.code, parsed.data.error.message)
      : new BffError(response.status, "UNKNOWN", GENERIC_ERROR);
  }

  const data = typeof json === "object" && json !== null && "data" in json ? json.data : undefined;
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new BffError(response.status, "UNEXPECTED_RESPONSE", GENERIC_ERROR);
  }
  return parsed.data;
}

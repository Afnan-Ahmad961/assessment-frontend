// Server environment variables, validated once. Not marked "server-only" because proxy.ts imports
// it and proxy doesn't run under the React Server Components build; none of these variables have
// the NEXT_PUBLIC_ prefix, so Next.js never inlines them into browser code.
import { z } from "zod";

const envSchema = z.object({
  BACKEND_API_URL: z.url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Same value as the API's BFF_SHARED_SECRET. Optional in development.
  BFF_SHARED_SECRET: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(32, "BFF_SHARED_SECRET must be at least 32 characters").optional(),
  ),
});

export const env = envSchema.parse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  BFF_SHARED_SECRET: process.env.BFF_SHARED_SECRET,
});

export const isProduction = env.NODE_ENV === "production";

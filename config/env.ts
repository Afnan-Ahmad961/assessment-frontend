// Server environment variables, validated once. Not marked "server-only" because proxy.ts imports
// it and proxy doesn't run under the React Server Components build; none of these variables have
// the NEXT_PUBLIC_ prefix, so Next.js never inlines them into browser code.
import { z } from "zod";

const envSchema = z.object({
  BACKEND_API_URL: z.url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

export const isProduction = env.NODE_ENV === "production";

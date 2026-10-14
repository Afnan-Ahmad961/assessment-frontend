// Zod schemas for responses from the Express API. Responses are parsed at the boundary so the rest
// of the app works with checked, typed data (and real Date objects) instead of raw JSON.
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  createdAt: z.coerce.date(),
});

export const authTokensSchema = z.object({
  accessToken: z.string(),
  accessTokenExpiresAt: z.coerce.date(),
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.coerce.date(),
});

export const authResultSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
});

export const currentUserSchema = z.object({
  user: userSchema,
});

// Every error from the API has this shape (see backend/src/middleware/error-handler.ts).
export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

// Details attached to a VALIDATION_FAILED error.
export const validationIssuesSchema = z.array(
  z.object({
    location: z.string(),
    path: z.string(),
    message: z.string(),
  }),
);

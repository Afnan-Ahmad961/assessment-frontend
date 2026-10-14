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

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  durationMinutes: z.number(),
});

export const servicesResultSchema = z.object({ services: z.array(serviceSchema) });

export const availabilityResultSchema = z.object({
  date: z.string(),
  timeZone: z.string(),
  slots: z.array(z.object({ startsAt: z.coerce.date(), endsAt: z.coerce.date() })),
});

export const appointmentSchema = z.object({
  id: z.string(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
  source: z.enum(["CHAT", "FORM"]),
  notes: z.string().nullable(),
  service: z.object({ id: z.string(), name: z.string(), durationMinutes: z.number() }),
});

export const appointmentResultSchema = z.object({ appointment: appointmentSchema });

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["USER", "ASSISTANT"]),
  content: z.string(),
  createdAt: z.coerce.date(),
});

export const bookingDraftSchema = z.object({
  service: z.object({ id: z.string(), name: z.string(), durationMinutes: z.number() }).nullable(),
  /** Business-time calendar date, "YYYY-MM-DD". */
  date: z.string().nullable(),
  /** Business-time start, "HH:mm". */
  time: z.string().nullable(),
  notes: z.string().nullable(),
});

export const chatSessionSchema = z.object({
  id: z.string(),
  status: z.enum(["ACTIVE", "CLOSED"]),
  state: z.enum(["collecting", "confirming", "booked", "closed"]),
  draft: bookingDraftSchema,
  appointment: appointmentSchema.nullable(),
});

export const sessionWithMessagesSchema = z.object({
  session: chatSessionSchema,
  messages: z.array(chatMessageSchema),
});

export const sendMessageResultSchema = z.object({
  userMessage: chatMessageSchema,
  assistantMessage: chatMessageSchema,
  session: chatSessionSchema,
  /** requested: open the form. stuck / ai_unavailable: offer it under the reply. */
  formSuggestion: z.enum(["requested", "stuck", "ai_unavailable"]).nullable(),
});

export const confirmBookingResultSchema = z.object({
  assistantMessage: chatMessageSchema,
  session: chatSessionSchema,
});

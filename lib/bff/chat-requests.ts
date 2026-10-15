// Browser calls for the booking chat.
import {
  confirmBookingResultSchema,
  sendMessageResultSchema,
  sessionWithMessagesSchema,
} from "@/schemas/api.schema";

import { BffError, bffRequest } from "./bff-client";

const sessionPath = (id: string) => `/api/chat/sessions/${encodeURIComponent(id)}`;

/** The current conversation, or null if the user has none. */
export async function getActiveSession() {
  try {
    return await bffRequest("/api/chat/sessions/active", { schema: sessionWithMessagesSchema });
  } catch (error) {
    if (error instanceof BffError && error.status === 404) return null;
    throw error;
  }
}

export function startSession() {
  return bffRequest("/api/chat/sessions", { method: "POST", schema: sessionWithMessagesSchema });
}

/** The session plus only the messages created after `after` (polling). */
export function getSessionUpdates(sessionId: string, after: Date | null) {
  const query = after ? `?${new URLSearchParams({ after: after.toISOString() })}` : "";
  return bffRequest(`${sessionPath(sessionId)}${query}`, { schema: sessionWithMessagesSchema });
}

export function sendMessage(sessionId: string, content: string) {
  return bffRequest(`${sessionPath(sessionId)}/messages`, {
    method: "POST",
    body: { content },
    schema: sendMessageResultSchema,
  });
}

export function confirmBooking(sessionId: string) {
  return bffRequest(`${sessionPath(sessionId)}/confirm`, { method: "POST", schema: confirmBookingResultSchema });
}

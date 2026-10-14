// Types for the chat conversation and the booking built during it.
import type { z } from "zod";

import type {
  appointmentSchema,
  bookingDraftSchema,
  chatMessageSchema,
  chatSessionSchema,
  serviceSchema,
} from "@/schemas/api.schema";

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type BookingDraft = z.infer<typeof bookingDraftSchema>;
export type ChatSession = z.infer<typeof chatSessionSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Service = z.infer<typeof serviceSchema>;

/** A message as shown in the UI: server messages, plus the user's own while it's being sent. */
export type DisplayMessage = ChatMessage & {
  delivery?: { status: "sending" } | { status: "failed"; error: string };
};

/** Everything the chat screen renders. */
export type ChatData = {
  session: ChatSession;
  messages: DisplayMessage[];
};

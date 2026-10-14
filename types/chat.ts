// Types for the chat conversation and the booking details collected during it.

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

/** What the assistant has worked out so far. `null` means the detail is still needed. */
export type BookingDraft = {
  service: { name: string; durationMinutes: number } | null;
  /** Calendar date, "YYYY-MM-DD". */
  date: string | null;
  /** Local start time, "HH:mm" (24h). */
  time: string | null;
  notes: string | null;
};

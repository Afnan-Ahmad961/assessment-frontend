// TEMPORARY: static data so the chat UI can be built and reviewed before the chat API exists.
// Delete this file once the chat page loads real sessions from the backend.
import type { BookingDraft, ChatMessage } from "@/types/chat";

export const previewMessages: ChatMessage[] = [
  {
    id: "preview-1",
    role: "assistant",
    content: "Hi! I can help you book an appointment. What would you like to come in for, and when suits you?",
  },
  {
    id: "preview-2",
    role: "user",
    content: "I'd like a consultation sometime next week.",
  },
  {
    id: "preview-3",
    role: "assistant",
    content: "A consultation takes 30 minutes. Which day next week works best, and do you prefer morning or afternoon?",
  },
];

export const previewDraft: BookingDraft = {
  service: { name: "Consultation", durationMinutes: 30 },
  date: null,
  time: null,
  notes: null,
};

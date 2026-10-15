// POST /api/chat/sessions: start a new conversation (closes the current one).
import { forwardToBackend } from "@/lib/api/forward-to-backend";

export function POST() {
  return forwardToBackend("/chat/sessions", { method: "POST" });
}

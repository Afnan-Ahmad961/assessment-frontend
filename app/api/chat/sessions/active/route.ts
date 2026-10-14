// GET /api/chat/sessions/active: the user's current conversation, or 404 if there is none.
import { forwardToBackend } from "@/lib/api/forward-to-backend";

export function GET() {
  return forwardToBackend("/chat/sessions/active", { method: "GET" });
}

// POST /api/appointments: book from the form (optionally linked to a chat via chatSessionId).
import { forwardToBackend, readJsonBody } from "@/lib/api/forward-to-backend";

export async function POST(request: Request) {
  return forwardToBackend("/appointments", { method: "POST", body: await readJsonBody(request) });
}

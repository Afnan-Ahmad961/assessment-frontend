// GET /api/services: bookable services.
import { forwardToBackend } from "@/lib/api/forward-to-backend";

export function GET() {
  return forwardToBackend("/services", { method: "GET" });
}

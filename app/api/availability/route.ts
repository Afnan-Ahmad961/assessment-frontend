// GET /api/availability?serviceId=&date=: free start times for a service on a day.
import type { NextRequest } from "next/server";

import { forwardToBackend } from "@/lib/api/forward-to-backend";

export function GET(request: NextRequest) {
  return forwardToBackend("/availability", { method: "GET", searchParams: request.nextUrl.searchParams });
}

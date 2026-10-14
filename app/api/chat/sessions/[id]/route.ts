// GET /api/chat/sessions/:id?after=<timestamp>: a conversation, or only its newer messages (polling).
import type { NextRequest } from "next/server";

import { forwardToBackend } from "@/lib/api/forward-to-backend";

export async function GET(request: NextRequest, ctx: RouteContext<"/api/chat/sessions/[id]">) {
  const { id } = await ctx.params;
  return forwardToBackend(`/chat/sessions/${encodeURIComponent(id)}`, {
    method: "GET",
    searchParams: request.nextUrl.searchParams,
  });
}

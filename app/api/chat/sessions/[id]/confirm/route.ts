// POST /api/chat/sessions/:id/confirm: book the conversation's draft.
import { forwardToBackend } from "@/lib/api/forward-to-backend";

export async function POST(_request: Request, ctx: RouteContext<"/api/chat/sessions/[id]/confirm">) {
  const { id } = await ctx.params;
  return forwardToBackend(`/chat/sessions/${encodeURIComponent(id)}/confirm`, { method: "POST" });
}

// POST /api/chat/sessions/:id/messages: send a message and get the assistant's reply.
import { forwardToBackend, readJsonBody } from "@/lib/api/forward-to-backend";

export async function POST(request: Request, ctx: RouteContext<"/api/chat/sessions/[id]/messages">) {
  const { id } = await ctx.params;
  return forwardToBackend(`/chat/sessions/${encodeURIComponent(id)}/messages`, {
    method: "POST",
    body: await readJsonBody(request),
  });
}

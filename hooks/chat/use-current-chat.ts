"use client";
// The conversation on screen. The first load resumes the open conversation (or starts one); after
// that it polls for new messages every few seconds, asking only for messages newer than the last.
import { useIsMutating, useQuery, useQueryClient } from "@tanstack/react-query";

import { getActiveSession, getSessionUpdates, startSession } from "@/lib/bff/chat-requests";
import { lastServerMessageTime, mergeMessages } from "@/lib/chat-cache";
import { mutationKeys, queryKeys } from "@/lib/query-keys";
import type { ChatData } from "@/types/chat";

const POLL_INTERVAL_MS = 4000;

export function useCurrentChat() {
  const queryClient = useQueryClient();
  // Paused while a message is being sent, so a poll can't race the optimistic message.
  const isSending = useIsMutating({ mutationKey: mutationKeys.sendMessage }) > 0;

  return useQuery({
    queryKey: queryKeys.currentChat,
    queryFn: async (): Promise<ChatData> => {
      const current = queryClient.getQueryData<ChatData>(queryKeys.currentChat);
      if (!current) {
        return (await getActiveSession()) ?? (await startSession());
      }
      const update = await getSessionUpdates(current.session.id, lastServerMessageTime(current.messages));
      return { session: update.session, messages: mergeMessages(current.messages, update.messages) };
    },
    refetchInterval: (query) =>
      !isSending && query.state.data?.session.status === "ACTIVE" ? POLL_INTERVAL_MS : false,
  });
}

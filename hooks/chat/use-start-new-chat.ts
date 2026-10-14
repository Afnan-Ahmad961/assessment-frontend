"use client";
// "New conversation": closes the current one on the server and shows a fresh one.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startSession } from "@/lib/bff/chat-requests";
import { queryKeys } from "@/lib/query-keys";
import type { ChatData } from "@/types/chat";

export function useStartNewChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startSession,
    onSuccess: (chat) => queryClient.setQueryData<ChatData>(queryKeys.currentChat, chat),
  });
}

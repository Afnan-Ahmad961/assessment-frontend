"use client";
// The "Confirm booking" button: books the conversation's draft.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { confirmBooking } from "@/lib/bff/chat-requests";
import { mergeMessages, updateCurrentChat } from "@/lib/chat-cache";

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => confirmBooking(sessionId),
    onSuccess: (result) => {
      updateCurrentChat(queryClient, (chat) => ({
        session: result.session,
        messages: mergeMessages(chat.messages, [result.assistantMessage]),
      }));
    },
  });
}

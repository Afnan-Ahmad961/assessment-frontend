"use client";
// Sends a chat message. The message appears immediately as "sending", is replaced by the saved
// one plus the assistant's reply on success, and is marked "failed" (with a retry) on error.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BffError } from "@/lib/bff/bff-client";
import { sendMessage } from "@/lib/bff/chat-requests";
import { mergeMessages, updateCurrentChat } from "@/lib/chat-cache";
import { mutationKeys, queryKeys } from "@/lib/query-keys";

type SendVariables = {
  sessionId: string;
  content: string;
  /** Id of the on-screen message; reused when retrying a failed one. */
  localId: string;
};

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.sendMessage,
    mutationFn: ({ sessionId, content }: SendVariables) => sendMessage(sessionId, content),

    onMutate: async ({ content, localId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.currentChat });
      updateCurrentChat(queryClient, (chat) => ({
        ...chat,
        messages: [
          ...chat.messages.filter((message) => message.id !== localId),
          { id: localId, role: "USER", content, createdAt: new Date(), delivery: { status: "sending" } },
        ],
      }));
    },

    onSuccess: (turn, { localId }) => {
      updateCurrentChat(queryClient, (chat) => ({
        session: turn.session,
        messages: mergeMessages(
          chat.messages.filter((message) => message.id !== localId),
          [turn.userMessage, turn.assistantMessage],
        ),
      }));
    },

    onError: (error, { localId }) => {
      const message = error instanceof BffError ? error.message : "Message not sent.";
      updateCurrentChat(queryClient, (chat) => ({
        ...chat,
        messages: chat.messages.map((m) =>
          m.id === localId ? { ...m, delivery: { status: "failed", error: message } } : m,
        ),
      }));
    },
  });
}

// Helpers for updating the cached conversation (queryKeys.currentChat) from polls and mutations.
import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { ChatData, ChatMessage, DisplayMessage } from "@/types/chat";

/** Adds or replaces messages by id, keeping the list in chronological order. */
export function mergeMessages(current: DisplayMessage[], incoming: ChatMessage[]): DisplayMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

/** Time of the newest message that came from the server: the polling cursor. */
export function lastServerMessageTime(messages: DisplayMessage[]): Date | null {
  const fromServer = messages.filter((message) => !message.delivery);
  return fromServer.at(-1)?.createdAt ?? null;
}

export function updateCurrentChat(queryClient: QueryClient, update: (chat: ChatData) => ChatData) {
  queryClient.setQueryData<ChatData>(queryKeys.currentChat, (chat) => chat && update(chat));
}

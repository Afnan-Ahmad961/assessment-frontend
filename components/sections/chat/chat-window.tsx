"use client";
// The conversation: header, message list, and composer. Owns the message list state.
// For now sending only adds the message locally; it isn't connected to the chat API yet.
import { useState, type ReactNode } from "react";

import type { ChatMessage } from "@/types/chat";

import { ChatComposer } from "./chat-composer";
import { MessageList } from "./message-list";

type ChatWindowProps = {
  initialMessages: ChatMessage[];
  /** Rendered on the right of the header, e.g. the mobile booking sheet trigger. */
  headerAction?: ReactNode;
};

export function ChatWindow({ initialMessages, headerAction }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);

  function handleSend(content: string) {
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content }]);
  }

  return (
    <section aria-labelledby="chat-title" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <h1 id="chat-title" className="text-sm font-semibold">
            Booking assistant
          </h1>
          <p className="truncate text-xs text-muted-foreground">Tell it what you need and when. It asks for anything missing.</p>
        </div>
        {headerAction}
      </header>
      <MessageList messages={messages} />
      <ChatComposer onSend={handleSend} />
    </section>
  );
}

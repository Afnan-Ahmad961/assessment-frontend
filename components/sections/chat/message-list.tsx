"use client";
// Scrollable list of messages. Keeps the newest message in view as messages are added.
import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/types/chat";

import { MessageBubble } from "./message-bubble";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <ol className="mx-auto flex max-w-2xl flex-col gap-4" aria-label="Conversation" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ol>
      <div ref={endRef} />
    </div>
  );
}

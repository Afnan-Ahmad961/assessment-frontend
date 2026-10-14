"use client";
// Scrollable conversation. Keeps the newest message in view, shows the typing indicator while the
// assistant replies, and puts a "Fill in the form" action under the message that suggested it.
import { useEffect, useRef } from "react";
import { ClipboardListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DisplayMessage } from "@/types/chat";

import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

type MessageListProps = {
  messages: DisplayMessage[];
  isReplying: boolean;
  formHintMessageId: string | null;
  onOpenForm: () => void;
  onRetry: (message: DisplayMessage) => void;
};

export function MessageList({ messages, isReplying, formHintMessageId, onOpenForm, onRetry }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, isReplying]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <ol className="mx-auto flex max-w-2xl flex-col gap-4" aria-label="Conversation" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onRetry={onRetry}
            footer={
              message.id === formHintMessageId && (
                <Button variant="outline" size="sm" className="w-fit" onClick={onOpenForm}>
                  <ClipboardListIcon aria-hidden />
                  Fill in the form
                </Button>
              )
            }
          />
        ))}
        {isReplying && <TypingIndicator />}
      </ol>
      <div ref={endRef} />
    </div>
  );
}

"use client";
// Message input. Enter sends, Shift+Enter adds a new line, and the box grows with its content.
// While the assistant is replying the user can keep typing, but sending waits for the reply.
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_MESSAGE_LENGTH = 2000;

type ChatComposerProps = {
  onSend: (content: string) => void;
  isReplying: boolean;
};

export function ChatComposer({ onSend, isReplying }: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0 && !isReplying;

  function send() {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // isComposing: don't send while an input method (e.g. for Japanese) is still composing.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-xl border bg-background p-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <label htmlFor="chat-message" className="sr-only">
          Message
        </label>
        <Textarea
          id="chat-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you'd like to book..."
          maxLength={MAX_MESSAGE_LENGTH}
          rows={1}
          className="max-h-40 min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <Button type="submit" size="icon" disabled={!canSend} aria-label="Send message">
          <ArrowUpIcon />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-2xl px-1 text-xs text-muted-foreground">
        Press Enter to send, Shift + Enter for a new line.
      </p>
    </form>
  );
}

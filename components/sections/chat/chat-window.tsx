// The conversation column: header, message list, and either the composer or, once the
// conversation has ended, a prompt to start a new one. Presentational; state lives in ChatScreen.
import type { ReactNode } from "react";
import { MessageSquarePlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DisplayMessage } from "@/types/chat";

import { ChatComposer } from "./chat-composer";
import { MessageList } from "./message-list";

type ChatWindowProps = {
  messages: DisplayMessage[];
  isEnded: boolean;
  isReplying: boolean;
  isStartingNew: boolean;
  formHintMessageId: string | null;
  onSend: (content: string) => void;
  onRetry: (message: DisplayMessage) => void;
  onOpenForm: () => void;
  onStartNew: () => void;
  /** Rendered on the right of the header, e.g. the mobile booking sheet trigger. */
  headerAction?: ReactNode;
};

export function ChatWindow({
  messages,
  isEnded,
  isReplying,
  isStartingNew,
  formHintMessageId,
  onSend,
  onRetry,
  onOpenForm,
  onStartNew,
  headerAction,
}: ChatWindowProps) {
  return (
    <section aria-labelledby="chat-title" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <h1 id="chat-title" className="text-sm font-semibold">
            Booking assistant
          </h1>
          <p className="truncate text-xs text-muted-foreground">Tell it what you need and when. It asks for anything missing.</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onStartNew} disabled={isStartingNew || isReplying}>
            <MessageSquarePlusIcon aria-hidden />
            <span className="hidden sm:inline">New conversation</span>
            <span className="sr-only sm:hidden">New conversation</span>
          </Button>
          {headerAction}
        </div>
      </header>

      <MessageList
        messages={messages}
        isReplying={isReplying}
        formHintMessageId={formHintMessageId}
        onOpenForm={onOpenForm}
        onRetry={onRetry}
      />

      {isEnded ? (
        <div className="flex flex-col items-center gap-2 border-t px-4 py-4 text-center sm:px-6">
          <p className="text-sm text-muted-foreground">This conversation has ended.</p>
          <Button size="sm" onClick={onStartNew} disabled={isStartingNew}>
            Start a new conversation
          </Button>
        </div>
      ) : (
        <ChatComposer onSend={onSend} isReplying={isReplying} />
      )}
    </section>
  );
}

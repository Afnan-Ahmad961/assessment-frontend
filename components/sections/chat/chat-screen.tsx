"use client";
// The chat page's client root: loads the conversation, wires the chat, the booking panel (side
// panel on desktop, sheet on mobile), and the form fallback to the hooks.
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmBooking } from "@/hooks/chat/use-confirm-booking";
import { useCurrentChat } from "@/hooks/chat/use-current-chat";
import { useSendMessage } from "@/hooks/chat/use-send-message";
import { useStartNewChat } from "@/hooks/chat/use-start-new-chat";
import { BffError } from "@/lib/bff/bff-client";
import type { DisplayMessage } from "@/types/chat";

import { BookingFormDialog } from "./booking-form-dialog";
import { BookingSheet } from "./booking-sheet";
import { BookingSummary, countCompletedDetails } from "./booking-summary";
import { ChatWindow } from "./chat-window";

export function ChatScreen() {
  const chat = useCurrentChat();
  const send = useSendMessage();
  const confirm = useConfirmBooking();
  const startNew = useStartNewChat();

  const [isFormOpen, setFormOpen] = useState(false);
  // The assistant message that suggested the form; it gets a "Fill in the form" action.
  const [formHintMessageId, setFormHintMessageId] = useState<string | null>(null);

  if (chat.isPending) return <ChatSkeleton />;
  if (chat.isError) return <ChatLoadError message={errorMessage(chat.error)} onRetry={() => void chat.refetch()} />;

  const { session, messages } = chat.data;

  function sendMessage(content: string, localId: string = crypto.randomUUID()) {
    send.mutate(
      { sessionId: session.id, content, localId },
      {
        onSuccess: (turn) => {
          if (!turn.formSuggestion) return;
          setFormHintMessageId(turn.assistantMessage.id);
          // The user asked for the form: open it. Otherwise only offer it under the reply.
          if (turn.formSuggestion === "requested") setFormOpen(true);
        },
      },
    );
  }

  function retry(message: DisplayMessage) {
    sendMessage(message.content, message.id);
  }

  function startNewConversation() {
    confirm.reset();
    setFormHintMessageId(null);
    startNew.mutate();
  }

  const { done, total } = countCompletedDetails(session.draft);
  const summary = (
    <BookingSummary
      session={session}
      isConfirming={confirm.isPending}
      confirmError={confirm.error ? errorMessage(confirm.error) : null}
      onConfirm={() => confirm.mutate(session.id)}
      onOpenForm={() => setFormOpen(true)}
    />
  );

  return (
    <div className="flex min-h-0 flex-1">
      <ChatWindow
        messages={messages}
        isEnded={session.status !== "ACTIVE"}
        isReplying={send.isPending}
        isStartingNew={startNew.isPending}
        formHintMessageId={session.status === "ACTIVE" ? formHintMessageId : null}
        onSend={(content) => sendMessage(content)}
        onRetry={retry}
        onOpenForm={() => setFormOpen(true)}
        onStartNew={startNewConversation}
        headerAction={<BookingSheet progressLabel={`${done}/${total}`}>{summary}</BookingSheet>}
      />

      <aside
        aria-labelledby="booking-title"
        className="hidden w-88 shrink-0 flex-col gap-4 overflow-y-auto border-l bg-muted/30 p-6 lg:flex"
      >
        <h2 id="booking-title" className="text-sm font-semibold">
          Your booking
        </h2>
        {summary}
      </aside>

      <BookingFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        draft={session.draft}
        chatSessionId={session.id}
      />
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-6 sm:px-6" aria-busy aria-label="Loading conversation">
      <Skeleton className="h-12 w-2/3 max-w-md rounded-2xl" />
      <Skeleton className="ml-auto h-10 w-1/2 max-w-sm rounded-2xl" />
      <Skeleton className="h-12 w-3/5 max-w-md rounded-2xl" />
    </div>
  );
}

function ChatLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">The conversation couldn&apos;t load</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function errorMessage(error: Error): string {
  return error instanceof BffError ? error.message : "Something went wrong. Please try again.";
}

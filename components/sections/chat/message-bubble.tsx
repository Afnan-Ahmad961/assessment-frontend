// One chat message. Assistant messages sit on the left with the app mark; the user's on the right,
// dimmed while sending and with a retry link if sending failed.
import type { ReactNode } from "react";
import { CalendarCheck2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DisplayMessage } from "@/types/chat";

type MessageBubbleProps = {
  message: DisplayMessage;
  onRetry?: (message: DisplayMessage) => void;
  /** Extra content under the bubble, e.g. the "Fill in the form" action. */
  footer?: ReactNode;
};

export function MessageBubble({ message, onRetry, footer }: MessageBubbleProps) {
  const isUser = message.role === "USER";
  const delivery = message.delivery;

  return (
    <li className={cn("flex items-end gap-2", isUser && "justify-end")}>
      {!isUser && <AssistantMark />}
      <div className={cn("flex max-w-[80%] flex-col gap-1.5", isUser && "items-end")}>
        <p
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
            isUser ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground",
            delivery?.status === "sending" && "opacity-60",
            delivery?.status === "failed" && "bg-destructive/10 text-foreground ring-1 ring-destructive/40",
          )}
        >
          <span className="sr-only">{isUser ? "You: " : "Assistant: "}</span>
          {message.content}
        </p>
        {delivery?.status === "failed" && (
          <p className="text-xs text-destructive" role="alert">
            {delivery.error}{" "}
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message)}
                className="font-medium underline underline-offset-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Retry
              </button>
            )}
          </p>
        )}
        {footer}
      </div>
    </li>
  );
}

export function AssistantMark() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary" aria-hidden>
      <CalendarCheck2Icon className="size-3.5" />
    </span>
  );
}

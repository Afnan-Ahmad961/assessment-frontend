// One chat message. Assistant messages sit on the left with the app mark; the user's on the right.
import { CalendarCheck2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

import type { ChatMessage } from "@/types/chat";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <li className={cn("flex items-end gap-2", isUser && "justify-end")}>
      {!isUser && (
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary" aria-hidden>
          <CalendarCheck2Icon className="size-3.5" />
        </span>
      )}
      <p
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
          isUser ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        <span className="sr-only">{isUser ? "You: " : "Assistant: "}</span>
        {message.content}
      </p>
    </li>
  );
}

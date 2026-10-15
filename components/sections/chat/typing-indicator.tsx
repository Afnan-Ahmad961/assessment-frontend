// Shown in place of the assistant's reply while it's being worked out.
import { AssistantMark } from "./message-bubble";

export function TypingIndicator() {
  return (
    <li className="flex items-end gap-2" aria-label="Assistant is typing">
      <AssistantMark />
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </li>
  );
}

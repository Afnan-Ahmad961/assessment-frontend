// /chat: the conversation on the left, the booking being built on the right. Below the lg
// breakpoint the booking panel moves into a sheet opened from the chat header.
import type { Metadata } from "next";

import { BookingSheet } from "@/components/sections/chat/booking-sheet";
import { BookingSummary, countCompletedDetails } from "@/components/sections/chat/booking-summary";
import { ChatWindow } from "@/components/sections/chat/chat-window";
import { previewDraft, previewMessages } from "@/lib/mocks/chat-preview";

export const metadata: Metadata = { title: "Chat" };

export default function ChatPage() {
  const draft = previewDraft;
  const { done, total } = countCompletedDetails(draft);

  return (
    <div className="flex min-h-0 flex-1">
      <ChatWindow
        initialMessages={previewMessages}
        headerAction={
          <BookingSheet progressLabel={`${done}/${total}`}>
            <BookingSummary draft={draft} />
          </BookingSheet>
        }
      />

      <aside aria-labelledby="booking-title" className="hidden w-88 shrink-0 flex-col gap-4 border-l bg-muted/30 p-6 lg:flex">
        <h2 id="booking-title" className="text-sm font-semibold">
          Your booking
        </h2>
        <BookingSummary draft={draft} />
      </aside>
    </div>
  );
}

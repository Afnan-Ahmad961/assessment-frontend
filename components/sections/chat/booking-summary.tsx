// The booking being built in the chat, one row per detail. Missing details are marked "Needed".
// Offers "Confirm booking" once the assistant has proposed a bookable slot, and the form as the
// manual alternative. After booking it shows the confirmed appointment. Rendered in the desktop
// side panel and in the mobile sheet.
import type { ReactNode } from "react";
import { CheckIcon, CircleCheckBigIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatCalendarDate } from "@/lib/format-booking";
import { cn } from "@/lib/utils";
import type { BookingDraft, ChatSession } from "@/types/chat";

type BookingSummaryProps = {
  session: ChatSession;
  isConfirming: boolean;
  confirmError: string | null;
  onConfirm: () => void;
  onOpenForm: () => void;
};

type DetailRow = { label: string; value: string | null; required: boolean };

export function countCompletedDetails(draft: BookingDraft) {
  const required = [draft.service, draft.date, draft.time];
  return { done: required.filter(Boolean).length, total: required.length };
}

export function BookingSummary({ session, isConfirming, confirmError, onConfirm, onOpenForm }: BookingSummaryProps) {
  const { draft, state } = session;
  const { done, total } = countCompletedDetails(draft);
  const isBooked = state === "booked";

  const rows: DetailRow[] = [
    {
      label: "Service",
      value: draft.service ? `${draft.service.name}, ${draft.service.durationMinutes} min` : null,
      required: true,
    },
    { label: "Date", value: draft.date ? formatCalendarDate(draft.date) : null, required: true },
    { label: "Time", value: draft.time, required: true },
    { label: "Notes", value: draft.notes, required: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      {isBooked ? (
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <CircleCheckBigIcon className="size-4" aria-hidden />
          Booked
        </p>
      ) : (
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-muted-foreground">{describeState(state)}</p>
          <p className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
            {done} of {total} done
          </p>
        </div>
      )}

      <dl className="flex flex-col divide-y rounded-lg border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-3 py-2.5">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="min-w-0 text-right text-sm">{renderValue(row)}</dd>
          </div>
        ))}
      </dl>

      {state === "collecting" || state === "confirming" ? (
        <div className="flex flex-col gap-2">
          {confirmError && (
            <p className="text-sm text-destructive" role="alert">
              {confirmError}
            </p>
          )}
          <Button size="lg" disabled={state !== "confirming" || isConfirming} onClick={onConfirm}>
            {isConfirming && <Spinner aria-hidden />}
            {isConfirming ? "Booking..." : "Confirm booking"}
          </Button>
          <Button size="lg" variant="ghost" onClick={onOpenForm}>
            Fill in the details myself
          </Button>
        </div>
      ) : (
        isBooked && <p className="text-sm text-muted-foreground">You&apos;re all set. Start a new conversation to book again.</p>
      )}
    </div>
  );
}

function describeState(state: ChatSession["state"]): string {
  if (state === "confirming") return "Ready to book. Check the details.";
  if (state === "closed") return "This conversation ended without a booking.";
  return "Details fill in as you chat.";
}

function renderValue(row: DetailRow): ReactNode {
  if (row.value) {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="truncate">{row.value}</span>
        {row.required && <CheckIcon className="size-3.5 shrink-0 text-primary" aria-label="Done" />}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-md border border-dashed px-2 py-0.5 text-xs",
        row.required ? "border-primary/40 text-primary" : "text-muted-foreground",
      )}
    >
      {row.required ? "Needed" : "Optional"}
    </span>
  );
}

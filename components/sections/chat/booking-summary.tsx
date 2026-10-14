// The booking details collected so far, one row per detail. Missing required details are marked
// "Needed", so the user can see at a glance what the assistant still has to ask for. Rendered in
// the desktop side panel and in the mobile sheet.
import type { ReactNode } from "react";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingDraft } from "@/types/chat";

type DetailRow = {
  label: string;
  value: string | null;
  required: boolean;
};

export function countCompletedDetails(draft: BookingDraft) {
  const required = [draft.service, draft.date, draft.time];
  return { done: required.filter(Boolean).length, total: required.length };
}

export function BookingSummary({ draft }: { draft: BookingDraft }) {
  const { done, total } = countCompletedDetails(draft);
  const isComplete = done === total;

  const rows: DetailRow[] = [
    {
      label: "Service",
      value: draft.service ? `${draft.service.name}, ${draft.service.durationMinutes} min` : null,
      required: true,
    },
    { label: "Date", value: draft.date ? formatDate(draft.date) : null, required: true },
    { label: "Time", value: draft.time ? formatTime(draft.time) : null, required: true },
    { label: "Notes", value: draft.notes, required: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">Details fill in as you chat.</p>
        <p className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
          {done} of {total} done
        </p>
      </div>

      <dl className="flex flex-col divide-y rounded-lg border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-3 py-2.5">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-right text-sm">{renderValue(row)}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2">
        <Button size="lg" disabled={!isComplete}>
          Confirm booking
        </Button>
        <Button size="lg" variant="ghost">
          Fill in the details myself
        </Button>
      </div>
    </div>
  );
}

function renderValue(row: DetailRow): ReactNode {
  if (row.value) {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium">
        {row.value}
        {row.required && <CheckIcon className="size-3.5 text-primary" aria-label="Done" />}
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

// Dates are calendar dates ("2026-10-21") and times are wall-clock ("14:30"), so they're formatted
// in UTC on purpose: the result is the same on the server and in the browser.
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

function formatTime(time: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(
    new Date(`1970-01-01T${time}:00Z`),
  );
}

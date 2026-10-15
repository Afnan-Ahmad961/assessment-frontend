// One appointment: a date tile, the service and time, any notes, and its status.
import { MessageSquareIcon, ClipboardListIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { dateParts, formatClockTime, toClockValue } from "@/lib/format-booking";
import type { Appointment } from "@/types/chat";

const STATUS_LABEL: Record<Appointment["status"], string> = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

type AppointmentCardProps = {
  appointment: Appointment;
  timeZone: string;
  isPast: boolean;
};

export function AppointmentCard({ appointment, timeZone, isPast }: AppointmentCardProps) {
  const { weekday, day, month } = dateParts(appointment.startsAt, timeZone);
  const start = formatClockTime(toClockValue(appointment.startsAt, timeZone));
  const end = formatClockTime(toClockValue(appointment.endsAt, timeZone));
  const SourceIcon = appointment.source === "CHAT" ? MessageSquareIcon : ClipboardListIcon;

  return (
    <li className="flex gap-4 rounded-xl border bg-card p-4">
      <div
        className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted py-2 text-center"
        aria-hidden
      >
        <span className="text-xs text-muted-foreground uppercase">{weekday}</span>
        <span className="text-xl leading-tight font-semibold tabular-nums">{day}</span>
        <span className="text-xs text-muted-foreground">{month}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold">
            <span className="sr-only">{`${weekday} ${day} ${month}, `}</span>
            {appointment.service.name}
          </h3>
          <Badge variant={badgeVariant(appointment.status, isPast)}>{STATUS_LABEL[appointment.status]}</Badge>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {start} to {end} · {appointment.service.durationMinutes} min
        </p>
        {appointment.notes && (
          <p className="line-clamp-2 text-sm break-words text-muted-foreground" title={appointment.notes}>
            {appointment.notes}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <SourceIcon className="size-3.5" aria-hidden />
          Booked {appointment.source === "CHAT" ? "with the assistant" : "with the form"}
        </p>
      </div>
    </li>
  );
}

function badgeVariant(status: Appointment["status"], isPast: boolean) {
  if (status === "CANCELLED") return "destructive";
  // A past appointment is history: no need to draw attention to it.
  if (isPast || status === "COMPLETED") return "secondary";
  return "default";
}

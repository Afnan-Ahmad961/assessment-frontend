// Shown when a tab has no appointments, with a way to book one.
import Link from "next/link";
import { CalendarPlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AppointmentScope } from "@/lib/api/appointments-api";

export function AppointmentsEmpty({ scope }: { scope: AppointmentScope }) {
  const isUpcoming = scope === "upcoming";

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-14 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground" aria-hidden>
        <CalendarPlusIcon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold">{isUpcoming ? "No upcoming appointments" : "No past appointments"}</h2>
        <p className="text-sm text-muted-foreground">
          {isUpcoming ? "Book one by chatting with the assistant." : "Appointments you've had will show up here."}
        </p>
      </div>
      {isUpcoming && (
        <Button size="sm" nativeButton={false} render={<Link href="/chat" />}>
          Book an appointment
        </Button>
      )}
    </div>
  );
}

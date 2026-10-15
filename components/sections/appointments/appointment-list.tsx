// The list for one tab (upcoming or past), grouped by month. Loads on the server; render it inside
// <Suspense> (see AppointmentListSkeleton).
import { Skeleton } from "@/components/ui/skeleton";
import type { AppointmentScope } from "@/lib/api/appointments-api";
import { getAppointments } from "@/lib/data/appointments";
import { formatMonthYear } from "@/lib/format-booking";
import type { Appointment } from "@/types/chat";

import { AppointmentCard } from "./appointment-card";
import { AppointmentsEmpty } from "./appointments-empty";

export async function AppointmentList({ scope }: { scope: AppointmentScope }) {
  const { appointments, timeZone } = await getAppointments(scope);

  if (appointments.length === 0) {
    return <AppointmentsEmpty scope={scope} />;
  }

  return (
    <div className="flex flex-col gap-8">
      {groupByMonth(appointments, timeZone).map(({ month, items }) => (
        <section key={month} aria-labelledby={`month-${month}`} className="flex flex-col gap-3">
          <h2 id={`month-${month}`} className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {month}
          </h2>
          <ul className="flex flex-col gap-3">
            {items.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                timeZone={timeZone}
                isPast={scope === "past"}
              />
            ))}
          </ul>
        </section>
      ))}
      <p className="text-xs text-muted-foreground">Times are in {timeZone}.</p>
    </div>
  );
}

export function AppointmentListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy aria-label="Loading appointments">
      <Skeleton className="h-3 w-28" />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}

/** The API already returns them in order (soonest first, or most recent first for past). */
function groupByMonth(appointments: Appointment[], timeZone: string) {
  const groups: { month: string; items: Appointment[] }[] = [];
  for (const appointment of appointments) {
    const month = formatMonthYear(appointment.startsAt, timeZone);
    const last = groups.at(-1);
    if (last?.month === month) last.items.push(appointment);
    else groups.push({ month, items: [appointment] });
  }
  return groups;
}

// Upcoming / Past switch. Plain links (?scope=), so each tab has its own URL and works without JS.
import Link from "next/link";

import type { AppointmentScope } from "@/lib/api/appointments-api";
import { cn } from "@/lib/utils";

const TABS: { scope: AppointmentScope; label: string }[] = [
  { scope: "upcoming", label: "Upcoming" },
  { scope: "past", label: "Past" },
];

export function ScopeTabs({ active }: { active: AppointmentScope }) {
  return (
    <nav aria-label="Appointment period" className="inline-flex w-fit rounded-lg bg-muted p-1">
      {TABS.map(({ scope, label }) => {
        const isActive = scope === active;
        return (
          <Link
            key={scope}
            href={scope === "upcoming" ? "/appointments" : `/appointments?scope=${scope}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

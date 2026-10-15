// The app's wordmark, linking home. Shared by the auth and app layouts.
import Link from "next/link";
import { CalendarCheck2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  /** Show only the mark on small screens, to leave room for navigation next to it. */
  hideWordmarkOnMobile?: boolean;
};

export function AppLogo({ hideWordmarkOnMobile = false }: AppLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Appointments, home"
      className="inline-flex shrink-0 items-center gap-2 rounded-md text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <CalendarCheck2Icon className="size-4" aria-hidden />
      </span>
      <span className={cn(hideWordmarkOnMobile && "hidden sm:inline")}>Appointments</span>
    </Link>
  );
}

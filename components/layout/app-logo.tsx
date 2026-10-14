// The app's wordmark, linking home. Shared by the auth and app layouts.
import Link from "next/link";
import { CalendarCheck2Icon } from "lucide-react";

export function AppLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-md text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <CalendarCheck2Icon className="size-4" aria-hidden />
      </span>
      Appointments
    </Link>
  );
}

// /appointments: the signed-in user's upcoming and past appointments.
// The page shell renders at once; the tabs and list read the URL and the session, so they stream
// in behind <Suspense>.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AppointmentList, AppointmentListSkeleton } from "@/components/sections/appointments/appointment-list";
import { ScopeTabs } from "@/components/sections/appointments/scope-tabs";
import { Button } from "@/components/ui/button";
import type { AppointmentScope } from "@/lib/api/appointments-api";

export const metadata: Metadata = { title: "My appointments" };

export default function AppointmentsPage({ searchParams }: PageProps<"/appointments">) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">My appointments</h1>
            <p className="text-sm text-muted-foreground">Everything you&apos;ve booked, with the assistant or the form.</p>
          </div>
          <Button size="sm" nativeButton={false} render={<Link href="/chat" />}>
            Book an appointment
          </Button>
        </header>

        <Suspense fallback={<AppointmentsSkeleton />}>
          <AppointmentsForScope searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function AppointmentsForScope({ searchParams }: Pick<PageProps<"/appointments">, "searchParams">) {
  const scope = parseScope((await searchParams).scope);
  return (
    <div className="flex flex-col gap-6">
      <ScopeTabs active={scope} />
      {/* Keyed by scope so switching tabs shows the skeleton instead of the old list. */}
      <Suspense key={scope} fallback={<AppointmentListSkeleton />}>
        <AppointmentList scope={scope} />
      </Suspense>
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-9 w-40 rounded-lg bg-muted" />
      <AppointmentListSkeleton />
    </div>
  );
}

function parseScope(value: string | string[] | undefined): AppointmentScope {
  return value === "past" ? "past" : "upcoming";
}

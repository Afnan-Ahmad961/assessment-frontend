"use client";
// Free start times for a service on a date. Only runs once both are chosen.
import { useQuery } from "@tanstack/react-query";

import { getAvailability } from "@/lib/bff/booking-requests";
import { queryKeys } from "@/lib/query-keys";

export function useAvailability(serviceId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.availability(serviceId, date),
    queryFn: () => getAvailability(serviceId, date),
    enabled: Boolean(serviceId && date),
    staleTime: 30_000,
  });
}

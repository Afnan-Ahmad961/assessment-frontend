"use client";
// Bookable services, for the booking form. Rarely changes, so it's cached for a few minutes.
import { useQuery } from "@tanstack/react-query";

import { listServices } from "@/lib/bff/booking-requests";
import { queryKeys } from "@/lib/query-keys";

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: listServices,
    select: (result) => result.services,
    staleTime: 5 * 60_000,
  });
}

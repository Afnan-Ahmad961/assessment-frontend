"use client";
// Books from the form. Afterwards the conversation is refreshed (it now shows the booking) and
// free times are re-fetched, since one slot is now gone or someone else took it.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookAppointment } from "@/lib/bff/booking-requests";
import { queryKeys } from "@/lib/query-keys";

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointment,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.currentChat });
    },
  });
}

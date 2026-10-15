// Browser calls for the booking form: services, free times, and creating the appointment.
import { appointmentResultSchema, availabilityResultSchema, servicesResultSchema } from "@/schemas/api.schema";

import { bffRequest } from "./bff-client";

export function listServices() {
  return bffRequest("/api/services", { schema: servicesResultSchema });
}

export function getAvailability(serviceId: string, date: string) {
  const query = new URLSearchParams({ serviceId, date });
  return bffRequest(`/api/availability?${query}`, { schema: availabilityResultSchema });
}

export type BookAppointmentInput = {
  serviceId: string;
  startsAt: Date;
  notes?: string;
  chatSessionId?: string;
};

export function bookAppointment({ startsAt, ...input }: BookAppointmentInput) {
  return bffRequest("/api/appointments", {
    method: "POST",
    body: { ...input, startsAt: startsAt.toISOString() },
    schema: appointmentResultSchema,
  });
}

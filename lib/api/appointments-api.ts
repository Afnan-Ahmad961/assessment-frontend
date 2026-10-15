// Typed wrappers for the Express /appointments endpoints, called from the server.
import { appointmentListResultSchema } from "@/schemas/api.schema";

import { backendRequest } from "./backend-client";

export type AppointmentScope = "upcoming" | "past";

export function listAppointments(accessToken: string, scope: AppointmentScope, clientIp: string | null) {
  return backendRequest(`/appointments?scope=${scope}`, { accessToken, schema: appointmentListResultSchema, clientIp });
}

// Data Access Layer for the signed-in user's appointments, used by the My appointments page.
// Not cached: right after a booking the list must already include it.
import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import * as appointmentsApi from "@/lib/api/appointments-api";
import type { AppointmentScope } from "@/lib/api/appointments-api";
import { getClientIp } from "@/lib/api/client-ip";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session-cookies";

/** Must be rendered inside a <Suspense> boundary, because it reads request cookies. */
export async function getAppointments(scope: AppointmentScope) {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    redirect("/login");
  }

  const result = await appointmentsApi.listAppointments(accessToken, scope, getClientIp(await headers()));

  if (!result.ok) {
    if (result.error.status === 401) {
      redirect("/login");
    }
    throw new Error(result.error.message);
  }

  return result.data;
}

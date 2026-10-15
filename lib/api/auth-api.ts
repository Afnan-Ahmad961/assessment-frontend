// Typed wrappers for the Express /auth endpoints. `clientIp` is the browser's IP, passed on for the
// API's rate limiting (see client-ip.ts).
import { authResultSchema, currentUserSchema } from "@/schemas/api.schema";
import type { LoginFormInput, SignupFormInput } from "@/schemas/auth.schema";

import { backendRequest } from "./backend-client";

export function login(input: LoginFormInput, clientIp: string | null) {
  return backendRequest("/auth/login", { method: "POST", body: input, schema: authResultSchema, clientIp });
}

export function signup(input: SignupFormInput, clientIp: string | null) {
  return backendRequest("/auth/signup", { method: "POST", body: input, schema: authResultSchema, clientIp });
}

export function refresh(refreshToken: string, clientIp: string | null) {
  return backendRequest("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    schema: authResultSchema,
    clientIp,
  });
}

export function logout(refreshToken: string, clientIp: string | null) {
  return backendRequest("/auth/logout", { method: "POST", body: { refreshToken }, clientIp });
}

export function getMe(accessToken: string, clientIp: string | null) {
  return backendRequest("/auth/me", { accessToken, schema: currentUserSchema, clientIp });
}

// Typed wrappers for the Express /auth endpoints.
import { authResultSchema, currentUserSchema } from "@/schemas/api.schema";
import type { LoginFormInput, SignupFormInput } from "@/schemas/auth.schema";

import { backendRequest } from "./backend-client";

export function login(input: LoginFormInput) {
  return backendRequest("/auth/login", { method: "POST", body: input, schema: authResultSchema });
}

export function signup(input: SignupFormInput) {
  return backendRequest("/auth/signup", { method: "POST", body: input, schema: authResultSchema });
}

export function refresh(refreshToken: string) {
  return backendRequest("/auth/refresh", { method: "POST", body: { refreshToken }, schema: authResultSchema });
}

export function logout(refreshToken: string) {
  return backendRequest("/auth/logout", { method: "POST", body: { refreshToken } });
}

export function getMe(accessToken: string) {
  return backendRequest("/auth/me", { accessToken, schema: currentUserSchema });
}

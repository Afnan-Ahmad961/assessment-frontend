"use server";
// Server Actions behind the login and signup forms, plus sign out. They validate input, call the
// API, store the tokens in httpOnly cookies, and redirect. The tokens never reach the browser's JS.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { BackendError } from "@/lib/api/backend-client";
import * as authApi from "@/lib/api/auth-api";
import { REFRESH_TOKEN_COOKIE, SESSION_COOKIE_NAMES, buildSessionCookies } from "@/lib/auth/session-cookies";
import { validationIssuesSchema } from "@/schemas/api.schema";
import { loginFormSchema, signupFormSchema } from "@/schemas/auth.schema";
import type { AuthFormState, AuthTokens } from "@/types/auth";

type LoginField = keyof z.infer<typeof loginFormSchema>;
type SignupField = keyof z.infer<typeof signupFormSchema>;

export type LoginFormState = AuthFormState<LoginField>;
export type SignupFormState = AuthFormState<SignupField>;

const AFTER_SIGN_IN_PATH = "/chat";

export async function login(_previous: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const values = { email: readString(formData, "email") };
  const parsed = loginFormSchema.safeParse({ ...values, password: readString(formData, "password") });

  if (!parsed.success) {
    return { values, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await authApi.login(parsed.data);
  if (!result.ok) {
    return { values, ...toFormErrors(result.error) };
  }

  await setSessionCookies(result.data.tokens);
  redirect(AFTER_SIGN_IN_PATH);
}

export async function signup(_previous: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const values = { fullName: readString(formData, "fullName"), email: readString(formData, "email") };
  const parsed = signupFormSchema.safeParse({ ...values, password: readString(formData, "password") });

  if (!parsed.success) {
    return { values, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await authApi.signup(parsed.data);
  if (!result.ok) {
    return { values, ...toFormErrors(result.error) };
  }

  await setSessionCookies(result.data.tokens);
  redirect(AFTER_SIGN_IN_PATH);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  // Revoke the session on the API. If that fails, still sign out locally.
  if (refreshToken) {
    await authApi.logout(refreshToken);
  }

  for (const name of SESSION_COOKIE_NAMES) cookieStore.delete(name);
  redirect("/login");
}

async function setSessionCookies(tokens: AuthTokens) {
  const cookieStore = await cookies();
  for (const cookie of buildSessionCookies(tokens)) {
    cookieStore.set(cookie.name, cookie.value, cookie.options);
  }
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Turns an API error into something the form can show next to the right field. */
function toFormErrors(error: BackendError): Pick<AuthFormState<string>, "formError" | "fieldErrors"> {
  if (error.code === "VALIDATION_FAILED") {
    const issues = validationIssuesSchema.safeParse(error.details);
    if (issues.success) {
      const fieldErrors: Partial<Record<string, string[]>> = {};
      for (const issue of issues.data) {
        (fieldErrors[issue.path] ??= []).push(issue.message);
      }
      return { fieldErrors };
    }
  }

  if (error.code === "CONFLICT") {
    // The only conflict auth can return is a taken email.
    return { fieldErrors: { email: [error.message] } };
  }

  if (error.code === "BACKEND_UNREACHABLE") {
    return { formError: error.message };
  }

  if (error.status >= 500) {
    return { formError: "Something went wrong on our side. Please try again in a moment." };
  }

  // 401 (wrong credentials) and 429 (rate limited) messages from the API are written for users.
  return { formError: error.message };
}

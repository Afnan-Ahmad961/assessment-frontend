// Auth-related types shared across the data layer, actions, and UI.
import type { z } from "zod";

import type { authResultSchema, authTokensSchema, userSchema } from "@/schemas/api.schema";

export type User = z.infer<typeof userSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type AuthResult = z.infer<typeof authResultSchema>;

/** State returned by the login/signup Server Actions and rendered by the forms. */
export type AuthFormState<TField extends string> = {
  /** A problem with the request as a whole, e.g. wrong credentials or the server being down. */
  formError?: string;
  fieldErrors?: Partial<Record<TField, string[]>>;
  /** What the user typed (never the password), so the form can be refilled after an error. */
  values?: Partial<Record<TField, string>>;
};

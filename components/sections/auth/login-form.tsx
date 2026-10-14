"use client";
// Login form. Submits to the `login` Server Action and renders the errors it returns.
import { useActionState } from "react";

import { login, type LoginFormState } from "@/actions/auth.actions";
import { FieldGroup } from "@/components/ui/field";

import { AuthTextField } from "./auth-text-field";
import { FormErrorAlert } from "./form-error-alert";
import { SubmitButton } from "./submit-button";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <FormErrorAlert message={state.formError} />
        <AuthTextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          defaultValue={state.values?.email}
          errors={state.fieldErrors?.email}
        />
        <AuthTextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          errors={state.fieldErrors?.password}
        />
        <SubmitButton pending={pending} label="Sign in" pendingLabel="Signing in..." />
      </FieldGroup>
    </form>
  );
}

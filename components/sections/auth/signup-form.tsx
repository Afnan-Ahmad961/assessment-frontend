"use client";
// Signup form. Submits to the `signup` Server Action and renders the errors it returns.
import { useActionState } from "react";

import { signup, type SignupFormState } from "@/actions/auth.actions";
import { FieldGroup } from "@/components/ui/field";

import { AuthTextField } from "./auth-text-field";
import { FormErrorAlert } from "./form-error-alert";
import { SubmitButton } from "./submit-button";

const initialState: SignupFormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <FormErrorAlert message={state.formError} />
        <AuthTextField
          name="fullName"
          label="Full name"
          autoComplete="name"
          required
          defaultValue={state.values?.fullName}
          errors={state.fieldErrors?.fullName}
        />
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
          autoComplete="new-password"
          required
          description="At least 8 characters."
          errors={state.fieldErrors?.password}
        />
        <SubmitButton pending={pending} label="Create account" pendingLabel="Creating account..." />
      </FieldGroup>
    </form>
  );
}

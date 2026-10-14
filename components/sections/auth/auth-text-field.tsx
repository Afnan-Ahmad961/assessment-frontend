// A labelled input with its error message, wired up for screen readers (aria-invalid,
// aria-describedby). Used by the login and signup forms.
import type { ComponentProps } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AuthTextFieldProps = Omit<ComponentProps<"input">, "id" | "name"> & {
  name: string;
  label: string;
  description?: string;
  errors?: string[];
};

export function AuthTextField({ name, label, description, errors, ...inputProps }: AuthTextFieldProps) {
  const id = `field-${name}`;
  const hasError = Boolean(errors?.length);
  const describedBy = [description && `${id}-description`, hasError && `${id}-error`].filter(Boolean).join(" ");

  return (
    <Field data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy || undefined}
        className="h-9"
        {...inputProps}
      />
      {description && !hasError && <FieldDescription id={`${id}-description`}>{description}</FieldDescription>}
      {hasError && <FieldError id={`${id}-error`}>{errors?.[0]}</FieldError>}
    </Field>
  );
}

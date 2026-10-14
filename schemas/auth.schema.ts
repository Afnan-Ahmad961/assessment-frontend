// Zod schemas for the login and signup forms. Same rules as the backend, so most mistakes are
// caught here before a request is made; the backend still validates on its own.
import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address").max(254));

export const loginFormSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password").max(72),
});

export const signupFormSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name").max(100, "Name must be at most 100 characters"),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type SignupFormInput = z.infer<typeof signupFormSchema>;

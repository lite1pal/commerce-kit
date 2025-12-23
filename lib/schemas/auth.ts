import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const registerSchema = loginSchema;

export const adminTokenSchema = z.object({
  token: z.string().min(1, { message: "Token is required." }).trim(),
});

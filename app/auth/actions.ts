"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  ActionError,
  ActionResult,
  createInitialState,
  withValidatedAction,
} from "./action-helpers";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";
import {
  clearSessionCookie,
  getSessionUserId,
  setSessionCookie,
} from "../../lib/auth/session";

export async function register(
  _prevState: ActionResult<{ userId: string }>,
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  return withValidatedAction({
    formData,
    schema: registerSchema,
    rateLimit: {
      key: ({ email }) => `register:${email}`,
      max: 5,
      window: 60,
    },
    handler: async ({ email, password }) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new ActionError("Email already registered.");
      }
      const hash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, password: hash },
      });
      await setSessionCookie(user.id);
      return { userId: user.id };
    },
  });
}

export async function login(
  _prevState: ActionResult<{ userId: string }>,
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  return withValidatedAction({
    formData,
    schema: loginSchema,
    rateLimit: {
      key: ({ email }) => `login:${email}`,
      max: 10,
      window: 60,
    },
    handler: async ({ email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new ActionError("Invalid credentials.");
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new ActionError("Invalid credentials.");
      }
      await setSessionCookie(user.id);
      return { userId: user.id };
    },
  });
}

export async function logout() {
  await clearSessionCookie();
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
}

export const initialAuthState = createInitialState<{ userId: string }>();

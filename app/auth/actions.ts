"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { validateEmail, validatePassword } from "./validate";
import { rateLimit } from "@/lib/rateLimit";

const SESSION_COOKIE = "session";

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();

  // Rate limit by email
  const rateKey = `register:${email}`;
  const limit = await rateLimit({ key: rateKey, window: 60, max: 5 });
  if (!limit.allowed) {
    return {
      error: `Too many registration attempts. Try again in ${limit.reset}s.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!validateEmail(email)) {
    return { error: "Invalid email address." };
  }
  if (!validatePassword(password)) {
    return { error: "Password must be at least 8 characters." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered." };
  }
  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hash } });
  // Set session cookie
  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return { success: true };
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();

  // Rate limit by email
  const rateKey = `login:${email}`;
  const limit = await rateLimit({ key: rateKey, window: 60, max: 10 });

  if (!limit.allowed) {
    return { error: `Too many login attempts. Try again in ${limit.reset}s.` };
  }

  const password = String(formData.get("password") ?? "");
  if (!validateEmail(email)) {
    return { error: "Invalid email address." };
  }
  if (!validatePassword(password)) {
    return { error: "Password must be at least 8 characters." };
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid credentials." };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid credentials." };
  // Set session cookie
  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return { success: true };
}

export async function logout() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const jar = await cookies();
  const userId = jar.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
}

"use server";

import { UserRole } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserRole(id: string, currentRole: UserRole) {
  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
  await prisma.user.update({ where: { id }, data: { role: newRole } });

  revalidatePath("/admin/users");
}

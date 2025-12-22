"server only";

import { getCurrentUser } from "@/app/auth/actions";
import { UserRole } from "@/app/generated/prisma/enums";

export async function requireAdmin() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }
}

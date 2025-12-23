"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ActionError,
  ActionResult,
  withValidatedAction,
} from "@/app/(storefront)/auth/action-helpers";
import { adminTokenSchema } from "@/lib/schemas/auth";

export async function adminLogin(
  _prev: ActionResult<{ success: true }>,
  formData: FormData
): Promise<ActionResult<{ success: true }>> {
  return withValidatedAction({
    formData,
    schema: adminTokenSchema,
    handler: async ({ token }) => {
      if (!process.env.ADMIN_TOKEN) {
        throw new ActionError("Admin token is not configured.");
      }
      if (token !== process.env.ADMIN_TOKEN) {
        throw new ActionError("Wrong token.");
      }
      const jar = await cookies();
      jar.set("admin", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return { success: true };
    },
  });
}

export async function adminLogout() {
  const jar = await cookies();
  jar.set("admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}

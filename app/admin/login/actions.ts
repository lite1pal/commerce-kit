"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
  const token = String(formData.get("token") || "");
  if (token && token === process.env.ADMIN_TOKEN) {
    const jar = await cookies();
    jar.set("admin", "1", { httpOnly: true, sameSite: "lax", path: "/" });
    redirect("/admin/products");
  }
  redirect("/admin/login?error=1");
}

export async function adminLogout() {
  const jar = await cookies();
  jar.set("admin", "", { httpOnly: true, maxAge: 0, path: "/" });
  redirect("/admin/login");
}

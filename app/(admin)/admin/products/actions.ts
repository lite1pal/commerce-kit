"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils/string";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const active = formData.get("active") === "on";
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);

  if (!name) throw new Error("Name is required");
  if (!slug) throw new Error("Slug is required");

  await prisma.product.create({
    data: { name, slug, description, active },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const active = formData.get("active") === "on";
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);

  if (!name) throw new Error("Name is required");
  if (!slug) throw new Error("Slug is required");

  await prisma.product.update({
    where: { id: productId },
    data: { name, slug, description, active },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
}

export async function toggleProductActive(productId: string) {
  const p = await prisma.product.findUnique({ where: { id: productId } });
  if (!p) return;

  await prisma.product.update({
    where: { id: productId },
    data: { active: !p.active },
  });

  revalidatePath("/admin/products");
}

"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAttributes() {
  await requireAdmin();

  return prisma.attribute.findMany({ include: { values: true } });
}

export async function getAttributeById(id: string) {
  await requireAdmin();

  return prisma.attribute.findUnique({
    where: { id },
    include: { values: true },
  });
}

export async function createAttribute(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Attribute name is required");

  await prisma.attribute.create({ data: { name } });

  revalidatePath("/admin/attributes");
}

export async function createAttributeValue(formData: FormData) {
  await requireAdmin();

  const attributeId = String(formData.get("attributeId") || "").trim();
  const value = String(formData.get("value") || "").trim();

  if (!attributeId) throw new Error("attributeId is required");
  if (!value) throw new Error("Value is required");

  await prisma.attributeValue.create({
    data: { value, attribute: { connect: { id: attributeId } } },
  });

  revalidatePath(`/admin/attributes/${attributeId}/edit`);
}

export async function updateAttribute(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!id) throw new Error("Attribute id is required");
  if (!name) throw new Error("Attribute name is required");

  await prisma.attribute.update({ where: { id }, data: { name } });

  revalidatePath(`/admin/attributes`);
}

export async function deleteAttribute(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Attribute id is required");

  await prisma.attribute.delete({ where: { id } });

  revalidatePath(`/admin/attributes`);
  redirect("/admin/attributes");
}

export async function updateAttributeValue(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const value = String(formData.get("value") || "").trim();

  if (!id) throw new Error("Attribute value id is required");
  if (!value) throw new Error("Value is required");

  await prisma.attributeValue.update({ where: { id }, data: { value } });

  revalidatePath(`/admin/attributes`);
}

export async function deleteAttributeValue(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Attribute value id is required");

  await prisma.attributeValue.delete({ where: { id } });

  revalidatePath(`/admin/attributes`);
}

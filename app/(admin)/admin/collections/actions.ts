"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { UpdateCollectionSchema } from "@/lib/schemas/collection";
import { formDataToObject } from "@/lib/utils/form-data";

export async function getCollections() {
  await requireAdmin();

  return prisma.collection.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getCollectionById(id: string) {
  await requireAdmin();

  return prisma.collection.findUnique({
    where: { id },
    include: { products: { select: { productId: true } } },
  });
}

export async function updateCollectionById(_: any, formData: FormData) {
  await requireAdmin();

  const parsed = UpdateCollectionSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    console.error(parsed.error);
    return { message: "Some form field is empty or invalid" };
  }

  const { id, name, slug, description, productIds } = parsed.data;

  await prisma.$transaction(async (tx) => {
    // 1. Update collection meta
    await tx.collection.update({
      where: { id },
      data: { name, slug, description },
    });

    // 2. Remove old assignments
    await tx.productCollection.deleteMany({
      where: { collectionId: id },
    });

    // 3. Add new assignments
    if (productIds.length > 0) {
      await tx.productCollection.createMany({
        data: productIds.map((productId) => ({
          productId,
          collectionId: id,
        })),
        skipDuplicates: true,
      });
    }
  });

  return { message: "Collection was updated successfully" };
}

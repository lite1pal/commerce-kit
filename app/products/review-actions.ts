"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProductReviews(productId: string) {
  return prisma.productReview.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addProductReview({
  productId,
  userId,
  rating,
  comment,
}: {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}) {
  await prisma.productReview.create({
    data: {
      productId,
      userId,
      rating,
      comment,
    },
  });

  revalidatePath("/products/" + productId);
}

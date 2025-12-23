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

export async function addProductReview(formData: FormData) {
  const { productId, userId, rating, comment } = validateReviewForm(formData);
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

function validateReviewForm(formData: FormData) {
  const productId = String(formData.get("productId"));
  const userId = String(formData.get("userId"));
  const rating = Number(formData.get("rating"));
  let comment = String(formData.get("comment") ?? "");

  if (!productId || typeof productId !== "string") {
    throw new Error("Invalid productId");
  }
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }
  comment = comment.trim();
  if (comment.length > 1000) {
    comment = comment.slice(0, 1000);
  }
  comment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return { productId, userId, rating, comment };
}

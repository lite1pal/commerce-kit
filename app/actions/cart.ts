"use server";

import { getOrCreateCartId } from "@/lib/cart";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCart(variantId: string) {
  const cartId = await getOrCreateCartId();

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    select: { id: true, stock: true },
  });
  if (!variant) throw new Error("Variant not found");

  // simplest stock rule (optional):
  // if (variant.stock <= 0) throw new Error("Out of stock");

  await prisma.cartItem.upsert({
    where: {
      cartId_variantId: { cartId, variantId },
    },
    create: { cartId, variantId, quantity: 1 },
    update: { quantity: { increment: 1 } },
  });

  revalidatePath("/cart");
  revalidatePath("/products");
}

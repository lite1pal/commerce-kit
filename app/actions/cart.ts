"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "@/lib/cart";

export async function addToCart(variantId: string) {
  const cartId = await getOrCreateCartId();

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    select: { id: true },
  });
  if (!variant) throw new Error("Variant not found");

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId, variantId } },
    create: { cartId, variantId, quantity: 1 },
    update: { quantity: { increment: 1 } },
  });

  revalidatePath("/cart");
}

export async function setCartItemQuantity(variantId: string, quantity: number) {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  if (!cartId) return;

  const q = Math.max(0, Math.floor(quantity));

  if (q === 0) {
    await prisma.cartItem.deleteMany({ where: { cartId, variantId } });
  } else {
    await prisma.cartItem.update({
      where: { cartId_variantId: { cartId, variantId } },
      data: { quantity: q },
    });
  }

  revalidatePath("/cart");
}

export async function removeFromCart(variantId: string) {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  if (!cartId) return;

  await prisma.cartItem.deleteMany({ where: { cartId, variantId } });
  revalidatePath("/cart");
}

export async function clearCart() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  if (!cartId) return;

  await prisma.cartItem.deleteMany({ where: { cartId } });
  revalidatePath("/cart");
}

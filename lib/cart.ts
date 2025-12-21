import { cookies } from "next/headers";
import prisma from "./prisma";

const CART_COOKIE = "cartId";

function newCartId() {
  return crypto.randomUUID();
}

export async function getOrCreateCartId(): Promise<string> {
  const jar = await cookies();
  let cartId = jar.get(CART_COOKIE)?.value;

  if (!cartId) {
    cartId = newCartId();

    await prisma.cart.create({
      data: { id: cartId },
    });

    jar.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return cartId;
  }

  await prisma.cart.upsert({
    where: { id: cartId },
    create: { id: cartId },
    update: {},
  });

  return cartId;
}

export async function getCartItemCount() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  if (!cartId) return 0;

  const result = await prisma.cartItem.aggregate({
    where: { cartId },
    _sum: { quantity: true },
  });

  return result._sum.quantity ?? 0;
}

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import CartCheckoutCard from "./cart-checkout-card";

export default async function CartCheckoutCardServer() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  if (!cartId) return null;

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: { variant: true },
      },
    },
  });
  const items = cart?.items ?? [];
  if (items.length === 0) return null;
  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.variant.priceCents,
    0
  );
  return <CartCheckoutCard totalCents={totalCents} />;
}

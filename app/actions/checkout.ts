"use server";

import prisma from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/schemas/order";
import { formDataToObject } from "@/lib/utils/formData";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createOrder(
  _: any,
  formData: FormData
): Promise<void | { message: string }> {
  const parsed = CreateOrderSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { message: "Invalid form data" };
  }

  const email = parsed.data.email;

  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  if (!cartId) return { message: "Cart is empty" };

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) return { message: "Cart is empty" };

  const totalCents = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.variant.priceCents,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    // Validate stock and decrement per item
    for (const item of cart.items) {
      const stock = item.variant.stock;
      if (stock < item.quantity) {
        throw new Error(
          `Insufficient stock for variant ${item.variant.name}. Requested ${item.quantity}, available ${stock}.`
        );
      }
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const created = await tx.order.create({
      data: {
        email,
        totalCents,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            title: `${item.variant.product.name} — ${item.variant.name}`,
            sku: item.variant.sku ?? null,
            priceCents: item.variant.priceCents,
            quantity: item.quantity,
          })),
        },
      },
      select: { id: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId } });

    return created;
  });
  redirect(`/thank-you?order=${order.id}`);
}

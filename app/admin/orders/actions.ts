"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertValidOrderStatusTransition } from "@/lib/domain/order-status";
import prisma from "@/lib/prisma";
import { UpdateOrderSchema } from "@/lib/schemas/order";
import { secureAction } from "@/lib/secureServerAction";
import { formDataToObject } from "@/lib/utils/formData";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateOrder = secureAction({
  requireAuth: requireAdmin,
  validate: (_, formData: FormData) => {
    const parsed = UpdateOrderSchema.safeParse(formDataToObject(formData));
    if (!parsed.success) throw new Error("Invalid form data");
    return parsed.data;
  },
  action: async (orderId: string, formData: FormData) => {
    const parsedData = UpdateOrderSchema.parse(formDataToObject(formData));

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    assertValidOrderStatusTransition(order.status, parsedData.status);

    await prisma.order.update({
      where: { id: orderId },
      data: { status: parsedData.status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}/edit`);
    redirect("/admin/orders");
  },
});

export async function deleteOrder(orderId: string) {
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}

export async function getOrders() {
  return prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
}

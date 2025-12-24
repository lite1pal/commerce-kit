"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { assertValidOrderStatusTransition } from "@/lib/domain/order-status";
import prisma from "@/lib/prisma";
import { UpdateOrderSchema } from "@/lib/schemas/order";
import { formDataToObject } from "@/lib/utils/form-data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrder(
  _: any,
  formData: FormData
): Promise<void | { message: string }> {
  // 1️⃣ Auth
  await requireAdmin();

  // 2️⃣ Validate + parse input
  const parsed = UpdateOrderSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { message: "Invalid form data" };
  }

  const orderId = parsed.data.orderId;
  const newStatus = parsed.data.status;

  // 3️⃣ Load current order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return { message: "Order not found" };
  }

  // 4️⃣ Enforce valid state transition
  const err = assertValidOrderStatusTransition(order.status, newStatus);

  if (err) return { message: err.message };

  // 5️⃣ Persist
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}/edit`);
  redirect("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}

export async function getOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string) {
  await requireAdmin();

  return prisma.order.findUnique({
    where: { id: orderId },
  });
}

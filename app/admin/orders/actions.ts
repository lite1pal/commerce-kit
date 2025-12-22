"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertValidOrderStatusTransition } from "@/lib/domain/order-status";
import prisma from "@/lib/prisma";
import { UpdateOrderSchema } from "@/lib/schemas/order";
import { formDataToObject } from "@/lib/utils/formData";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrder(orderId: string, formData: FormData) {
  // 1️⃣ Auth
  await requireAdmin();

  // 2️⃣ Validate + parse input
  const parsed = UpdateOrderSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  // 3️⃣ Load current order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 4️⃣ Enforce valid state transition
  assertValidOrderStatusTransition(order.status, parsed.data.status);

  // 5️⃣ Persist
  await prisma.order.update({
    where: { id: orderId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}/edit`);
  redirect("/admin/orders");
}

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

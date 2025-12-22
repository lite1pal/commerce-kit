"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export async function createOrder(formData: FormData) {
//   // Example: create order with minimal fields
//   const userId = String(formData.get("userId") || "").trim();
//   const total = Number(formData.get("total") || 0);
//   const status: OrderStatus = String(formData.get("status") || "pending");

//   if (!userId) throw new Error("User ID is required");

//   await prisma.order.create({
//     data: { userId, total, status },
//   });

//   revalidatePath("/admin/orders");
//   redirect("/admin/orders");
// }

export async function updateOrder(orderId: string, formData: FormData) {
  const status: any = String(formData.get("status") || "PENDING");
  // Add more fields as needed

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
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

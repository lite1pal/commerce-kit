"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function markOrderPaid(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) throw new Error("Missing orderId");

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" },
  });

  redirect(`/thank-you?order=${orderId}`);
}

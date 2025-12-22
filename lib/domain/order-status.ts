import { OrderStatus } from "@/app/generated/prisma/enums";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELED"],
  PAID: ["REFUNDED"],
  CANCELED: [],
  REFUNDED: [],
};

export function assertValidOrderStatusTransition(
  from: OrderStatus,
  to: OrderStatus
) {
  if (from === to) return;

  if (!allowedTransitions[from].includes(to)) {
    throw new Error(`Invalid order status transition: ${from} → ${to}`);
  }
}

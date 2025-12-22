import { OrderStatus } from "@/app/generated/prisma/enums";
import { ErrorType } from "../types/error";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELED"],
  PAID: ["REFUNDED"],
  CANCELED: [],
  REFUNDED: [],
};

export function assertValidOrderStatusTransition(
  from: OrderStatus,
  to: OrderStatus
): ErrorType {
  if (from === to) return { message: "You can't submit the same status" };

  if (!allowedTransitions[from].includes(to)) {
    return { message: `Invalid order status transition: ${from} → ${to}` };
  }

  return null;
}

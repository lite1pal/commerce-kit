import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums";

export const FindOrdersSchema = z.object({
  email: z.email(),
});

export const UpdateOrderSchema = z.object({
  orderId: z.string(),
  status: z.enum(OrderStatus),
  intent: z.literal("update-order-status"),
});

export const CreateOrderSchema = z.object({
  email: z.email(),
  intent: z.literal("create-order"),
});

import { z } from "zod";
import { OrderStatus } from "@/app/generated/prisma/enums";

export const UpdateOrderSchema = z.object({
  orderId: z.string(),
  status: z.enum(OrderStatus),
  intent: z.literal("update-order-status"),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

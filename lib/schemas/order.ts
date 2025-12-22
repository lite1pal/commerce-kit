import { z } from "zod";
import { OrderStatus } from "@/app/generated/prisma/enums";

export const UpdateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  intent: z.literal("update-order-status"),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

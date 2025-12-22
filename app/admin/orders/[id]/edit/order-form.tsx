"use client";

import { OrderStatus } from "@/app/generated/prisma/enums";
import { updateOrder } from "../../actions";
import { useActionState } from "react";

type OrderFormProps = {
  order: {
    id: string;
    status: OrderStatus;
  };
};

const initialErrorState = {
  message: "",
};

export default function OrderForm({ order }: OrderFormProps) {
  const [state, formAction] = useActionState(updateOrder, initialErrorState);
  return (
    <form className="space-y-4" action={formAction}>
      <input type="hidden" name="intent" value="update-order-status" />
      <input type="hidden" name="orderId" value={order.id} />

      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status"
          className="border px-2 py-1"
          defaultValue={order.status}
        >
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {state?.message && <p aria-live="polite">{state.message}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
}

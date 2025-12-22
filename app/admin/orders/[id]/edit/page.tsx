import { OrderStatus } from "@/app/generated/prisma/enums";
import { getOrderById, updateOrder } from "../../actions";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const order = await getOrderById(id);

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Order #{order.id}</h1>
      <form className="space-y-4" action={updateOrder.bind(null, order.id)}>
        <input type="hidden" name="intent" value="update-order-status" />

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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}

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
      <form
        className="space-y-4"
        action={async (formData: FormData) => {
          "use server";
          await updateOrder(order.id, formData);
        }}
      >
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            className="border px-2 py-1"
            defaultValue={order.status}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        {/* Add more fields as needed */}
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

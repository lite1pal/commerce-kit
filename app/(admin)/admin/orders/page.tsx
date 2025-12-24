import { formatCentsToDollars } from "@/lib/price";
import { getOrders, deleteOrder } from "./actions";
import Link from "next/link";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.user?.email}</td>
              <td className="border px-4 py-2">
                ${formatCentsToDollars(order.totalCents)}
              </td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <Link
                  href={`/admin/orders/${order.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                {/* Delete button example, you may want to use a form for server action */}
                <form
                  action={async () => {
                    "use server";
                    await deleteOrder(order.id);
                  }}
                  style={{ display: "inline" }}
                >
                  <button
                    type="submit"
                    className="text-red-600 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

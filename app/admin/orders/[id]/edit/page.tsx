import { getOrderById } from "../../actions";
import OrderForm from "./order-form";

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
      <OrderForm order={order} />
    </main>
  );
}

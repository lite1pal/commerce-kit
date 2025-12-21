import prisma from "@/lib/prisma";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  if (!orderId) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Thank you</h1>
        <p className="text-slate-600 mt-2">Missing order id.</p>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Thank you</h1>
        <p className="text-slate-600 mt-2">Order not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Thank you 🎉</h1>
      <div className="rounded-2xl border p-4 space-y-2">
        <div>
          <span className="text-slate-600">Order:</span> {order.id}
        </div>
        <div>
          <span className="text-slate-600">Email:</span> {order.email}
        </div>
        <div>
          <span className="text-slate-600">Status:</span> {order.status}
        </div>
        <div className="font-semibold">
          Total: {(order.totalCents / 100).toFixed(2)} €
        </div>
      </div>

      <div className="rounded-2xl border p-4 space-y-2">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between gap-4">
            <div className="min-w-0 truncate">
              {i.title} × {i.quantity}
            </div>
            <div className="shrink-0">
              {((i.priceCents * i.quantity) / 100).toFixed(2)} €
            </div>
          </div>
        ))}
      </div>

      <a href="/products" className="inline-block rounded-xl border px-4 py-2">
        Back to products
      </a>
    </main>
  );
}

import Button from "@/app/components/Button";
import prisma from "@/lib/prisma";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  const orders = email
    ? await prisma.order.findMany({
        where: { email: email.toLowerCase().trim() },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, totalCents: true, createdAt: true },
      })
    : [];

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My orders</h1>

      <form className="rounded-2xl border p-4 space-y-3">
        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input
            name="email"
            type="email"
            defaultValue={email ?? ""}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="you@company.com"
          />
        </label>
        <Button type="submit" fullWidth>
          Find orders
        </Button>
      </form>

      {email && orders.length === 0 && (
        <p className="text-slate-600">No orders found for {email}.</p>
      )}

      {orders.length > 0 && (
        <div className="rounded-2xl border p-4 space-y-2">
          {orders.map((o) => (
            <a
              key={o.id}
              href={`/thank-you?order=${o.id}`}
              className="flex justify-between gap-4 rounded-xl border px-3 py-2 hover:bg-slate-50"
            >
              <div className="min-w-0 truncate">
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-slate-600">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-medium">
                  {(o.totalCents / 100).toFixed(2)} €
                </div>
                <div className="text-xs text-slate-600">{o.status}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

import { createOrder } from "@/app/actions/checkout";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function CheckoutPage() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;

  const cart = cartId
    ? await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: { include: { variant: { include: { product: true } } } },
        },
      })
    : null;

  const items = cart?.items ?? [];
  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.variant.priceCents,
    0
  );

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {items.length === 0 ? (
        <p className="text-slate-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="rounded-2xl border p-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <div className="min-w-0 truncate">
                  {item.variant.product.name} — {item.variant.name} ×{" "}
                  {item.quantity}
                </div>
                <div className="shrink-0">
                  {((item.variant.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                  €
                </div>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
              <div>Total</div>
              <div>{(totalCents / 100).toFixed(2)} €</div>
            </div>
          </div>

          <form
            action={createOrder}
            className="rounded-2xl border p-4 space-y-3"
          >
            <label className="block">
              <div className="text-sm font-medium">Email</div>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="you@company.com"
              />
            </label>

            <button className="w-full rounded-xl bg-black px-4 py-2 text-white">
              Place order
            </button>
            <p className="text-xs text-slate-600">
              (No payment yet — this just creates the order + snapshots.)
            </p>
          </form>
        </>
      )}
    </main>
  );
}

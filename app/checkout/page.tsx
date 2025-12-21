import Button from "@/app/components/Button";
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
          <div className="border-t pt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div className="min-w-0 truncate">
                  {item.variant.product.name} — {item.variant.name} ×{" "}
                  {item.quantity}
                </div>
                <div className="shrink-0 text-neutral-500">
                  €
                  {((item.variant.priceCents * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t pt-3">
              <div>Total</div>
              <div>€{(totalCents / 100).toFixed(2)}</div>
            </div>
          </div>

          <form action={createOrder} className="border-t pt-4 space-y-4">
            <label className="block">
              <div className="text-sm mb-2">Email</div>
              <input
                name="email"
                type="email"
                required
                className="w-full border px-3 py-2 text-sm"
                placeholder="you@company.com"
              />
            </label>

            <Button type="submit" fullWidth>
              Place order
            </Button>
            <p className="text-xs text-neutral-400">
              No payment yet — this just creates the order.
            </p>
          </form>
        </>
      )}
    </main>
  );
}

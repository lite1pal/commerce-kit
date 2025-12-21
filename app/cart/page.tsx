import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function CartPage() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;

  if (!cartId) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-slate-600 mt-2">Your cart is empty.</p>
      </main>
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-slate-600 mt-2">Your cart is empty.</p>
      </main>
    );
  }

  const totalCents = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.variant.priceCents,
    0
  );

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>

      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item.id} className="rounded-2xl border p-4">
            <div className="font-medium">
              {item.variant.product.name} — {item.variant.name}
            </div>
            <div className="text-slate-600 text-sm">
              Qty: {item.quantity} ·{" "}
              {(item.variant.priceCents / 100).toFixed(2)} €
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border p-4">
        <div className="font-medium">Total</div>
        <div className="font-semibold">{(totalCents / 100).toFixed(2)} €</div>
      </div>
    </main>
  );
}

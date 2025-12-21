import Button from "@/app/components/Button";
import prisma from "@/lib/prisma";
import { validateEmail } from "../auth/validate";

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

  // Client-side email validation
  // (This page is a server component, so we use a form handler below)
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My orders</h1>

      <OrderEmailForm defaultEmail={email ?? ""} />

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

// Client component for email validation
("use client");
import { useState } from "react";
function OrderEmailForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!validateEmail(email)) {
      e.preventDefault();
      setError("Please enter a valid email address.");
    }
  }

  return (
    <form
      className="rounded-2xl border p-4 space-y-3"
      method="GET"
      onSubmit={onSubmit}
    >
      <label className="block">
        <div className="text-sm font-medium">Email</div>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          placeholder="you@company.com"
        />
      </label>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button type="submit" fullWidth>
        Find orders
      </Button>
    </form>
  );
}

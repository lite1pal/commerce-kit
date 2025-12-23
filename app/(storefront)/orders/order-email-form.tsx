"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { FindOrdersSchema } from "@/lib/schemas/order";

function OrderEmailForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const parsed = FindOrdersSchema.safeParse({ email });

    if (!parsed.success) {
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

export default OrderEmailForm;

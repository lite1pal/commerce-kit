"use client";

import { useActionState } from "react";
import Button from "../components/Button";
import { createOrder } from "../actions/checkout";

type CheckoutFormProps = {
  userEmail?: string;
};

const initialErrorState = {
  message: "",
};

export default function CheckoutForm({ userEmail }: CheckoutFormProps) {
  const [state, formAction] = useActionState(createOrder, initialErrorState);

  return (
    <form action={formAction} className="border-t pt-4 space-y-4">
      <label className="block">
        <div className="text-sm mb-2">Email</div>
        <input
          name="email"
          type="email"
          defaultValue={userEmail ?? ""}
          required
          className="w-full border px-3 py-2 text-sm"
          placeholder="you@company.com"
        />
      </label>
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <Button type="submit" fullWidth>
        Place order
      </Button>
      <p className="text-xs text-neutral-400">
        No payment yet — this just creates the order.
      </p>
    </form>
  );
}

"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { adminLogin } from "./actions";
import { createInitialState } from "@/app/(storefront)/auth/action-helpers";

const initialAdminState = createInitialState<{ success: true }>();

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="w-full rounded-lg border px-3 py-2" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}

export default function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(adminLogin, initialAdminState);

  useEffect(() => {
    if (state.ok) {
      router.replace("/admin/products");
    }
  }, [router, state]);

  return (
    <form action={formAction} className="mt-6 space-y-3">
      {!state.ok &&
        state.formErrors?.map((message: string) => (
          <p key={message} className="text-sm text-red-600">
            {message}
          </p>
        ))}
      <input
        name="token"
        type="password"
        placeholder="ADMIN_TOKEN"
        className="w-full rounded-lg border px-3 py-2"
      />
      {!state.ok &&
        state.fieldErrors?.token?.map((message: string) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      <SubmitButton />
    </form>
  );
}

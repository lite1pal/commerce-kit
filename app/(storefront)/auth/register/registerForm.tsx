"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Button from "@/components/Button";
import { register } from "../actions";
import { useRouter } from "next/navigation";
import { initialAuthState } from "../action-helpers";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth disabled={pending}>
      {pending ? "Registering..." : "Register"}
    </Button>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(register, initialAuthState);

  useEffect(() => {
    if (state.ok) {
      router.replace("/collections");
    }
  }, [router, state]);

  return (
    <form action={formAction} className="space-y-4">
      {!state.ok &&
        state.formErrors?.map((message: string) => (
          <div key={message} className="text-sm text-red-600">
            {message}
          </div>
        ))}
      <label className="block">
        <div className="mb-1 text-sm">Email</div>
        <input
          name="email"
          type="email"
          required
          className="w-full border px-3 py-2 text-sm"
        />
        {!state.ok &&
          state.fieldErrors?.email?.map((message: string) => (
            <p key={message} className="text-xs text-red-600">
              {message}
            </p>
          ))}
      </label>
      <label className="block">
        <div className="mb-1 text-sm">Password</div>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full border px-3 py-2 text-sm"
        />
        {!state.ok &&
          state.fieldErrors?.password?.map((message: string) => (
            <p key={message} className="text-xs text-red-600">
              {message}
            </p>
          ))}
      </label>
      <SubmitButton />
    </form>
  );
}

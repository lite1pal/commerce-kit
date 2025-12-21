"use client";
import { useState, useTransition } from "react";
import Button from "@/app/components/Button";
import { register } from "../actions";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await register(formData);
      if (res?.error) setError(res.error);
    });

    router.replace("/collections");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block">
        <div className="mb-1 text-sm">Email</div>
        <input
          name="email"
          type="email"
          required
          className="w-full border px-3 py-2 text-sm"
        />
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
      </label>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button type="submit" fullWidth disabled={pending}>
        {pending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}

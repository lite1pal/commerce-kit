import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminLogin } from "./actions";
import { getCurrentUser } from "@/app/auth/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const error = (await searchParams).error;

  const user = await getCurrentUser();

  const isAdmin = user && user.role === "ADMIN";

  if (isAdmin) redirect("/admin/products");

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      {error ? <p className="mt-2 text-sm text-red-600">Wrong token.</p> : null}

      <form action={adminLogin} className="mt-6 space-y-3">
        <input
          name="token"
          type="password"
          placeholder="ADMIN_TOKEN"
          className="w-full rounded-lg border px-3 py-2"
        />
        <button className="w-full rounded-lg border px-3 py-2">Login</button>
      </form>
    </div>
  );
}

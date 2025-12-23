import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/(storefront)/auth/actions";
import AdminLoginForm from "./loginForm";

export default async function AdminLoginPage() {
  const user = await getCurrentUser();

  const isAdmin = user && user.role === "ADMIN";

  if (isAdmin) redirect("/admin/products");

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <AdminLoginForm />
    </div>
  );
}

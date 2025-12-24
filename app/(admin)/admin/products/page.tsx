import Link from "next/link";
import { deleteProduct, toggleProductActive } from "./actions";
import prisma from "@/lib/prisma";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, active: true, createdAt: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          className="rounded-lg border px-3 py-2 text-sm"
          href="/admin/products/new"
        >
          + New product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Active</th>
              <th className="p-3 w-65">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-gray-600">{p.slug}</td>
                <td className="p-3">{p.active ? "Yes" : "No"}</td>
                <td className="p-3 flex gap-3">
                  <Link
                    className="underline"
                    href={`/admin/products/${p.id}/edit`}
                  >
                    Edit
                  </Link>

                  <form action={toggleProductActive.bind(null, p.id)}>
                    <button className="underline" type="submit">
                      Toggle
                    </button>
                  </form>

                  <form action={deleteProduct.bind(null, p.id)}>
                    <button className="underline text-red-600" type="submit">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {products.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-600" colSpan={4}>
                  No products yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

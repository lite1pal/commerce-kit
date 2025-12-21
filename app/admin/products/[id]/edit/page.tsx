import Link from "next/link";
import { updateProduct } from "../../actions";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit product</h1>
        <Link className="underline" href="/admin/products">
          Back
        </Link>
      </div>

      <form
        action={updateProduct.bind(null, product.id)}
        className="mt-6 space-y-4"
      >
        <div>
          <label className="text-sm">Name</label>
          <input
            name="name"
            defaultValue={product.name}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Slug</label>
          <input
            name="slug"
            defaultValue={product.slug}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea
            name="description"
            defaultValue={product.description ?? ""}
            rows={5}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product.active}
          />
          Active
        </label>

        <button className="rounded-lg border px-4 py-2 text-sm">Save</button>
      </form>
    </div>
  );
}

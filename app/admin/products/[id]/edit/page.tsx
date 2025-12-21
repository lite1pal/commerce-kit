import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { createdAt: "asc" } } },
  });

  if (!product) return <div className="p-6">Not found</div>;

  async function createVariant(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId"));
    const name = String(formData.get("name") || "").trim();
    const skuRaw = String(formData.get("sku") || "").trim();
    const priceCents = Number(formData.get("priceCents"));
    const stock = Number(formData.get("stock"));

    if (!productId) throw new Error("Missing productId");
    if (!name) throw new Error("Name is required");
    if (!Number.isFinite(priceCents) || priceCents < 0)
      throw new Error("Invalid priceCents");
    if (!Number.isFinite(stock) || stock < 0) throw new Error("Invalid stock");

    await prisma.variant.create({
      data: {
        productId,
        name,
        priceCents,
        stock,
        sku: skuRaw ? skuRaw : null,
      },
    });

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  async function updateVariant(formData: FormData) {
    "use server";
    const variantId = String(formData.get("variantId"));
    const productId = String(formData.get("productId"));
    const name = String(formData.get("name") || "").trim();
    const skuRaw = String(formData.get("sku") || "").trim();
    const priceCents = Number(formData.get("priceCents"));
    const stock = Number(formData.get("stock"));

    if (!variantId) throw new Error("Missing variantId");
    if (!productId) throw new Error("Missing productId");
    if (!name) throw new Error("Name is required");
    if (!Number.isFinite(priceCents) || priceCents < 0)
      throw new Error("Invalid priceCents");
    if (!Number.isFinite(stock) || stock < 0) throw new Error("Invalid stock");

    await prisma.variant.update({
      where: { id: variantId },
      data: {
        name,
        priceCents,
        stock,
        sku: skuRaw ? skuRaw : null,
      },
    });

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  async function deleteVariant(formData: FormData) {
    "use server";
    const variantId = String(formData.get("variantId"));
    const productId = String(formData.get("productId"));

    if (!variantId) throw new Error("Missing variantId");
    if (!productId) throw new Error("Missing productId");

    // If variant is in any cart items, Prisma will throw because your relation is Restrict.
    // That’s OK for MVP; you’ll see the error and can decide what UX you want later.
    await prisma.variant.delete({ where: { id: variantId } });

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit product</h1>
          <p className="text-sm text-gray-500">{product.name}</p>
        </div>

        <Link className="text-sm underline" href="/admin/products">
          Back
        </Link>
      </div>

      {/* ===== Variants ===== */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Variants</h2>
          <p className="text-sm text-gray-500">priceCents + stock for MVP</p>
        </div>

        {/* Create */}
        <form
          action={createVariant}
          className="rounded-xl border p-4 space-y-3"
        >
          <input type="hidden" name="productId" value={product.id} />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                placeholder="e.g. Standard"
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">priceCents</label>
              <input
                name="priceCents"
                type="number"
                min={0}
                step={1}
                defaultValue={0}
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock</label>
              <input
                name="stock"
                type="number"
                min={0}
                step={1}
                defaultValue={0}
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">SKU (optional)</label>
              <input
                name="sku"
                placeholder="e.g. SKU-123"
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>

          <button className="rounded-md bg-black px-4 py-2 text-white">
            Add variant
          </button>
        </form>

        {/* List + Update/Delete */}
        <div className="space-y-3">
          {product.variants.length === 0 ? (
            <div className="text-sm text-gray-500">No variants yet.</div>
          ) : (
            product.variants.map((v) => (
              <div key={v.id} className="rounded-xl border p-4 space-y-3">
                <form action={updateVariant} className="space-y-3">
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="variantId" value={v.id} />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Name</label>
                      <input
                        name="name"
                        defaultValue={v.name}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">priceCents</label>
                      <input
                        name="priceCents"
                        type="number"
                        min={0}
                        step={1}
                        defaultValue={v.priceCents}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Stock</label>
                      <input
                        name="stock"
                        type="number"
                        min={0}
                        step={1}
                        defaultValue={v.stock}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">SKU</label>
                      <input
                        name="sku"
                        defaultValue={v.sku ?? ""}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="rounded-md bg-black px-4 py-2 text-white">
                      Save
                    </button>

                    <form action={deleteVariant}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />
                      <input type="hidden" name="variantId" value={v.id} />
                      <button
                        className="rounded-md border px-4 py-2"
                        formAction={deleteVariant}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </form>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

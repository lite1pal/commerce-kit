import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { formatCentsToDollars } from "@/lib/price";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { createdAt: "asc" },
        include: {
          variantAttributeValues: {
            include: { attributeValue: { include: { attribute: true } } },
          },
        },
      },
    },
  });

  const attributes = await prisma.attribute.findMany({
    include: { values: true },
  });

  if (!product) return <div className="p-6">Not found</div>;

  async function createVariant(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId"));
    const name = String(formData.get("name") || "").trim();
    const skuRaw = String(formData.get("sku") || "").trim();
    const priceCents = Number(formData.get("priceCents"));
    const stock = Number(formData.get("stock"));

    if (!productId || !name) throw new Error("Invalid input");

    await prisma.variant.create({
      data: {
        productId,
        name,
        priceCents,
        stock,
        sku: skuRaw || null,
      },
    });

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  async function updateVariant(formData: FormData) {
    "use server";
    const variantId = String(formData.get("variantId"));
    const productId = String(formData.get("productId"));

    await prisma.variant.update({
      where: { id: variantId },
      data: {
        name: String(formData.get("name")),
        priceCents: Number(formData.get("priceCents")),
        stock: Number(formData.get("stock")),
        sku: String(formData.get("sku") || "") || null,
      },
    });

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  async function deleteVariant(formData: FormData) {
    "use server";
    const variantId = String(formData.get("variantId"));
    const productId = String(formData.get("productId"));

    await prisma.variant.delete({ where: { id: variantId } });

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  async function updateVariantAttributes(formData: FormData) {
    "use server";
    await requireAdmin();

    const variantId = String(formData.get("variantId"));
    const productId = String(formData.get("productId"));

    const attributeValueIds = formData
      .getAll("attributeValueIds")
      .map(String)
      .filter(Boolean);

    await prisma.variantAttributeValue.deleteMany({ where: { variantId } });

    if (attributeValueIds.length) {
      await prisma.variantAttributeValue.createMany({
        data: attributeValueIds.map((id) => ({
          variantId,
          attributeValueId: id,
        })),
      });
    }

    revalidatePath(`/admin/products/${productId}/edit`);
    redirect(`/admin/products/${productId}/edit`);
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-10">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit product</h1>
          <p className="text-sm text-gray-500">{product.name}</p>
        </div>
        <Link href="/admin/products" className="text-sm underline">
          ← Back
        </Link>
      </header>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Variants</h2>
          <span className="text-xs text-gray-500">
            Price & stock only (MVP)
          </span>
        </div>

        <section className="rounded-xl border bg-gray-50 p-4">
          <h3 className="font-medium mb-3">Add new variant</h3>
          <form action={createVariant} className="grid gap-4">
            <input type="hidden" name="productId" value={product.id} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm">Name</label>
                <input name="name" required className="input" />
              </div>
              <div>
                <label className="text-sm">priceCents</label>
                <input
                  name="priceCents"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="input"
                />
              </div>
              <div>
                <label className="text-sm">Stock</label>
                <input
                  name="stock"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="input"
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <label className="text-sm">SKU (optional)</label>
              <input name="sku" className="input" />
            </div>

            <button className="btn-primary w-fit">Add variant</button>
          </form>
        </section>

        {/* Existing Variants */}
        <div className="space-y-4">
          {product.variants.length === 0 && (
            <p className="text-sm text-gray-500">No variants yet.</p>
          )}

          {product.variants.map((v) => (
            <details key={v.id} className="rounded-xl border">
              <summary className="cursor-pointer px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-gray-500">
                    ${formatCentsToDollars(v.priceCents)} · stock {v.stock}
                  </p>
                </div>
                <span className="text-sm text-blue-600">Manage</span>
              </summary>

              <div className="p-4 space-y-5 border-t">
                {/* Edit Variant */}
                <form action={updateVariant} className="space-y-4">
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="variantId" value={v.id} />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-sm">Name</label>
                      <input
                        name="name"
                        defaultValue={v.name}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-sm">priceCents</label>
                      <input
                        name="priceCents"
                        type="number"
                        defaultValue={v.priceCents}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Stock</label>
                      <input
                        name="stock"
                        type="number"
                        defaultValue={v.stock}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <label className="text-sm">SKU</label>
                    <input
                      name="sku"
                      defaultValue={v.sku ?? ""}
                      className="input"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button className="btn-primary">Save</button>
                    <form action={deleteVariant}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />
                      <input type="hidden" name="variantId" value={v.id} />
                      <button
                        className="btn-danger"
                        type="submit"
                        // onClick={(e) => {
                        //   if (!confirm("Delete this variant?"))
                        //     e.preventDefault();
                        // }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </form>

                <form action={updateVariantAttributes} className="space-y-3">
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="variantId" value={v.id} />

                  <h4 className="text-sm font-medium">Attributes</h4>

                  {attributes.map((attr) => {
                    const selected = v.variantAttributeValues.find(
                      (av) => av.attributeValue.attributeId === attr.id
                    );

                    return (
                      <div key={attr.id} className="flex items-center gap-3">
                        <label className="w-32 text-sm">{attr.name}</label>
                        <select
                          name="attributeValueIds"
                          defaultValue={selected?.attributeValue.id ?? ""}
                          className="input py-1"
                        >
                          <option value="">— none —</option>
                          {attr.values.map((val) => (
                            <option key={val.id} value={val.id}>
                              {val.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}

                  <button className="btn-secondary w-fit">
                    Save attributes
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

type VariantSelectorProps = {
  selectedVariant: { id: string };
  product: { variants: { id: string; name: string }[] };
};

export default function VariantSelector({
  selectedVariant,
  product,
}: VariantSelectorProps) {
  return (
    <form method="get" className="mb-4">
      <label htmlFor="variant" className="block mb-1 font-medium">
        Choose a variant:
      </label>
      <select
        id="variant"
        name="variant"
        className="border rounded-lg px-3 py-2 text-base"
        defaultValue={selectedVariant.id}
        onChange={(e) => e.currentTarget.form?.submit()}
      >
        {product.variants.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </form>
  );
}

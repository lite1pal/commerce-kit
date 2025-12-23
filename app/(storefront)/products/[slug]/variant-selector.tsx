"use client";

import { useState, useMemo } from "react";

type Variant = {
  id: string;
  name: string;
  variantAttributeValues?: {
    attributeValue: {
      id: string;
      value: string;
      attribute: { id: string; name: string };
    };
  }[];
};

type ProductProp = { variants: Variant[] };

type VariantSelectorProps = {
  selectedVariant: { id: string };
  product: ProductProp;
};

export default function VariantSelector({
  selectedVariant,
  product,
}: VariantSelectorProps) {
  // Build attribute -> values map from variants
  const attributes = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; values: { id: string; value: string }[] }
    >();

    product.variants.forEach((v) => {
      v.variantAttributeValues?.forEach((vav) => {
        const attr = vav.attributeValue.attribute;
        const val = vav.attributeValue;
        if (!map.has(attr.id))
          map.set(attr.id, { id: attr.id, name: attr.name, values: [] });
        const entry = map.get(attr.id)!;
        if (!entry.values.find((x) => x.id === val.id))
          entry.values.push({ id: val.id, value: val.value });
      });
    });

    return Array.from(map.values());
  }, [product.variants]);

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    // default selection from selectedVariant
    const initial: Record<string, string> = {};
    const v =
      product.variants.find((x) => x.id === selectedVariant.id) ||
      product.variants[0];
    v?.variantAttributeValues?.forEach((vav) => {
      initial[vav.attributeValue.attribute.id] = vav.attributeValue.id;
    });
    return initial;
  });

  // find variant that matches current selection
  const matchedVariantId = useMemo(() => {
    return (
      product.variants.find((v) => {
        return attributes.every((attr) => {
          const sel = selection[attr.id];
          if (!sel) return true; // allow partial
          return v.variantAttributeValues?.some(
            (vav) => vav.attributeValue.id === sel
          );
        });
      })?.id || product.variants[0]?.id
    );
  }, [selection, product.variants, attributes]);

  return (
    <form method="get" className="mb-4">
      <input type="hidden" name="variant" value={matchedVariantId} />

      {attributes.map((attr) => (
        <div key={attr.id} className="mb-2">
          <label className="block mb-1 font-medium">{attr.name}</label>
          <select
            className="border rounded-lg px-3 py-2 text-base w-full"
            value={selection[attr.id] || ""}
            onChange={(e) => {
              setSelection((s) => ({ ...s, [attr.id]: e.target.value }));
              // submit the form after change to update variant param
              // find the enclosing form and submit
              setTimeout(() => {
                const form = (e.target as HTMLElement).closest(
                  "form"
                ) as HTMLFormElement | null;
                form?.submit();
              }, 0);
            }}
          >
            <option value="">— choose —</option>
            {attr.values.map((v) => (
              <option key={v.id} value={v.id}>
                {v.value}
              </option>
            ))}
          </select>
        </div>
      ))}
    </form>
  );
}

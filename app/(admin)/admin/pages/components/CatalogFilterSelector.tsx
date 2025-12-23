import { useEffect, useState } from "react";
import CatalogGrid, { CatalogProduct } from "@/components/CatalogGrid";

export type CatalogFilter = {
  query?: string;
  attributeFilters?: Record<string, string[]>;
};

export default function CatalogFilterSelector({
  filters,
  onChange,
  previewProducts,
}: {
  filters: CatalogFilter;
  onChange: (filters: CatalogFilter) => void;
  previewProducts: CatalogProduct[];
}) {
  const [query, setQuery] = useState(filters.query || "");
  const [attributes, setAttributes] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, string[]>>(
    filters.attributeFilters || {}
  );

  useEffect(() => {
    fetch("/api/attributes")
      .then((res) => res.json())
      .then((data) => setAttributes(data.attributes));
  }, []);

  function toggleValue(attr: string, value: string) {
    setSelected((prev) => {
      const arr = prev[attr] || [];
      if (arr.includes(value)) {
        const next = { ...prev, [attr]: arr.filter((v) => v !== value) };
        if (next[attr].length === 0) delete next[attr];
        return next;
      } else {
        return { ...prev, [attr]: [...arr, value] };
      }
    });
  }

  useEffect(() => {
    onChange({ query, attributeFilters: selected });
  }, [query, selected]);

  return (
    <div>
      <input
        className="input mb-2"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mb-4">
        {attributes.map((attr) => (
          <div key={attr.id} className="mb-2">
            <div className="font-semibold mb-1">{attr.name}</div>
            <div className="flex flex-wrap gap-2">
              {attr.values.map((val: any) => {
                const checked = (selected[attr.name] || []).includes(val.value);
                return (
                  <label
                    key={val.id}
                    className="flex items-center gap-1 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleValue(attr.name, val.value)}
                    />
                    {val.value}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="font-semibold mb-2">Preview:</div>
        <CatalogGrid products={previewProducts} />
      </div>
    </div>
  );
}

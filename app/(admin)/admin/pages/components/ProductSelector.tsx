import { useEffect, useState } from "react";
import CatalogGrid from "@/app/(storefront)/components/catalog-grid";
import { CatalogProduct } from "@/lib/types/catalog-product";

export default function ProductSelector({
  selected,
  onChange,
}: {
  selected: CatalogProduct[];
  onChange: (products: CatalogProduct[]) => void;
}) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchProducts() {
      setLoading(true);
      const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!ignore) setProducts(data.products);
      setLoading(false);
    }
    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [query]);

  function toggleProduct(product: CatalogProduct) {
    if (selected.some((p) => p.id === product.id)) {
      onChange(selected.filter((p) => p.id !== product.id));
    } else {
      onChange([...selected, product]);
    }
  }

  return (
    <div>
      <input
        className="input mb-2"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isSelected = selected.some((p) => p.id === product.id);
          return (
            <div
              key={product.id}
              className={`border rounded p-2 cursor-pointer transition-all ${
                isSelected ? "ring-2 ring-blue-500" : "hover:shadow"
              }`}
              onClick={() => toggleProduct(product)}
            >
              <CatalogGrid products={[product]} />
              <div className="mt-2 text-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="mr-2"
                />
                {isSelected ? "Selected" : "Select"}
              </div>
            </div>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="mt-4">
          <div className="font-semibold mb-2">Selected products:</div>
          <CatalogGrid products={selected} />
        </div>
      )}
    </div>
  );
}

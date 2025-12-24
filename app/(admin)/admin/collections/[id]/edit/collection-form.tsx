"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useState } from "react";
import { Collection } from "@/generated/prisma/client";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { DataTable } from "../../../components/ui/data-table";
import { productColumns } from "./columns";
import type { CatalogProduct } from "@/lib/types/catalog-product";
import { CatalogFilter } from "../../../pages/components/CatalogFilterSelector";
import { updateCollectionById } from "../../actions";

const CatalogFilterSelector = dynamic(
  () => import("../../../pages/components/CatalogFilterSelector"),
  { ssr: false }
);

type CollectionFormProps = {
  collection: Collection & { products: { productId: string }[] };
};

const initialErrorState = {
  message: "",
};

export default function CollectionForm({ collection }: CollectionFormProps) {
  const [filters, setFilters] = useState<CatalogFilter>({});
  const [previewProducts, setPreviewProducts] = useState<CatalogProduct[]>([]);
  const [selected, setSelected] = useState<string[]>(
    (collection?.products || []).map((p) => p.productId)
  );

  const [state, formAction, pending] = useActionState(
    updateCollectionById,
    initialErrorState
  );

  useEffect(() => {
    let mounted = true;
    const id = setTimeout(async () => {
      const res = await fetch("/api/catalog-block-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data: CatalogProduct[] = await res.json();
      if (mounted) setPreviewProducts(data || []);
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(id);
    };
  }, [filters]);

  function toggleProduct(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function toggleAllVisible() {
    const ids = previewProducts.map((p) => p.id);
    const allSelected =
      ids.length > 0 && ids.every((id) => selected.includes(id));
    if (allSelected) {
      // remove visible ids
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      // add visible ids
      setSelected((prev) => Array.from(new Set([...prev, ...ids])));
    }
  }

  function clearSelection() {
    setSelected([]);
  }

  const allVisibleSelected =
    previewProducts.length > 0 &&
    previewProducts.every((p) => selected.includes(p.id));

  return (
    <form action={formAction}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>{collection.name} collection</FieldLegend>
          <FieldDescription>#{collection.id}</FieldDescription>
          <FieldGroup>
            <input type="hidden" name="id" value={collection.id} />
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input name="name" defaultValue={collection.name} />
            </Field>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input name="slug" defaultValue={collection.slug} />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                name="description"
                defaultValue={collection.description ?? ""}
              />
            </Field>

            <Field>
              <FieldLabel>Products</FieldLabel>
              <div>
                <CatalogFilterSelector
                  filters={filters}
                  onChange={(f: CatalogFilter) => setFilters(f)}
                  previewProducts={[]}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-neutral-700">
                  Selected: <strong>{selected.length}</strong>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" type="button" onClick={toggleAllVisible}>
                    {allVisibleSelected
                      ? "Unselect visible"
                      : "Select all visible"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={clearSelection}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                {previewProducts.length > 0 ? (
                  <DataTable
                    columns={productColumns(
                      selected,
                      toggleProduct,
                      toggleAllVisible,
                      allVisibleSelected
                    )}
                    data={previewProducts}
                  />
                ) : (
                  <div className="text-sm text-neutral-500">
                    No products to preview for current filters.
                  </div>
                )}
              </div>

              <input
                type="hidden"
                name="productIds"
                value={JSON.stringify(selected)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {state?.message && <p aria-live="polite">{state.message}</p>}

        <Field orientation="horizontal">
          <Button disabled={pending} type="submit">
            Save
          </Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

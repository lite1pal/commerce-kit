"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { CatalogProduct } from "@/lib/types/catalog-product";

export function productColumns(
  selected: string[],
  toggleProduct: (id: string) => void,
  toggleAll: () => void,
  allSelected: boolean
): ColumnDef<CatalogProduct, any>[] {
  const cols: ColumnDef<CatalogProduct, any>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() => toggleAll()}
          aria-label="Select all visible"
        />
      ),
      cell: ({ row }) => {
        const p = row.original as CatalogProduct;
        const checked = selected.includes(p.id);
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleProduct(p.id)}
            aria-label={`Select ${p.name}`}
          />
        );
      },
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const p = row.original as CatalogProduct;
        const img = p.images?.[0]?.url;
        return img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={p.name} className="w-16 h-16 object-cover" />
        ) : (
          <div className="w-16 h-16 bg-neutral-100" />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: (info) => (
        <div className="text-sm text-neutral-600">{info.getValue()}</div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const p = row.original as CatalogProduct;
        const isSelected = selected.includes(p.id);
        return (
          <Button size="sm" type="button" onClick={() => toggleProduct(p.id)}>
            {isSelected ? "Remove" : "Add"}
          </Button>
        );
      },
    },
  ];

  return cols;
}

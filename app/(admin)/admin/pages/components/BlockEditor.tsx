"use client";

import dynamic from "next/dynamic";
const CatalogFilterSelector = dynamic(() => import("./CatalogFilterSelector"), {
  ssr: false,
});
import { useState, useEffect } from "react";
import {
  ButtonBlock,
  HeadingBlock,
  ImageBlock,
  PageBlock,
  ParagraphBlock,
} from "@/app/(storefront)/p/[...slug]/page-renderer";
import { CatalogProduct } from "@/lib/types/catalog-product";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { DataTable } from "../../components/ui/data-table";
import { productColumns } from "../../collections/[id]/edit/columns";

const BLOCK_TYPES: { type: PageBlock["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
  { type: "catalog", label: "Catalog" },
];

type BlockEditorProps = {
  value?: PageBlock[];
};

function CatalogFilterBlockEditor({
  filters,
  onChange,
}: {
  filters: any;
  onChange: (filters: any) => void;
}) {
  const [previewProducts, setPreviewProducts] = useState<CatalogProduct[]>([]);
  // const [selected, setSelected] = useState<string[]>([]);

  // function toggleAllVisible() {
  //   const ids = previewProducts.map((p) => p.id);
  //   const allSelected =
  //     ids.length > 0 && ids.every((id) => selected.includes(id));
  //   if (allSelected) {
  //     // remove visible ids
  //     setSelected((prev) => prev.filter((id) => !ids.includes(id)));
  //   } else {
  //     // add visible ids
  //     setSelected((prev) => Array.from(new Set([...prev, ...ids])));
  //   }
  // }
  // function toggleProduct(id: string) {
  //   setSelected((prev) =>
  //     prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  //   );
  // }

  // const allVisibleSelected =
  //   previewProducts.length > 0 &&
  //   previewProducts.every((p) => selected.includes(p.id));

  useEffect(() => {
    async function fetchPreview() {
      const res = await fetch("/api/catalog-block-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data: CatalogProduct[] = await res.json();
      setPreviewProducts(data);
    }
    fetchPreview();
  }, [filters]);

  return (
    // <div>
    <CatalogFilterSelector
      filters={filters}
      onChange={onChange}
      previewProducts={previewProducts}
    />

    //   <div className="mt-3">
    //     {previewProducts.length > 0 ? (
    //       <DataTable
    //         columns={productColumns(
    //           selected,
    //           toggleProduct,
    //           toggleAllVisible,
    //           allVisibleSelected
    //         )}
    //         data={previewProducts}
    //       />
    //     ) : (
    //       <div className="text-sm text-neutral-500">
    //         No products to preview for current filters.
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}

export default function BlockEditor({ value }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(value ?? []);

  function moveBlockUp(idx: number) {
    if (idx <= 0) return;
    setBlocks((prev) => {
      const newBlocks = [...prev];
      [newBlocks[idx - 1], newBlocks[idx]] = [
        newBlocks[idx],
        newBlocks[idx - 1],
      ];
      return newBlocks;
    });
  }

  function moveBlockDown(idx: number) {
    if (idx >= blocks.length - 1) return;
    setBlocks((prev) => {
      const newBlocks = [...prev];
      [newBlocks[idx], newBlocks[idx + 1]] = [
        newBlocks[idx + 1],
        newBlocks[idx],
      ];
      return newBlocks;
    });
  }

  function addBlock(type: PageBlock["type"]) {
    let newBlock: PageBlock;
    if (type === "heading") {
      newBlock = { type, props: { text: "Heading" } } as HeadingBlock;
    } else if (type === "paragraph") {
      newBlock = { type, props: { text: "Paragraph" } } as ParagraphBlock;
    } else if (type === "image") {
      newBlock = { type, props: { url: "", alt: "" } } as ImageBlock;
    } else if (type === "catalog") {
      newBlock = { type, props: { products: [] } } as any;
    } else {
      newBlock = { type, props: { text: "Button", url: "" } } as ButtonBlock;
    }
    setBlocks([...blocks, newBlock]);
  }

  function updateBlock(idx: number, props: any) {
    const updated = blocks.map((b: PageBlock, i: number) =>
      i === idx ? { ...b, props } : b
    );
    setBlocks(updated);
  }

  function removeBlock(idx: number) {
    const updated = blocks.filter((_: PageBlock, i: number) => i !== idx);
    setBlocks(updated);
  }

  return (
    <div>
      <div className="mb-2">
        {BLOCK_TYPES.map((b) => (
          <Button
            variant="outline"
            type="button"
            key={b.type}
            onClick={() => addBlock(b.type)}
            className="mr-2 btn"
          >
            + {b.label}
          </Button>
        ))}
      </div>
      {blocks.map((block: PageBlock, idx: number) => (
        <div key={idx} className="border p-2 mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">{block.type}</span>
            <div className="flex gap-2">
              <div className="flex gap-2 mr-10">
                <button
                  type="button"
                  onClick={() => moveBlockUp(idx)}
                  disabled={idx === 0}
                  title="Move up"
                  className="text-gray-500 disabled:opacity-40"
                  style={{ fontSize: "1.1em" }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlockDown(idx)}
                  disabled={idx === blocks.length - 1}
                  title="Move down"
                  className="text-gray-500 disabled:opacity-40"
                  style={{ fontSize: "1.1em" }}
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeBlock(idx)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
          {block.type === "heading" && (
            <Input
              className="input"
              value={block.props.text}
              onChange={(e) =>
                updateBlock(idx, { ...block.props, text: e.target.value })
              }
              placeholder="Heading text"
            />
          )}
          {block.type === "paragraph" && (
            <Textarea
              className="input"
              value={block.props.text}
              onChange={(e) =>
                updateBlock(idx, { ...block.props, text: e.target.value })
              }
              placeholder="Paragraph text"
            />
          )}
          {block.type === "image" && (
            <>
              <Input
                className="input"
                value={block.props.url}
                onChange={(e) =>
                  updateBlock(idx, { ...block.props, url: e.target.value })
                }
                placeholder="Image URL"
              />
              <Input
                className="input"
                value={block.props.alt}
                onChange={(e) =>
                  updateBlock(idx, { ...block.props, alt: e.target.value })
                }
                placeholder="Alt text"
              />
            </>
          )}
          {block.type === "button" && (
            <>
              <Input
                className="input"
                value={block.props.text}
                onChange={(e) =>
                  updateBlock(idx, { ...block.props, text: e.target.value })
                }
                placeholder="Button text"
              />
              <Input
                className="input"
                value={block.props.url}
                onChange={(e) =>
                  updateBlock(idx, { ...block.props, url: e.target.value })
                }
                placeholder="Button URL"
              />
            </>
          )}
          {block.type === "catalog" && (
            <CatalogFilterBlockEditor
              filters={block.props.filters || {}}
              onChange={(filters: any) =>
                updateBlock(idx, { ...block.props, filters })
              }
            />
          )}
        </div>
      ))}
      {/* Hidden input for form submission */}
      <input type="hidden" name="content" value={JSON.stringify(blocks)} />
    </div>
  );
}

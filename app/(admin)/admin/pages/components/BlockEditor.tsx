"use client";

import dynamic from "next/dynamic";
const CatalogFilterSelector = dynamic(() => import("./CatalogFilterSelector"), {
  ssr: false,
});
import { useState, useEffect } from "react";
import type { CatalogProduct } from "@/components/CatalogGrid";
import {
  ButtonBlock,
  HeadingBlock,
  ImageBlock,
  PageBlock,
  ParagraphBlock,
} from "@/app/(storefront)/p/[...slug]/page-renderer";

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

  useEffect(() => {
    async function fetchPreview() {
      const res = await fetch("/api/catalog-block-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      setPreviewProducts(data.products);
    }
    fetchPreview();
  }, [filters]);

  return (
    <CatalogFilterSelector
      filters={filters}
      onChange={onChange}
      previewProducts={previewProducts}
    />
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
          <button
            type="button"
            key={b.type}
            onClick={() => addBlock(b.type)}
            className="mr-2 btn"
          >
            + {b.label}
          </button>
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
            <input
              className="input"
              value={block.props.text}
              onChange={(e) =>
                updateBlock(idx, { ...block.props, text: e.target.value })
              }
              placeholder="Heading text"
            />
          )}
          {block.type === "paragraph" && (
            <textarea
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
              <input
                className="input"
                value={block.props.url}
                onChange={(e) =>
                  updateBlock(idx, { ...block.props, url: e.target.value })
                }
                placeholder="Image URL"
              />
              <input
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
              <input
                className="input"
                value={block.props.text}
                onChange={(e) =>
                  updateBlock(idx, { ...block.props, text: e.target.value })
                }
                placeholder="Button text"
              />
              <input
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

"use client";

import { useEffect, useState } from "react";
import CatalogGrid from "@/app/(storefront)/components/catalog-grid";
import { CatalogProduct } from "@/lib/types/catalog-product";

export type HeadingBlock = {
  type: "heading";
  props: { text: string };
};
export type ParagraphBlock = {
  type: "paragraph";
  props: { text: string };
};
export type ImageBlock = {
  type: "image";
  props: { url: string; alt: string };
};
export type ButtonBlock = {
  type: "button";
  props: { text: string; url: string };
};
export type CatalogBlock = {
  type: "catalog";
  props: {
    filters: {
      query?: string;
      attributeFilters?: Record<string, string[]>;
    };
  };
};
export type PageBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ButtonBlock
  | CatalogBlock;
export type PageContent = PageBlock[];

function renderBlock(block: PageBlock) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-2xl font-bold mt-6 mb-4 text-neutral-900">
          {block.props.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-base leading-7 my-3 text-neutral-700">
          {block.props.text}
        </p>
      );
    case "image":
      return (
        <div className="flex justify-center my-6">
          <img
            src={block.props.url}
            alt={block.props.alt}
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      );
    case "button":
      return (
        <div className="my-6">
          <a
            href={block.props.url}
            className="btn inline-block px-6 py-3 bg-blue-600 text-white rounded-md no-underline font-semibold text-base shadow transition-colors duration-200 hover:bg-blue-800"
          >
            {block.props.text}
          </a>
        </div>
      );
    case "catalog":
      return <CatalogBlockRenderer filters={block.props.filters} />;
    default:
      return null;
  }
}

function CatalogBlockRenderer({ filters }: { filters: any }) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/catalog-block-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data: CatalogProduct[] = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return (
    <div className="my-8">
      <CatalogGrid products={products} />
    </div>
  );
}

export default function PageRenderer({ content }: { content: PageContent }) {
  const blocks = Array.isArray(content) ? content : [];
  return (
    <div>
      {blocks.map((block, idx) => (
        <div key={idx}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}

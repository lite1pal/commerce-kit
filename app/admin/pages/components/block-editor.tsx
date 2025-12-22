"use client";

import type {
  PageBlock,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  ButtonBlock,
} from "../../../p/[...slug]/page-renderer";
import { useState } from "react";

const BLOCK_TYPES: { type: PageBlock["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
];

type BlockEditorProps = {
  value?: PageBlock[];
};

export default function BlockEditor({ value }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(value ?? []);

  function addBlock(type: PageBlock["type"]) {
    let newBlock: PageBlock;
    if (type === "heading") {
      newBlock = { type, props: { text: "Heading" } } as HeadingBlock;
    } else if (type === "paragraph") {
      newBlock = { type, props: { text: "Paragraph" } } as ParagraphBlock;
    } else if (type === "image") {
      newBlock = { type, props: { url: "", alt: "" } } as ImageBlock;
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
            <button
              type="button"
              onClick={() => removeBlock(idx)}
              className="text-red-600"
            >
              Remove
            </button>
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
        </div>
      ))}
      {/* Hidden input for form submission */}
      <input type="hidden" name="content" value={JSON.stringify(blocks)} />
    </div>
  );
}

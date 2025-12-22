"use client";

// --- Block Types ---
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
export type PageBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ButtonBlock;
export type PageContent = PageBlock[];

function renderBlock(block: PageBlock) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            margin: "1.5rem 0 1rem 0",
            color: "#222",
          }}
        >
          {block.props.text}
        </h2>
      );
    case "paragraph":
      return (
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            margin: "0.75rem 0",
            color: "#444",
          }}
        >
          {block.props.text}
        </p>
      );
    case "image":
      return (
        <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
          <img
            src={block.props.url}
            alt={block.props.alt}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      );
    case "button":
      return (
        <div style={{ margin: "1.5rem 0" }}>
          <a
            href={block.props.url}
            className="btn"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#0070f3",
              color: "#fff",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#0059c1")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#0070f3")}
          >
            {block.props.text}
          </a>
        </div>
      );
    default:
      return null;
  }
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

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
      return <h2>{block.props.text}</h2>;
    case "paragraph":
      return <p>{block.props.text}</p>;
    case "image":
      return <img src={block.props.url} alt={block.props.alt} />;
    case "button":
      return (
        <a href={block.props.url} className="btn">
          {block.props.text}
        </a>
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

type ContentBlock =
  | {
      id: string;
      text: string;
      type: "heading" | "subheading" | "paragraph" | "quote";
    }
  | {
      id: string;
      items: string[];
      type: "list";
    };

function parseContent(content: string) {
  const blocks: ContentBlock[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    blocks.push({
      id: `paragraph-${blocks.length}`,
      text: paragraph.join(" "),
      type: "paragraph",
    });
    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) return;
    blocks.push({
      id: `list-${blocks.length}`,
      items: list,
      type: "list",
    });
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({
        id: `subheading-${blocks.length}`,
        text: line.slice(3).trim(),
        type: "subheading",
      });
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({
        id: `heading-${blocks.length}`,
        text: line.slice(2).trim(),
        type: "heading",
      });
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({
        id: `quote-${blocks.length}`,
        text: line.slice(2).trim(),
        type: "quote",
      });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2).trim());
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export default function FormattedContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="mx-auto w-full max-w-[65ch] font-[family-name:var(--font-newsreader)] text-[1.15rem] leading-[1.75] text-[var(--color-ink)]">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return (
            <h2
              key={block.id}
              className="mb-5 mt-14 font-[family-name:var(--font-newsreader)] text-[clamp(1.8rem,3vw,2.4rem)] font-normal leading-[1.15] tracking-[-0.015em] text-[var(--color-ink)]"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "subheading") {
          return (
            <h3
              key={block.id}
              className="mb-4 mt-10 font-[family-name:var(--font-newsreader)] text-[clamp(1.4rem,2vw,1.75rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[var(--color-ink)]"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={block.id}
              className="my-10 border-l-2 border-[var(--color-accent)] pl-6 font-[family-name:var(--font-newsreader)] text-[1.35rem] italic leading-[1.55] tracking-[-0.005em] text-[var(--color-ink)]"
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={block.id}
              className="mb-7 grid gap-3 pl-6 [&>li]:relative [&>li]:pl-3 [&>li]:before:absolute [&>li]:before:left-[-6px] [&>li]:before:top-[0.85em] [&>li]:before:h-[6px] [&>li]:before:w-[6px] [&>li]:before:rounded-full [&>li]:before:bg-[var(--color-accent)]"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={block.id} className="mb-7">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

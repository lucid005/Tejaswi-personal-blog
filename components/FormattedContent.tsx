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
    if (paragraph.length === 0) {
      return;
    }

    blocks.push({
      id: `paragraph-${blocks.length}`,
      text: paragraph.join(" "),
      type: "paragraph",
    });
    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) {
      return;
    }

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
    <div className="max-w-[760px] text-[1.08rem] font-semibold leading-8 text-[#2f2c29]">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return (
            <h2
              className="mb-5 mt-10 font-fraunces text-[clamp(2rem,4vw,3.4rem)] font-medium leading-tight"
              key={block.id}
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "subheading") {
          return (
            <h3
              className="mb-4 mt-8 font-fraunces text-[clamp(1.55rem,3vw,2.35rem)] font-medium leading-tight"
              key={block.id}
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              className="my-8 border-l-4 border-[#717a51] pl-5 font-fraunces text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-snug text-[#4f5740]"
              key={block.id}
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul className="mb-7 grid list-disc gap-2 pl-6" key={block.id}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p className="mb-7" key={block.id}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

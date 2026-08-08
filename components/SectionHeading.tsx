type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const wrapClass =
    align === "center"
      ? "mx-auto mb-[clamp(32px,5vw,56px)] max-w-[720px] text-center"
      : "mb-[clamp(32px,5vw,56px)]";

  return (
    <div className={wrapClass}>
      {eyebrow ? (
        <p className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-[22ch] font-[family-name:var(--font-newsreader)] text-[clamp(2.2rem,5.5vw,4.6rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)]">
        {title}
      </h1>
      {description ? (
        <p
          className={`mt-5 max-w-[58ch] text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6] text-[var(--color-muted)] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

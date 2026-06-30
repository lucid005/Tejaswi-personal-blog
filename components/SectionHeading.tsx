type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-[clamp(24px,4vw,44px)]">
      {eyebrow ? (
        <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-normal text-[#717a51]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-[980px] font-fraunces text-[clamp(2.4rem,7vw,6.8rem)] font-medium leading-[0.95] tracking-normal">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-[760px] text-[clamp(1rem,1.3vw,1.2rem)] font-semibold leading-[1.55] text-[#625c55]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

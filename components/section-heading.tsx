type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

// Signature visuelle de la direction artistique Rooted : petit trait vertical
// accent au-dessus du titre, titre serif en majuscules très espacées, et
// sous-titre italique en dessous.
export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment}`}>
      <span aria-hidden="true" className="mb-4 h-8 w-px bg-accent" />
      <h2 className="font-serif text-2xl tracking-widest text-foreground uppercase sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 font-serif text-lg text-secondary italic">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

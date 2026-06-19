type SectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "white";
};

export function Section({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: SectionProps) {
  return (
    <section className={tone === "white" ? "bg-white" : "bg-transparent"}>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-7 max-w-3xl">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-steel">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
          {description && (
            <p className="mt-3 text-base leading-7 text-slate-600">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

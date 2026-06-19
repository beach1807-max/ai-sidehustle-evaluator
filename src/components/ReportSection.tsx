export function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-4 text-slate-700">{children}</div>
    </section>
  );
}

export function PlainList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-steel" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function WarningCard({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium leading-6 text-danger"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

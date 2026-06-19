export function ScoreCard({
  score,
  label,
  summary,
}: {
  score: number;
  label: string;
  summary: string;
}) {
  return (
    <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[220px_1fr]">
      <div className="rounded-md bg-ink p-6 text-white">
        <p className="text-sm text-slate-300">冷靜總分</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-6xl font-bold leading-none">{score}</span>
          <span className="pb-2 text-lg text-slate-300">/ 100</span>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-signal">
          {label}
        </span>
        <p className="mt-4 text-lg leading-8 text-slate-700">{summary}</p>
      </div>
    </div>
  );
}

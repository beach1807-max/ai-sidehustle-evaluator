import type { DimensionScore } from "../data/mockReports";

export function DimensionScoreList({
  dimensions,
}: {
  dimensions: DimensionScore[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {dimensions.map((dimension) => {
        const percent = (dimension.score / dimension.maxScore) * 100;
        return (
          <article
            key={dimension.name}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-ink">{dimension.name}</h3>
              <span className="shrink-0 text-sm font-bold text-steel">
                {dimension.score} / {dimension.maxScore}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-steel"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {dimension.comment}
            </p>
          </article>
        );
      })}
    </div>
  );
}

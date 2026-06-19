import { ButtonLink } from "./Buttons";
import type { ExampleReport } from "../data/mockReports";

export function ExampleReportCard({ report }: { report: ExampleReport }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">{report.title}</h2>
          <span className="mt-3 inline-flex rounded-full bg-frost px-3 py-1 text-sm font-semibold text-steel">
            {report.label}
          </span>
        </div>
        <div className="rounded-md bg-ink px-4 py-3 text-center text-white">
          <div className="text-2xl font-bold">{report.score}</div>
          <div className="text-xs text-slate-300">/ 100</div>
        </div>
      </div>
      <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
        <p>{report.conclusion}</p>
        <p>
          <strong className="text-ink">主要風險：</strong>
          {report.risk}
        </p>
        <p>
          <strong className="text-ink">縮小後的產品樣貌：</strong>
          {report.smallerVersion}
        </p>
      </div>
      <div className="mt-6">
        <ButtonLink to={`/report/${report.id}`} variant="secondary">
          查看完整報告
        </ButtonLink>
      </div>
    </article>
  );
}

import { ExampleReportCard } from "../components/ExampleReportCard";
import { exampleReports } from "../data/mockReports";

export function ExamplesPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-steel">固定範例</p>
        <h1 className="text-3xl font-bold text-ink">範例報告</h1>
        <p className="mt-3 leading-8 text-slate-600">
          以下是幾個副業點子的冷靜評估示範。重點不是鼓勵你做，而是幫你看見風險、縮小範圍，找到最小驗證版本。
        </p>
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-signal">
          以下範例用來展示這套評分器的判斷風格。正式 AI 客製化分析仍在測試中。
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {exampleReports.map((report) => (
          <ExampleReportCard key={report.title} report={report} />
        ))}
      </div>
    </section>
  );
}

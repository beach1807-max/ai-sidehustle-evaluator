import { ButtonLink } from "../components/Buttons";
import { DeepReportView } from "../components/DeepReportView";
import type { DeepReport } from "../data/deepReport";
import { normalizeDeepReport, validateDeepReport } from "../lib/validateDeepReport";

const storageKey = "deepReportPreview";

export function DeepReportPreviewPage() {
  const report = readDeepReport();

  if (!report) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-sm font-semibold text-steel">Deep Report</p>
          <h1 className="text-3xl font-bold text-ink">目前沒有可預覽的深度報告</h1>
          <p className="mt-4 leading-8 text-slate-600">
            請先回到免費報告頁，並在開發者模式中產生深度報告。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/report/generated-preview">回到免費報告</ButtonLink>
            <ButtonLink to="/evaluate" variant="secondary">
              回到輸入頁
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return <DeepReportView report={report} />;
}

function readDeepReport(): DeepReport | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const result = validateDeepReport(parsed);
    if (!result.isValid) {
      return null;
    }

    const normalizedReport = normalizeDeepReport(parsed as DeepReport);
    localStorage.setItem(storageKey, JSON.stringify(normalizedReport));
    return normalizedReport;
  } catch {
    return null;
  }
}

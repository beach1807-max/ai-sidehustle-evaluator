import { ButtonLink } from "../components/Buttons";
import { ReportView } from "../components/ReportView";
import type { MockReport } from "../data/mockReports";
import { normalizeReportData, validateReportData } from "../lib/validateReport";

const storageKey = "generatedReportPreview";
const sourceKey = "generatedReportPreviewSource";

export function GeneratedReportPreviewPage() {
  const report = readGeneratedReport();

  if (!report) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-sm font-semibold text-steel">Generated Preview</p>
          <h1 className="text-3xl font-bold text-ink">目前沒有可預覽的 AI 報告</h1>
          <p className="mt-4 leading-8 text-slate-600">
            請先回到輸入頁產生報告。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/evaluate">回到輸入頁</ButtonLink>
            <ButtonLink to="/json-preview" variant="secondary">
              前往 JSON Preview
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <ReportView
      report={report}
      displayedIdea={report.title}
      notice={getGeneratedReportNotice()}
    />
  );
}

function getGeneratedReportNotice() {
  const source = localStorage.getItem(sourceKey);
  const saveStatus = localStorage.getItem("reportHistoryLastSaveStatus");
  if (source === "saved-history") {
    return "這是從本機報告紀錄載入的內容，不會重新呼叫 AI。";
  }

  if (source === "mock-fallback") {
    return "這是 Mock 報告，用於展示報告格式，不代表你的點子已被 AI 實際分析。";
  }

  if (saveStatus === "saved") {
    localStorage.removeItem("reportHistoryLastSaveStatus");
    return "這是 AI 測試版產生的報告，內容僅供副業規劃與 MVP 驗證參考。已自動保存到報告紀錄，可稍後回來查看。";
  }

  return "這是 AI 測試版產生的報告，內容僅供副業規劃與 MVP 驗證參考。";
}

function readGeneratedReport(): MockReport | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const result = validateReportData(parsed);
    if (!result.isValid) {
      return null;
    }

    const normalizedReport = normalizeReportData(parsed as MockReport);
    localStorage.setItem(storageKey, JSON.stringify(normalizedReport));
    return normalizedReport;
  } catch {
    return null;
  }
}

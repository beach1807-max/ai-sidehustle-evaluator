import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ButtonLink } from "../components/Buttons";
import { ReportView } from "../components/ReportView";
import {
  defaultReportId,
  getMockReport,
  mockReport as defaultReport,
} from "../data/mockReports";

export function ReportPage() {
  const { reportId } = useParams();
  const activeReportId = reportId ?? defaultReportId;
  const report = getMockReport(activeReportId);

  const userIdea = useMemo(() => {
    try {
      const raw = localStorage.getItem("coldScoreInput");
      const parsed = raw ? (JSON.parse(raw) as Record<string, string>) : null;
      const savedIdea = parsed?.idea?.trim();
      if (activeReportId === defaultReportId && savedIdea) {
        return savedIdea;
      }
      return report?.title ?? defaultReport.title;
    } catch {
      return report?.title ?? defaultReport.title;
    }
  }, [activeReportId, report?.title]);

  if (!report) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-sm font-semibold text-steel">範例報告</p>
          <h1 className="text-3xl font-bold text-ink">找不到這份報告</h1>
          <p className="mt-4 leading-8 text-slate-600">
            這份範例報告不存在，請回到範例報告頁重新選擇。
          </p>
          <div className="mt-7">
            <ButtonLink to="/examples">回到範例報告頁</ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <ReportView
      report={report}
      displayedIdea={userIdea}
      exampleReportId={activeReportId}
      notice="目前為 Mock 版，報告內容為範例資料，之後會接上 AI API 產生客製化分析。"
    />
  );
}

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "../components/Buttons";
import {
  clearSavedReports,
  deleteSavedReport,
  getSavedReports,
  type SavedReport,
  type SavedReportType,
} from "../lib/reportStorage";

const generatedReportStorageKey = "generatedReportPreview";
const generatedReportSourceKey = "generatedReportPreviewSource";
const deepReportStorageKey = "deepReportPreview";

type ReportFilter = "all" | SavedReportType;

const filters: { value: ReportFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "free", label: "一般報告" },
  { value: "deep", label: "深度報告" },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(() => getSavedReports());
  const [filter, setFilter] = useState<ReportFilter>("all");

  const filteredReports = useMemo(
    () =>
      filter === "all"
        ? reports
        : reports.filter((report) => report.type === filter),
    [filter, reports]
  );

  function viewReport(report: SavedReport) {
    if (report.type === "deep") {
      localStorage.setItem(deepReportStorageKey, JSON.stringify(report.report));
      navigate("/report/deep-preview");
      return;
    }

    localStorage.setItem(generatedReportStorageKey, JSON.stringify(report.report));
    localStorage.setItem(generatedReportSourceKey, "saved-history");
    navigate("/report/generated-preview");
  }

  function deleteReport(id: string) {
    const confirmed = window.confirm("確定要刪除這份報告紀錄嗎？此操作無法復原。");
    if (!confirmed) {
      return;
    }

    deleteSavedReport(id);
    setReports(getSavedReports());
  }

  function clearAllReports() {
    const confirmed = window.confirm("確定要清空所有報告紀錄嗎？此操作無法復原。");
    if (!confirmed) {
      return;
    }

    clearSavedReports();
    setReports([]);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-steel">本機紀錄</p>
        <h1 className="text-3xl font-bold text-ink">報告紀錄</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          這裡只保存同一台裝置、同一個瀏覽器中產出的報告，不會同步到雲端。
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-ink">目前還沒有報告紀錄</h2>
          <p className="mt-4 leading-8 text-slate-600">
            產出一般報告或深度報告後，會自動出現在這裡。
          </p>
          <div className="mt-7">
            <ButtonLink to="/evaluate">開始產出報告</ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold transition ${
                    filter === item.value
                      ? "bg-ink text-white"
                      : "border border-slate-300 bg-white text-ink hover:bg-frost"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={clearAllReports}
              className="focus-ring rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-danger transition hover:bg-red-50"
            >
              清空全部紀錄
            </button>
          </div>

          {filteredReports.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="leading-8 text-slate-600">這個篩選條件目前沒有報告紀錄。</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-ink">{report.title}</h2>
                        <span className="rounded-full bg-frost px-3 py-1 text-sm font-semibold text-steel">
                          {getReportTypeLabel(report.type)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        建立時間：{formatDateTime(report.createdAt)}
                      </p>
                      <p className="mt-3 leading-7 text-slate-700">
                        {report.summary || report.verdict || "這份報告沒有摘要。"}
                      </p>
                      {(report.score !== undefined || report.verdict) && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {report.score !== undefined && <>分數：{report.score}　</>}
                          {report.verdict && <>判斷：{report.verdict}</>}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => viewReport(report)}
                        className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        查看報告
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteReport(report.id)}
                        className="focus-ring rounded-md border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-red-50"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function getReportTypeLabel(type: SavedReportType) {
  return type === "deep" ? "深度報告" : "一般報告";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

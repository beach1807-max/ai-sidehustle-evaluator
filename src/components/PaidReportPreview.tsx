import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exampleDeepReports } from "../data/exampleDeepReports";
import { normalizeDeepReport, validateDeepReport } from "../lib/validateDeepReport";

const paidReportItems = [
  "7 天 MVP 行動計畫",
  "AI Agent 開工包",
  "給 AI 的完整開發任務說明",
  "一頁式銷售頁文案",
  "第一版收費與推廣建議",
  "風險修正與砍功能建議",
];

type PaidReportPreviewProps = {
  displayedIdea: string;
  exampleReportId?: string;
};

type DeepReportApiResponse =
  | {
      ok: true;
      report: unknown;
      warnings: string[];
    }
  | {
      ok: false;
      error: string;
      code?: string;
      retryable?: boolean;
      details: string[];
    };

const deepReportStorageKey = "deepReportPreview";

export function PaidReportPreview({
  displayedIdea,
  exampleReportId,
}: PaidReportPreviewProps) {
  const navigate = useNavigate();
  const enableDeepReport = import.meta.env.VITE_ENABLE_DEEP_REPORT === "true";
  const exampleDeepReport = exampleReportId
    ? exampleDeepReports[exampleReportId]
    : undefined;
  const [showComingSoonMessage, setShowComingSoonMessage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  function openStaticExampleStarterKit() {
    if (!exampleDeepReport) {
      return;
    }

    setShowComingSoonMessage(false);
    setError("");

    const normalizedReport = normalizeDeepReport(exampleDeepReport);
    const validation = validateDeepReport(normalizedReport);
    if (!validation.isValid) {
      setError(`固定範例 Deep Report 驗證失敗：${validation.errors.join("；")}`);
      return;
    }

    localStorage.setItem(deepReportStorageKey, JSON.stringify(normalizedReport));
    navigate("/report/deep-preview");
  }

  async function generateDeepReport() {
    setShowComingSoonMessage(false);
    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...readEvaluationInput(displayedIdea),
          mode: "deep",
        }),
      });

      const result = (await response.json()) as DeepReportApiResponse;
      if (!response.ok || !result.ok) {
        setError(result.ok === false ? result.error : "深度報告產生失敗，請稍後再試。");
        return;
      }

      localStorage.setItem(deepReportStorageKey, JSON.stringify(result.report));
      navigate("/report/deep-preview");
    } catch {
      setError("深度報告產生失敗，請稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="rounded-lg border border-steel/25 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-frost px-3 py-1 text-sm font-semibold text-steel">
            AI Agent 開工包預覽
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink">
            想讓 AI 幫你做出第一版網站？
          </h2>
          <p className="mt-3 leading-8 text-slate-600">
            系統會把你的副業點子整理成一份 AI 看得懂的開發說明書，包含 MVP 功能、7 天行動計畫、AI Agent 開工包、推廣文案與收費建議。
          </p>
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-signal">
            <p className="font-semibold text-ink">這不是單純買一份分析報告。</p>
            <p className="mt-2">
              你會拿到一份可以交給 AI 開發工具的 MVP（最小可行產品 / 第一版可測試網站）開工說明書，幫你把副業點子整理成功能、頁面、開發步驟與驗收條件。
            </p>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
          <p className="font-semibold text-ink">產生完整開工包後，你會得到：</p>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {paidReportItems.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="font-bold text-steel">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-bold text-ink">單次完整開工包：NT$49～99</p>
        {exampleDeepReport ? (
          <button
            type="button"
            onClick={openStaticExampleStarterKit}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            產生完整開工包
          </button>
        ) : enableDeepReport ? (
          <button
            type="button"
            onClick={generateDeepReport}
            disabled={isGenerating}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:bg-slate-500"
          >
            {isGenerating ? "正在產生完整開工包..." : "產生完整開工包"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowComingSoonMessage(true)}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            產生完整開工包
          </button>
        )}
      </div>

      {exampleDeepReport && (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          範例報告會直接顯示預設好的完整開工包，不會消耗 AI 產生次數。
        </p>
      )}

      {showComingSoonMessage && (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium leading-6 text-emerald-700">
          此功能即將開放，感謝你的興趣。
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium leading-6 text-danger">
          {error}
        </p>
      )}
    </section>
  );
}

function readEvaluationInput(displayedIdea: string) {
  try {
    const rawInput = localStorage.getItem("coldScoreInput");
    const savedInput = rawInput ? JSON.parse(rawInput) : null;

    return {
      idea: savedInput?.idea || displayedIdea,
      availableTime: savedInput?.time || "未提供",
      avoidThings: savedInput?.avoid || "",
    };
  } catch {
    return {
      idea: displayedIdea,
      availableTime: "未提供",
      avoidThings: "",
    };
  }
}

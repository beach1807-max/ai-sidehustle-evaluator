import { useState } from "react";
import { useNavigate } from "react-router-dom";

const paidReportItems = [
  "7 天 MVP 行動計畫",
  "Codex 開發提示詞",
  "一頁式銷售頁文案",
  "第一版收費建議",
  "風險修正方案",
];

type PaidReportPreviewProps = {
  displayedIdea: string;
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

export function PaidReportPreview({ displayedIdea }: PaidReportPreviewProps) {
  const navigate = useNavigate();
  const enableDeepReport = import.meta.env.VITE_ENABLE_DEEP_REPORT === "true";
  const [showComingSoonMessage, setShowComingSoonMessage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

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
            深度報告預覽
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink">
            想把這個點子變成可執行 MVP？
          </h2>
          <p className="mt-3 leading-8 text-slate-600">
            解鎖副業點子深度驗證報告，取得更具體的 7 天執行方案與 Codex 開發提示詞。
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
          <p className="font-semibold text-ink">解鎖深度報告後，你會得到：</p>
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
        <p className="text-lg font-bold text-ink">單次深度報告：NT$49～99</p>
        {enableDeepReport ? (
          <button
            type="button"
            onClick={generateDeepReport}
            disabled={isGenerating}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:bg-slate-500"
          >
            {isGenerating ? "正在產生深度報告..." : "產生深度報告"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowComingSoonMessage(true)}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            我想要這份深度報告
          </button>
        )}
      </div>

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

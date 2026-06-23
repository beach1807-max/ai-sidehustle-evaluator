import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ActionButton } from "../components/Buttons";
import { UsageDebugPanel } from "../components/UsageDebugPanel";
import { mockProvider } from "../lib/ai/mockProvider";
import {
  buildEvaluationPrompt,
  type EvaluationInput,
} from "../lib/promptTemplate";
import { getEvaluateErrorMessage, postEvaluate } from "../lib/evaluateApi";
import { saveReport } from "../lib/reportStorage";
import {
  canUseFreeEvaluation,
  getFreeEvaluationLimit,
  recordFreeEvaluationUsed,
} from "../lib/usageLimits";

const generatedReportStorageKey = "generatedReportPreview";
const generatedReportSourceKey = "generatedReportPreviewSource";
const genericErrorMessage = "AI 產生失敗，請稍後再試。";
const freeEvaluationLimitMessage =
  "今天的一般報告免費使用次數已達上限。每日可產生 3 次，請明天再試。";

const fields = [
  {
    id: "idea",
    label: "你的點子",
    placeholder: "例如：用 AI 幫小型餐廳自動整理 Google 評論並產生改善建議",
  },
  {
    id: "time",
    label: "可投入時間",
    placeholder: "例如：每週 5 小時，想先做一個週末 MVP",
  },
  {
    id: "avoid",
    label: "不想做的事",
    placeholder: "例如：不想露臉、不想做大量客服、不想碰庫存或物流",
  },
];

export function EvaluatePage() {
  const navigate = useNavigate();
  const showDevTools = import.meta.env.VITE_SHOW_DEV_TOOLS === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackStatus, setFallbackStatus] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setIsTakingLonger(false);
      setLoadingMessage("");
      return;
    }

    setLoadingMessage("正在送出你的點子，請稍候...");
    const firstTimerId = window.setTimeout(() => {
      setLoadingMessage("AI 正在整理市場與 MVP 建議，可能還需要一點時間。");
    }, 15000);
    const secondTimerId = window.setTimeout(() => {
      setIsTakingLonger(true);
      setLoadingMessage(
        "這次 AI 回應較慢，系統仍在等待；如果失敗，不會扣除使用次數。"
      );
    }, 30000);

    return () => {
      window.clearTimeout(firstTimerId);
      window.clearTimeout(secondTimerId);
    };
  }, [isLoading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setIsTakingLonger(false);
    setError("");
    setShowFallback(false);
    setFallbackStatus("");

    const evaluationInput: EvaluationInput = {
      idea: values.idea ?? "",
      availableTime: values.time ?? "",
      avoidThings: values.avoid ?? "",
    };

    const validationMessage = validateInput(evaluationInput);
    if (validationMessage) {
      setError(validationMessage);
      setIsLoading(false);
      return;
    }

    const savedInput = {
      idea: evaluationInput.idea,
      time: evaluationInput.availableTime,
      avoid: evaluationInput.avoidThings,
    };
    localStorage.setItem("coldScoreInput", JSON.stringify(savedInput));

    if (!canUseFreeEvaluation()) {
      setError(
        freeEvaluationLimitMessage.replace(
          "3 次",
          `${getFreeEvaluationLimit()} 次`
        )
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await postEvaluate(evaluationInput);
      if (!result.ok) {
        setError(getEvaluateErrorMessage(result.code, result.error));
        setShowFallback(true);
        return;
      }

      const normalizedReport = normalizeReportForHistory(result.report);
      localStorage.setItem(
        generatedReportStorageKey,
        JSON.stringify(normalizedReport)
      );
      localStorage.setItem(generatedReportSourceKey, "ai");
      const saved = saveReport({
        type: "free",
        title: normalizedReport.title || evaluationInput.idea || "未命名報告",
        idea: evaluationInput.idea,
        summary: normalizedReport.summary,
        score: normalizedReport.score,
        verdict:
          normalizedReport.scoreLabel || normalizedReport.oneSentenceVerdict,
        report: normalizedReport,
        input: evaluationInput,
      });
      if (saved) {
        localStorage.setItem("reportHistoryLastSaveStatus", "saved");
      }
      recordFreeEvaluationUsed();
      window.setTimeout(() => navigate("/report/generated-preview"), 300);
    } catch (providerError) {
      setError(
        providerError instanceof Error
          ? providerError.message
          : genericErrorMessage
      );
      setShowFallback(true);
    } finally {
      setIsLoading(false);
    }
  }

  function getCurrentInput(): EvaluationInput {
    return {
      idea: values.idea ?? "",
      availableTime: values.time ?? "",
      avoidThings: values.avoid ?? "",
    };
  }

  async function previewMockReport() {
    setFallbackStatus("");
    const input = getCurrentInput();
    const result = await mockProvider.generateReport(input);
    localStorage.setItem(generatedReportStorageKey, JSON.stringify(result.report));
    localStorage.setItem(generatedReportSourceKey, "mock-fallback");
    navigate("/report/generated-preview");
  }

  async function copyPromptForManualTest() {
    await navigator.clipboard.writeText(buildEvaluationPrompt(getCurrentInput()));
    setFallbackStatus("已複製 prompt，可貼到 ChatGPT / Gemini 手動測試。");
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-steel">AI 冷靜評估</p>
        <h1 className="text-3xl font-bold text-ink">輸入你的副業點子</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          用三個輸入快速判斷這個點子是否適合一人開工，並產生 MVP、風險與驗證方向。
        </p>
        <p className="mt-3 max-w-3xl rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-signal">
          AI 回覆僅供決策參考；建議先用最小成本驗證需求，再投入開發。
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="grid gap-5">
          {fields.map((field) => (
            <label key={field.id} className="grid gap-2">
              <span className="font-semibold text-ink">{field.label}</span>
              <textarea
                rows={field.id === "idea" ? 3 : 2}
                placeholder={field.placeholder}
                value={values[field.id] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.id]: event.target.value,
                  }))
                }
                className="focus-ring min-h-24 resize-y rounded-md border border-slate-300 bg-white px-4 py-3 leading-7 text-ink placeholder:text-slate-400"
              />
            </label>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ActionButton disabled={isLoading}>
            {isLoading ? "分析中..." : "開始冷靜評估"}
          </ActionButton>
          <p className="text-sm text-slate-500">
            產生成功才會扣除一般報告使用次數。
          </p>
        </div>
        {isLoading && (
          <div className="mt-4 rounded-md border border-steel/20 bg-frost p-4 text-sm leading-6 text-steel">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-steel/30 border-t-steel" />
              <div>
                <p className="font-semibold text-ink">
                  {loadingMessage || "正在送出你的點子，請稍候..."}
                </p>
                <p className="mt-1">
                  請不要關閉頁面；如果 AI 請求失敗，系統不會扣除使用次數。
                </p>
                {isTakingLonger && (
                  <p className="mt-3 rounded-md bg-white/70 p-3 font-medium text-signal">
                    AI 回應比平常久，系統會自動停止過久的請求，請稍後再試。
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {error && (
          <pre className="mt-4 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-danger">
            {error}
          </pre>
        )}
        {showFallback && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-6 text-signal">
              AI 請求沒有完成。你可以稍後重試，或先查看 Mock 報告確認流程。
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previewMockReport}
                className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                使用 Mock 報告預覽
              </button>
              {showDevTools && (
                <>
                  <button
                    type="button"
                    onClick={copyPromptForManualTest}
                    className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
                  >
                    複製 prompt
                  </button>
                  <Link
                    to="/json-preview"
                    className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
                  >
                    前往 JSON Preview
                  </Link>
                </>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Mock 報告不會扣除每日 AI 使用次數。
            </p>
            {fallbackStatus && (
              <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-medium leading-6 text-emerald-700">
                {fallbackStatus}
              </p>
            )}
          </div>
        )}
      </form>
      <div className="mt-6">
        <UsageDebugPanel />
      </div>
    </section>
  );
}

function validateInput(input: EvaluationInput) {
  if (!input.idea.trim()) {
    return "請先輸入你的點子。";
  }

  if (!input.availableTime.trim()) {
    return "請先輸入你可投入的時間。";
  }

  return "";
}

function normalizeReportForHistory(report: unknown) {
  if (report && typeof report === "object" && !Array.isArray(report)) {
    const normalizedReport = report as {
      title?: string;
      summary?: string;
      score?: number | string;
      scoreLabel?: string;
      oneSentenceVerdict?: string;
    };

    return {
      ...normalizedReport,
      title: normalizedReport.title || "未命名報告",
      summary: normalizedReport.summary || "",
      score: normalizedReport.score,
      scoreLabel: normalizedReport.scoreLabel || "",
      oneSentenceVerdict: normalizedReport.oneSentenceVerdict || "",
    };
  }

  return {
    title: "未命名報告",
    summary: "",
    score: undefined,
    scoreLabel: "",
    oneSentenceVerdict: "",
  };
}

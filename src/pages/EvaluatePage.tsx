import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ActionButton } from "../components/Buttons";
import { UsageDebugPanel } from "../components/UsageDebugPanel";
import { mockProvider } from "../lib/ai/mockProvider";
import {
  buildEvaluationPrompt,
  type EvaluationInput,
} from "../lib/promptTemplate";
import {
  canUseFreeEvaluation,
  getFreeEvaluationLimit,
  recordFreeEvaluationUsed,
} from "../lib/usageLimits";

const generatedReportStorageKey = "generatedReportPreview";
const generatedReportSourceKey = "generatedReportPreviewSource";
const rateLimitMessage = "AI 目前請求過於頻繁，請稍後再試。你的輸入內容已保留。";
const temporaryErrorMessage =
  "AI 暫時無法回應，請稍後重試。你也可以改用 Mock 報告或複製提示詞手動測試。";
const genericErrorMessage = "AI 報告產生失敗，請稍後重試。你的輸入內容已保留。";
const freeEvaluationLimitMessage =
  "今日一般報告免費產出次數已用完。公開測試期間每日暫時開放 2 次，你仍可以查看範例報告，或明天再試。";

type EvaluateApiResponse =
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

const fields = [
  {
    id: "idea",
    label: "副業點子",
    placeholder: "例如：\nAI 寵物飼料分析推薦",
  },
  {
    id: "time",
    label: "可投入時間",
    placeholder: "例如：\n下班後每天 1～2 小時",
  },
  {
    id: "avoid",
    label: "不想做哪些事（選填）",
    placeholder: "例如：\n不想做客服\n不想拜訪客戶\n不想長期人工維護資料\n\n可留空",
  },
];

export function EvaluatePage() {
  const navigate = useNavigate();
  const showDevTools = import.meta.env.VITE_SHOW_DEV_TOOLS === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackStatus, setFallbackStatus] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setIsTakingLonger(false);
      return;
    }

    const timerId = window.setTimeout(() => {
      setIsTakingLonger(true);
    }, 20000);

    return () => window.clearTimeout(timerId);
  }, [isLoading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        freeEvaluationLimitMessage.replace("2 次", `${getFreeEvaluationLimit()} 次`)
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluationInput),
      });

      if (!response.ok) {
        throw new Error(genericErrorMessage);
      }

      const result = (await response.json()) as EvaluateApiResponse;
      if (!result.ok) {
        setError(getProviderErrorMessage(result.code));
        setShowFallback(true);
        return;
      }

      localStorage.setItem(generatedReportStorageKey, JSON.stringify(result.report));
      localStorage.setItem(generatedReportSourceKey, "ai");
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
    setFallbackStatus(
      "已複製提示詞。你可以貼到 ChatGPT / Gemini 網頁版手動測試，再把 JSON 貼回 JSON Preview。"
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-steel">AI 測試版評估流程</p>
        <h1 className="text-3xl font-bold text-ink">輸入你的副業點子</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          請輸入你的副業點子、可投入時間，以及你不想做的事。AI 會用偏保守、冷靜的標準，產生一份 MVP 可行性評估報告。
        </p>
        <p className="mt-3 max-w-3xl rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-signal">
          這份報告是初步決策輔助，不是創業保證，也不是法律、財務或專業顧問意見。
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
            目前為 AI 測試版，會依環境設定使用 Gemini 或 Mock provider。
          </p>
        </div>
        {isLoading && (
          <div className="mt-4 rounded-md border border-steel/20 bg-frost p-4 text-sm leading-6 text-steel">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-steel/30 border-t-steel" />
              <div>
                <p className="font-semibold text-ink">
                  正在冷靜分析你的副業點子...
                </p>
                <p className="mt-1">
                  通常需要 10～20 秒，請不要關閉頁面。
                </p>
                {isTakingLonger && (
                  <p className="mt-3 rounded-md bg-white/70 p-3 font-medium text-signal">
                    AI 正在整理較完整的評估報告，請再稍等一下。
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
              你的輸入內容已保留。你可以稍後重試，或先改用 Mock 報告預覽。
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previewMockReport}
                className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                改用 Mock 報告預覽
              </button>
              {showDevTools && (
                <>
                  <button
                    type="button"
                    onClick={copyPromptForManualTest}
                    className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
                  >
                    複製提示詞，改用手動測試
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
              Mock 報告只用於展示報告格式，不代表你的點子已被 AI 實際分析。
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

function getProviderErrorMessage(code?: string) {
  if (code === "GEMINI_RATE_LIMITED") {
    return rateLimitMessage;
  }

  if (code === "GEMINI_TEMPORARY_ERROR") {
    return temporaryErrorMessage;
  }

  return genericErrorMessage;
}

function validateInput(input: EvaluationInput) {
  if (!input.idea.trim()) {
    return "請輸入副業點子";
  }

  if (!input.availableTime.trim()) {
    return "請輸入可投入時間";
  }

  return "";
}

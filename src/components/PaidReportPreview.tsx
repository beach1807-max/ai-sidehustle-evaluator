import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DeepReport } from "../data/deepReport";
import { exampleDeepReports } from "../data/exampleDeepReports";
import { FeedbackUnlockForm } from "./FeedbackUnlockForm";
import { UsageDebugPanel } from "./UsageDebugPanel";
import {
  canUseDeepReportFeedbackUnlock,
  getDeepReportFeedbackUnlock,
  markDeepReportFeedbackUnlockUsed,
  type FeedbackSubmitResult,
} from "../lib/feedback";
import { getEvaluateErrorMessage, postEvaluate } from "../lib/evaluateApi";
import { saveReport } from "../lib/reportStorage";
import { normalizeDeepReport, validateDeepReport } from "../lib/validateDeepReport";
import {
  canUseDeepReportDailyLimit,
  getDeepReportDailyLimit,
  recordDeepReportUsed,
} from "../lib/usageLimits";

const paidReportItems = [
  "7 天 MVP 開工計畫",
  "AI Agent 任務拆解",
  "市場與受眾假設",
  "風險與不要做清單",
  "驗證腳本與第一批使用者策略",
  "一人可執行的技術與產品範圍",
];

type PaidReportPreviewProps = {
  displayedIdea: string;
  score?: number | string;
  decision?: string;
  exampleReportId?: string;
};

const deepReportStorageKey = "deepReportPreview";
const deepReportDailyLimitMessage =
  "今天的 Deep Report / AI Agent 開工包使用次數已達上限。每日可產生 3 次，請明天再試。";
const feedbackUnlockUsedMessage =
  "這次回饋解鎖資格已使用完畢。每次回饋只能免費解鎖 1 份 Deep Report / AI Agent 開工包。";

export function PaidReportPreview({
  displayedIdea,
  score,
  decision,
  exampleReportId,
}: PaidReportPreviewProps) {
  const navigate = useNavigate();
  const exampleDeepReport = exampleReportId
    ? exampleDeepReports[exampleReportId]
    : undefined;
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [canGenerateDeepReport, setCanGenerateDeepReport] = useState(
    () => !exampleDeepReport && canUseDeepReportFeedbackUnlock()
  );
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isGenerating) {
      setIsTakingLonger(false);
      setLoadingMessage("");
      return;
    }

    setLoadingMessage("正在產生完整開工包，請稍候...");
    const firstTimerId = window.setTimeout(() => {
      setLoadingMessage("AI 正在整理任務、風險與 MVP 步驟，可能還需要一點時間。");
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
  }, [isGenerating]);

  function openStaticExampleStarterKit() {
    if (!exampleDeepReport) {
      return;
    }

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

  function requestDeepReportUnlock() {
    setError("");

    const unlock = getDeepReportFeedbackUnlock();
    if (unlock?.used) {
      setError(feedbackUnlockUsedMessage);
      return;
    }

    if (unlock?.unlocked) {
      setCanGenerateDeepReport(true);
      setFeedbackStatus("已取得一次 Deep Report / AI Agent 開工包解鎖資格。");
      return;
    }

    setShowFeedbackForm(true);
  }

  function handleFeedbackUnlocked(result: FeedbackSubmitResult) {
    setCanGenerateDeepReport(true);
    setShowFeedbackForm(false);
    setFeedbackStatus(result.message);
  }

  async function generateDeepReport() {
    if (isGenerating) {
      return;
    }

    setError("");

    const unlock = getDeepReportFeedbackUnlock();
    if (unlock?.used) {
      setCanGenerateDeepReport(false);
      setError(feedbackUnlockUsedMessage);
      return;
    }

    if (!canUseDeepReportFeedbackUnlock()) {
      setCanGenerateDeepReport(false);
      setShowFeedbackForm(true);
      setError("請先完成回饋，才能免費解鎖一次完整 Deep Report / AI Agent 開工包。");
      return;
    }

    if (!canUseDeepReportDailyLimit()) {
      setError(
        deepReportDailyLimitMessage.replace(
          "3 次",
          `${getDeepReportDailyLimit()} 次`
        )
      );
      return;
    }

    setIsGenerating(true);

    try {
      const input = readEvaluationInput(displayedIdea);
      const result = await postEvaluate({
        ...input,
        mode: "deep",
      });

      if (!result.ok) {
        setError(getEvaluateErrorMessage(result.code, result.error));
        return;
      }

      const validation = validateDeepReport(result.report);
      if (!validation.isValid) {
        setError(`Deep Report 資料格式不完整：${validation.errors.join("；")}`);
        return;
      }

      const normalizedReport = normalizeDeepReport(result.report as DeepReport);
      localStorage.setItem(deepReportStorageKey, JSON.stringify(normalizedReport));
      const saved = saveReport({
        type: "deep",
        title: displayedIdea || "未命名報告",
        idea: displayedIdea,
        summary: normalizedReport.feasibility.recommendation,
        verdict: normalizedReport.feasibility.soloDeveloperFit,
        report: normalizedReport,
        input,
      });
      if (saved) {
        localStorage.setItem("reportHistoryLastSaveStatus", "saved");
      }
      markDeepReportFeedbackUnlockUsed();
      recordDeepReportUsed();
      navigate("/report/deep-preview");
    } catch {
      setError("Deep Report 產生失敗，請稍後再試。");
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
            產生一份可以直接開工的完整計畫
          </h2>
          <p className="mt-3 leading-8 text-slate-600">
            根據你的點子與限制，整理 MVP 範圍、驗證任務、風險與 AI Agent 可執行的工作清單。
          </p>
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-signal">
            <p className="font-semibold text-ink">測試版提醒</p>
            <p className="mt-2">
              產生成功才會扣除 Deep Report 使用次數與回饋解鎖資格；失敗或格式錯誤不會扣除。
            </p>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
          <p className="font-semibold text-ink">完整開工包包含</p>
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
        <p className="text-lg font-bold text-ink">測試版完整開工包</p>
        {exampleDeepReport ? (
          <button
            type="button"
            onClick={openStaticExampleStarterKit}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            查看完整開工包
          </button>
        ) : canGenerateDeepReport ? (
          <button
            type="button"
            onClick={generateDeepReport}
            disabled={isGenerating}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:bg-slate-500"
          >
            {isGenerating ? "產生中..." : "產生完整開工包"}
          </button>
        ) : (
          <button
            type="button"
            onClick={requestDeepReportUnlock}
            className="focus-ring inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            完成回饋解鎖
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="mt-4 rounded-md border border-steel/20 bg-frost p-4 text-sm leading-6 text-steel">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-steel/30 border-t-steel" />
            <div>
              <p className="font-semibold text-ink">
                {loadingMessage || "正在產生完整開工包，請稍候..."}
              </p>
              <p className="mt-1">
                請不要重複點擊；如果 AI 請求失敗，系統不會扣除使用次數。
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

      {exampleDeepReport && (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          這是固定範例報告，不會呼叫 AI，也不會扣除使用次數。
        </p>
      )}

      {feedbackStatus && (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium leading-6 text-emerald-700">
          {feedbackStatus}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium leading-6 text-danger">
          {error}
        </p>
      )}
      {showFeedbackForm && !exampleDeepReport && (
        <FeedbackUnlockForm
          idea={displayedIdea}
          score={score}
          decision={decision}
          sourcePage={window.location.pathname}
          onUnlocked={handleFeedbackUnlocked}
        />
      )}
      <div className="mt-5">
        <UsageDebugPanel />
      </div>
    </section>
  );
}

function readEvaluationInput(displayedIdea: string) {
  try {
    const rawInput = localStorage.getItem("coldScoreInput");
    const savedInput = rawInput ? JSON.parse(rawInput) : null;

    return {
      idea: savedInput?.idea || displayedIdea,
      availableTime: savedInput?.time || "未填寫",
      avoidThings: savedInput?.avoid || "",
    };
  } catch {
    return {
      idea: displayedIdea,
      availableTime: "未填寫",
      avoidThings: "",
    };
  }
}

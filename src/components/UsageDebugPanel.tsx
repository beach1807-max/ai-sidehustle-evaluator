import { getDeepReportFeedbackUnlock } from "../lib/feedback";
import {
  getDeepReportDailyLimit,
  getDeepReportUsage,
  getFreeEvaluationLimit,
  getFreeEvaluationUsage,
} from "../lib/usageLimits";

export function UsageDebugPanel() {
  const showDevTools = import.meta.env.VITE_SHOW_DEV_TOOLS === "true";
  if (!showDevTools) {
    return null;
  }

  const freeUsage = getFreeEvaluationUsage();
  const deepUsage = getDeepReportUsage();
  const unlock = getDeepReportFeedbackUnlock();
  const hasLatestFeedback = Boolean(
    localStorage.getItem("latestFeedbackUnlockSubmission")
  );
  const hasAnonymousUserId = Boolean(
    localStorage.getItem("anonymousFeedbackUserId")
  );

  return (
    <div className="rounded-md border border-slate-300 bg-white p-4 text-sm leading-7 text-slate-700">
      <p className="font-semibold text-ink">開發測試狀態</p>
      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
        <li>
          一般報告今日使用次數：{freeUsage.count} / {getFreeEvaluationLimit()}
        </li>
        <li>
          深度報告今日使用次數：{deepUsage.count} / {getDeepReportDailyLimit()}
        </li>
        <li>deepReportFeedbackUnlock：{unlock ? "存在" : "不存在"}</li>
        <li>deepReportFeedbackUnlock.used：{unlock ? String(unlock.used) : "無"}</li>
        <li>latestFeedbackUnlockSubmission：{hasLatestFeedback ? "存在" : "不存在"}</li>
        <li>anonymousFeedbackUserId：{hasAnonymousUserId ? "存在" : "不存在"}</li>
      </ul>
    </div>
  );
}

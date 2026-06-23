const freeEvaluationUsageKey = "freeEvaluationUsage";
const deepReportUsageKey = "deepReportUsage";
export function getTodayDateKey() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}
export function getFreeEvaluationLimit() {
    return getPositiveIntegerFromEnv(import.meta.env.VITE_FREE_EVALUATION_DAILY_LIMIT, 3);
}
export function getDeepReportDailyLimit() {
    return getPositiveIntegerFromEnv(import.meta.env.VITE_DEEP_REPORT_DAILY_LIMIT, 3);
}
export function getFreeEvaluationUsage() {
    return getUsageRecord(freeEvaluationUsageKey);
}
export function canUseFreeEvaluation() {
    return getFreeEvaluationUsage().count < getFreeEvaluationLimit();
}
export function recordFreeEvaluationUsed() {
    recordUsage(freeEvaluationUsageKey);
}
export function getDeepReportUsage() {
    return getUsageRecord(deepReportUsageKey);
}
export function canUseDeepReportDailyLimit() {
    return getDeepReportUsage().count < getDeepReportDailyLimit();
}
export function recordDeepReportUsed() {
    recordUsage(deepReportUsageKey);
}
function getUsageRecord(key) {
    const today = getTodayDateKey();
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return { date: today, count: 0 };
        }
        const parsed = JSON.parse(raw);
        if (parsed.date !== today) {
            return { date: today, count: 0 };
        }
        return {
            date: today,
            count: Number.isFinite(parsed.count) ? parsed.count : 0,
        };
    }
    catch {
        return { date: today, count: 0 };
    }
}
function recordUsage(key) {
    const current = getUsageRecord(key);
    localStorage.setItem(key, JSON.stringify({
        date: current.date,
        count: current.count + 1,
    }));
}
function getPositiveIntegerFromEnv(value, fallback) {
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        return fallback;
    }
    return parsedValue;
}

export type SavedReportType = "free" | "deep";

export type SavedReport = {
  id: string;
  type: SavedReportType;
  title: string;
  idea: string;
  createdAt: string;
  summary?: string;
  score?: number | string;
  verdict?: string;
  report: unknown;
  input?: unknown;
};

const savedReportsKey = "ai-sidehustle:saved-reports";
const maxSavedReports = 20;

export function getSavedReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(savedReportsKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSavedReport);
  } catch {
    return [];
  }
}

export function saveReport(report: Omit<SavedReport, "id" | "createdAt">) {
  const savedReport: SavedReport = {
    ...report,
    id: createReportId(),
    createdAt: new Date().toISOString(),
  };

  try {
    const nextReports = [savedReport, ...getSavedReports()].slice(0, maxSavedReports);
    localStorage.setItem(savedReportsKey, JSON.stringify(nextReports));
    return true;
  } catch (error) {
    console.warn("無法保存報告紀錄", error);
    return false;
  }
}

export function deleteSavedReport(id: string) {
  const nextReports = getSavedReports().filter((report) => report.id !== id);
  localStorage.setItem(savedReportsKey, JSON.stringify(nextReports));
}

export function clearSavedReports() {
  localStorage.removeItem(savedReportsKey);
}

export function getSavedReportsStorageKey() {
  return savedReportsKey;
}

function createReportId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `report_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function isSavedReport(value: unknown): value is SavedReport {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const report = value as Record<string, unknown>;
  return (
    typeof report.id === "string" &&
    (report.type === "free" || report.type === "deep") &&
    typeof report.title === "string" &&
    typeof report.idea === "string" &&
    typeof report.createdAt === "string" &&
    "report" in report
  );
}

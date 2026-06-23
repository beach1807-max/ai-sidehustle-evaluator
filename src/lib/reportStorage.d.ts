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
export declare function getSavedReports(): SavedReport[];
export declare function saveReport(report: Omit<SavedReport, "id" | "createdAt">): boolean;
export declare function deleteSavedReport(id: string): void;
export declare function clearSavedReports(): void;
export declare function getSavedReportsStorageKey(): string;

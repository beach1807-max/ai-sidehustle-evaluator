import type { MockReport } from "../data/mockReports";
type ValidationResult = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
export declare function validateReportData(data: unknown): ValidationResult;
export declare function getScoreLabel(score: number): string;
export declare function normalizeReportData(report: MockReport): MockReport;
export {};

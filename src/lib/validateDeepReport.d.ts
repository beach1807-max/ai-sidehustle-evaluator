import type { DeepReport } from "../data/deepReport";
export type DeepReportValidationResult = {
    isValid: boolean;
    errors: string[];
};
export declare function validateDeepReport(data: unknown): DeepReportValidationResult;
export declare function normalizeDeepReport(report: DeepReport): DeepReport;

import type { MockReport } from "../../data/mockReports";
import type { DeepReport } from "../../data/deepReport";
import type { EvaluationInput } from "../promptTemplate";
export type AiProviderName = "mock" | "openai" | "anthropic" | "gemini";
export type ReportMode = "free" | "deep";
export type AiRuntimeEnv = {
    AI_PROVIDER?: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
};
export type GenerateReportResult = {
    report: MockReport;
    warnings: string[];
};
export type GenerateDeepReportResult = {
    report: DeepReport;
    warnings: string[];
};
export interface AiProvider {
    name: AiProviderName;
    generateReport(input: EvaluationInput, env?: AiRuntimeEnv): Promise<GenerateReportResult>;
    generateDeepReport?(input: EvaluationInput, env?: AiRuntimeEnv): Promise<GenerateDeepReportResult>;
}

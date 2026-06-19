import type { MockReport } from "../../data/mockReports";
import type { EvaluationInput } from "../promptTemplate";
export type AiProviderName = "mock" | "openai" | "anthropic" | "gemini";
export type AiRuntimeEnv = {
    AI_PROVIDER?: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
};
export type GenerateReportResult = {
    report: MockReport;
    warnings: string[];
};
export interface AiProvider {
    name: AiProviderName;
    generateReport(input: EvaluationInput, env?: AiRuntimeEnv): Promise<GenerateReportResult>;
}

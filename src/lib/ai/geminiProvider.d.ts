import type { MockReport } from "../../data/mockReports";
import { type EvaluationInput } from "../promptTemplate";
import type { AiProvider } from "./types";
type GeminiPocOptions = {
    apiKey?: string;
    model?: string;
};
export type GeminiPocResult = {
    rawText: string;
    report: MockReport;
    warnings: string[];
    provider: "gemini";
    model: string;
};
export declare class GeminiApiError extends Error {
    code?: string;
    retryable?: boolean;
    status?: number;
    constructor(message: string, options?: {
        code?: string;
        retryable?: boolean;
        status?: number;
    });
}
export declare const geminiProvider: AiProvider;
export declare function generateGeminiPocReport(input: EvaluationInput, options: GeminiPocOptions): Promise<GeminiPocResult>;
export {};

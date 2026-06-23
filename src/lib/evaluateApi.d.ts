import type { EvaluationInput } from "./promptTemplate";
export type EvaluateApiResponse = {
    ok: true;
    report: unknown;
    warnings: string[];
} | {
    ok: false;
    error: string;
    code?: string;
    retryable?: boolean;
    details: string[];
};
export type EvaluateApiRequest = EvaluationInput & {
    mode?: "free" | "deep";
};
export declare function postEvaluate(input: EvaluateApiRequest): Promise<EvaluateApiResponse>;
export declare function getEvaluateErrorMessage(code?: string, fallback?: string): string;

import type { EvaluationInput } from "../promptTemplate";
import type { AiRuntimeEnv, GenerateDeepReportResult, GenerateReportResult } from "./types";
export declare function evaluateWithProvider(input: EvaluationInput, env?: AiRuntimeEnv): Promise<GenerateReportResult>;
export declare function evaluateDeepReportWithProvider(input: EvaluationInput, env?: AiRuntimeEnv): Promise<GenerateDeepReportResult>;

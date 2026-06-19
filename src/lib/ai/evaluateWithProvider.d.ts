import type { EvaluationInput } from "../promptTemplate";
import type { AiRuntimeEnv, GenerateReportResult } from "./types";
export declare function evaluateWithProvider(input: EvaluationInput, env?: AiRuntimeEnv): Promise<GenerateReportResult>;

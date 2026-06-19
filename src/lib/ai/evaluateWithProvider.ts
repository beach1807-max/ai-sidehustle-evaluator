import type { EvaluationInput } from "../promptTemplate";
import { getAiProvider } from "./getAiProvider";
import type { AiRuntimeEnv, GenerateReportResult } from "./types";

export async function evaluateWithProvider(
  input: EvaluationInput,
  env?: AiRuntimeEnv
): Promise<GenerateReportResult> {
  const provider = getAiProvider(env);
  return provider.generateReport(input, env);
}

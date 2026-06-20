import type { EvaluationInput } from "../promptTemplate";
import { getAiProvider } from "./getAiProvider";
import type {
  AiRuntimeEnv,
  GenerateDeepReportResult,
  GenerateReportResult,
} from "./types";

export async function evaluateWithProvider(
  input: EvaluationInput,
  env?: AiRuntimeEnv
): Promise<GenerateReportResult> {
  const provider = getAiProvider(env);
  return provider.generateReport(input, env);
}

export async function evaluateDeepReportWithProvider(
  input: EvaluationInput,
  env?: AiRuntimeEnv
): Promise<GenerateDeepReportResult> {
  const provider = getAiProvider(env);
  if (!provider.generateDeepReport) {
    throw new Error("Deep Report provider 尚未實作");
  }

  return provider.generateDeepReport(input, env);
}

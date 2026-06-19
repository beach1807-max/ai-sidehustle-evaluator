import type { EvaluationInput } from "../promptTemplate";
import { evaluateWithProvider } from "./evaluateWithProvider";
import type { AiRuntimeEnv } from "./types";

export type EvaluateApiResult =
  | {
      ok: true;
      report: unknown;
      warnings: string[];
    }
  | {
      ok: false;
      error: string;
      code: string;
      retryable: boolean;
      details: string[];
    };

export async function evaluateFromApiRequest(
  payload: unknown,
  env?: AiRuntimeEnv
): Promise<{ status: number; body: EvaluateApiResult }> {
  const input = toEvaluationInput(payload);

  if (!input) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "缺少必要輸入欄位。",
        code: "INVALID_INPUT",
        retryable: false,
        details: [],
      },
    };
  }

  try {
    const result = await evaluateWithProvider(input, env);

    return {
      status: 200,
      body: {
        ok: true,
        report: result.report,
        warnings: result.warnings,
      },
    };
  } catch (error) {
    const knownError = error as {
      code?: string;
      retryable?: boolean;
      message?: string;
    };

    return {
      status: 200,
      body: {
        ok: false,
        error: getPublicErrorMessage(knownError),
        code: knownError.code || "AI_PROVIDER_ERROR",
        retryable: knownError.retryable ?? true,
        details: [],
      },
    };
  }
}

export function methodNotAllowedResponse() {
  return {
    status: 405,
    body: {
      ok: false as const,
      error: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
      retryable: false,
      details: [],
    },
  };
}

function toEvaluationInput(value: unknown): EvaluationInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const input = value as Record<string, unknown>;
  if (!isNonEmptyString(input.idea) || !isNonEmptyString(input.availableTime)) {
    return null;
  }

  return {
    idea: input.idea.trim(),
    availableTime: input.availableTime.trim(),
    avoidThings: normalizeAvoidThings(input.avoidThings),
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeAvoidThings(value: unknown): string {
  if (typeof value !== "string") {
    return "無特別限制";
  }

  const trimmedValue = value.trim();
  return trimmedValue || "無特別限制";
}

function getPublicErrorMessage(error: { code?: string; message?: string }) {
  if (error.code === "GEMINI_RATE_LIMITED") {
    return "AI 目前請求過於頻繁，請稍後再試。";
  }

  if (error.code === "GEMINI_TEMPORARY_ERROR") {
    return "AI 暫時無法回應，請稍後重試。";
  }

  return "AI 報告產生失敗，請稍後重試。";
}

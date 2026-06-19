import type { MockReport } from "../../data/mockReports";
import { buildEvaluationPrompt, type EvaluationInput } from "../promptTemplate";
import { normalizeReportData, validateReportData } from "../validateReport";
import { extractJsonFromAiText } from "./extractJsonFromAiText";
import { geminiReportResponseSchema } from "./reportSchema";
import type { AiProvider, AiRuntimeEnv } from "./types";

const missingApiKeyMessage =
  "尚未設定 GEMINI_API_KEY。請在 .env 中填入 Gemini API Key 後重新啟動開發伺服器。";
const rateLimitedMessage = "Gemini API 目前請求過於頻繁，請稍後再試。";
const temporaryErrorMessage = "Gemini 暫時無法回應，請稍後再試。";
const maxRetries = 2;
const fallbackBackoffMs = [2000, 5000];

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

export class GeminiApiError extends Error {
  code?: string;
  retryable?: boolean;
  status?: number;

  constructor(
    message: string,
    options: { code?: string; retryable?: boolean; status?: number } = {}
  ) {
    super(message);
    this.name = "GeminiApiError";
    this.code = options.code;
    this.retryable = options.retryable;
    this.status = options.status;
  }
}

export const geminiProvider: AiProvider = {
  name: "gemini",
  async generateReport(input, env) {
    const result = await generateGeminiPocReport(input, {
      apiKey: readRuntimeEnv("GEMINI_API_KEY", env),
      model: readRuntimeEnv("GEMINI_MODEL", env),
    });

    return {
      report: result.report,
      warnings: result.warnings,
    };
  },
};

export async function generateGeminiPocReport(
  input: EvaluationInput,
  options: GeminiPocOptions
): Promise<GeminiPocResult> {
  const apiKey = options.apiKey?.trim();
  const model = options.model?.trim() || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error(missingApiKeyMessage);
  }

  const prompt = buildEvaluationPrompt(input);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiReportResponseSchema,
    },
  };

  const response = await fetchGeminiWithRetry(endpoint, requestBody);

  const payload = await response.json();
  const rawText = extractGeminiText(payload);
  const parsed = extractJsonFromAiText(rawText);
  const validation = validateReportData(parsed);

  if (!validation.isValid) {
    throw new Error(validation.errors.join("\n"));
  }

  const report = normalizeReportData(parsed as MockReport);

  return {
    rawText,
    report,
    warnings: validation.warnings,
    provider: "gemini",
    model,
  };
}

async function fetchGeminiWithRetry(
  endpoint: string,
  requestBody: unknown
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return response;
    }

    const shouldRetry = isRetryableStatus(response.status) && attempt < maxRetries;
    if (shouldRetry) {
      await sleep(resolveBackoffMs(response, attempt));
      continue;
    }

    if (response.status === 429) {
      throw new GeminiApiError(rateLimitedMessage, {
        code: "GEMINI_RATE_LIMITED",
        retryable: true,
        status: response.status,
      });
    }

    if (response.status >= 500 && response.status <= 599) {
      throw new GeminiApiError(temporaryErrorMessage, {
        code: "GEMINI_TEMPORARY_ERROR",
        retryable: true,
        status: response.status,
      });
    }

    throw new GeminiApiError(`Gemini API 呼叫失敗，HTTP ${response.status}。`, {
      status: response.status,
    });
  }

  throw new GeminiApiError(temporaryErrorMessage, {
    code: "GEMINI_TEMPORARY_ERROR",
    retryable: true,
  });
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function resolveBackoffMs(response: Response, attempt: number): number {
  return parseRetryAfterMs(response.headers.get("Retry-After")) ?? fallbackBackoffMs[attempt];
}

function parseRetryAfterMs(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  const retryDate = Date.parse(value);
  if (Number.isFinite(retryDate)) {
    return Math.max(0, retryDate - Date.now());
  }

  return undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function extractGeminiText(payload: unknown): string {
  const candidates = (payload as { candidates?: unknown[] }).candidates;
  const firstCandidate = candidates?.[0] as
    | { content?: { parts?: { text?: string }[] } }
    | undefined;
  const text = firstCandidate?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini 回傳內容沒有可讀取的文字。");
  }

  return text;
}

function readRuntimeEnv(
  key: keyof AiRuntimeEnv,
  env?: AiRuntimeEnv
): string | undefined {
  return env?.[key] || readServerEnv(key);
}

function readServerEnv(key: string): string | undefined {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env?.[key];
}

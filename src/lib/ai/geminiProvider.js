import { buildEvaluationPrompt } from "../promptTemplate";
import { normalizeReportData, validateReportData } from "../validateReport";
import { extractJsonFromAiText } from "./extractJsonFromAiText";
import { geminiReportResponseSchema } from "./reportSchema";
const missingApiKeyMessage = "尚未設定 GEMINI_API_KEY。請在 .env 中填入 Gemini API Key 後重新啟動開發伺服器。";
const rateLimitedMessage = "Gemini API 目前請求過於頻繁，請稍後再試。";
const temporaryErrorMessage = "Gemini 暫時無法回應，請稍後再試。";
const maxRetries = 2;
const fallbackBackoffMs = [2000, 5000];
export class GeminiApiError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = "GeminiApiError";
        this.code = options.code;
        this.retryable = options.retryable;
        this.status = options.status;
    }
}
export const geminiProvider = {
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
export async function generateGeminiPocReport(input, options) {
    const apiKey = options.apiKey?.trim();
    const model = options.model?.trim() || "gemini-2.5-flash";
    if (!apiKey) {
        throw new Error(missingApiKeyMessage);
    }
    const prompt = buildEvaluationPrompt(input);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
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
    const report = normalizeReportData(parsed);
    return {
        rawText,
        report,
        warnings: validation.warnings,
        provider: "gemini",
        model,
    };
}
async function fetchGeminiWithRetry(endpoint, requestBody) {
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
function isRetryableStatus(status) {
    return status === 429 || (status >= 500 && status <= 599);
}
function resolveBackoffMs(response, attempt) {
    return parseRetryAfterMs(response.headers.get("Retry-After")) ?? fallbackBackoffMs[attempt];
}
function parseRetryAfterMs(value) {
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
function sleep(ms) {
    return new Promise((resolve) => {
        globalThis.setTimeout(resolve, ms);
    });
}
function extractGeminiText(payload) {
    const candidates = payload.candidates;
    const firstCandidate = candidates?.[0];
    const text = firstCandidate?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();
    if (!text) {
        throw new Error("Gemini 回傳內容沒有可讀取的文字。");
    }
    return text;
}
function readRuntimeEnv(key, env) {
    return env?.[key] || readServerEnv(key);
}
function readServerEnv(key) {
    return globalThis.process?.env?.[key];
}

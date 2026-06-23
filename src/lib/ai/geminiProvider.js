import { buildDeepReportPrompt } from "../deepReportPrompt";
import { buildEvaluationPrompt } from "../promptTemplate";
import { normalizeDeepReport, validateDeepReport } from "../validateDeepReport";
import { normalizeReportData, validateReportData } from "../validateReport";
import { extractJsonFromAiText } from "./extractJsonFromAiText";
import { geminiDeepReportResponseSchema, geminiReportResponseSchema, } from "./reportSchema";
const missingApiKeyMessage = "尚未設定 GEMINI_API_KEY，請先在環境變數中加入 Gemini API Key。";
const rateLimitedMessage = "目前 AI 使用量較高，請稍後再試。";
const temporaryErrorMessage = "AI 服務暫時不穩，請稍後再試。";
const timeoutMessage = "AI 產生時間過長，這次請求已停止。請稍後再試一次，或先縮短輸入內容。";
const networkErrorMessage = "網路連線不穩，AI 請求沒有完成。請確認連線後再試一次。";
const schemaErrorMessage = "AI 回傳格式不完整，系統沒有扣除使用次數。請再試一次。";
const requestTimeoutMs = 45000;
const maxRetries = 1;
const minBackoffMs = 800;
const maxBackoffMs = 1500;
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
    async generateDeepReport(input, env) {
        const result = await generateGeminiDeepReport(input, {
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
    const endpoint = buildGeminiEndpoint(model, apiKey);
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
    const response = await fetchGeminiWithRetry(endpoint, requestBody, "free");
    const payload = await readGeminiJsonResponse(response);
    const rawText = extractGeminiTextSafely(payload);
    const parsed = extractGeminiJsonSafely(rawText);
    const validation = validateReportData(parsed);
    if (!validation.isValid) {
        throw new GeminiApiError(schemaErrorMessage, {
            code: "GEMINI_SCHEMA_ERROR",
            retryable: false,
        });
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
export async function generateGeminiDeepReport(input, options) {
    const apiKey = options.apiKey?.trim();
    const model = options.model?.trim() || "gemini-2.5-flash";
    if (!apiKey) {
        throw new Error(missingApiKeyMessage);
    }
    const prompt = buildDeepReportPrompt(input);
    const endpoint = buildGeminiEndpoint(model, apiKey);
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: geminiDeepReportResponseSchema,
        },
    };
    const response = await fetchGeminiWithRetry(endpoint, requestBody, "deep");
    const payload = await readGeminiJsonResponse(response);
    const rawText = extractGeminiTextSafely(payload);
    const parsed = extractGeminiJsonSafely(rawText);
    const validation = validateDeepReport(parsed);
    if (!validation.isValid) {
        throw new GeminiApiError(schemaErrorMessage, {
            code: "GEMINI_SCHEMA_ERROR",
            retryable: false,
        });
    }
    const report = normalizeDeepReport(parsed);
    return {
        rawText,
        report,
        warnings: [],
        provider: "gemini",
        model,
    };
}
function buildGeminiEndpoint(model, apiKey) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
}
async function fetchGeminiWithRetry(endpoint, requestBody, mode) {
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
            const response = await fetchWithTimeout(endpoint, requestBody);
            if (response.ok) {
                return response;
            }
            const providerMessage = await readProviderError(response);
            logGeminiFailure({
                mode,
                status: response.status,
                providerMessage,
                attempt,
                retryable: isRetryableStatus(response.status),
            });
            const shouldRetry = isRetryableStatus(response.status) && attempt < maxRetries;
            if (shouldRetry) {
                await sleep(resolveBackoffMs(response));
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
            throw new GeminiApiError(`Gemini API 請求失敗：HTTP ${response.status}`, {
                retryable: false,
                status: response.status,
            });
        }
        catch (error) {
            if (error instanceof GeminiApiError) {
                throw error;
            }
            const isTimeout = error instanceof DOMException && error.name === "AbortError";
            logGeminiFailure({
                mode,
                status: isTimeout ? "timeout" : "network_error",
                providerMessage: error instanceof Error ? error.message : "unknown",
                attempt,
                retryable: true,
            });
            if (attempt < maxRetries) {
                await sleep(resolveBackoffMs());
                continue;
            }
            throw new GeminiApiError(isTimeout ? timeoutMessage : networkErrorMessage, {
                code: isTimeout ? "GEMINI_TIMEOUT" : "GEMINI_NETWORK_ERROR",
                retryable: true,
            });
        }
    }
    throw new GeminiApiError(temporaryErrorMessage, {
        code: "GEMINI_TEMPORARY_ERROR",
        retryable: true,
    });
}
function isRetryableStatus(status) {
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}
function resolveBackoffMs(response) {
    return (parseRetryAfterMs(response?.headers.get("Retry-After") ?? null) ??
        minBackoffMs + Math.floor(Math.random() * (maxBackoffMs - minBackoffMs + 1)));
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
async function fetchWithTimeout(endpoint, requestBody) {
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => {
        controller.abort();
    }, requestTimeoutMs);
    try {
        return await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
        });
    }
    finally {
        globalThis.clearTimeout(timeoutId);
    }
}
async function readGeminiJsonResponse(response) {
    try {
        return await response.json();
    }
    catch {
        throw new GeminiApiError(schemaErrorMessage, {
            code: "GEMINI_SCHEMA_ERROR",
            retryable: false,
            status: response.status,
        });
    }
}
function extractGeminiTextSafely(payload) {
    try {
        return extractGeminiText(payload);
    }
    catch {
        throw new GeminiApiError(schemaErrorMessage, {
            code: "GEMINI_SCHEMA_ERROR",
            retryable: false,
        });
    }
}
function extractGeminiJsonSafely(rawText) {
    try {
        return extractJsonFromAiText(rawText);
    }
    catch {
        throw new GeminiApiError(schemaErrorMessage, {
            code: "GEMINI_SCHEMA_ERROR",
            retryable: false,
        });
    }
}
async function readProviderError(response) {
    try {
        const text = await response.text();
        return text.slice(0, 500);
    }
    catch {
        return "";
    }
}
function logGeminiFailure(details) {
    console.warn("Gemini API request failed", {
        mode: details.mode,
        status: details.status,
        providerMessage: details.providerMessage,
        retryCount: details.attempt,
        retryable: details.retryable,
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
        throw new Error("Gemini 回傳內容沒有文字。");
    }
    return text;
}
function readRuntimeEnv(key, env) {
    return env?.[key] || readServerEnv(key);
}
function readServerEnv(key) {
    return globalThis.process?.env?.[key];
}

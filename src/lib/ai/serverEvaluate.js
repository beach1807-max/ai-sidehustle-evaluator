import { evaluateDeepReportWithProvider, evaluateWithProvider, } from "./evaluateWithProvider";
export async function evaluateFromApiRequest(payload, env) {
    const input = toEvaluationInput(payload);
    const mode = getReportMode(payload);
    if (!input) {
        return {
            status: 400,
            body: {
                ok: false,
                error: "請填寫完整的評估資料。",
                code: "INVALID_INPUT",
                retryable: false,
                details: [],
            },
        };
    }
    try {
        const result = mode === "deep"
            ? await evaluateDeepReportWithProvider(input, env)
            : await evaluateWithProvider(input, env);
        return {
            status: 200,
            body: {
                ok: true,
                report: result.report,
                warnings: result.warnings,
            },
        };
    }
    catch (error) {
        const knownError = error;
        console.warn("AI evaluate failed", {
            mode,
            code: knownError.code || "AI_PROVIDER_ERROR",
            retryable: knownError.retryable ?? true,
            status: knownError.status,
            message: knownError.message,
        });
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
function getReportMode(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return "free";
    }
    const mode = payload.mode;
    return mode === "deep" ? "deep" : "free";
}
export function methodNotAllowedResponse() {
    return {
        status: 405,
        body: {
            ok: false,
            error: "Method not allowed",
            code: "METHOD_NOT_ALLOWED",
            retryable: false,
            details: [],
        },
    };
}
function toEvaluationInput(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }
    const input = value;
    if (!isNonEmptyString(input.idea) || !isNonEmptyString(input.availableTime)) {
        return null;
    }
    return {
        idea: input.idea.trim(),
        availableTime: input.availableTime.trim(),
        avoidThings: normalizeAvoidThings(input.avoidThings),
    };
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function normalizeAvoidThings(value) {
    if (typeof value !== "string") {
        return "沒有特別限制";
    }
    const trimmedValue = value.trim();
    return trimmedValue || "沒有特別限制";
}
function getPublicErrorMessage(error) {
    if (error.code === "GEMINI_RATE_LIMITED") {
        return "目前 AI 使用量較高，請稍後再試。";
    }
    if (error.code === "GEMINI_TIMEOUT") {
        return "AI 產生時間過長，這次請求已停止。請稍後再試一次，或先縮短輸入內容。";
    }
    if (error.code === "GEMINI_SCHEMA_ERROR") {
        return "AI 回傳格式不完整，系統沒有扣除使用次數。請再試一次。";
    }
    if (error.code === "GEMINI_NETWORK_ERROR") {
        return "網路連線不穩，AI 請求沒有完成。請確認連線後再試一次。";
    }
    if (error.code === "GEMINI_TEMPORARY_ERROR") {
        return "AI 服務暫時不穩，請稍後再試。";
    }
    return "AI 產生失敗，請稍後再試。";
}

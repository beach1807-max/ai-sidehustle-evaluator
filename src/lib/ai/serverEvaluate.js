import { evaluateDeepReportWithProvider, evaluateWithProvider, } from "./evaluateWithProvider";
export async function evaluateFromApiRequest(payload, env) {
    const input = toEvaluationInput(payload);
    const mode = getReportMode(payload);
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
        return "無特別限制";
    }
    const trimmedValue = value.trim();
    return trimmedValue || "無特別限制";
}
function getPublicErrorMessage(error) {
    if (error.code === "GEMINI_RATE_LIMITED") {
        return "AI 目前請求過於頻繁，請稍後再試。";
    }
    if (error.code === "GEMINI_TEMPORARY_ERROR") {
        return "AI 暫時無法回應，請稍後重試。";
    }
    return "AI 報告產生失敗，請稍後重試。";
}

import { evaluateWithProvider } from "./evaluateWithProvider";
export async function evaluateFromApiRequest(payload, env) {
    if (!isEvaluationInput(payload)) {
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
        const result = await evaluateWithProvider(payload, env);
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
function isEvaluationInput(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }
    const input = value;
    return (isNonEmptyString(input.idea) &&
        isNonEmptyString(input.availableTime) &&
        isNonEmptyString(input.avoidThings));
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
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

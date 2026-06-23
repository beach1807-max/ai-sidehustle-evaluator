const evaluateApiTimeoutMs = 55000;
export async function postEvaluate(input) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
        controller.abort();
    }, evaluateApiTimeoutMs);
    try {
        const response = await fetch("/api/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            signal: controller.signal,
        });
        const result = (await response.json());
        if (!response.ok) {
            return {
                ok: false,
                error: result.ok === false ? result.error : "AI 請求失敗，請稍後再試。",
                code: result.ok === false ? result.code : "HTTP_ERROR",
                retryable: result.ok === false ? result.retryable : true,
                details: result.ok === false ? result.details : [],
            };
        }
        return result;
    }
    catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            return {
                ok: false,
                error: "AI 產生時間過長，這次請求已停止。請稍後再試一次，或先縮短輸入內容。",
                code: "AI_TIMEOUT",
                retryable: true,
                details: [],
            };
        }
        return {
            ok: false,
            error: "網路連線不穩，AI 請求沒有完成。請確認連線後再試一次。",
            code: "AI_NETWORK_ERROR",
            retryable: true,
            details: [],
        };
    }
    finally {
        window.clearTimeout(timeoutId);
    }
}
export function getEvaluateErrorMessage(code, fallback) {
    if (code === "GEMINI_RATE_LIMITED") {
        return "目前 AI 使用量較高，請稍後再試。";
    }
    if (code === "AI_TIMEOUT" || code === "GEMINI_TIMEOUT") {
        return "AI 產生時間過長，這次請求已停止。請稍後再試一次，或先縮短輸入內容。";
    }
    if (code === "GEMINI_SCHEMA_ERROR") {
        return "AI 回傳格式不完整，系統沒有扣除使用次數。請再試一次。";
    }
    if (code === "AI_NETWORK_ERROR" || code === "GEMINI_NETWORK_ERROR") {
        return "網路連線不穩，AI 請求沒有完成。請確認連線後再試一次。";
    }
    if (code === "GEMINI_TEMPORARY_ERROR") {
        return "AI 服務暫時不穩，請稍後再試。";
    }
    return fallback || "AI 產生失敗，請稍後再試。";
}

export function extractJsonFromAiText(text) {
    const trimmed = text.trim();
    try {
        return JSON.parse(trimmed);
    }
    catch {
        const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (fencedMatch?.[1]) {
            return JSON.parse(fencedMatch[1].trim());
        }
        const firstBrace = trimmed.indexOf("{");
        const lastBrace = trimmed.lastIndexOf("}");
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
        }
        throw new Error("無法從 AI 回應中擷取 JSON。");
    }
}

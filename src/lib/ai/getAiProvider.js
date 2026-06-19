import { geminiProvider } from "./geminiProvider";
import { mockProvider } from "./mockProvider";
export function getAiProvider(env) {
    const providerName = getConfiguredProviderName(env);
    switch (providerName) {
        case "mock":
            return mockProvider;
        case "openai":
            throw new Error("OpenAI provider 尚未實作");
        case "anthropic":
            throw new Error("Anthropic provider 尚未實作");
        case "gemini":
            return geminiProvider;
        default:
            return mockProvider;
    }
}
function getConfiguredProviderName(env) {
    const viteEnv = import.meta.env;
    const providerName = env?.AI_PROVIDER ||
        readServerEnv("AI_PROVIDER") ||
        viteEnv?.VITE_AI_PROVIDER ||
        "mock";
    if (providerName === "mock" ||
        providerName === "openai" ||
        providerName === "anthropic" ||
        providerName === "gemini") {
        return providerName;
    }
    return "mock";
}
function readServerEnv(key) {
    return globalThis.process?.env?.[key];
}

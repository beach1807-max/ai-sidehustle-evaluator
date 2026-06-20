import { getAiProvider } from "./getAiProvider";
export async function evaluateWithProvider(input, env) {
    const provider = getAiProvider(env);
    return provider.generateReport(input, env);
}
export async function evaluateDeepReportWithProvider(input, env) {
    const provider = getAiProvider(env);
    if (!provider.generateDeepReport) {
        throw new Error("Deep Report provider 尚未實作");
    }
    return provider.generateDeepReport(input, env);
}

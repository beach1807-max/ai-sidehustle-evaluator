import { getAiProvider } from "./getAiProvider";
export async function evaluateWithProvider(input, env) {
    const provider = getAiProvider(env);
    return provider.generateReport(input, env);
}

import { geminiProvider } from "./geminiProvider";
import { mockProvider } from "./mockProvider";
import type { AiProvider, AiProviderName, AiRuntimeEnv } from "./types";

export function getAiProvider(env?: AiRuntimeEnv): AiProvider {
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

function getConfiguredProviderName(env?: AiRuntimeEnv): AiProviderName {
  const viteEnv = (
    import.meta as ImportMeta & {
      env?: { VITE_AI_PROVIDER?: string };
    }
  ).env;
  const providerName =
    env?.AI_PROVIDER ||
    readServerEnv("AI_PROVIDER") ||
    viteEnv?.VITE_AI_PROVIDER ||
    "mock";

  if (
    providerName === "mock" ||
    providerName === "openai" ||
    providerName === "anthropic" ||
    providerName === "gemini"
  ) {
    return providerName;
  }

  return "mock";
}

function readServerEnv(key: string): string | undefined {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env?.[key];
}

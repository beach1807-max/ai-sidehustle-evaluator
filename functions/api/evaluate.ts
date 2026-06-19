import {
  evaluateFromApiRequest,
  methodNotAllowedResponse,
} from "../../src/lib/ai/serverEvaluate";
import type { AiRuntimeEnv } from "../../src/lib/ai/types";

type PagesContext = {
  request: Request;
  env: AiRuntimeEnv;
};

export async function onRequest(context: PagesContext): Promise<Response> {
  if (context.request.method !== "POST") {
    const response = methodNotAllowedResponse();
    return jsonResponse(response.body, response.status);
  }

  let payload: unknown;
  try {
    payload = await context.request.json();
  } catch {
    payload = null;
  }

  const response = await evaluateFromApiRequest(payload, {
    AI_PROVIDER: context.env.AI_PROVIDER,
    GEMINI_API_KEY: context.env.GEMINI_API_KEY,
    GEMINI_MODEL: context.env.GEMINI_MODEL,
  });

  return jsonResponse(response.body, response.status);
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

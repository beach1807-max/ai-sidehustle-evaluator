import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { generateGeminiPocReport } from "./src/lib/ai/geminiProvider";
import {
  evaluateFromApiRequest,
  methodNotAllowedResponse,
} from "./src/lib/ai/serverEvaluate";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), geminiPocApiPlugin(env)],
  };
});

function geminiPocApiPlugin(env: Record<string, string>) {
  return {
    name: "gemini-poc-api",
    configureServer(server: any) {
      server.middlewares.use("/api/evaluate", async (req: any, res: any) => {
        if (req.method !== "POST") {
          const response = methodNotAllowedResponse();
          sendJson(res, response.status, response.body);
          return;
        }

        try {
          const body = await readRequestBody(req);
          const input = JSON.parse(body || "{}");
          const response = await evaluateFromApiRequest(input, {
            AI_PROVIDER: env.AI_PROVIDER,
            GEMINI_API_KEY: env.GEMINI_API_KEY,
            GEMINI_MODEL: env.GEMINI_MODEL,
          });

          sendJson(res, response.status, response.body);
        } catch {
          const response = await evaluateFromApiRequest(null, env);
          sendJson(res, response.status, response.body);
        }
      });

      server.middlewares.use("/api/gemini-poc", async (req: any, res: any) => {
        if (req.method !== "POST") {
          sendJson(res, 405, {
            ok: false,
            error: "Method not allowed",
            details: [],
          });
          return;
        }

        try {
          const body = await readRequestBody(req);
          const input = JSON.parse(body || "{}");
          const result = await generateGeminiPocReport(input, {
            apiKey: env.GEMINI_API_KEY,
            model: env.GEMINI_MODEL,
          });

          sendJson(res, 200, {
            ok: true,
            rawText: result.rawText,
            report: result.report,
            warnings: result.warnings,
            provider: result.provider,
            model: result.model,
          });
        } catch (error) {
          const knownError = error as {
            code?: string;
            retryable?: boolean;
            message?: string;
          };

          sendJson(res, 200, {
            ok: false,
            error:
              error instanceof Error
                ? error.message
                : "Gemini PoC 呼叫發生未知錯誤。",
            code: knownError.code,
            retryable: knownError.retryable === true,
            details: [],
          });
        }
      });
    },
  };
}

function readRequestBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: any, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

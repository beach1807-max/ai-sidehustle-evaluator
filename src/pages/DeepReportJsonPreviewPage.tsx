import { useState } from "react";
import { ButtonLink } from "../components/Buttons";
import { DeepReportView } from "../components/DeepReportView";
import type { DeepReport } from "../data/deepReport";
import { sampleDeepReport } from "../data/deepReport";
import { normalizeDeepReport, validateDeepReport } from "../lib/validateDeepReport";

const healthCheckSections = [
  "feasibility",
  "mvpFeatures",
  "sevenDayPlan",
  "agentMvpKit",
  "landingPageCopy",
  "pricing",
  "acquisition",
  "mvpReduction",
  "agentExecutionStrategy",
] as const;

type HealthCheckItem = {
  key: (typeof healthCheckSections)[number];
  label: string;
  passed: boolean;
};

export function DeepReportJsonPreviewPage() {
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState("");
  const [readableError, setReadableError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [healthCheck, setHealthCheck] = useState<HealthCheckItem[]>([]);
  const [sanitizedPreview, setSanitizedPreview] = useState("");
  const [report, setReport] = useState<DeepReport | null>(null);

  function loadSampleJson() {
    setParseError("");
    setReadableError("");
    setValidationErrors([]);
    setHealthCheck([]);
    setSanitizedPreview("");
    setReport(null);
    setJsonText(JSON.stringify(sampleDeepReport, null, 2));
  }

  function clearJson() {
    setJsonText("");
    setParseError("");
    setReadableError("");
    setValidationErrors([]);
    setHealthCheck([]);
    setSanitizedPreview("");
    setReport(null);
  }

  function validateAndPreview() {
    setParseError("");
    setReadableError("");
    setValidationErrors([]);
    setHealthCheck([]);
    setSanitizedPreview("");
    setReport(null);

    let parsed: unknown;
    const sanitizedJson = sanitizeJsonInput(jsonText);
    try {
      parsed = JSON.parse(sanitizedJson);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : String(error));
      setReadableError("貼上的內容不是合法 JSON，請檢查是否缺少逗號、括號，或 JSON 字串內包含未跳脫的雙引號。");
      setSanitizedPreview(sanitizedJson.slice(0, 1000));
      return;
    }

    const currentHealthCheck = buildDeepReportHealthCheck(parsed);
    setHealthCheck(currentHealthCheck);

    const result = validateDeepReport(parsed);
    if (!result.isValid) {
      setValidationErrors(result.errors);
      setReadableError(formatReadableValidationError(result.errors));
      setSanitizedPreview(sanitizedJson.slice(0, 1000));
      return;
    }

    const normalizedReport = normalizeDeepReport(parsed as DeepReport);
    localStorage.setItem("deepReportPreview", JSON.stringify(normalizedReport));
    setReport(normalizedReport);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-steel">開發者工具</p>
        <h1 className="text-3xl font-bold text-ink">Deep Report JSON Preview</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          請貼上 ChatGPT 依照 Deep Report Prompt 產出的 JSON。系統只會在瀏覽器中解析、驗證並渲染，不會呼叫 Gemini API。
        </p>
        <div className="mt-5">
          <ButtonLink to="/deep-report-prompt-preview" variant="secondary">
            回到 Deep Prompt Preview
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={validateAndPreview}
              className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              驗證並渲染 Deep Report
            </button>
            <button
              type="button"
              onClick={loadSampleJson}
              className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
            >
              載入範例 JSON
            </button>
            <button
              type="button"
              onClick={clearJson}
              className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
            >
              清空 textarea
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder="請貼上 ChatGPT 回傳的 Deep Report JSON"
            className="focus-ring mt-5 h-[620px] w-full resize-y rounded-md border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-5">
          <StatusPanel title="使用方式">
            <ol className="space-y-3 text-sm leading-7 text-slate-700">
              <li>1. 從 Deep Prompt Preview 複製 Prompt。</li>
              <li>2. 貼到 ChatGPT，取得純 JSON 回覆。</li>
              <li>3. 將 JSON 貼到左側文字框。</li>
              <li>4. 點擊「驗證並渲染 Deep Report」。</li>
              <li>5. 驗證通過後，下方會直接顯示完整 Deep Report。</li>
            </ol>
          </StatusPanel>

          {parseError && (
            <StatusPanel title="無法產生報告" tone="error">
              <div className="rounded-md bg-red-50 p-3 text-sm leading-7 text-danger">
                <p className="font-semibold">原因：</p>
                <p className="mt-1">{readableError}</p>
                <p className="mt-4 font-semibold">可能原因：</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>JSON 缺少逗號或括號</li>
                  <li>JSON 字串內包含未跳脫的雙引號</li>
                  <li>包含 Markdown 格式或說明文字</li>
                </ul>
              </div>
              <details className="mt-3 rounded-md bg-red-50 p-3 text-sm leading-6 text-danger">
                <summary className="cursor-pointer font-semibold">技術訊息</summary>
                <pre className="mt-2 whitespace-pre-wrap">{parseError}</pre>
              </details>
            </StatusPanel>
          )}

          {healthCheck.length > 0 && (
            <StatusPanel title="Deep Report 健康檢查">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {healthCheck.map((item) => (
                  <li key={item.key}>
                    <span className={item.passed ? "text-emerald-700" : "text-danger"}>
                      {item.passed ? "通過" : "缺少"}
                    </span>{" "}
                    {item.label}
                  </li>
                ))}
              </ul>
              {healthCheck.some((item) => !item.passed) && (
                <p className="mt-3 rounded-md bg-red-50 p-3 text-sm leading-7 text-danger">
                  無法渲染完整報告，請補齊缺少區塊。
                </p>
              )}
            </StatusPanel>
          )}

          {sanitizedPreview && (
            <StatusPanel title="清理後 JSON 預覽">
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 font-mono text-sm leading-6 text-slate-700">
                {sanitizedPreview}
              </pre>
            </StatusPanel>
          )}

          {validationErrors.length > 0 && (
            <StatusPanel title="無法產生報告" tone="error">
              <div className="rounded-md bg-red-50 p-3 text-sm leading-7 text-danger">
                <p className="font-semibold">原因：</p>
                <p className="mt-1">{readableError}</p>
              </div>
              <ul className="space-y-2 rounded-md bg-red-50 p-3 text-sm leading-6 text-danger">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </StatusPanel>
          )}

          {report && (
            <StatusPanel title="驗證通過">
              <p className="text-sm leading-7 text-emerald-700">
                JSON 已通過 Deep Report validator，完整報告已在下方渲染。
              </p>
            </StatusPanel>
          )}
        </div>
      </div>

      {report && (
        <div className="mt-10 rounded-lg border border-slate-200 bg-white shadow-sm">
          <DeepReportView report={report} />
        </div>
      )}
    </section>
  );
}

export function sanitizeJsonInput(input: string): string {
  let output = input.trim();

  output = output
    .replace(/```(?:json|JSON)?/g, "")
    .replace(/```/g, "")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\_/g, "_")
    .trim();

  const firstBraceIndex = output.indexOf("{");
  const lastBraceIndex = output.lastIndexOf("}");
  if (
    firstBraceIndex !== -1 &&
    lastBraceIndex !== -1 &&
    lastBraceIndex > firstBraceIndex
  ) {
    output = output.slice(firstBraceIndex, lastBraceIndex + 1);
  }

  return output;
}

function buildDeepReportHealthCheck(data: unknown): HealthCheckItem[] {
  const report =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};

  return healthCheckSections.map((key) => ({
    key,
    label: key,
    passed:
      key === "sevenDayPlan"
        ? Array.isArray(report[key]) && report[key].length === 7
        : Boolean(report[key]) &&
          typeof report[key] === "object" &&
          !Array.isArray(report[key]),
  }));
}

function formatReadableValidationError(errors: string[]): string {
  const firstError = errors[0] ?? "Deep Report 結構不完整。";

  if (firstError.includes("sevenDayPlan")) {
    return "sevenDayPlan 必須包含 7 天內容。";
  }

  const missingObjectMatch = /^(.+) 必須是 object$/.exec(firstError);
  if (missingObjectMatch) {
    return `缺少 ${missingObjectMatch[1]} 區塊。`;
  }

  const missingArrayMatch = /^(.+) 必須是 array$/.exec(firstError);
  if (missingArrayMatch) {
    return `${missingArrayMatch[1]} 必須是清單格式。`;
  }

  return firstError;
}

function StatusPanel({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "error";
}) {
  const toneClass = tone === "error" ? "border-red-200 bg-white" : "border-slate-200 bg-white";

  return (
    <section className={`rounded-lg border p-5 shadow-sm ${toneClass}`}>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

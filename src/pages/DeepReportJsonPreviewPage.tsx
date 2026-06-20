import { useState } from "react";
import { ButtonLink } from "../components/Buttons";
import { DeepReportView } from "../components/DeepReportView";
import type { DeepReport } from "../data/deepReport";
import { sampleDeepReport } from "../data/deepReport";
import { normalizeDeepReport, validateDeepReport } from "../lib/validateDeepReport";

export function DeepReportJsonPreviewPage() {
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [report, setReport] = useState<DeepReport | null>(null);

  function loadSampleJson() {
    setParseError("");
    setValidationErrors([]);
    setReport(null);
    setJsonText(JSON.stringify(sampleDeepReport, null, 2));
  }

  function clearJson() {
    setJsonText("");
    setParseError("");
    setValidationErrors([]);
    setReport(null);
  }

  function validateAndPreview() {
    setParseError("");
    setValidationErrors([]);
    setReport(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : String(error));
      return;
    }

    const result = validateDeepReport(parsed);
    if (!result.isValid) {
      setValidationErrors(result.errors);
      return;
    }

    setReport(normalizeDeepReport(parsed as DeepReport));
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
            <StatusPanel title="JSON 格式無法解析，請確認是否為有效 JSON。" tone="error">
              <pre className="whitespace-pre-wrap rounded-md bg-red-50 p-3 text-sm leading-6 text-danger">
                {parseError}
              </pre>
            </StatusPanel>
          )}

          {validationErrors.length > 0 && (
            <StatusPanel title="JSON 可以解析，但資料結構不符合 Deep Report 格式。" tone="error">
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "../components/Buttons";
import type { MockReport } from "../data/mockReports";
import { sampleGeneratedReport } from "../data/sampleGeneratedReport";
import { normalizeReportData, validateReportData } from "../lib/validateReport";

const storageKey = "generatedReportPreview";
const sourceKey = "generatedReportPreviewSource";

export function JsonPreviewPage() {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  function loadSampleJson() {
    setParseError("");
    setValidationErrors([]);
    setValidationWarnings([]);
    setSuccessMessage("");
    setJsonText(JSON.stringify(sampleGeneratedReport, null, 2));
  }

  function clearJson() {
    setJsonText("");
    setParseError("");
    setValidationErrors([]);
    setValidationWarnings([]);
    setSuccessMessage("");
  }

  function validateAndPreview() {
    setParseError("");
    setValidationErrors([]);
    setValidationWarnings([]);
    setSuccessMessage("");

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : String(error));
      return;
    }

    const result = validateReportData(parsed);
    if (!result.isValid) {
      setValidationErrors(result.errors);
      return;
    }

    const normalizedReport = normalizeReportData(parsed as MockReport);
    localStorage.setItem(storageKey, JSON.stringify(normalizedReport));
    localStorage.setItem(sourceKey, "manual-json");

    if (result.warnings.length > 0) {
      setValidationWarnings(result.warnings);
      setSuccessMessage("已自動依照七大維度分數修正總分。");
      window.setTimeout(() => navigate("/report/generated-preview"), 900);
      return;
    }

    navigate("/report/generated-preview");
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-steel">開發者工具</p>
        <h1 className="text-3xl font-bold text-ink">JSON Preview</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          請貼上 AI 依照 Prompt 產出的 JSON。系統會先檢查 JSON 格式與報告資料結構，通過後才會產生報告預覽。
        </p>
        <div className="mt-5">
          <ButtonLink to="/prompt-preview" variant="secondary">
            回到 Prompt Preview
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
              驗證並預覽報告
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
            placeholder="請貼上 AI 回傳的 JSON"
            className="focus-ring mt-5 h-[620px] w-full resize-y rounded-md border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-5">
          <StatusPanel title="使用方式">
            <ol className="space-y-3 text-sm leading-7 text-slate-700">
              <li>1. 從 ChatGPT 或未來 API 複製 JSON。</li>
              <li>2. 貼到左側文字框。</li>
              <li>3. 點擊「驗證並預覽報告」。</li>
              <li>4. 通過後會存入 localStorage 並前往預覽頁。</li>
              <li>5. 如需重產 Prompt，可回到 Prompt Preview。</li>
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
            <StatusPanel title="JSON 可以解析，但資料結構不符合報告格式。" tone="error">
              <ul className="space-y-2 rounded-md bg-red-50 p-3 text-sm leading-6 text-danger">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </StatusPanel>
          )}

          {validationWarnings.length > 0 && (
            <StatusPanel title="資料已通過基本驗證，但有以下提醒：" tone="warning">
              <ul className="space-y-2 rounded-md bg-amber-50 p-3 text-sm leading-6 text-signal">
                {validationWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
              {successMessage && (
                <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </p>
              )}
            </StatusPanel>
          )}
        </div>
      </div>
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
  tone?: "default" | "error" | "warning";
}) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-white"
      : tone === "warning"
        ? "border-amber-200 bg-white"
        : "border-slate-200 bg-white";

  return (
    <section className={`rounded-lg border p-5 shadow-sm ${toneClass}`}>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

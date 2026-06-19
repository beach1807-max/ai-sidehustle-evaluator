import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { MockReport } from "../data/mockReports";
import {
  buildEvaluationPrompt,
  type EvaluationInput,
} from "../lib/promptTemplate";

const storageKey = "generatedReportPreview";
const sourceKey = "generatedReportPreviewSource";
const cooldownSeconds = 10;
const pendingReviewText = "待人工複查";
const rateLimitDisplayMessage =
  "Gemini API 目前請求過於頻繁。請等待一段時間後再測，這通常是 Free Tier 或短時間多次呼叫造成的。";
const temporaryErrorDisplayMessage =
  "Gemini 暫時無法回應。你可以稍後重試，或改用手動 Prompt 測試流程。";

const testInputs: { label: string; input: EvaluationInput }[] = [
  {
    label: "測試題 1：寵物飼料分析網站",
    input: {
      idea: "我想做一個 AI 寵物飼料分析推薦網站",
      availableTime: "下班後每天 1～2 小時，週末半天",
      avoidThings:
        "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料",
    },
  },
  {
    label: "測試題 2：AI 寵物監控摘要",
    input: {
      idea: "我想做一個 AI 寵物監控摘要工具，可以分析家用監視器影片，讓飼主知道寵物什麼時候尿尿、便便、焦慮或破壞家具",
      availableTime: "下班後每天 1～2 小時",
      avoidThings:
        "不想處理複雜安裝、不想長期維護影像資料、不想碰第三方平台違規串接",
    },
  },
  {
    label: "測試題 3：AI 副業啟動包",
    input: {
      idea: "我想做一套 AI 副業啟動包，包含 Notion 主控台、Google Sheet 評分器、Prompt 工作流與 14 天行動清單",
      availableTime: "下班後每天 1～2 小時，假日可以整理內容",
      avoidThings: "不想做大量客服、不想客製化服務、不想長期人工維護資料",
    },
  },
];

type GeminiPocResponse =
  | {
      ok: true;
      rawText: string;
      report: MockReport;
      warnings: string[];
      provider: "gemini";
      model: string;
    }
  | {
      ok: false;
      error: string;
      code?: string;
      retryable?: boolean;
      details: string[];
    };

type ThreeLevelReview = "是" | "普通" | "否" | "";
type OverPromiseReview = "無" | "輕微" | "明顯" | "";
type AcceptReview = "是" | "需小修" | "否" | "";

type ManualReview = {
  productShape: ThreeLevelReview;
  dontBuild: ThreeLevelReview;
  validationPlan: ThreeLevelReview;
  calmTone: ThreeLevelReview;
  overPromise: OverPromiseReview;
  riskCoverage: ThreeLevelReview;
  acceptable: AcceptReview;
  note: string;
};

const emptyManualReview: ManualReview = {
  productShape: "",
  dontBuild: "",
  validationPlan: "",
  calmTone: "",
  overPromise: "",
  riskCoverage: "",
  acceptable: "",
  note: "",
};

export function GeminiPocPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState<EvaluationInput>(testInputs[0].input);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState("");
  const [rawText, setRawText] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [report, setReport] = useState<MockReport | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [recordCopyStatus, setRecordCopyStatus] = useState("");
  const [storageError, setStorageError] = useState("");
  const [selectedTestLabel, setSelectedTestLabel] = useState(testInputs[0].label);
  const [manualReview, setManualReview] = useState<ManualReview>(emptyManualReview);
  const [showPromptFallback, setShowPromptFallback] = useState(false);
  const [promptCopyStatus, setPromptCopyStatus] = useState("");
  const cooldownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        window.clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  async function callGemini() {
    if (isLoading || cooldownRemaining > 0) {
      return;
    }

    setIsLoading(true);
    setIsRateLimited(false);
    setError("");
    setCopyStatus("");
    setRecordCopyStatus("");
    setStorageError("");
    setShowPromptFallback(false);
    setPromptCopyStatus("");

    try {
      const response = await fetch("/api/gemini-poc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Gemini PoC API 呼叫失敗，HTTP ${response.status}。`);
      }

      const result = (await response.json()) as GeminiPocResponse;
      if (!result.ok) {
        const hitRateLimit = result.code === "GEMINI_RATE_LIMITED";
        const hitTemporaryError = result.code === "GEMINI_TEMPORARY_ERROR";
        const canFallback = result.retryable === true || hitTemporaryError;
        setIsRateLimited(hitRateLimit);
        setShowPromptFallback(canFallback);
        setError(
          hitRateLimit
            ? rateLimitDisplayMessage
            : hitTemporaryError
              ? temporaryErrorDisplayMessage
              : result.error
        );
        return;
      }

      setRawText(result.rawText);
      setWarnings(result.warnings);
      setReport(result.report);
      setManualReview(emptyManualReview);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "前端 fetch Gemini PoC API 時發生未知錯誤。"
      );
    } finally {
      setIsLoading(false);
      startCooldown();
    }
  }

  function startCooldown() {
    if (cooldownTimerRef.current) {
      window.clearInterval(cooldownTimerRef.current);
    }

    setCooldownRemaining(cooldownSeconds);
    cooldownTimerRef.current = window.setInterval(() => {
      setCooldownRemaining((current) => {
        if (current <= 1) {
          if (cooldownTimerRef.current) {
            window.clearInterval(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
          }

          setIsRateLimited(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);
  }

  function previewReport() {
    if (!report) {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(report));
      localStorage.setItem(sourceKey, "gemini-poc");
      navigate("/report/generated-preview");
    } catch {
      setStorageError("localStorage 寫入失敗，無法預覽 Gemini 報告。");
    }
  }

  async function copyNormalizedJson() {
    if (!report) {
      return;
    }

    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopyStatus("已複製 normalized JSON。");
  }

  async function copyTestRecord(markdown: string) {
    await navigator.clipboard.writeText(markdown);
    setRecordCopyStatus("已複製本次測試紀錄。");
  }

  async function copyPromptForManualTest() {
    await navigator.clipboard.writeText(buildEvaluationPrompt(input));
    setPromptCopyStatus(
      "已複製 Prompt。你可以貼到 ChatGPT / Gemini 網頁版手動測試，再把 JSON 貼回 JSON Preview。"
    );
  }

  const isSubmitDisabled = isLoading || cooldownRemaining > 0;
  const submitButtonText = getSubmitButtonText({
    isLoading,
    cooldownRemaining,
    isRateLimited,
  });

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-steel">開發測試工具</p>
        <h1 className="text-3xl font-bold text-ink">Gemini PoC</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          這是開發測試頁，用來測試 Gemini 是否能穩定產出符合報告格式的 JSON。
        </p>
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-signal">
          如果尚未設定 server side Gemini 金鑰，本頁可以先檢查 PoC 介面與流程；實際呼叫 Gemini 需要事後在本機環境檔補上金鑰。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-ink">測試輸入</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {testInputs.map((testInput) => (
              <button
                key={testInput.label}
                type="button"
                onClick={() => {
                  setSelectedTestLabel(testInput.label);
                  setInput(testInput.input);
                }}
                className="focus-ring rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-frost"
              >
                {testInput.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-5">
            <TextField
              label="你的副業點子是什麼？"
              rows={4}
              value={input.idea}
              onChange={(value) => setInput((current) => ({ ...current, idea: value }))}
            />
            <TextField
              label="你能投入多少時間？"
              rows={2}
              value={input.availableTime}
              onChange={(value) =>
                setInput((current) => ({ ...current, availableTime: value }))
              }
            />
            <TextField
              label="你不想做哪些事？"
              rows={3}
              value={input.avoidThings}
              onChange={(value) =>
                setInput((current) => ({ ...current, avoidThings: value }))
              }
            />
          </div>

          <button
            type="button"
            onClick={callGemini}
            disabled={isSubmitDisabled}
            className="focus-ring mt-6 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {submitButtonText}
          </button>

          {error && (
            <pre className="mt-4 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-danger">
              {error}
            </pre>
          )}
          {showPromptFallback && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyPromptForManualTest}
                  className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  複製 Prompt，改用手動測試
                </button>
                <Link
                  to="/json-preview"
                  className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
                >
                  前往 JSON Preview
                </Link>
              </div>
              {promptCopyStatus && (
                <p className="mt-3 text-sm font-medium leading-6 text-signal">
                  {promptCopyStatus}
                </p>
              )}
            </div>
          )}
          {storageError && (
            <pre className="mt-4 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-danger">
              {storageError}
            </pre>
          )}
        </div>

        <div className="space-y-5">
          <Panel title="Gemini 原始回應">
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {rawText || "尚無 Gemini 原始回應。"}
            </pre>
          </Panel>

          <Panel title="驗證結果">
            {!report && !error && (
              <p className="text-sm leading-7 text-slate-600">
                尚無驗證結果。請先呼叫 Gemini 測試報告產出。
              </p>
            )}
            {report && (
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>JSON parse：成功</p>
                <p>validate errors：0</p>
                <p>validate warnings：{warnings.length}</p>
                <p>normalize：已套用 score / scoreLabel 修正流程</p>
                <p>最終 score：{report.score}</p>
                <p>scoreLabel：{report.scoreLabel}</p>
                <p className="rounded-md bg-frost p-3 font-medium text-steel">
                  技術驗證通過不代表 Gemini 適合作為正式 Provider。請人工檢查 productShape、dontBuild、7 天驗證計畫與語氣是否符合「冷靜、保守、具體」的產品定位。
                </p>
                {warnings.length > 0 && (
                  <ul className="rounded-md bg-amber-50 p-3 text-signal">
                    {warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Panel>

          {report && (
            <Panel title="人工內容複查">
              <div className="grid gap-5 text-sm">
                <ReviewField
                  label="ProductShape 是否具體"
                  value={manualReview.productShape}
                  options={["是", "普通", "否"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      productShape: value as ThreeLevelReview,
                    }))
                  }
                />
                <ReviewField
                  label="DontBuild 是否有針對性"
                  value={manualReview.dontBuild}
                  options={["是", "普通", "否"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      dontBuild: value as ThreeLevelReview,
                    }))
                  }
                />
                <ReviewField
                  label="7 天計畫是否偏驗證"
                  value={manualReview.validationPlan}
                  options={["是", "普通", "否"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      validationPlan: value as ThreeLevelReview,
                    }))
                  }
                />
                <ReviewField
                  label="語氣是否冷靜保守"
                  value={manualReview.calmTone}
                  options={["是", "普通", "否"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      calmTone: value as ThreeLevelReview,
                    }))
                  }
                />
                <ReviewField
                  label="是否有過度承諾"
                  value={manualReview.overPromise}
                  options={["無", "輕微", "明顯"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      overPromise: value as OverPromiseReview,
                    }))
                  }
                />
                <ReviewField
                  label="風險判斷是否足夠"
                  value={manualReview.riskCoverage}
                  options={["是", "普通", "否"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      riskCoverage: value as ThreeLevelReview,
                    }))
                  }
                />
                <ReviewField
                  label="是否可接受作為產品報告"
                  value={manualReview.acceptable}
                  options={["是", "需小修", "否"]}
                  onChange={(value) =>
                    setManualReview((current) => ({
                      ...current,
                      acceptable: value as AcceptReview,
                    }))
                  }
                />
                <label className="grid gap-2">
                  <span className="font-semibold text-ink">人工備註</span>
                  <textarea
                    rows={4}
                    value={manualReview.note}
                    placeholder="記錄這次報告的具體問題，例如：productShape 太抽象、dontBuild 太通用、風險講太輕、分數偏高等。"
                    onChange={(event) =>
                      setManualReview((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                    className="focus-ring resize-y rounded-md border border-slate-300 bg-white px-4 py-3 leading-7 text-ink"
                  />
                </label>
              </div>
            </Panel>
          )}

          {report && (
            <Panel title="下一步">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={previewReport}
                  className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  預覽 Gemini 報告
                </button>
                <button
                  type="button"
                  onClick={copyNormalizedJson}
                  className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
                >
                  複製 normalized JSON
                </button>
              </div>
              {copyStatus && (
                <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                  {copyStatus}
                </p>
              )}
            </Panel>
          )}

          {report && (
            <Panel title="測試紀錄輔助">
              <p className="text-sm leading-7 text-slate-600">
                以下 Markdown 可複製到 docs/gemini-poc-test-results.md，再人工補上內容品質欄位。
              </p>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {buildTestRecordRow({
                  testLabel: selectedTestLabel,
                  warnings,
                  report,
                  manualReview,
                })}
              </pre>
              <button
                type="button"
                onClick={() =>
                  copyTestRecord(
                    buildTestRecordRow({
                      testLabel: selectedTestLabel,
                      warnings,
                      report,
                      manualReview,
                    })
                  )
                }
                className="focus-ring mt-3 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-frost"
              >
                複製本次測試紀錄
              </button>
              {recordCopyStatus && (
                <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                  {recordCopyStatus}
                </p>
              )}
            </Panel>
          )}
        </div>
      </div>
    </section>
  );
}

function buildTestRecordRow({
  testLabel,
  warnings,
  report,
  manualReview,
}: {
  testLabel: string;
  warnings: string[];
  report: MockReport;
  manualReview: ManualReview;
}) {
  const normalizedTestLabel = testLabel.replace(/^測試題\s*\d+：/, "");
  const warningText = warnings.length > 0 ? `有：${warnings.join("；")}` : "無";
  const reviewNoteParts = [
    `score ${report.score} / ${report.scoreLabel}`,
    `風險判斷：${manualReview.riskCoverage || pendingReviewText}`,
    `產品可接受度：${manualReview.acceptable || pendingReviewText}`,
    manualReview.note.trim(),
  ].filter(Boolean);

  return `| ${normalizedTestLabel} | 待填 | 是 | 是 | 無 | ${warningText} | 已套用：score ${report.score} / ${report.scoreLabel} | 是 | ${manualReview.productShape || pendingReviewText} | ${manualReview.dontBuild || pendingReviewText} | ${manualReview.validationPlan || pendingReviewText} | ${manualReview.calmTone || pendingReviewText} | ${manualReview.overPromise || pendingReviewText} | ${reviewNoteParts.join("；")} |`;
}

function getSubmitButtonText({
  isLoading,
  cooldownRemaining,
  isRateLimited,
}: {
  isLoading: boolean;
  cooldownRemaining: number;
  isRateLimited: boolean;
}) {
  if (isLoading) {
    return "正在呼叫 Gemini...";
  }

  if (cooldownRemaining > 0 && isRateLimited) {
    return "Gemini 請求過於頻繁，請稍後再試";
  }

  if (cooldownRemaining > 0) {
    return `請稍候 ${cooldownRemaining} 秒後再測試`;
  }

  return "測試 Gemini 產生報告";
}

function ReviewField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="font-semibold text-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`focus-ring rounded-md border px-3 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "border-ink bg-ink text-white"
                  : "border-slate-300 bg-white text-ink hover:bg-frost"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold text-ink">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring resize-y rounded-md border border-slate-300 bg-white px-4 py-3 leading-7 text-ink"
      />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

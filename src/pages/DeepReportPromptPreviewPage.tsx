import { useMemo, useState } from "react";
import { ButtonLink } from "../components/Buttons";
import { buildDeepReportPrompt } from "../lib/deepReportPrompt";
import type { EvaluationInput } from "../lib/promptTemplate";

const sampleInput: EvaluationInput = {
  idea: "我想做一個 AI 寵物飼料分析推薦網站",
  availableTime: "下班後每天 1～2 小時，週末半天",
  avoidThings: "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料",
};

const fields = [
  {
    key: "idea",
    label: "你的副業點子是什麼？",
    rows: 3,
  },
  {
    key: "availableTime",
    label: "你能投入多少時間？",
    rows: 2,
  },
  {
    key: "avoidThings",
    label: "你不想做哪些事？",
    rows: 2,
  },
] satisfies {
  key: keyof EvaluationInput;
  label: string;
  rows: number;
}[];

export function DeepReportPromptPreviewPage() {
  const [input, setInput] = useState<EvaluationInput>(sampleInput);
  const [copyStatus, setCopyStatus] = useState("");
  const prompt = useMemo(() => buildDeepReportPrompt(input), [input]);

  async function copyPrompt() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        copyTextWithFallback(prompt);
      }
      setCopyStatus("已複製 Deep Report Prompt，可以貼到 ChatGPT 測試。");
    } catch {
      const copied = copyTextWithFallback(prompt);
      setCopyStatus(
        copied
          ? "已複製 Deep Report Prompt，可以貼到 ChatGPT 測試。"
          : "無法自動複製，請手動選取下方 Prompt 後複製。"
      );
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-steel">開發測試工具</p>
        <h1 className="text-3xl font-bold text-ink">Deep Report Prompt Preview</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          這是 Deep Report 開發測試用頁面。輸入副業點子後，系統會用目前的 Deep Report Prompt 邏輯產生完整提示詞，不會呼叫 Gemini API。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-ink">測試輸入</h2>
          <div className="mt-5 grid gap-5">
            {fields.map((field) => (
              <label key={field.key} className="grid gap-2">
                <span className="font-semibold text-ink">{field.label}</span>
                <textarea
                  rows={field.rows}
                  value={input[field.key]}
                  onChange={(event) =>
                    setInput((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="focus-ring min-h-20 resize-y rounded-md border border-slate-300 bg-white px-4 py-3 leading-7 text-ink"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Generated Deep Report Prompt</h2>
            <button
              type="button"
              onClick={copyPrompt}
              className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              複製 Prompt
            </button>
          </div>
          {copyStatus && (
            <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              {copyStatus}
            </p>
          )}
          <textarea
            readOnly
            value={prompt}
            className="mt-4 h-[620px] w-full resize-y rounded-md border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800"
          />
        </div>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-ink">手動測試流程</h2>
        <ol className="mt-4 grid gap-2 text-sm leading-7 text-slate-700 sm:grid-cols-2">
          <li>1. 在本頁填入副業點子</li>
          <li>2. 複製 Deep Report Prompt</li>
          <li>3. 貼到 ChatGPT</li>
          <li>4. 複製 ChatGPT 回傳的 JSON</li>
          <li>5. 前往 Deep JSON Preview</li>
          <li>6. 貼上 JSON 並驗證</li>
          <li>7. 驗證通過後查看完整 Deep Report</li>
        </ol>
        <div className="mt-5">
          <ButtonLink to="/deep-report-json-preview" variant="secondary">
            前往 Deep JSON Preview
          </ButtonLink>
        </div>
      </section>
    </section>
  );
}

function copyTextWithFallback(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}

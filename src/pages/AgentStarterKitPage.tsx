import { useMemo, useState } from "react";
import { ButtonLink } from "../components/Buttons";
import type { DeepReport } from "../data/deepReport";
import { buildAgentStarterPrompt } from "../lib/agentStarterKit";
import { normalizeDeepReport, validateDeepReport } from "../lib/validateDeepReport";

const storageKey = "deepReportPreview";

export function AgentStarterKitPage() {
  const report = readDeepReport();
  const [copyStatus, setCopyStatus] = useState("");
  const prompt = useMemo(
    () => (report ? buildAgentStarterPrompt(report) : ""),
    [report]
  );

  async function copyPrompt() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        copyTextWithFallback(prompt);
      }
      setCopyStatus("已複製給 AI 的開發任務，可以貼到你使用的 AI 開發工具。");
    } catch {
      const copied = copyTextWithFallback(prompt);
      setCopyStatus(
        copied
          ? "已複製給 AI 的開發任務，可以貼到你使用的 AI 開發工具。"
          : "無法自動複製，請手動選取下方任務說明後複製。"
      );
    }
  }

  if (!report) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-sm font-semibold text-steel">AI Agent 開工包</p>
          <h1 className="text-3xl font-bold text-ink">目前沒有可用的深度報告</h1>
          <p className="mt-4 leading-8 text-slate-600">
            請先產生 Deep Report，再回到這裡取得可直接複製給 AI 的開發任務。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/report/generated-preview">回到免費報告</ButtonLink>
            <ButtonLink to="/evaluate" variant="secondary">
              回到輸入頁
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-steel">給 AI 的開發任務</p>
        <h1 className="text-3xl font-bold text-ink">AI Agent 開工包</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          複製以下內容並貼到你使用的 AI 開發工具。系統已自動整理產品需求、功能規格與開發步驟。
        </p>
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-ink">這是什麼？</h2>
          <div className="mt-3 space-y-3 leading-7 text-slate-700">
            <p>這是一份整理好的 AI 開發任務說明。</p>
            <p>
              你可以把它整段複製，貼到 Codex、Cursor、Claude Code、ChatGPT Agent 或其他 AI 開發工具。
            </p>
            <p>AI 會根據這份說明，協助你建立第一版 MVP 網站框架。</p>
          </div>
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-signal">
            <p className="font-semibold text-ink">重要提醒</p>
            <p className="mt-2">
              第一版不會幫你完成正式金流、會員、資料庫或外部 API 串接。
            </p>
            <p className="mt-2">
              它會先建立可操作的框架、假資料流程、設定範例與 README，讓你可以先看到產品長什麼樣子。
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-ink">新手名詞解釋</h2>
          <dl className="mt-4 space-y-4">
            {glossary.map((item) => (
              <div key={item.term}>
                <dt className="font-semibold text-ink">{item.term}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">給 AI 的 MVP 開發說明書</h2>
          <button
            type="button"
            onClick={copyPrompt}
            className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            複製給 AI 的開發任務
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
          className="mt-4 h-[680px] w-full resize-y rounded-md border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/report/deep-preview">返回深度報告</ButtonLink>
        <ButtonLink to="/evaluate" variant="secondary">
          重新評估
        </ButtonLink>
      </div>
    </section>
  );
}

function readDeepReport(): DeepReport | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const result = validateDeepReport(parsed);
    if (!result.isValid) {
      return null;
    }

    return normalizeDeepReport(parsed as DeepReport);
  } catch {
    return null;
  }
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

const glossary = [
  {
    term: "AI Agent",
    description: "會幫你執行任務的 AI 工具",
  },
  {
    term: "Prompt（提示詞）",
    description: "你交給 AI 的任務說明",
  },
  {
    term: "MVP（最小可行產品）",
    description: "先做出最簡單、可以測試市場反應的第一版",
  },
  {
    term: "Mock（假資料 / 假流程）",
    description: "先用假的資料或假的流程做出畫面，之後再接真的服務",
  },
];

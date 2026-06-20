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
      setCopyStatus("已複製 AI Agent Prompt，可以貼到你使用的 AI Agent。");
    } catch {
      const copied = copyTextWithFallback(prompt);
      setCopyStatus(
        copied
          ? "已複製 AI Agent Prompt，可以貼到你使用的 AI Agent。"
          : "無法自動複製，請手動選取下方 Prompt 後複製。"
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
            請先產生 Deep Report，再回到這裡取得可直接複製的 AI Agent Prompt。
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
        <p className="mb-2 text-sm font-semibold text-steel">AI Agent Prompt</p>
        <h1 className="text-3xl font-bold text-ink">AI Agent 開工包</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          複製以下內容並貼到你使用的 AI Agent。系統已自動整理產品需求、功能規格與開發步驟。
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">AI Agent Prompt</h2>
          <button
            type="button"
            onClick={copyPrompt}
            className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            複製全部
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

# 專案目前狀態

更新日期：2026-06-20

## 專案資訊

- 專案名稱：Side Project Cold Score
- package name：side-project-cold-score
- 目前定位：AI Agent MVP 啟動器
- Production URL：https://ai-sidehustle-evaluator.pages.dev
- 最新安全版本：v0.2.5

## Git 狀態

- 目前分支：main
- 遠端狀態：main 與 origin/main 同步
- 工作區狀態：乾淨，沒有未提交修改
- 最新 commit：
  - `5f77784 feat: improve deep report and add agent starter kit`

最近提交：

```text
5f77784 feat: improve deep report and add agent starter kit
5867f50 feat: add ai agent starter kit
e5feff1 feat: add dynamic gemini deep report
02a7c6f Improve loading state during evaluation
8e31366 Make restrictions optional and improve form validation
```

## 已完成階段

- Phase 1：Paid Preview
- Phase 2：Deep Report UI
- Phase 2.5：Gemini Dynamic Deep Report
- Phase 3：AI Agent MVP Starter Kit Enhancement
- Phase 3.5：AI Agent Starter Kit

## 目前核心功能

- 免費副業點子冷靜評估
- Gemini 動態報告產生
- Deep Report JSON Schema 與驗證流程
- Deep Report Prompt Preview
- Deep Report JSON Preview
- AI Agent 開工包
- AI Agent 開工包第三方服務與外部整合規則
- 文件分類整理

## Deep Report 開發者工具

- `/deep-report-prompt-preview`
  - 產生 Deep Report Prompt
  - 強制提示 AI 只輸出合法 JSON
  - 避免 Markdown、code block、說明文字與跳脫陣列格式

- `/deep-report-json-preview`
  - 支援貼上 AI 回覆內容
  - 自動清理 Markdown code block、說明文字、`\[`、`\]`、`\_`
  - 顯示 Deep Report 健康檢查
  - 驗證成功後寫入 `localStorage["deepReportPreview"]`
  - 可接續使用 AI Agent 開工包

## AI Agent 開工包

- route：`/agent-starter-kit`
- 資料來源：`localStorage["deepReportPreview"]`
- Prompt 產生函式：`buildAgentStarterPrompt`
- 檔案位置：`src/lib/agentStarterKit.ts`

開工包會整合：

- 產品目標
- 目標客群
- MVP 功能需求
- 頁面需求
- UI 需求
- 資料結構
- 技術限制
- 建議檔案結構
- 開發任務拆解
- 驗收條件
- MVP 瘦身方案
- 不要做的功能
- 第三方服務與外部整合規則

## 第三方服務與外部整合規則

AI Agent 開工包的複製內容已包含以下規則：

- 第一版 MVP 不正式串接金流、外部 API、Email、會員系統、資料庫、第三方 SaaS、OAuth、雲端儲存、推播服務或 AI 模型服務
- 必須先建立功能框架與操作流程
- 必須建立 Mock Function
- 必須建立 Placeholder / TODO
- 必須建立 `.env.example`
- README 必須包含啟動步驟、環境變數設定、第三方服務設定方式與部署方式
- 必須列出待使用者設定項目
- 禁止寫死 API Key
- 禁止因第三方服務未設定導致專案無法啟動

## 文件結構

文件已整理至：

```text
docs/
├─ roadmap/
├─ prompts/
├─ prompts/features/
├─ deployment/
├─ testing/
└─ archive/
```

## 開發指令

```text
npm run dev
npm run build
npm run preview
```

目前環境曾使用 Codex 內建 Node runtime 執行：

```text
tsc -b
vite build
```

最近一次回報的 build 狀態：通過。

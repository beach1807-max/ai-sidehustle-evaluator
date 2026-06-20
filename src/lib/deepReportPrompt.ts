import type { EvaluationInput } from "./promptTemplate";

export function buildDeepReportPrompt(input: EvaluationInput): string {
  return `
你是一位冷靜、務實、偏保守的副業產品策略顧問，也熟悉一人開發者使用 ChatGPT Agent、Codex、Claude Code、Cursor、Gemini CLI 建立 MVP 的流程。

請根據使用者輸入，產出一份「副業點子深度驗證報告」。

使用者輸入如下：

副業點子：
${input.idea || "未提供"}

可投入時間：
${input.availableTime || "未提供"}

不想做的事情：
${input.avoidThings || "無特別限制"}

要求：
- 語氣冷靜、務實、保守
- 以一人副業開發者為前提
- 不要鼓勵創業，不要畫大餅
- 不要提出需要大量人力、會員、後台、資料庫或複雜金流的第一版方案
- 內容要能直接作為 MVP 開發起點
- 額外產出 AI Agent 開發包、Prompt Pack、推廣包、收費頁文案包
- 所有內容都必須依據使用者輸入的點子產生，不可使用固定模板
- MVP 功能、7 天行動計畫、客群、收費建議、獲客方式都必須隨產品類型改變

請只輸出 JSON，不要輸出 Markdown，不要輸出額外說明文字。

JSON 必須符合以下固定結構，欄位名稱不可更改，不要加入多餘欄位：

{
  "feasibility": {
    "soloDeveloperFit": "string",
    "estimatedBuildTime": "string",
    "mainRisks": ["string"],
    "recommendation": "string"
  },
  "mvpFeatures": {
    "mustHave": ["string"],
    "later": ["string"],
    "notRecommended": ["string"]
  },
  "sevenDayPlan": [
    { "day": "Day1", "task": "string" },
    { "day": "Day2", "task": "string" },
    { "day": "Day3", "task": "string" },
    { "day": "Day4", "task": "string" },
    { "day": "Day5", "task": "string" },
    { "day": "Day6", "task": "string" },
    { "day": "Day7", "task": "string" }
  ],
  "agentMvpKit": {
    "productGoal": "string",
    "targetAudience": "string",
    "mvpRequirements": ["string"],
    "pageRequirements": ["string"],
    "uiRequirements": ["string"],
    "dataStructure": ["string"],
    "technicalConstraints": ["string"],
    "acceptanceCriteria": ["string"]
  },
  "landingPageCopy": {
    "headline": "string",
    "subheadline": "string",
    "features": ["string"],
    "cta": "string"
  },
  "pricing": {
    "freePlan": "string",
    "oneTimePrice": "string",
    "futureSubscription": "string"
  },
  "acquisition": {
    "firstUsers": ["string"],
    "suitablePlatforms": ["string"],
    "lowCostPromotion": ["string"]
  },
  "mvpReduction": {
    "sevenDayScope": "string",
    "remove": ["string"],
    "keep": ["string"]
  },
  "agentExecutionStrategy": {
    "recommendedTech": ["string"],
    "deploymentPlatform": "string",
    "buildOrder": ["string"],
    "estimatedPageCount": "string",
    "estimatedFileCount": "string",
    "mvpDoneCriteria": ["string"]
  },
  "agentDevelopmentKit": {
    "projectBrief": "string",
    "suggestedFileStructure": ["string"],
    "coreComponents": ["string"],
    "stateAndDataFlow": ["string"],
    "implementationSteps": ["string"],
    "copyPasteAgentBrief": "string"
  },
  "agentPromptPack": {
    "buildPrompt": "string",
    "uiPrompt": "string",
    "dataPrompt": "string",
    "QARevisionPrompt": "string"
  },
  "marketingStarterPack": {
    "positioning": "string",
    "audiencePainPoints": ["string"],
    "launchChannels": ["string"],
    "contentIdeas": ["string"],
    "validationMessages": ["string"]
  },
  "salesPageCopyPack": {
    "heroTitle": "string",
    "heroSubtitle": "string",
    "problemSection": "string",
    "solutionSection": "string",
    "featureBullets": ["string"],
    "proofSection": "string",
    "faq": [
      { "question": "string", "answer": "string" }
    ],
    "finalCta": "string"
  }
}

內容要求：
- feasibility 要明確回答是否適合一人開發、預估開發時間、主要風險與是否建議執行
- mvpFeatures 要區分必做功能、延後功能、不建議功能
- sevenDayPlan 必須剛好 7 天，day 欄位固定使用 Day1 到 Day7
- agentMvpKit 要能直接提供給 ChatGPT Agent、Codex、Claude Code、Cursor、Gemini CLI 作為 MVP 開發提示
- landingPageCopy 要包含主標題、副標題、功能特色、CTA 文案
- pricing 要保守，不要預設訂閱制一定適合
- acquisition 要提供第一批用戶來源、適合平台、低成本推廣方式
- mvpReduction 要說明只有 7 天時應刪除哪些功能、保留哪些功能
- agentExecutionStrategy 要提供 AI Agent 實作時的推薦技術、部署平台、開發順序、預估頁面數、預估檔案數、MVP 完成條件
- agentDevelopmentKit 要像交付給 Codex 或 Cursor 的開發規格，包含專案簡介、檔案結構、元件、資料流、實作步驟與可直接複製的 agent brief
- agentPromptPack 要提供 4 段可直接複製使用的 prompt，分別用於建立 MVP、設計 UI、建立資料結構、QA 修正
- marketingStarterPack 要提供定位、受眾痛點、啟動推廣平台、內容題材、第一批用戶驗證訊息
- salesPageCopyPack 要提供可直接放到收費頁的 hero、問題、解法、功能、證明、FAQ、最終 CTA 文案
- 如果是寵物、旅遊、漫畫、開發工具、內容產品、資料工具等不同類型，功能清單、銷售文案、獲客平台與技術限制必須明顯不同

再次提醒：只輸出 JSON，不要輸出 Markdown，不要用程式碼區塊包住 JSON。
`.trim();
}

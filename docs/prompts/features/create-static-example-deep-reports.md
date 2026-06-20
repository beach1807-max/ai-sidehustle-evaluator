# 建立三份固定範例 Deep Report：依現有渲染邏輯產生本地靜態資料

## 任務目標

目前產品有三份預設範例報告。

我希望這三份範例報告不再只是免費評估，也不要在使用者點擊「產生完整開工包」時呼叫 Gemini 或任何 AI API。

本次任務目標是：

請先閱讀目前專案中 Deep Report 的：

* TypeScript 型別
* Schema / validator
* normalize 邏輯
* DeepReportView 渲染邏輯
* AgentStarterKitPage 資料讀取邏輯
* buildAgentStarterPrompt 使用欄位

然後依照目前前端實際渲染需要，一次建立三份完整、固定、本地的範例 Deep Report 資料。

未來使用者開啟範例報告時，看到的都必須是固定內容，不得每次重新產生，也不得呼叫 Gemini。

---

## 請先理解這件事

這次不是要在前端動態生成範例內容。

這次要做的是：

```text
開發時：
Codex 依照目前 schema 與渲染邏輯，產生三份固定 Deep Report 範例資料

執行時：
網站只讀取這三份固定本地資料
```

也就是：

```text
範例內容可以由 Codex 生成

但生成後必須寫死在本地資料檔中

使用者瀏覽範例時，不得呼叫 AI
```

---

## 正確使用者流程

### 使用者打開範例報告頁

```text
開啟範例報告
↓
讀取本地固定範例資料
↓
顯示免費評估內容
↓
顯示付費預覽區塊
```

### 使用者按下「產生完整開工包」

```text
按下產生完整開工包
↓
讀取對應範例的固定 Deep Report 資料
↓
通過 validateDeepReport()
↓
寫入 localStorage["deepReportPreview"]
↓
導向 /agent-starter-kit
↓
AgentStarterKitPage 使用既有邏輯渲染完整開工包
```

### 不允許的流程

```text
按下產生完整開工包
↓
呼叫 Gemini
↓
重新產生報告
```

這是不允許的。

---

## 修改前請先檢查

請先搜尋並確認以下檔案與邏輯：

```text
src/lib/ai/types.ts
src/lib/validateDeepReport.ts
src/lib/agentStarterKit.ts
src/components/DeepReportView.tsx
src/components/PaidReportPreview.tsx
src/pages/AgentStarterKitPage.tsx
src/pages/ExampleReportsPage.tsx
src/data/
```

請確認：

1. DeepReport 實際需要哪些欄位。
2. validateDeepReport() 會檢查哪些欄位。
3. normalizeDeepReport() 是否存在。
4. DeepReportView 實際會渲染哪些欄位。
5. buildAgentStarterPrompt() 實際會讀哪些欄位。
6. AgentStarterKitPage 目前是否讀取 `localStorage["deepReportPreview"]`。
7. 三份範例報告目前的 ID 或資料來源。

---

## 建立固定範例資料

請建立或擴充本地資料檔。

建議檔案：

```text
src/data/exampleDeepReports.ts
```

如果專案已有更適合的位置，請沿用既有結構。

範例資料應該使用目前專案的 DeepReport 型別，例如：

```ts
import type { DeepReport } from "../lib/ai/types";

export const exampleDeepReports: Record<string, DeepReport> = {
  petFoodAnalyzer: {
    ...
  },
  travelPlanner: {
    ...
  },
  resumeChecker: {
    ...
  },
};
```

實際 import 路徑請依專案結構調整。

---

## 三份固定範例主題

請建立三份固定 Deep Report。

若專案已有三份既定範例，請優先沿用原本三份範例名稱與 ID。

若目前沒有固定主題，請使用以下三份：

```text
1. AI 寵物飼料分析推薦網站
2. AI 旅遊行程規劃工具
3. AI 履歷健檢工具
```

---

## 範例內容必須符合現有渲染

請不要憑空創造新的資料格式。

請依照目前專案中實際的 DeepReport type、validator、DeepReportView、AgentStarterKitPage、buildAgentStarterPrompt 補齊資料。

至少應包含目前常用欄位，例如：

```text
feasibility
mvpFeatures
sevenDayPlan
agentMvpKit
landingPageCopy
pricing
acquisition
mvpReduction
agentExecutionStrategy
```

如果目前專案已經支援或要求以下欄位，也請補齊：

```text
agentDevelopmentKit
agentPromptPack
marketingStarterPack
salesPageCopyPack
```

請以專案實際型別與 validator 為準。

---

## 欄位內容要求

### feasibility

內容需務實、偏保守。

應能回答：

```text
這個點子適不適合一人做？
大約多久能做 MVP？
主要風險是什麼？
建議做、縮小，還是暫緩？
```

---

### mvpFeatures

請分成：

```text
mustHave
later
notRecommended
```

要求：

```text
mustHave：第一版一定要有
later：之後再做
notRecommended：第一版不該做
```

---

### sevenDayPlan

必須剛好 7 筆。

每筆都要具體可執行。

不要寫空泛內容，例如：

```text
優化產品
做行銷
改善體驗
```

要寫成比較具體的任務，例如：

```text
建立首頁、輸入表單與結果區塊
建立 mock 分析函式與範例資料
完成結果頁與複製文字功能
```

---

### agentMvpKit

請補齊目前開工包會用到的欄位，例如：

```text
productGoal
targetAudience
mvpRequirements
pageRequirements
uiRequirements
dataStructure
technicalConstraints
acceptanceCriteria
```

內容要能讓 `buildAgentStarterPrompt()` 產生可直接複製給 AI Agent 的開發任務。

---

### agentExecutionStrategy

技術建議請偏簡單，適合一人 MVP。

優先使用：

```text
React + Vite
Cloudflare Pages
localStorage
mock data
不先接資料庫
不先接金流
不先做會員
```

---

### pricing / acquisition / landingPageCopy

請保持務實，不要保證賺錢。

內容要能讓新手理解：

```text
第一版可以怎麼收費
先去哪裡找第一批使用者
首頁可以怎麼寫
```

---

## 三份範例內容方向

### 範例 1：AI 寵物飼料分析推薦網站

請強調：

```text
適合做 MVP，但需避免醫療宣稱。
第一版不要做完整品牌資料庫。
不要取代獸醫。
先做成分輸入、寵物條件輸入、一般性風險提醒、免責聲明。
```

開工包應能讓 AI Agent 建立：

```text
可輸入寵物條件與飼料成分的網頁
顯示一般性分析與風險提醒
使用 mock data
不接正式飼料資料庫
不接付款
不做醫療診斷
```

---

### 範例 2：AI 旅遊行程規劃工具

請強調：

```text
市場競爭高，但適合做小型 MVP。
第一版不要做訂房、地圖串接、會員收藏、即時票價。
先做目的地、天數、偏好輸入，產生每日行程與複製文字功能。
```

開工包應能讓 AI Agent 建立：

```text
可輸入目的地、天數、偏好的網站
產生每日行程卡片
可複製文字
使用 mock generate function
不接地圖 API
不接訂房服務
```

---

### 範例 3：AI 履歷健檢工具

請強調：

```text
需求明確，但競爭高。
第一版不要做完整求職平台。
不要做會員履歷庫。
先做履歷文字貼上、問題診斷、修改建議、面試重點提醒。
```

開工包應能讓 AI Agent 建立：

```text
可貼上履歷文字的網站
輸出改善建議
列出問題清單
提供面試準備重點
使用 mock analysis
不接登入
不接資料庫
```

---

## 範例報告按鈕行為

在範例報告中，按下：

```text
產生完整開工包
```

時，請使用對應的固定範例 Deep Report。

概念如下：

```ts
const report = exampleDeepReports[exampleId];

const normalizedReport = normalizeDeepReport
  ? normalizeDeepReport(report)
  : report;

const validation = validateDeepReport(normalizedReport);

if (!validation.ok) {
  console.error(validation);
  return;
}

localStorage.setItem("deepReportPreview", JSON.stringify(normalizedReport));
navigate("/agent-starter-kit");
```

請依專案實際函式名稱調整。

不要更換 `localStorage["deepReportPreview"]` 這個 key。

---

## 範例報告不得呼叫 AI

請確保範例報告流程不得呼叫：

```text
/api/evaluate
evaluateWithProvider
geminiProvider
generateDeepReport
serverEvaluate
```

或任何會造成 Gemini API 呼叫的流程。

正式使用者輸入點子的流程仍然維持原本 Gemini 流程，不要修改。

---

## 範例資料要通過驗證

請在開發時確認三份固定範例都能通過：

```text
validateDeepReport()
```

如果有 `normalizeDeepReport()`，請先 normalize 再 validate。

請不要用 `as any` 硬繞過型別錯誤。

請不要為了通過 build 而刪掉 validator。

請不要放入不會被渲染、格式不一致的資料。

---

## UI 補充說明

如果範例頁需要避免誤會，可以在按鈕附近加入一句小字：

```text
範例報告會直接顯示預設好的完整開工包，不會消耗 AI 產生次數。
```

---

## 禁止事項

本次不要新增：

```text
金流
會員
登入
資料庫
Email
新 API
新 AI Provider
使用次數限制
真實付款流程
```

本次不要改動：

```text
正式 Gemini 流程
/api/evaluate
Deep Report schema
JSON Preview 驗證邏輯
AI Agent 開工包 localStorage key
Router 路徑
付費邏輯
```

---

## 驗收標準

完成後請確認：

1. 專案中存在三份固定範例 Deep Report 資料。
2. 三份資料都是本地靜態資料，不是執行時產生。
3. 三份資料符合目前 DeepReport 型別。
4. 三份資料都通過 `validateDeepReport()`。
5. 三份範例報告都可以正常開啟。
6. 三份範例報告按下「產生完整開工包」時，不會呼叫 Gemini。
7. 按下後會寫入 `localStorage["deepReportPreview"]`。
8. 按下後會導向 `/agent-starter-kit`。
9. AI Agent 開工包頁能正常顯示該範例的固定內容。
10. 三份範例開工包內容彼此不同。
11. 正式使用者輸入點子的 Deep Report 流程仍可正常呼叫 Gemini。
12. JSON Preview 流程不受影響。
13. Build 通過。

---

## Build 驗證

完成後請執行：

```bash
npm run build
```

如果目前環境沒有 npm，請使用專案可用的 build 指令，例如：

```bash
tsc -b
vite build
```

---

## 完成後回報

請回報：

* 修改檔案
* 三份固定範例 Deep Report 的 ID / 名稱
* 固定資料放在哪個檔案
* 範例報告按鈕如何取得固定資料
* 是否通過 validateDeepReport()
* 是否仍有範例流程會呼叫 Gemini
* 是否影響正式 Gemini 流程
* Build 結果

不要 commit。

不要 push。

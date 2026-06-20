# 修正範例報告流程：先顯示固定 Deep Report，再進入 AI Agent 開工包

## 任務目標

目前三份範例報告中，使用者按下：

```text
產生完整開工包
```

後，系統會直接導向：

```text
/agent-starter-kit
```

這會略過「完整 Deep Report / 深度驗證報告」頁面。

這不是預期行為。

正確流程應該是：

```text
範例報告
↓
按「產生完整開工包」
↓
讀取對應的本地固定 Deep Report 資料
↓
顯示完整 Deep Report / 深度驗證報告頁面
↓
使用者在 Deep Report 頁面點「AI Agent 開工包」
↓
再進入 /agent-starter-kit
```

本次任務目標：

讓範例報告的「產生完整開工包」按鈕，先導向完整 Deep Report 頁，而不是直接導向 AI Agent 開工包頁。

---

## 目前錯誤流程

目前可能是：

```ts
localStorage.setItem("deepReportPreview", JSON.stringify(exampleDeepReport));
navigate("/agent-starter-kit");
```

這會直接進入 AI Agent 開工包。

請改成先進入 Deep Report 顯示頁。

---

## 正確流程

範例報告按鈕應改成：

```text
取得對應固定 exampleDeepReport
↓
normalizeDeepReport()
↓
validateDeepReport()
↓
localStorage.setItem("deepReportPreview", JSON.stringify(report))
↓
導向 Deep Report 預覽頁
```

而不是直接導向 `/agent-starter-kit`。

---

## 請先檢查現有路由

請先確認目前專案中完整 Deep Report 頁面的路由。

可能是：

```text
/report/deep-preview
```

或其他既有路由。

請不要新增重複頁面。

請優先使用現有可以渲染 `DeepReportView` 的頁面。

---

## 修改範圍

請搜尋以下檔案與邏輯：

```text
src/pages/
src/components/
src/data/exampleDeepReports.ts
src/components/PaidReportPreview.tsx
src/pages/ExampleReportsPage.tsx
src/pages/DeepReportPreviewPage.tsx
src/pages/AgentStarterKitPage.tsx
src/lib/validateDeepReport.ts
```

請找出：

1. 範例報告的「產生完整開工包」按鈕在哪裡。
2. 按鈕目前是否直接 `navigate("/agent-starter-kit")`。
3. Deep Report 頁面目前讀取哪個 localStorage key。
4. AI Agent 開工包頁面是否同樣讀取 `localStorage["deepReportPreview"]`。
5. 是否已有 `/report/deep-preview` 或等效頁面。

---

## 要做的事

### 1. 範例報告按鈕改為導向 Deep Report 頁

如果目前程式是：

```ts
localStorage.setItem("deepReportPreview", JSON.stringify(exampleDeepReport));
navigate("/agent-starter-kit");
```

請改成類似：

```ts
localStorage.setItem("deepReportPreview", JSON.stringify(exampleDeepReport));
navigate("/report/deep-preview");
```

實際路由請以專案現有 Deep Report 頁面為準。

不要硬編不存在的路由。

---

### 2. 保留 AI Agent 開工包頁面的入口

完整 Deep Report 頁面中，仍應保留：

```text
AI Agent 開工包
```

或：

```text
開始開發 MVP
```

按鈕。

使用者應該在看完完整 Deep Report 後，再從該按鈕進入：

```text
/agent-starter-kit
```

---

### 3. 範例資料仍然使用本地固定內容

範例流程仍必須使用本地固定資料，例如：

```text
src/data/exampleDeepReports.ts
```

或專案目前實際使用的靜態資料檔。

範例報告不得呼叫 Gemini。

範例報告不得呼叫：

```text
/api/evaluate
evaluateWithProvider
geminiProvider
generateDeepReport
serverEvaluate
```

---

### 4. localStorage key 不要更換

請沿用目前 key：

```text
deepReportPreview
```

不要新增新的 key。

不要改 AgentStarterKitPage 的資料讀取方式，除非目前流程真的無法正常讀取。

---

## 使用者體驗要求

完成後，範例報告流程應為：

```text
範例頁
↓
按「產生完整開工包」
↓
看到完整 Deep Report
↓
Deep Report 頁面上方或下方有「AI Agent 開工包」按鈕
↓
點擊後才進入 AI Agent 開工包
```

這樣使用者才能先理解：

```text
可行性
MVP 功能
7 天行動計畫
收費建議
推廣建議
砍功能建議
```

再取得：

```text
給 AI 的完整開發任務說明
```

---

## 可選文案調整

如果範例報告頁面的按鈕目前叫：

```text
產生完整開工包
```

但實際會先進 Deep Report，可以改成更準確：

```text
查看完整範例報告
```

或：

```text
查看完整 Deep Report
```

但如果目前整體產品文案已經統一使用「產生完整開工包」，可以先不改按鈕文字，只修正導向流程。

請避免大規模改文案。

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
Router 路徑架構
付費邏輯
```

除非必須使用既有 Deep Report 路由，否則不要新增新路由。

---

## 驗收標準

完成後請確認：

1. 三份範例報告都可以正常開啟。
2. 三份範例報告按下「產生完整開工包」後，不會直接進入 `/agent-starter-kit`。
3. 按下後會先進入完整 Deep Report 頁面。
4. Deep Report 頁面可以正常顯示該範例的固定內容。
5. Deep Report 頁面中的「AI Agent 開工包」按鈕可以正常導向 `/agent-starter-kit`。
6. AI Agent 開工包頁面可以正常顯示該範例對應內容。
7. 範例流程不會呼叫 Gemini API。
8. 正式使用者輸入點子的 Deep Report 流程不受影響。
9. JSON Preview 流程不受影響。
10. Build 通過。

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
* 範例報告按鈕原本導向哪裡
* 範例報告按鈕現在導向哪裡
* 使用的 Deep Report 頁面路由
* 是否仍使用本地固定 exampleDeepReports
* 是否有任何範例流程呼叫 Gemini
* 是否影響正式 Gemini 流程
* Build 結果

不要 commit。

不要 push。

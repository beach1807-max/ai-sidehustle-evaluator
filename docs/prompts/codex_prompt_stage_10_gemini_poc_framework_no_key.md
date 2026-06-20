# Codex 提示詞：第十階段 Gemini API PoC 框架版（API Key 事後補）

目前「副業點子冷靜評分器」已完成：

1. Mock 版網站
2. 三份範例完整報告
3. Prompt Template
4. JSON Preview
5. Report JSON 驗證工具
6. Generated Report 預覽頁
7. 手動 AI 產報告測試流程
8. score 與 dimensions 分數不一致時的 warning + normalize 機制
9. AI Provider 抽象層與 mock provider
10. 開發工具入口整理

現在進入第十階段：Gemini API PoC 框架版。

這次目標是：

> 先完成 Gemini API PoC 的整體程式框架，但不要要求我現在填入 Gemini API Key。  
> API Key 我會事後自行申請並填入 `.env`。

請注意：

- 這是 PoC，不是正式上線
- 先完成框架，允許 Gemini API Key 尚未設定
- API Key 未設定時，頁面要顯示清楚提示，而不是讓網站 crash
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增正式使用者歷史紀錄
- 不要刪除 mock provider
- 不要刪除 prompt-preview / json-preview
- 不要把正式產品流程完全綁死在 Gemini

---

## 一、階段目標

建立一個獨立的 Gemini PoC 測試流程，用來回答這個問題：

> Gemini 是否能穩定產出符合 MockReport type 的副業點子冷靜評估 JSON 報告？

但這一階段先以「完成框架」為主。

如果 `GEMINI_API_KEY` 尚未設定，系統應該：

1. 正常啟動
2. `/gemini-poc` 頁面正常開啟
3. 表單正常顯示
4. 點擊測試按鈕時顯示「尚未設定 Gemini API Key」的友善錯誤
5. README 清楚說明我之後要怎麼補上 API Key

---

## 二、重要安全原則

Gemini API Key 不可以放在前端。

請不要把 Gemini API Key 寫進：

- React component
- Vite 前端環境變數
- GitHub
- 前端 bundle
- localStorage
- README 的真實範例
- 程式碼註解中的真實 key

API Key 只能放在後端環境變數。

正確流程應該是：

```text
前端
→ 自己的後端 API / serverless function
→ Gemini API
```

錯誤流程：

```text
前端
→ Gemini API
```

---

## 三、環境變數

請新增或更新：

```text
.env.example
```

加入：

```env
AI_PROVIDER=mock

# Gemini PoC
# 先留空，之後由我自行申請 Gemini API Key 後填入 .env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# 開發工具入口
VITE_SHOW_DEV_TOOLS=true
```

請注意：

- `.env.example` 只放空值，不要填入任何真實 API Key
- 不要建立含有真實 key 的 `.env`
- 不要要求我現在提供 API Key
- 如果 `.env` 不存在，網站仍應該可以正常啟動 mock / demo 功能
- 如果 `GEMINI_API_KEY` 沒有設定，只有 Gemini PoC API 呼叫會失敗，其他頁面不能受影響

---

## 四、新增 Gemini Provider

請新增：

```text
src/lib/ai/geminiProvider.ts
```

這個 provider 要符合既有 AI Provider 介面。

目前可能已有：

```ts
export interface AiProvider {
  name: AiProviderName;
  generateReport(input: EvaluationInput): Promise<GenerateReportResult>;
}
```

請讓 `geminiProvider` 實作：

```ts
export const geminiProvider: AiProvider = {
  name: "gemini",
  async generateReport(input) {
    // 使用 Gemini API 產生 report
  }
}
```

但請注意：

- 如果沒有 `GEMINI_API_KEY`，請丟出清楚錯誤
- 錯誤訊息不要暴露任何敏感資訊
- 不要讓整個 app crash

建議錯誤訊息：

```text
尚未設定 GEMINI_API_KEY。請在 .env 中填入 Gemini API Key 後重新啟動開發伺服器。
```

---

## 五、更新 Provider Factory

請修改：

```text
src/lib/ai/getAiProvider.ts
```

讓它支援：

```text
AI_PROVIDER=gemini
```

邏輯：

- `mock`：使用 mock provider
- `gemini`：使用 gemini provider
- 其他 provider 尚未實作時，不要讓整個網站 crash，請回傳清楚錯誤或 fallback 到 mock provider

請保持預設：

```text
AI_PROVIDER=mock
```

也就是：即使我還沒設定 Gemini API Key，網站仍然以 mock provider 正常運作。

---

## 六、建立 Gemini API 呼叫邏輯

請建立 Gemini API 呼叫邏輯。

如果專案已經有後端 API route，請建立：

```text
POST /api/gemini-poc
```

或：

```text
POST /api/evaluate-gemini
```

如果目前沒有後端，請用最小可行方式建立本機可測的 server / serverless function。

請不要讓前端直接呼叫 Gemini。

Request body：

```json
{
  "idea": "我想做一個 AI 寵物飼料分析推薦網站",
  "availableTime": "下班後每天 1～2 小時，週末半天",
  "avoidThings": "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料"
}
```

Response success：

```json
{
  "ok": true,
  "rawText": "Gemini 原始回應文字",
  "report": {},
  "warnings": [],
  "provider": "gemini",
  "model": "gemini-2.5-flash"
}
```

Response error：

```json
{
  "ok": false,
  "error": "錯誤訊息",
  "details": []
}
```

如果 `GEMINI_API_KEY` 尚未設定，response error 請回傳：

```json
{
  "ok": false,
  "error": "尚未設定 GEMINI_API_KEY。請在 .env 中填入 Gemini API Key 後重新啟動開發伺服器。",
  "details": []
}
```

---

## 七、優先測 Structured Output，但要允許先完成骨架

Gemini PoC 請優先預留 structured output / response schema。

目標是讓 Gemini 盡量直接產出符合 `MockReport` 的 JSON。

請建立一份對應 `MockReport` 的 response schema。

可以新增：

```text
src/lib/ai/reportSchema.ts
```

schema 內容應對應目前報告資料結構：

```ts
{
  id: string;
  title: string;
  score: number;
  scoreLabel: string;
  summary: string;
  dimensions: {
    name: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
  oneSentenceVerdict: string;
  strengths: string[];
  risks: string[];
  fatalWarnings: string[];
  productShape: {
    format: string;
    userFlow: string[];
    userSees: string[];
    firstVersionLook: string[];
  };
  dontBuild: string[];
  pricingSuggestion: string;
  validationPlan: {
    day: string;
    task: string;
  }[];
}
```

注意：

- `dimensions` 必須剛好 7 項
- `validationPlan` 必須剛好 7 項
- `productShape.userFlow` 至少 4 項
- `productShape.userSees` 至少 5 項
- `productShape.firstVersionLook` 至少 4 項
- `dontBuild` 至少 3 項

如果 Gemini 的 schema 語法或目前 SDK 串接尚未完全確認，可以先建立 schema 檔與註解，讓後續補 API Key 後再實測調整。

但請不要因此阻塞整個專案 build。

---

## 八、保留 extract / validate / normalize 流程

即使使用 Gemini structured output，也請保留既有防呆流程：

1. 取得 Gemini 原始回應
2. 使用 `extractJsonFromAiText`
3. 使用 `validateReportData`
4. 如果只有 warning，允許通過
5. 使用 `normalizeReportData`
6. 回傳 normalized report

不要因為 structured output 就跳過驗證。

如果沒有 API Key，此流程不會真的執行，但相關程式架構要先預留好。

---

## 九、新增 Gemini PoC 測試頁

請新增一個開發用頁面：

```text
/gemini-poc
```

這個頁面只做測試，不是正式產品頁。

頁面標題：

```text
Gemini PoC
```

頁面說明：

```text
這是開發測試頁，用來測試 Gemini 是否能穩定產出符合報告格式的 JSON。
```

請在頁面上方加一個提示：

```text
如果尚未設定 GEMINI_API_KEY，本頁可以先檢查 PoC 介面與流程；實際呼叫 Gemini 需要事後在 .env 補上 API Key。
```

---

## 十、Gemini PoC 頁面功能

`/gemini-poc` 頁面請包含：

### 1. 測試輸入表單

欄位沿用正式輸入頁三個欄位：

- 你的副業點子是什麼？
- 你能投入多少時間？
- 你不想做哪些事？

預設 sample input：

```json
{
  "idea": "我想做一個 AI 寵物飼料分析推薦網站",
  "availableTime": "下班後每天 1～2 小時，週末半天",
  "avoidThings": "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料"
}
```

### 2. 呼叫 Gemini 按鈕

按鈕文字：

```text
測試 Gemini 產生報告
```

點擊後：

- 呼叫後端 Gemini PoC API
- 顯示 loading 狀態
- 禁用按鈕避免重複送出

loading 文案：

```text
正在呼叫 Gemini 測試報告產出...
```

如果沒有 API Key，請顯示清楚錯誤：

```text
尚未設定 GEMINI_API_KEY。請在 .env 中填入 Gemini API Key 後重新啟動開發伺服器。
```

### 3. 原始回應區

如果有成功呼叫 Gemini，顯示 Gemini 的 rawText。

標題：

```text
Gemini 原始回應
```

目的：

- 方便 debug
- 看 Gemini 是否有多餘文字
- 看是否真的回 JSON

如果尚未呼叫成功，可以顯示：

```text
尚無 Gemini 原始回應。
```

### 4. 驗證結果區

成功呼叫後顯示：

- 是否 JSON parse 成功
- validate errors
- validate warnings
- 是否有 normalize 修正
- 最終 score
- scoreLabel

如果尚未設定 API Key，不需要顯示假驗證結果，只要顯示錯誤即可。

### 5. 預覽報告按鈕

如果驗證通過，提供按鈕：

```text
預覽 Gemini 報告
```

點擊後：

1. 將 normalized report 存入 localStorage key：

```text
generatedReportPreview
```

2. 導向：

```text
/report/generated-preview
```

### 6. 複製 JSON 按鈕

如果有 normalized report，提供：

```text
複製 normalized JSON
```

方便貼到 `/json-preview` 或留存測試結果。

---

## 十一、測試題組

請在 `/gemini-poc` 頁面提供三個快速載入按鈕：

### 測試題 1：寵物飼料分析網站

```json
{
  "idea": "我想做一個 AI 寵物飼料分析推薦網站",
  "availableTime": "下班後每天 1～2 小時，週末半天",
  "avoidThings": "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料"
}
```

### 測試題 2：AI 寵物監控摘要

```json
{
  "idea": "我想做一個 AI 寵物監控摘要工具，可以分析家用監視器影片，讓飼主知道寵物什麼時候尿尿、便便、焦慮或破壞家具",
  "availableTime": "下班後每天 1～2 小時",
  "avoidThings": "不想處理複雜安裝、不想長期維護影像資料、不想碰第三方平台違規串接"
}
```

### 測試題 3：AI 副業啟動包

```json
{
  "idea": "我想做一套 AI 副業啟動包，包含 Notion 主控台、Google Sheet 評分器、Prompt 工作流與 14 天行動清單",
  "availableTime": "下班後每天 1～2 小時，假日可以整理內容",
  "avoidThings": "不想做大量客服、不想客製化服務、不想長期人工維護資料"
}
```

---

## 十二、更新開發工具導覽

如果目前已有 `VITE_SHOW_DEV_TOOLS=true` 才顯示開發工具，請在開發工具區新增：

```text
Gemini PoC
```

連到：

```text
/gemini-poc
```

如果 `VITE_SHOW_DEV_TOOLS=false`，不要在主要導覽顯示。

路由仍可直接輸入網址進入。

---

## 十三、README 更新

請更新 README，加入：

```md
## Gemini PoC

本專案保留 `/gemini-poc` 作為 Gemini API 測試頁。

目前 Gemini API Key 可以先不填，PoC 介面與框架仍可先完成。

### 使用方式

1. 複製 `.env.example` 為 `.env`
2. 先不填 `GEMINI_API_KEY` 也可以啟動專案
3. 前往 `/gemini-poc` 檢查頁面是否正常
4. 之後自行申請 Gemini API Key
5. 在 `.env` 填入：

```env
GEMINI_API_KEY=你的 Gemini API Key
GEMINI_MODEL=gemini-2.5-flash
AI_PROVIDER=gemini
VITE_SHOW_DEV_TOOLS=true
```

6. 重新啟動開發伺服器
7. 回到 `/gemini-poc`
8. 使用三組固定測試題測試 Gemini 是否能產出合法報告 JSON

### 注意

- Gemini API Key 不可放在前端
- 不要使用 `VITE_GEMINI_API_KEY`
- `/gemini-poc` 是開發測試頁，不是正式產品流程
- 測試重點是 JSON 穩定度與報告品質，不是單純能不能回答
```

請注意 README 內不要填入任何真實 API Key。

---

## 十四、錯誤處理

請處理以下錯誤：

1. 沒有設定 `GEMINI_API_KEY`
2. Gemini API 呼叫失敗
3. Gemini 回傳不是 JSON
4. `extractJsonFromAiText` 失敗
5. `validateReportData` 有 errors
6. 只有 warnings 時允許繼續，但要顯示 warnings
7. `normalizeReportData` 修正 score 時要顯示提示
8. 前端 fetch 失敗
9. localStorage 寫入失敗

錯誤訊息要清楚，但不要暴露 API key 或內部敏感資訊。

---

## 十五、這次不要做的事

請不要：

- 不要要求我現在提供 Gemini API Key
- 不要把正式 `/evaluate` 預設切到 Gemini
- 不要刪除 mock provider
- 不要刪除 mock reports
- 不要刪除 `/prompt-preview`
- 不要刪除 `/json-preview`
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增使用者報告歷史紀錄
- 不要把 API key 寫到前端
- 不要把 API key 寫進 git
- 不要因為 API Key 尚未設定就讓 build 失敗

這次只做：

> Gemini API PoC 框架，API Key 由我事後自行補上。

---

## 十六、完成後請回報

完成後請回報：

1. 新增或修改了哪些檔案
2. Gemini provider 放在哪裡
3. Gemini PoC API endpoint 是什麼
4. `/gemini-poc` 如何使用
5. `GEMINI_API_KEY` 要放在哪裡
6. API Key 尚未設定時會出現什麼提示
7. 是否使用 structured output / response schema，或是否先預留 schema
8. Gemini 回傳後是否仍會經過 extract / validate / normalize
9. 三組測試題是否可快速載入
10. build 是否通過
11. 如何在尚未填入 API Key 的情況下啟動與驗證
12. 之後我補上 API Key 後，如何測試真實 Gemini 回應

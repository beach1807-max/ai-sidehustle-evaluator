# Codex 提示詞：新增 Cloudflare Pages Function `/api/evaluate`

目前專案「副業點子冷靜評分器」已完成 A 階段：

- `/evaluate` 已接 `evaluateWithProvider`
- `AI_PROVIDER=mock` / `AI_PROVIDER=gemini` 可切換
- `/report/generated-preview` 可顯示 generated report
- Gemini PoC 第三輪通過
- 公開 Demo 文案已整理
- dev tools 入口已由 `VITE_SHOW_DEV_TOOLS` 控制

但 Cloudflare Pages 部署前檢查發現阻塞問題：

```text
缺少 Cloudflare Pages Function /api/evaluate。
```

目前 `/api/evaluate` 很可能只存在於 `vite.config.ts` 的 dev middleware，或只在本機 dev server 可用。

這代表：

```text
本機 /evaluate 可用，不代表部署到 Cloudflare Pages 後可用。
```

現在要做的是：

> 新增 Cloudflare Pages Function `functions/api/evaluate.ts`，把目前本機 dev middleware 的 `/api/evaluate` 邏輯搬到 Cloudflare Pages 可執行的 serverless route。

---

## 一、重要目標

完成後線上流程應該是：

```text
前端 /evaluate
→ POST /api/evaluate
→ Cloudflare Pages Function functions/api/evaluate.ts
→ 從 server-side env 讀 AI_PROVIDER / GEMINI_API_KEY / GEMINI_MODEL
→ 呼叫 Gemini 或 Mock provider
→ validate / normalize report
→ 回傳 JSON 給前端
→ 前端存 generated report
→ 導向 /report/generated-preview
```

重要：

```text
瀏覽器前端不能直接呼叫 Gemini API。
GEMINI_API_KEY 只能在 Cloudflare Pages Function / server-side 使用。
```

---

## 二、這次不要做的事

請不要：

- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增會員系統
- 不要新增後台
- 不要刪除 mock provider
- 不要刪除 Gemini provider
- 不要刪除 `/gemini-poc`
- 不要刪除 `/json-preview`
- 不要刪除 `/prompt-preview`
- 不要把 API Key 寫進前端
- 不要新增 `VITE_GEMINI_API_KEY`
- 不要把 `.env` commit
- 不要直接部署
- 不要直接 push
- 不要重寫整個 AI provider 架構

這次只做：

> 補 Cloudflare Pages Function `/api/evaluate`，讓線上 Cloudflare Pages 部署可安全呼叫 Gemini。

---

## 三、先檢查目前 `/api/evaluate` 來源

請先搜尋專案中目前 `/api/evaluate` 的實作與呼叫位置。

請檢查：

```text
vite.config.ts
vite.config.js
src/pages/EvaluatePage.tsx
src/lib/ai/evaluateWithProvider.ts
src/lib/ai/geminiProvider.ts
src/lib/ai/mockProvider.ts
src/lib/ai/getAiProvider.ts
src/lib/validateReport.ts
```

請確認：

1. `/evaluate` 前端目前 POST 到哪個 endpoint
2. `vite.config.ts` 是否有 dev middleware 處理 `/api/evaluate`
3. dev middleware 的 request / response 格式
4. provider 回傳格式是什麼
5. 錯誤格式是什麼
6. localStorage generated report key 是什麼

不要猜，請以現有程式碼為準。

---

## 四、新增 Cloudflare Pages Function

請新增：

```text
functions/api/evaluate.ts
```

此檔案應支援：

```text
POST /api/evaluate
```

Cloudflare Pages Function 形式可使用：

```ts
export async function onRequestPost(context) {
  const { request, env } = context;
  // ...
}
```

如果專案 TypeScript 設定需要型別，可適度補型別，但不要引入過重依賴。

---

## 五、Function request body 格式

請讓 `functions/api/evaluate.ts` 接收與目前前端 `/evaluate` 相同的 input。

預期 body：

```json
{
  "idea": "副業點子",
  "availableTime": "可投入時間",
  "avoidThings": "不想做的事情"
}
```

請驗證必要欄位：

- `idea`
- `availableTime`
- `avoidThings`

如果缺少欄位，回傳：

```json
{
  "ok": false,
  "error": "缺少必要輸入欄位。",
  "code": "INVALID_INPUT",
  "retryable": false,
  "details": []
}
```

HTTP status 可用 `400`。

不要讓空 input 直接打 Gemini。

---

## 六、Function env 讀取

Cloudflare Pages Function 應從 `context.env` 讀：

```text
AI_PROVIDER
GEMINI_API_KEY
GEMINI_MODEL
```

Production 預期：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<Cloudflare Pages 後台設定>
GEMINI_MODEL=gemini-2.5-flash
```

Preview / fallback 可用：

```env
AI_PROVIDER=mock
```

請注意：

- 不要使用 `process.env` 作為 Cloudflare Pages Function 唯一來源
- 如果現有 provider 只讀 `process.env`，請調整成可注入 env
- 不要把 API Key 傳到前端
- 不要 log API Key

建議做法：

```ts
const providerName = env.AI_PROVIDER || "mock";
const apiKey = env.GEMINI_API_KEY;
const model = env.GEMINI_MODEL || "gemini-2.5-flash";
```

---

## 七、讓 provider 支援 Cloudflare env

如果目前 `geminiProvider.ts` 只從 `process.env.GEMINI_API_KEY` 讀 key，請調整為可接受 env 參數。

目標是同時支援：

1. 本機 dev middleware
2. Cloudflare Pages Function
3. 未來其他 server-side runtime

可以採用其中一種方式：

### 方式 A：evaluateWithProvider 支援 env 參數

例如：

```ts
evaluateWithProvider(input, {
  env: {
    AI_PROVIDER,
    GEMINI_API_KEY,
    GEMINI_MODEL
  }
})
```

### 方式 B：getAiProvider 支援 env 參數

例如：

```ts
getAiProvider(env)
```

### 方式 C：新增 server 專用 helper

例如：

```ts
evaluateWithProviderServer(input, env)
```

請選擇對現有架構影響最小的方式。

不要大改整個 provider 架構。

---

## 八、避免 Node-only API

Cloudflare Pages Function runtime 與 Node.js 不完全相同。

請檢查 `geminiProvider.ts` 或相關 helper 是否使用 Node-only API，例如：

```text
fs
path
Buffer
process 作為唯一 env 來源
Node stream
```

如果有，請改成 Cloudflare runtime 可用的寫法。

一般可使用：

```text
fetch
Request
Response
crypto
```

Gemini API 呼叫建議使用 `fetch`。

---

## 九、回傳格式

Function 成功時，請回傳與目前前端期待一致的格式。

建議格式：

```json
{
  "ok": true,
  "report": {},
  "warnings": []
}
```

失敗時：

```json
{
  "ok": false,
  "error": "AI 報告產生失敗，請稍後重試。",
  "code": "AI_PROVIDER_ERROR",
  "retryable": true,
  "details": []
}
```

請保留既有錯誤 code：

```text
GEMINI_RATE_LIMITED
GEMINI_TEMPORARY_ERROR
INVALID_INPUT
AI_PROVIDER_ERROR
```

不要把 Gemini 原始錯誤完整暴露給前端。

可以把簡短 debug 訊息留在 server log，但不要含 API Key。

---

## 十、HTTP method 處理

如果不是 POST，請回傳：

```json
{
  "ok": false,
  "error": "Method not allowed",
  "code": "METHOD_NOT_ALLOWED",
  "retryable": false,
  "details": []
}
```

HTTP status 可用 `405`。

如果只 export `onRequestPost`，Cloudflare 對其他 method 可能自然 405；但最好確認行為。

---

## 十一、前端 endpoint 檢查

請確認 `/evaluate` 前端送出時呼叫的是：

```text
/api/evaluate
```

不要呼叫：

```text
http://localhost:xxxx/api/evaluate
```

也不要呼叫 Gemini 官方 API URL。

正確：

```ts
fetch("/api/evaluate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input)
})
```

前端不得包含 `GEMINI_API_KEY`。

---

## 十二、保留本機開發可用

新增 Cloudflare Pages Function 後，請確認本機開發仍可用。

可能有兩種情境：

### 情境 A：本機仍靠 vite.config.ts dev middleware

可以先保留 dev middleware，不要急著刪。

但請確保 request / response 格式與 Pages Function 一致。

### 情境 B：改成使用 Cloudflare Pages local dev

如果專案已使用 Wrangler / Pages local dev，也可以補文件說明。

但這次不要強迫引入複雜工具。

原則：

```text
先讓 build 與線上 Cloudflare Pages Function 可行。
本機 dev middleware 可以暫時保留。
```

---

## 十三、public/_redirects 檢查

如果前一次部署前檢查已發現需要 SPA fallback，請確認存在：

```text
public/_redirects
```

內容：

```text
/* /index.html 200
```

build 後應產生：

```text
dist/_redirects
```

如果已存在，不要重複新增。

---

## 十四、環境變數文件更新

請更新 README 或 docs，補充 Cloudflare Pages Function 需要的 Production env vars：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<Cloudflare Pages 後台設定，不要寫入 repo>
GEMINI_MODEL=gemini-2.5-flash
VITE_SHOW_DEV_TOOLS=false
```

Preview env vars 建議：

```env
AI_PROVIDER=mock
VITE_SHOW_DEV_TOOLS=true
```

請明確寫：

```text
GEMINI_API_KEY 不可使用 VITE_ 前綴，否則會暴露到前端。
```

---

## 十五、部署前檢查文件更新

如果已有部署前檢查文件，請更新其中 `/api/evaluate` 的狀態。

例如：

```text
/api/evaluate Cloudflare Pages Function：已新增 functions/api/evaluate.ts
線上部署不再依賴 vite dev middleware
```

如果沒有文件，可以新增：

```text
docs/cloudflare-pages-predeploy-check.md
```

內容包含：

1. build 狀態
2. dist 狀態
3. env 安全狀態
4. API route 狀態
5. `_redirects` 狀態
6. dev tools 狀態
7. 部署設定建議

---

## 十六、測試與驗證

完成後請執行：

```bash
npm run build
```

確認：

```text
dist/
dist/index.html
```

如果有 `public/_redirects`，確認：

```text
dist/_redirects
```

如果專案有 lint/test script，可執行，但不要硬跑不存在的指令。

---

## 十七、API route 測試

請測試 `/api/evaluate`。

### 本機測試

如果本機仍透過 dev middleware：

```text
npm run dev
```

測 `/evaluate` 是否能送出。

如果可用 curl，測：

```bash
curl -X POST http://localhost:5173/api/evaluate \
  -H "Content-Type: application/json" \
  -d "{\"idea\":\"AI 寵物飼料分析網站\",\"availableTime\":\"下班後每天 1～2 小時\",\"avoidThings\":\"不想拜訪客戶、不想做客服\"}"
```

Windows PowerShell 可用等效 `Invoke-RestMethod`。

### Cloudflare Function 本機測試

如果專案已有 Wrangler / Pages dev 指令，可以測：

```bash
npx wrangler pages dev dist
```

或專案已有 script。

但不要強迫新增 Wrangler，如果目前專案沒有。

---

## 十八、完成後請回報

完成後請回報：

1. 新增或修改了哪些檔案
2. 是否新增 `functions/api/evaluate.ts`
3. `/api/evaluate` 是否已可在 Cloudflare Pages Function 中執行
4. Function 是否從 `context.env` 讀 `AI_PROVIDER`
5. Function 是否從 `context.env` 讀 `GEMINI_API_KEY`
6. 是否避免使用 `VITE_GEMINI_API_KEY`
7. 前端 `/evaluate` 是否呼叫 `/api/evaluate`
8. 是否仍保留 mock provider
9. 是否仍保留 Gemini provider
10. 是否保留本機 dev middleware，或如何處理
11. 是否確認無 API Key 暴露到前端
12. `public/_redirects` 是否存在
13. `dist/_redirects` 是否存在
14. `npm run build` 是否通過
15. 是否有任何 Cloudflare runtime 相容性問題
16. Cloudflare Pages Production env vars 建議
17. Cloudflare Pages Preview env vars 建議
18. 是否仍有部署前阻塞問題

請用「通過 / 需修正 / 阻塞」分類回報。

請不要輸出 API Key。

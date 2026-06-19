# 副業點子冷靜評分器

## AI Provider 設定

目前專案已完成 Gemini provider PoC 與正式 `/evaluate` AI MVP 流程，預設仍可使用 mock provider。

目前支援的 provider 設計：

- mock：目前預設，使用本地 mock report
- openai：預留，尚未實作
- anthropic：預留，尚未實作
- gemini：已實作，可透過 server side 環境變數啟用

切換 provider 透過後端環境變數 `AI_PROVIDER` 控制。

注意：正式 API key 不可放在前端 `VITE_` 環境變數中。

本機開發透過 Vite dev middleware 提供 `/api/evaluate`；線上部署透過 Cloudflare Pages Function 提供 `/api/evaluate`。

## 開發工具頁面

本專案保留以下開發測試頁：

- `/prompt-preview`：產生給 AI 的 Prompt
- `/json-preview`：貼上 AI 回傳 JSON 並驗證
- `/report/generated-preview`：預覽 generated report

預設不在導覽列顯示開發工具。

若要在導覽列或 Footer 顯示開發工具入口，請設定：

```env
VITE_SHOW_DEV_TOOLS=true
```

正式展示或部署 Mock Demo 時，建議維持：

```env
VITE_SHOW_DEV_TOOLS=false
```

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
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
AI_PROVIDER=gemini
VITE_SHOW_DEV_TOOLS=true
```

6. 在本機 `.env` 補上 Gemini API Key 後，重新啟動開發伺服器
7. 回到 `/gemini-poc`
8. 使用三組固定測試題測試 Gemini 是否能產出合法報告 JSON

### 注意

- Gemini API Key 不可放在前端
- 不要使用 `VITE_GEMINI_API_KEY`
- `/gemini-poc` 是開發測試頁，不是正式產品流程
- 測試重點是 JSON 穩定度與報告品質，不是單純能不能回答

## Gemini PoC 穩定性測試

Gemini API 可呼叫成功後，不應直接切到正式 `/evaluate`。

建議先執行 9 次穩定性測試：

- 寵物飼料分析網站 × 3
- AI 寵物監控摘要 × 3
- AI 副業啟動包 × 3

測試結果請記錄在：

- `docs/gemini-poc-test-plan.md`
- `docs/gemini-poc-test-results.md`

判斷重點：

- JSON 是否穩定
- 是否通過 validate
- 是否需要 normalize
- 報告是否冷靜保守
- productShape 是否具體
- dontBuild 是否有針對性
- 是否避免過度承諾

## Gemini 429 防護與第二輪測試

`/gemini-poc` 已加入 PoC 層級的 Gemini 請求防護與人工複查流程：

- 後端遇到 HTTP 429 或暫時性 5xx 會重試，最多重試 2 次
- 預設退避等待為 2 秒、5 秒，若 Gemini 回傳 `Retry-After` 會優先採用
- 重試後仍為 429 時，API 會回傳友善錯誤碼 `GEMINI_RATE_LIMITED`
- 前端呼叫中會鎖定測試按鈕，避免連續送出
- 每次成功或失敗後會進入 10 秒冷卻
- 遇到 429 時，頁面會提示 Free Tier 或短時間多次呼叫可能造成限制
- 成功產出報告後，頁面會顯示人工內容複查欄位
- 測試紀錄輔助可複製包含技術結果與人工複查結果的 Markdown

第二輪測試請使用：

- 測試計畫：`docs/gemini-poc-test-plan.md`
- 測試結果：`docs/gemini-poc-test-results.md`

## Gemini Schema 對齊與 Temporary Error Fallback

第二輪 Gemini PoC 測試後，主要問題不再是 429，而是：

- Schema / validate 不一致，例如 `pricingTiers 必須是 array`
- `GEMINI_TEMPORARY_ERROR` retry 後仍失敗

Stage 13 修正重點：

- 對齊 MockReport type、Gemini response schema、validateReportData、buildEvaluationPrompt
- 釐清 pricingTiers 是否為必要欄位
- 強化所有 array 欄位要求
- temporary error 時顯示友善錯誤
- 保留使用者輸入
- 提供「複製 Prompt，改用手動測試」fallback
- 保留 10 秒 cooldown

使用者已開啟 Gemini 付費，PoC 測試費用暫不作為主要限制，但正式產品仍需要 retry、cooldown、錯誤提示與 fallback。

## AI MVP 模式

目前 `/evaluate` 可透過 `AI_PROVIDER` 切換 provider。

### 使用 Mock Provider

```env
AI_PROVIDER=mock
```

用途：

- UI 開發
- Demo 展示
- 不消耗 Gemini API
- Gemini 失敗時 fallback

### 使用 Gemini Provider

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

注意：

- `GEMINI_API_KEY` 只能放在 server side `.env`
- 不要使用 `VITE_GEMINI_API_KEY`
- 不要 commit `.env`
- `.env.example` 不應包含真實 key

### 正式 AI MVP 流程

```text
/evaluate
→ /api/evaluate
→ Cloudflare Pages Function 或本機 dev middleware
→ server side evaluateWithProvider(input)
→ Gemini 或 Mock provider
→ validate / normalize report
→ localStorage generated report
→ /report/generated-preview
```

### Fallback

如果 Gemini 失敗：

- 可改用 Mock 報告預覽
- 可複製 Prompt 手動測試
- 可前往 JSON Preview 貼上手動 JSON

Gemini 已可作為正式 provider 候選。目前 PoC 測試 9 次成本估算約 1.5 台幣，費用暫不作為主要限制。但正式公開前仍需保留 cooldown、錯誤提示、fallback 與使用限制，避免重複送出造成不必要成本。

## Cloudflare Pages Function

線上部署使用：

```text
functions/api/evaluate.ts
```

`/evaluate` 前端會 POST 到 `/api/evaluate`。Cloudflare Pages Function 會從 `context.env` 讀取：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
VITE_SHOW_DEV_TOOLS=false
```

Preview 環境可使用：

```env
AI_PROVIDER=mock
VITE_SHOW_DEV_TOOLS=true
```

`GEMINI_API_KEY` 不可使用 `VITE_` 前綴，否則會暴露到前端 bundle。

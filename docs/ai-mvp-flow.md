# AI MVP Flow

## 目的

本階段讓 `/evaluate` 進入 AI 測試版流程，但仍保留 mock provider、開發工具與手動 fallback。這適合小流量外部測試，不是正式收費版。

## Provider 流程

`/evaluate` 送出三個欄位：

- 副業點子
- 可投入時間
- 不想做的事情

前端會呼叫 server side `/api/evaluate`，由 server 端執行 `evaluateWithProvider(input)`。

```text
/evaluate
→ /api/evaluate
→ evaluateWithProvider(input)
→ getAiProvider()
→ mock 或 gemini
→ validate / normalize report
→ localStorage generated report
→ /report/generated-preview
```

## Provider 設定

### Mock

```env
AI_PROVIDER=mock
```

用途：

- UI 開發
- Demo 展示
- 不消耗 Gemini API
- Gemini 失敗時備援

### Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_API_KEY` 只放在 server side `.env`，不要使用 `VITE_GEMINI_API_KEY`。

## 成功狀態

AI 或 mock provider 成功後：

1. 回傳 `report` 與 `warnings`
2. report 存入 `localStorage.generatedReportPreview`
3. report source 存入 `localStorage.generatedReportPreviewSource`
4. 導向 `/report/generated-preview`

## 失敗 Fallback

Gemini 或 provider 失敗時：

- 表單內容保留
- 顯示友善錯誤
- 可改用 Mock 報告預覽
- 可複製 Prompt，改用 ChatGPT / Gemini 網頁版手動測試
- 可前往 `/json-preview` 貼上手動 JSON

## Dev Tools

以下頁面保留，但一般導覽不顯示：

- `/gemini-poc`
- `/json-preview`
- `/prompt-preview`
- `/report/generated-preview`

只有 `VITE_SHOW_DEV_TOOLS=true` 時，導覽與 footer 會顯示開發工具入口。

## 尚未包含

本階段不做：

- 登入
- 付款
- 資料庫
- 正式使用者報告歷史
- 會員系統
- 後台

## 風險提醒

AI 報告只適合做副業規劃與 MVP 驗證參考，不保證市場需求、收入結果、法律合規或平台審核結果。

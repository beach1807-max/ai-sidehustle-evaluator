# 新增 Deep Report 開發者工具：手動 Prompt / JSON Preview 流程

## 任務目標

新增一個開發者工具流程，讓我可以在不消耗 Gemini API 的情況下測試 Deep Report。

目標流程：

```text
使用者輸入副業點子
→ 網站產生完整 Deep Report Prompt
→ 使用者複製 Prompt 到 ChatGPT
→ ChatGPT 回傳 JSON
→ 使用者貼回 JSON Preview
→ 網站驗證 JSON
→ 通過後渲染成完整 Deep Report
```

這個功能僅供開發者測試使用，不對一般使用者開放。

---

## 功能需求

### 1. 新增 Deep Report Prompt Preview

新增頁面或區塊：

```text
/deep-report-prompt-preview
```

功能：

* 可輸入副業點子
* 可輸入可投入時間
* 可輸入不想做的事情
* 點擊後產生完整 Deep Report Prompt
* Prompt 必須使用目前 `deepReportPrompt.ts` 的邏輯
* 顯示完整 Prompt
* 提供「複製 Prompt」按鈕

---

### 2. 新增 Deep Report JSON Preview

新增頁面或區塊：

```text
/deep-report-json-preview
```

功能：

* 提供 textarea，讓我貼上 ChatGPT 回傳的 JSON
* 使用現有 Deep Report schema / validator 驗證
* 驗證通過後，使用現有 DeepReportView 渲染完整報告
* 驗證失敗時，顯示錯誤訊息
* 不呼叫 Gemini API

---

### 3. 必須重用現有邏輯

請盡量重用：

```text
src/lib/deepReportPrompt.ts
src/lib/validateDeepReport.ts
src/components/DeepReportView.tsx
src/lib/ai/reportSchema.ts
```

避免建立兩套不同 schema。

---

## 開發者工具控制

此功能只在以下環境變數為 true 時顯示：

```env
VITE_SHOW_DEV_TOOLS=true
```

如果目前已有 dev tools 控制邏輯，請沿用既有邏輯。

正式使用者不應該在導航列看到此工具。

---

## 導航列

如果 `VITE_SHOW_DEV_TOOLS=true`，導航列可顯示：

```text
Deep Prompt Preview
Deep JSON Preview
```

如果不是 true，完全隱藏。

---

## 禁止事項

不要新增：

* 金流
* 登入
* 會員
* 資料庫
* Email
* 使用次數限制
* 新 API route
* Gemini API 呼叫

---

## 驗收標準

完成後需符合：

```text
1. 可輸入副業點子並產生 Deep Report Prompt
2. 可複製 Prompt
3. 可將 ChatGPT 回傳 JSON 貼回網站
4. JSON 驗證通過後可渲染 Deep Report
5. JSON 驗證失敗時有錯誤提示
6. 全流程不呼叫 Gemini API
7. VITE_SHOW_DEV_TOOLS=false 時工具不顯示
8. npm run build 或 tsc -b + vite build 通過
```

---

## Commit

完成後請回報：

* 修改檔案
* 新增頁面
* 是否有重用現有 validator
* 是否完全不呼叫 Gemini API
* build 結果

不要 commit。
不要 push。

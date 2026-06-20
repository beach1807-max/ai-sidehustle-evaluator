# 第 2 階段：深度報告引擎（Deep Report）實作提示詞

## 任務目標

在不影響現有免費版功能的前提下，新增 Deep Report 能力。

此階段僅供開發與測試使用。

不要實作：

- 金流
- 會員
- 登入
- 資料庫
- Email
- 使用次數限制

---

## 目標成果

系統支援兩種模式：

```json
{
  "mode": "free"
}
```

```json
{
  "mode": "deep"
}
```

free 維持現有功能。

deep 產生完整深度報告。

---

## API 設計

不要新增 API Route。

沿用既有 evaluate API。

新增 mode 參數：

```ts
type ReportMode = "free" | "deep";
```

---

## Deep Report 內容

Deep Report 必須輸出以下區塊。

### 1. MVP 可行性分析

包含：

- 是否適合一人開發
- 預估開發時間
- 主要風險
- 是否建議執行

---

### 2. MVP 功能清單

包含：

- 必做功能
- 延後功能
- 不建議功能

---

### 3. 7 天行動計畫

輸出：

- Day1
- Day2
- Day3
- Day4
- Day5
- Day6
- Day7

---

### 4. AI Agent MVP 啟動包

這是 Deep Report 核心價值。

內容包含：

- 產品目標
- 目標客群
- MVP 功能需求
- 頁面需求
- UI需求
- 資料結構
- 技術限制
- 驗收條件

要求產出內容可直接提供給：

- ChatGPT Agent
- Codex
- Claude Code
- Cursor
- Gemini CLI

作為 MVP 開發起點。

目標是能產出第一版網站框架。

---

### 5. 首頁銷售文案

包含：

- 主標題
- 副標題
- 功能特色
- CTA 文案

---

### 6. 第一版收費建議

包含：

- 免費方案
- 單次收費建議
- 未來訂閱制建議

---

### 7. 獲客建議

包含：

- 第一批用戶來源
- 適合的平台
- 低成本推廣方式

---

### 8. MVP 瘦身方案

包含：

- 若只有 7 天可開發
- 應刪除哪些功能
- 保留哪些功能

---

## Gemini Prompt

建立專屬 Deep Report Prompt。

要求模型：

- 冷靜
- 務實
- 保守
- 以一人副業開發者為前提

避免：

- 畫大餅
- 鼓勵創業
- 不切實際建議

---

## 回傳格式

禁止 Markdown。

必須回傳固定 JSON。

範例：

```json
{
  "feasibility": {},
  "mvpFeatures": {},
  "sevenDayPlan": {},
  "agentMvpKit": {},
  "landingPageCopy": {},
  "pricing": {},
  "acquisition": {},
  "mvpReduction": {}
}
```

---

## 前端顯示

新增 Deep Report Result View。

以卡片區塊呈現：

- MVP 可行性分析
- MVP 功能清單
- 7 天行動計畫
- AI Agent MVP 啟動包
- 首頁銷售文案
- 收費建議
- 獲客建議
- MVP 瘦身方案

---

## 開發者模式

新增環境變數：

```env
VITE_ENABLE_DEEP_REPORT=true
```

只有啟用時顯示：

```text
產生深度報告
```

一般使用者不可見。

---

## 驗收標準

完成後必須符合：

- 免費版功能正常
- Deep Mode 可正常運作
- Deep Report 成功產出 JSON
- 前端可顯示所有區塊
- 不影響既有分析流程
- 不新增金流相關功能

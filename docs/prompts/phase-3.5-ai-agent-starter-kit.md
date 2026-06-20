# 第 3.5 階段：AI Agent 開工包

## 背景

目前 Deep Report 已能產出：

* MVP 可行性分析
* MVP 功能清單
* 7 天行動計畫
* AI Agent MVP 啟動包
* 收費建議
* 獲客建議
* AI Agent 執行策略

但使用者看完後仍不清楚：

```text
我要複製哪一段給 AI Agent？
```

因此需要新增：

```text
AI Agent 開工包
```

讓使用者直接取得一份完整、可複製、可立即開發的 Prompt。

---

## 任務目標

新增：

```text
🚀 AI Agent 開工包
```

按鈕。

讓使用者不需要自行整理 Deep Report。

系統自動組合出完整開發 Prompt。

---

## 使用者流程

```text
使用者輸入副業點子
↓
產生 Deep Report
↓
點擊「AI Agent 開工包」
↓
進入開工包頁面
↓
查看完整 Prompt
↓
點擊「複製全部」
↓
貼到任何 AI Agent
↓
開始開發
```

---

## UI 新增

在 Deep Report 頁面新增：

```text
🚀 AI Agent 開工包
```

按鈕。

建議放在：

```text
AI Agent MVP 啟動包
```

區塊附近。

並設計成主要 CTA。

---

## 新頁面

新增：

```text
/agent-starter-kit
```

或其他適合的路由。

---

## 頁面內容

標題：

```text
AI Agent 開工包
```

說明：

```text
複製以下內容並貼到你使用的 AI Agent。

系統已自動整理產品需求、功能規格與開發步驟。
```

---

## 頁面功能

### 1. 顯示完整 Prompt

大型文字區塊。

支援：

* 滾動
* 選取
* 複製

---

### 2. 複製全部按鈕

按鈕：

```text
複製全部
```

功能：

直接複製完整 Prompt。

---

### 3. 返回按鈕

按鈕：

```text
返回深度報告
```

---

## Prompt 組成規則

系統自動整合 Deep Report 內容。

至少包含：

### 產品目標

### 目標客群

### MVP 功能需求

### 頁面需求

### UI需求

### 資料結構

### 技術限制

### 建議檔案結構

### 開發任務拆解

### 驗收條件

### MVP 瘦身方案

### 不要做的功能

---

## Prompt 開頭格式

固定格式：

```text
你是一位資深全端工程師與產品工程師。

請根據以下規格建立 MVP。

要求：

- 優先使用 React + Vite
- 優先使用 Cloudflare Pages
- 保持架構簡單
- 避免過度設計
- 不要加入未被要求的功能
- 不要新增會員系統
- 不要新增資料庫
- 不要新增金流

請先完成 MVP，再考慮擴充功能。
```

後面接續產品內容。

---

## 不要區分模型

禁止：

```text
Codex Prompt

Claude Prompt

Cursor Prompt

ChatGPT Prompt
```

只保留：

```text
AI Agent Prompt
```

一份即可。

---

## 資料來源

優先使用現有 Deep Report 資料。

不要重新生成第二份內容。

避免資料重複。

---

## JSON Schema

如果需要：

新增：

```json
{
  "agentStarterKit": {}
}
```

或等效結構。

保持向下相容。

禁止破壞現有 Deep Report。

---

## 驗收標準

測試：

```text
寵物飼料分析
AI 漫畫平台
AI 文字辨識工具
```

確認：

* AI Agent 開工包內容不同
* Prompt 可直接複製
* Prompt 可直接貼給 AI Agent
* 不需要手動整理內容
* Deep Report 功能正常

---

## 完成標準

完成後：

```text
使用者輸入點子
↓
得到 Deep Report
↓
點擊 AI Agent 開工包
↓
複製全部
↓
貼到 AI Agent
↓
開始開發
```

不需要思考：

「我要複製哪一段」。

---

## Commit

完成後：

git add .

git commit -m "feat: add ai agent starter kit"

不要 push。

請回報：

* 修改檔案
* 新增頁面
* Prompt 組成方式
* Build 結果
* 是否破壞既有 Deep Report

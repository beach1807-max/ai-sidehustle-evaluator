# Deep Report 驗證流程強化

## 背景

目前 Deep Report 已支援：

* Gemini 動態產生報告
* JSON Preview 驗證
* Deep Report 渲染

但實際測試發現：

```text
使用者從 ChatGPT
Claude
Gemini
Perplexity

複製內容貼回 JSON Preview 時

容易驗證失敗
```

常見原因：

```text
1. Prompt 輸出不夠嚴格
2. AI 回傳 Markdown
3. AI 回傳說明文字
4. JSON 含跳脫字元
5. Schema 錯誤不易理解
```

導致：

```text
JSON.parse 失敗

Expected ',' or '}'
line 163 column 347
```

一般使用者無法理解。

---

# 任務目標

建立完整 Deep Report 驗證管線：

```text
Prompt 約束
↓
自動清理 JSON
↓
Schema 驗證
↓
使用者可讀錯誤訊息
```

讓使用者即使直接貼上 AI 回覆內容，也能成功驗證與渲染。

---

# 第一層：Prompt 約束

## 修改

deepReportPrompt.ts

---

在 Prompt 中加入：

````text
輸出規則：

1. 只輸出合法 JSON

2. 不要輸出 Markdown

3. 不要輸出 ```json

4. 不要輸出任何解釋文字

5. 第一個字元必須是 {

6. 最後一個字元必須是 }

7. 不要輸出：
   以下是分析結果
   以下為 JSON
   Deep Report

8. 陣列必須使用標準 JSON 格式

9. 禁止輸出：
   \[
   \]

10. 禁止輸出任何 Markdown 跳脫字元
````

---

驗收：

```text
AI 回覆內容直接以 {

開始

以 }

結束
```

---

# 第二層：自動清理 JSON

## 新增

sanitizeJsonInput()

---

流程：

```text
使用者貼上內容
↓
sanitizeJsonInput()
↓
JSON.parse()
```

---

## 自動修正

### 移除

````text
```json
````

---

### 移除

```text
```

````

---

### 修正

```text
\[
````

轉：

```text
[
```

---

### 修正

```text
\]
```

轉：

```text
]
```

---

### 修正

```text
\_
```

轉：

```text
_
```

---

### 擷取 JSON

若內容包含：

```text
以下是分析結果：

{
 ...
}
```

則：

```text
擷取第一個 {

到

最後一個 }
```

作為驗證內容。

---

# 第三層：Schema 驗證

## 重用既有

```text
validateDeepReport.ts

reportSchema.ts
```

---

禁止建立第二套 Schema。

---

驗證：

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

---

## sevenDayPlan

必須：

```text
剛好 7 筆
```

---

# 第四層：使用者可讀錯誤訊息

## 不要顯示

```text
Expected ',' or '}'

JSON parse error

line xxx
```

作為主要錯誤訊息。

---

## 顯示

例如：

```text
無法產生報告

原因：

缺少 pricing 區塊
```

---

例如：

```text
無法產生報告

原因：

sevenDayPlan 必須包含 7 天內容
```

---

例如：

```text
無法產生報告

原因：

agentMvpKit 缺失
```

---

# Deep Report 健康檢查

新增驗證結果區塊：

```text
Deep Report 健康檢查
```

---

範例：

```text
✅ feasibility

✅ mvpFeatures

✅ sevenDayPlan

✅ agentMvpKit

❌ pricing

❌ acquisition
```

---

若有缺失：

```text
無法渲染完整報告

請補齊缺少區塊
```

---

# Debug 區塊

若驗證失敗：

顯示：

```text
清理後 JSON 預覽
```

內容：

```text
前 1000 字
```

方便除錯。

---

# 驗收測試

以下皆應成功：

## Case 1

純 JSON

---

## Case 2

```json
{
 ...
}
```

包裹格式

---

## Case 3

```text
以下是分析結果：

{
 ...
}
```

---

## Case 4

含：

```text
\[
\]
```

---

## Case 5

ChatGPT 回覆

---

## Case 6

Claude 回覆

---

## Case 7

Gemini 回覆

---

# 完成後回報

請回報：

* 修改檔案
* 新增函式
* Prompt 約束內容
* 自動清理規則
* Schema 驗證結果
* 使用者錯誤訊息範例
* Build 結果

不要 commit

不要 push

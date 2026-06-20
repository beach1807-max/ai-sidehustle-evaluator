# 修正 Deep Report JSON Preview 容錯機制

## 問題

目前 Deep Report JSON Preview 過於嚴格。

當使用者從：

* ChatGPT
* Claude
* Gemini
* Perplexity

複製內容貼回網站時，

經常出現：

```text
JSON 格式無法解析
```

實際原因並非內容錯誤，而是 AI 常回傳：

* ```json code block
  ```
* Markdown 格式
* 跳脫字元
* 多餘說明文字

導致 JSON.parse 失敗。

---

## 目標

提升 JSON Preview 容錯能力。

讓一般使用者即使直接複製 AI 回覆內容，也能成功驗證與渲染。

---

## 常見錯誤案例

### Case 1

AI 回傳：

````text
```json
{
  ...
}
```
````

目前會失敗。

應自動移除：

````text
```json
````

以及：

```text
```

````

後再驗證。

---

### Case 2

AI 回傳：

```json
{
  "mainRisks": \[
    "AAA"
  \]
}
````

目前失敗。

應自動轉換：

```json
{
  "mainRisks": [
    "AAA"
  ]
}
```

---

### Case 3

AI 回傳：

```text
以下是分析結果：

{
 ...
}
```

目前失敗。

應嘗試擷取：

```json
{
 ...
}
```

區段再驗證。

---

## 新增 JSON 清理流程

在執行：

```ts
JSON.parse(...)
```

之前先執行：

```ts
sanitizeJsonInput(...)
```

---

## sanitizeJsonInput 功能

### 1

移除：

````text
```json
````

---

### 2

移除：

```text
```

````

---

### 3

修正：

```text
\[
````

轉：

```text
[
```

---

### 4

修正：

```text
\]
```

轉：

```text
]
```

---

### 5

修正：

```text
\_
```

轉：

```text
_
```

---

### 6

若內容包含：

```text
以下是分析結果
```

```text
以下為 JSON
```

```text
Deep Report:
```

等說明文字，

自動嘗試擷取：

```text
第一個 {
到
最後一個 }
```

作為驗證內容。

---

## Debug 區塊

若驗證失敗：

新增：

```text
清理後 JSON 預覽
```

顯示：

```text
前 1000 字
```

方便除錯。

---

## 錯誤訊息優化

目前：

```text
JSON 格式無法解析
```

太模糊。

改為：

````text
JSON 格式無法解析

可能原因：

- 包含 Markdown 格式
- 包含 ```json 區塊
- 包含說明文字
- JSON 缺少逗號或括號

請確認內容後重新貼上
````

---

## 驗收測試

以下內容都應成功：

### 測試 1

純 JSON

---

### 測試 2

```json
{
 ...
}
```

包裹格式

---

### 測試 3

含：

```text
以下是分析結果：
```

前綴說明

---

### 測試 4

含：

```text
\[
\]
```

跳脫字元

---

### 測試 5

使用本次實際失敗案例

確認：

```text
mainRisks: \[
```

可自動修正。

---

## 要求

優先重用現有：

```text
validateDeepReport.ts
```

不要建立第二套驗證器。

---

## 完成後回報

請回報：

* 修改檔案
* 新增函式
* 支援哪些自動修正
* 測試結果
* build 結果

不要 commit

不要 push

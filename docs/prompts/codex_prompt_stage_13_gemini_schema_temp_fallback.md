# Codex 提示詞：第十三階段 Gemini Schema 對齊與 Temporary Error Fallback

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
10. Gemini API PoC 框架
11. Gemini API Key 已設定，本機 Gemini PoC 測試已可行
12. Gemini 429 retry / backoff
13. 前端 cooldown
14. 人工內容複查欄位
15. 第二輪 Gemini PoC 測試結果已完成

第二輪測試結果重點：

- 9 次測試中成功預覽 5 次
- HTTP 429 次數：0
- retry 後仍失敗次數：3
- validate error 次數：1
- warning 次數：0
- normalize 修正次數：0
- 明顯內容品質問題次數：2
- 第 2 次出現 validate error：`pricingTiers 必須是 array`
- 第 7、8、9 次出現 `GEMINI_TEMPORARY_ERROR`
- 成功報告多數冷靜保守，沒有明顯過度承諾
- 部分產品樣貌偏 Landing Page 或人工服務，需小修

目前決策：

```text
Gemini：保留第一候選
正式切換：暫緩
費用限制：暫不作為主要限制
下一步：修 Schema / validate 對齊 + Temporary Error fallback
再測：一次 9 次可接受，但保留 10 秒 cooldown
```

使用者已開啟 Gemini 付費，剛剛 9 次測試估算約 1.5 台幣，因此目前不需要再為 Free Tier 每日上限分三天測試。

但仍然要保留：

- 基本 cooldown
- retry / backoff
- 錯誤提示
- 防連點
- fallback 流程

---

## 一、階段目標

這次不要把正式 `/evaluate` 預設切到 Gemini。

這次只做三件事：

1. 對齊 `MockReport type`、`geminiReportResponseSchema`、`validateReportData`、`buildEvaluationPrompt`
2. 修正 `pricingTiers 必須是 array` 這類 schema / validate 不一致問題
3. 強化 `GEMINI_TEMPORARY_ERROR` 的前端 fallback 與使用者操作流程

完成後，再執行一次 9 次 Gemini PoC 測試。

---

## 二、這次不要做的事

請不要：

- 不要把正式 `/evaluate` 預設切到 Gemini
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增正式使用者報告歷史紀錄
- 不要刪除 mock provider
- 不要刪除 `/prompt-preview`
- 不要刪除 `/json-preview`
- 不要刪除 `/gemini-poc`
- 不要改測 OpenAI
- 不要大幅重寫整個產品
- 不要把 API key 寫進前端
- 不要把 API key 寫進 git
- 不要建立複雜後台或儀表板
- 不要因為已開啟付費就移除 cooldown / retry / 錯誤提示

這次只做：

> Schema / validate 對齊 + Temporary Error fallback + 再測 9 次的準備。

---

## 三、先全面盤點資料結構契約

請檢查以下檔案或實際存在的對應檔案：

```text
src/data/mockReports.ts
src/lib/promptTemplate.ts
src/lib/validateReport.ts
src/lib/ai/reportSchema.ts
src/lib/ai/geminiProvider.ts
src/pages/GeminiPocPage.tsx
src/pages/ReportPage.tsx
src/components/ReportView.tsx
```

目標是確認以下四者一致：

```text
MockReport type
Gemini response schema
validateReportData
buildEvaluationPrompt 要求的 JSON 結構
```

請找出：

1. 哪些欄位在 type 裡有，但 schema 沒有
2. 哪些欄位在 schema 裡有，但 type 沒有
3. 哪些欄位在 validate 裡要求，但 prompt 沒明確要求
4. 哪些欄位在 prompt 裡要求，但 ReportView 沒使用
5. 哪些欄位可能導致 Gemini 輸出錯誤格式

---

## 四、處理 pricingTiers 欄位

第二輪測試出現：

```text
pricingTiers 必須是 array
```

請優先釐清 `pricingTiers` 是否真的需要。

### 情境 A：ReportView / 報告頁目前沒有使用 pricingTiers

如果目前報告頁沒有用到 `pricingTiers`，請採用這個決策：

```text
移除 pricingTiers 的必填驗證，不要求 Gemini 一定輸出 pricingTiers。
```

請調整：

- `validateReportData` 不要把 `pricingTiers` 當必填
- `geminiReportResponseSchema` 不要要求 `pricingTiers`
- `buildEvaluationPrompt` 不要強制要求 `pricingTiers`
- 若舊資料有 `pricingTiers`，可以忽略，不要讓它影響預覽
- ReportView 不要因缺少 `pricingTiers` crash

### 情境 B：ReportView / 報告頁有使用 pricingTiers

如果目前報告頁真的有使用 `pricingTiers`，請採用這個決策：

```text
正式定義 pricingTiers 為 array，並讓 type / schema / validate / prompt 全部一致。
```

建議結構：

```ts
pricingTiers: {
  name: string;
  price: string;
  description: string;
  suitableFor: string;
}[];
```

驗證規則：

- `pricingTiers` 必須是 array
- 至少 1 項，最多 3 項
- 每項必須有：
  - name
  - price
  - description
  - suitableFor

Prompt 要明確要求：

```text
pricingTiers 必須是 array，不可回傳 string、object、null。
```

Schema 要明確定義 array item。

ReportView 要能優雅顯示，若空陣列則不顯示該區塊。

### 預設建議

如果不確定，請採用情境 A：

> 先不要讓 `pricingTiers` 成為 Gemini PoC 阻塞點。

目前產品核心是副業可行性報告，不是完整定價方案產生器。

---

## 五、強化所有 array 欄位的 schema 與 prompt

請確認以下欄位在 schema / prompt / validate 中都明確要求是 array：

```text
dimensions
strengths
risks
fatalWarnings
productShape.userFlow
productShape.userSees
productShape.firstVersionLook
dontBuild
validationPlan
```

如果保留 pricingTiers，則也包含：

```text
pricingTiers
```

Prompt 中請加入明確規則：

```text
所有 array 欄位都必須回傳 JSON array。
不可用逗號字串代替 array。
不可用 object 代替 array。
不可回傳 null。
不可省略 required array 欄位。
```

並特別補充：

```text
validationPlan 必須剛好 7 項。
dimensions 必須剛好 7 項。
dontBuild 至少 3 項。
productShape.userFlow 至少 4 項。
productShape.userSees 至少 5 項。
productShape.firstVersionLook 至少 4 項。
```

---

## 六、validateReportData 調整原則

請檢查並調整 `validateReportData`。

原則：

1. 核心報告欄位缺失才阻擋
2. ReportView 沒使用的欄位不要阻擋
3. 可自動修正的欄位給 warning，不要 error
4. 結構不安全、會導致報告無法渲染的欄位才 error

### 必須 error 的情況

- JSON 無法 parse
- `dimensions` 不是 array
- `dimensions` 不是 7 項
- `dimensions.maxScore` 加總不是 100
- `dimension.score` 超過 `maxScore`
- `productShape` 缺失
- `productShape.userFlow` 不是 array 或少於 4 項
- `productShape.userSees` 不是 array 或少於 5 項
- `productShape.firstVersionLook` 不是 array 或少於 4 項
- `dontBuild` 不是 array 或少於 3 項
- `validationPlan` 不是 array 或不是 7 項
- 會導致 ReportView crash 的欄位缺失

### 可以 warning 的情況

- `score` 與 dimensions 加總不同
- `scoreLabel` 與 score 不一致
- optional 欄位缺失
- 非核心文案欄位偏短
- 未使用的欄位格式不一致

---

## 七、normalizeReportData 調整原則

請確認 `normalizeReportData` 仍處理：

1. 以 dimensions score 加總修正 report.score
2. 根據修正後 score 更新 scoreLabel
3. 不破壞原本 report 內容
4. 不嘗試硬修太嚴重的結構錯誤，例如 dimensions 缺失或 validationPlan 不是 array

如果有 optional 欄位，例如 pricingTiers，normalize 可做：

- 缺少時補 `[]`
- 不是 array 時轉為 `[]` 並加 warning

但如果該欄位已決定不需要，就不要增加複雜 normalize。

---

## 八、強化 GEMINI_TEMPORARY_ERROR fallback

第二輪第 7、8、9 次出現：

```text
GEMINI_TEMPORARY_ERROR
```

retry/backoff 後仍失敗。

請加強 `/gemini-poc` 的 fallback 體驗。

### 後端錯誤格式

如果 Gemini temporary error 最後仍失敗，請回傳：

```json
{
  "ok": false,
  "error": "Gemini 暫時無法回應，請稍後再試。",
  "code": "GEMINI_TEMPORARY_ERROR",
  "retryable": true,
  "details": []
}
```

不要暴露 API key 或完整敏感 request。

### 前端顯示

如果收到 `GEMINI_TEMPORARY_ERROR`，請顯示：

```text
Gemini 暫時無法回應。你可以稍後重試，或改用手動 Prompt 測試流程。
```

請保留：

- 使用者輸入內容
- 已選測試題
- 上一次成功報告結果，如果有
- 人工複查欄位，不要因錯誤整頁清空

---

## 九、新增 fallback：複製 Prompt 改用手動測試

在 `/gemini-poc` 發生 `GEMINI_TEMPORARY_ERROR` 或其他 retryable error 時，請提供一個 fallback 按鈕：

```text
複製 Prompt，改用手動測試
```

功能：

1. 使用目前表單 input
2. 呼叫或共用 `buildEvaluationPrompt(input)`
3. 將完整 Prompt 複製到剪貼簿
4. 顯示成功訊息：

```text
已複製 Prompt。你可以貼到 ChatGPT / Gemini 網頁版手動測試，再把 JSON 貼回 JSON Preview。
```

旁邊提供連結：

```text
前往 JSON Preview
```

連到：

```text
/json-preview
```

目的：

> Gemini API 暫時失敗時，不讓測試流程完全中斷，仍可用手動流程完成報告驗證。

---

## 十、保留 10 秒 cooldown

雖然使用者已開啟 Gemini 付費，9 次測試成本約 1.5 台幣，費用暫時不是主要限制，但仍請保留 10 秒 cooldown。

原因：

- 避免連點
- 避免短時間重複 request
- 讓 PoC 測試更穩
- 未來正式產品仍需要基本防護

不要把 cooldown 拉太長。

建議：

```text
10 秒
```

---

## 十一、更新測試結果文件

請更新：

```text
docs/gemini-poc-test-results.md
```

保留第一輪與第二輪結果，不要覆蓋。

新增：

```md
# Gemini PoC 第三輪測試結果：Schema 對齊後

## 測試日期

待填

## 測試環境

- Provider：Gemini
- Model：gemini-2.5-flash
- 測試頁：`/gemini-poc`
- Prompt 版本：Stage 13 schema-aligned `buildEvaluationPrompt`
- Schema 版本：Stage 13 schema-aligned `geminiReportResponseSchema`
- 防護版本：429 retry / cooldown / temporary error fallback
- 成本狀態：已開啟付費，9 次測試成本估算約 1.5 台幣，費用暫不作為主要限制

## 總結

| 項目 | 結果 |
|---|---|
| 總測試次數 | 9 |
| 成功預覽次數 | 待填 |
| HTTP 429 次數 | 待填 |
| temporary error 次數 | 待填 |
| retry 後成功次數 | 待填 |
| retry 後仍失敗次數 | 待填 |
| validate error 次數 | 待填 |
| pricingTiers 錯誤次數 | 待填 |
| warning 次數 | 待填 |
| normalize 修正次數 | 待填 |
| 明顯內容品質問題次數 | 待填 |
| 初步結論 | 待填 |

## 第三輪測試紀錄表

| 編號 | 測試題 | 次數 | 成功呼叫 | JSON 合法 | Validate Errors | Warnings | Normalize | 可預覽 | ProductShape 具體 | DontBuild 有針對性 | 7 天計畫偏驗證 | 語氣冷靜 | 有無過度承諾 | 備註 |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 寵物飼料分析網站 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | 寵物飼料分析網站 | 2 |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | 寵物飼料分析網站 | 3 |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | AI 寵物監控摘要 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | AI 寵物監控摘要 | 2 |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 | AI 寵物監控摘要 | 3 |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 | AI 副業啟動包 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |
| 8 | AI 副業啟動包 | 2 |  |  |  |  |  |  |  |  |  |  |  |  |
| 9 | AI 副業啟動包 | 3 |  |  |  |  |  |  |  |  |  |  |  |  |

## 第三輪決策

請填入其中一項：

- Gemini 可進入正式 provider 候選
- Gemini 需要繼續修 temporary error / fallback
- Gemini 需要修 Prompt 後再測
- Gemini 需要修 Schema 後再測
- Gemini 暫不適合，改測 OpenAI
- 暫時不接真 AI，維持 mock / 手動流程
```

---

## 十二、更新測試計畫文件

請更新：

```text
docs/gemini-poc-test-plan.md
```

新增：

```md
## 第三輪測試：Schema 對齊後

第二輪測試中，HTTP 429 不再出現，但出現：

- 1 次 validate error：`pricingTiers 必須是 array`
- 3 次 `GEMINI_TEMPORARY_ERROR`

第三輪測試目的：

1. 驗證 MockReport type / Gemini schema / validate / prompt 是否已對齊
2. 驗證 pricingTiers 不再造成 validate error
3. 驗證 temporary error 時是否有清楚 fallback
4. 驗證 Gemini 在付費狀態下是否仍能穩定完成 9 次測試
5. 重新判斷 Gemini 是否可作為第一版 AI Provider 候選

第三輪仍使用三個固定測試題，每題三次，共 9 次。

因已開啟付費，費用暫不作為主要限制，但仍保留 10 秒 cooldown。
```

---

## 十三、README 更新

請更新 README，新增或補充：

```md
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
```

---

## 十四、完成後請回報

完成後請回報：

1. 新增或修改了哪些檔案
2. 是否盤點了 MockReport type / schema / validate / prompt
3. `pricingTiers` 最後決策是移除必填，還是正式定義為 array
4. `validateReportData` 做了哪些調整
5. `geminiReportResponseSchema` 做了哪些調整
6. `buildEvaluationPrompt` 做了哪些調整
7. `GEMINI_TEMPORARY_ERROR` fallback 如何顯示
8. 是否新增「複製 Prompt，改用手動測試」
9. `/json-preview` 連結是否可用
10. cooldown 是否保留 10 秒
11. `docs/gemini-poc-test-results.md` 是否新增第三輪測試表
12. `docs/gemini-poc-test-plan.md` 是否新增第三輪測試說明
13. README 是否更新
14. build 是否通過
15. 如何啟動與驗證

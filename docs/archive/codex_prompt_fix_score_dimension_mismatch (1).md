# Codex 提示詞：修正 score 與 dimensions 分數加總不一致問題

目前「副業點子冷靜評分器」已完成手動 AI 產報告測試流程。

測試時發現一個合理問題：

AI 回傳的 JSON 可以解析，但有時候 `score` 與 `dimensions` 裡各維度分數加總不一致，導致 `/json-preview` 顯示：

```text
JSON 可以解析，但資料結構不符合報告格式。
dimensions 分數加總與 score 不一致
```

這個防呆檢查是正確的，但實務上 AI 很容易在總分計算上出錯。

請針對這個問題做修正。

這次不要接 AI API、不要新增登入、不要新增付款、不要新增資料庫。

---

## 目標

讓系統更適合處理 AI 回傳 JSON。

原則是：

> 不要完全相信 AI 回傳的總分。  
> 七大維度分數才是主要資料來源。  
> report.score 應該可以由 dimensions 自動加總修正。

---

## 一、調整驗證邏輯

請修改：

```text
src/lib/validateReport.ts
```

目前如果 `dimensions` 的 score 加總與 `report.score` 不一致，會直接視為驗證失敗。

請調整成：

1. `dimensions` 的 `maxScore` 加總仍然必須等於 100。
2. `dimensions` 必須仍然剛好有 7 個項目。
3. `dimensions` 每個 score 仍然必須是 number。
4. `dimensions` 每個 score 不可以小於 0。
5. `dimensions` 每個 score 不可以大於該項 maxScore。
6. 如果 `dimensions` 的 score 加總與 `report.score` 不一致，不要直接讓整份報告無法預覽。
7. 請把這類問題改成 warning，而不是 error。

建議將回傳格式改成：

```ts
validateReportData(data: unknown): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

如果不想改太多現有程式，也可以另外新增：

```ts
validateReportDataWithWarnings(...)
```

但建議直接升級原本的 `validateReportData`。

---

## 二、新增 normalizeReportData 工具

請新增或放在同一檔案中：

```ts
normalizeReportData(report: MockReport): MockReport
```

功能：

1. 自動計算 `dimensions` 的 score 加總。
2. 將 `report.score` 修正為這個加總。
3. 根據修正後的 score 自動更新 `scoreLabel`。
4. 其他欄位不改動。

scoreLabel 規則：

- 80～100：適合進入 MVP
- 65～79：可做，但必須縮小範圍
- 50～64：只適合先做驗證頁
- 35～49：不建議直接開發
- 0～34：建議放棄或暫緩

例如：

```ts
function getScoreLabel(score: number): string
```

可以獨立出來，未來報告頁也能共用。

---

## 三、調整 /json-preview 行為

請修改：

```text
src/pages/JsonPreviewPage.tsx
```

目前流程大概是：

1. JSON.parse
2. validateReportData
3. 驗證通過後存入 localStorage
4. 導向 `/report/generated-preview`

請調整成：

1. JSON.parse
2. validateReportData
3. 如果有 error，維持阻擋並顯示錯誤
4. 如果只有 warning，允許繼續
5. 存入 localStorage 前，先呼叫 `normalizeReportData`
6. 顯示提示：已自動依照七大維度分數修正總分
7. 存入修正後 report
8. 導向 `/report/generated-preview`

畫面上如果出現 warning，請清楚顯示，例如：

```text
資料已通過基本驗證，但有以下提醒：
- dimensions 分數加總與 score 不一致，系統將自動以 dimensions 加總修正總分。
```

---

## 四、調整錯誤文字

請把原本：

```text
dimensions 分數加總與 score 不一致
```

改成 warning：

```text
dimensions 分數加總與 score 不一致，系統將自動以 dimensions 加總修正 score。
```

這樣使用者會知道不是失敗，而是系統有修正。

---

## 五、調整 Prompt Template

請修改：

```text
src/lib/promptTemplate.ts
```

在 Prompt 裡加強要求：

```text
score 必須等於 dimensions 中七個 score 的加總。
請在輸出前自行檢查加總。
如果 dimensions 分數加總為 72，score 就必須填 72。
不要估算總分。
```

但請注意：即使 Prompt 加強，前端仍然要保留 normalize 機制，因為 AI 還是可能算錯。

---

## 六、調整 /report/generated-preview

請確認 `/report/generated-preview` 讀取 localStorage 後，使用的是 normalize 後的 report。

如果 localStorage 裡是舊資料，也可以在讀取時再跑一次 `normalizeReportData`，避免舊資料造成總分不一致。

---

## 七、保留嚴格檢查的項目

以下仍然要維持 error，不要降級成 warning：

- JSON parse 失敗
- 缺少 title
- 缺少 dimensions
- dimensions 不是 array
- dimensions 不是 7 個項目
- dimensions maxScore 加總不是 100
- dimension score 不是 number
- dimension score 小於 0
- dimension score 大於 maxScore
- 缺少 productShape
- productShape.userFlow 少於 4 項
- productShape.userSees 少於 5 項
- productShape.firstVersionLook 少於 4 項
- validationPlan 不是 7 天
- 缺少 dontBuild
- dontBuild 少於 3 項

---

## 八、測試案例

請用以下情境測試：

### 測試 1：正確資料

`score` 等於 dimensions 加總。

結果：

- 無 error
- 無 score warning
- 可正常預覽

### 測試 2：score 不一致

例如：

```json
{
  "score": 80,
  "dimensions": [
    { "name": "個人契合度", "score": 10, "maxScore": 15, "comment": "..." },
    { "name": "MVP 難度", "score": 12, "maxScore": 20, "comment": "..." },
    { "name": "需求強度", "score": 12, "maxScore": 20, "comment": "..." },
    { "name": "付費可能性", "score": 8, "maxScore": 15, "comment": "..." },
    { "name": "獲客難度", "score": 7, "maxScore": 15, "comment": "..." },
    { "name": "法律與平台風險", "score": 6, "maxScore": 10, "comment": "..." },
    { "name": "維護成本", "score": 3, "maxScore": 5, "comment": "..." }
  ]
}
```

加總為 58，但 score 是 80。

結果：

- 不應該阻擋預覽
- 顯示 warning
- 存入 localStorage 前自動把 score 修正為 58
- scoreLabel 自動改成「只適合先做驗證頁」

### 測試 3：dimension score 超過 maxScore

例如 MVP 難度 score 25 / maxScore 20。

結果：

- 必須阻擋
- 顯示 error
- 不可預覽

### 測試 4：validationPlan 少於 7 天

結果：

- 必須阻擋
- 顯示 error
- 不可預覽

---

## 九、這次不要做的事

請不要：

- 不要接 OpenAI API
- 不要新增後端
- 不要新增登入
- 不要新增付款
- 不要移除 JSON Preview
- 不要放寬所有驗證
- 不要讓明顯缺欄位的 JSON 通過

這次只處理：

> score 與 dimensions 加總不一致時，改成 warning + 自動修正。

---

## 十、完成後請回報

完成後請回報：

1. 修改了哪些檔案
2. `validateReportData` 是否新增 warnings
3. 是否新增 `normalizeReportData`
4. scoreLabel 是否會依照修正後分數自動更新
5. `/json-preview` 遇到 score 不一致時現在會怎麼處理
6. 哪些錯誤仍然會阻擋預覽
7. 如何啟動與驗證

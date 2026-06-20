# Codex 提示詞：第四階段 AI JSON 測試與防呆

目前「副業點子冷靜評分器」已完成第三階段：建立 AI 分析 Prompt 模板。

請進行第四階段：建立 AI 回傳 JSON 的測試與防呆機制。

這次仍然不要真正接 AI API、不要新增登入、不要新增付款、不要新增資料庫。

## 目標

未來接 AI API 時，模型會回傳一份 JSON 報告。這一階段要先建立：

1. JSON 範例輸入/輸出測試資料
2. report 資料驗證工具
3. JSON 貼上測試頁
4. 讓我可以手動把 ChatGPT 產出的 JSON 貼進網站，確認 ReportPage 是否能正常渲染

這一步的目的不是正式上線，而是避免之後接 AI API 時出現：

- JSON 格式錯誤
- 缺欄位
- 分數加總錯誤
- dimensions 不完整
- productShape 缺資料
- validationPlan 不是 7 天
- 報告頁因資料不完整而 crash

---

## 一、新增 JSON 驗證工具

請新增檔案：

```text
src/lib/validateReport.ts
```

建立一個 function：

```ts
validateReportData(data: unknown): {
  isValid: boolean;
  errors: string[];
}
```

這個 function 用來檢查資料是否符合目前 MockReport type。

至少檢查：

1. 必須有 id
2. 必須有 title
3. score 必須是 number，且介於 0～100
4. 必須有 scoreLabel
5. 必須有 summary
6. dimensions 必須是 array
7. dimensions 必須包含 7 個維度
8. dimensions 每個項目必須有 name、score、maxScore、comment
9. dimensions 的 maxScore 總和必須等於 100
10. dimensions 的 score 總和應該等於 report.score
11. 必須有 oneSentenceVerdict
12. strengths 必須是 array，且至少 1 項
13. risks 必須是 array，且至少 1 項
14. fatalWarnings 必須是 array
15. productShape 必須存在
16. productShape.format 必須是 string
17. productShape.userFlow 必須是 array，且至少 4 項
18. productShape.userSees 必須是 array，且至少 5 項
19. productShape.firstVersionLook 必須是 array，且至少 4 項
20. dontBuild 必須是 array，且至少 3 項
21. pricingSuggestion 必須是 string
22. validationPlan 必須是 array，且剛好 7 項
23. validationPlan 每一項必須有 day 與 task

如果有錯誤，請回傳清楚的 errors，例如：

- 缺少 title
- score 必須介於 0～100
- dimensions 必須剛好有 7 個項目
- dimensions 分數加總與 score 不一致
- validationPlan 必須剛好 7 天

---

## 二、新增 JSON 測試頁

請新增一個開發用頁面：

```text
/json-preview
```

這個頁面不用做得很漂亮，但要清楚好用。

頁面功能：

1. 左側或上方有一個 textarea
2. 使用者可以貼上 AI 產出的 JSON
3. 有一個按鈕：驗證並預覽報告
4. 點擊後：
   - 嘗試 JSON.parse
   - 使用 validateReportData 檢查資料
   - 如果格式錯誤，顯示錯誤訊息
   - 如果驗證通過，把這份 report 存到 localStorage
   - 導向或顯示預覽報告

建議 localStorage key：

```text
generatedReportPreview
```

---

## 三、新增 Generated Report 預覽路由

請新增或調整一個路由：

```text
/report/generated-preview
```

這個頁面要讀取 localStorage 裡的：

```text
generatedReportPreview
```

如果有資料且驗證通過，就用現有 ReportPage 的版型渲染。

如果沒有資料，顯示友善提示：

標題：

尚未產生預覽報告

文字：

請先到 JSON Preview 頁面貼上 AI 產出的 JSON，再回來查看報告。

按鈕：

前往 JSON Preview → /json-preview

---

## 四、重用現有報告元件

如果目前 ReportPage 裡面已經有大量報告渲染邏輯，請盡量抽成可重用元件。

例如：

```text
src/components/ReportView.tsx
```

讓以下頁面都能重用同一套報告畫面：

- /report/:reportId
- /report/generated-preview

目標是避免同一份報告 UI 在多個頁面重複寫。

---

## 五、新增 sample JSON

請新增一個範例 JSON 檔或 TS 常數，方便測試。

建議新增：

```text
src/data/sampleGeneratedReport.ts
```

內容放一份符合 MockReport type 的 generated report。

題目可以使用：

```text
AI 履歷健檢報告產生器
```

這份 sample report 要完整包含：

- 7 大維度
- productShape
- dontBuild
- validationPlan 7 天

/json-preview 頁面可以提供一個按鈕：

```text
載入範例 JSON
```

點擊後把 sample JSON 填進 textarea，方便測試。

---

## 六、錯誤顯示 UX

JSON 錯誤請分成兩種：

### 1. JSON parse 錯誤

顯示：

```text
JSON 格式無法解析，請確認是否為有效 JSON。
```

並顯示原始錯誤訊息。

### 2. 資料結構驗證錯誤

顯示：

```text
JSON 可以解析，但資料結構不符合報告格式。
```

並列出 errors。

錯誤清單要容易複製，之後可以拿回去修 Prompt。

---

## 七、導覽入口

請在 Header 或 Footer 加一個開發用連結：

```text
JSON Preview
```

可以先保留在正式畫面中，或用不醒目的樣式呈現。

這是開發階段工具，之後正式上線前可以移除。

---

## 八、這次不要做的事

請不要：

- 不要接 AI API
- 不要新增後端
- 不要新增付款
- 不要新增登入
- 不要把 generated report 寫進資料庫
- 不要新增正式使用者歷史紀錄
- 不要改動目前三份 examples 的正常顯示

---

## 九、完成後請回報

請完成後回報：

1. 新增或修改了哪些檔案
2. validateReportData 檢查了哪些規則
3. /json-preview 如何使用
4. /report/generated-preview 如何使用
5. 是否有抽出 ReportView 共用元件
6. 如何啟動與驗證
7. 後續如果要真正接 AI API，建議下一步改哪裡

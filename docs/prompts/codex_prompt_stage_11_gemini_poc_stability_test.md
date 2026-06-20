# Codex 提示詞：第十一階段 Gemini PoC 穩定性測試紀錄與評估表

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

現在進入第十一階段：Gemini PoC 穩定性測試紀錄與評估表。

這次不要新增登入、不要新增付款、不要新增資料庫、不要新增正式使用者歷史紀錄。

也不要把正式 `/evaluate` 預設切到 Gemini。

這一階段只做：

> 建立一套可重複使用的 Gemini 測試紀錄工具與評估文件，幫我判斷 Gemini 是否適合作為第一版 AI Provider。

---

## 一、階段目標

目前 Gemini 已經可以成功呼叫，但還不能直接判斷它適合正式使用。

需要測的是穩定性：

1. 同一題多次呼叫是否都能成功
2. JSON 是否穩定
3. `validateReportData` 是否常出現 errors
4. 是否經常需要 `normalizeReportData`
5. 報告內容是否冷靜、保守、具體
6. `productShape` 是否讓人能想像產品樣貌
7. `dontBuild` 是否有針對性
8. `validationPlan` 是否真的偏驗證，而不是直接開發
9. 是否有過度樂觀、醫療承諾、法律承諾或不合理保證

---

## 二、新增測試紀錄文件

請新增：

```text
docs/gemini-poc-test-plan.md
```

內容包含：

# Gemini PoC 穩定性測試計畫

## 測試目的

判斷 Gemini 是否適合作為「副業點子冷靜評分器」第一版 AI Provider。

## 測試方式

使用 `/gemini-poc` 頁面進行測試。

固定三個測試題，每題測三次，共 9 次。

測試完成後，記錄每次結果。

## 測試題

### 測試題 1：寵物飼料分析網站

```json
{
  "idea": "我想做一個 AI 寵物飼料分析推薦網站",
  "availableTime": "下班後每天 1～2 小時，週末半天",
  "avoidThings": "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料"
}
```

觀察重點：

- 是否有明確提到寵物健康 / 營養 / 醫療責任風險
- 是否避免過度推薦
- 是否沒有亂承諾改善軟便、過敏、疾病
- 是否建議縮小成報告產生器，而不是完整推薦平台

### 測試題 2：AI 寵物監控摘要

```json
{
  "idea": "我想做一個 AI 寵物監控摘要工具，可以分析家用監視器影片，讓飼主知道寵物什麼時候尿尿、便便、焦慮或破壞家具",
  "availableTime": "下班後每天 1～2 小時",
  "avoidThings": "不想處理複雜安裝、不想長期維護影像資料、不想碰第三方平台違規串接"
}
```

觀察重點：

- 是否低估技術難度
- 是否提到監控器串接、雲端影片、隱私與維護風險
- 是否建議縮小成「短影片上傳分析」而不是即時監控
- 是否避免做 24 小時背景常駐分析

### 測試題 3：AI 副業啟動包

```json
{
  "idea": "我想做一套 AI 副業啟動包，包含 Notion 主控台、Google Sheet 評分器、Prompt 工作流與 14 天行動清單",
  "availableTime": "下班後每天 1～2 小時，假日可以整理內容",
  "avoidThings": "不想做大量客服、不想客製化服務、不想長期人工維護資料"
}
```

觀察重點：

- 是否指出差異化不足
- 是否指出「使用者為什麼不直接問 ChatGPT」的風險
- 是否避免把它說成容易爆賣
- 是否建議先做小型數位產品，而不是完整課程平台

## 每次測試紀錄欄位

每次測試請記錄：

1. 測試題
2. 第幾次
3. 是否成功呼叫 Gemini
4. 是否成功產出 JSON
5. 是否有 validate errors
6. 是否有 warnings
7. 是否有 normalize 修正 score
8. 是否可預覽報告
9. productShape 是否具體
10. dontBuild 是否有針對性
11. validationPlan 是否偏驗證
12. 報告語氣是否冷靜保守
13. 是否有過度樂觀
14. 是否有不該承諾的醫療 / 法律 / 財務內容
15. 備註

## 通過標準

暫定標準：

- 9 次測試中，至少 8 次可成功預覽報告
- validate errors 不超過 1 次
- 允許 warnings，但不能每次都有嚴重 warnings
- productShape 多數具體
- dontBuild 多數有針對性
- 報告語氣整體冷靜、保守
- 不可出現明顯醫療、法律、財務保證
- 不可過度鼓勵創業或畫大餅

## 決策規則

如果通過：

> Gemini 可作為第一版 AI Provider 候選。

如果不通過：

可能處理方式：

1. 先調整 Prompt
2. 先調整 response schema
3. 再測 OpenAI
4. 暫時維持 mock / 手動流程

---

## 三、新增測試結果紀錄文件

請新增：

```text
docs/gemini-poc-test-results.md
```

內容建立可手動填寫的 Markdown 表格。

請包含：

# Gemini PoC 測試結果

## 測試日期

待填

## 測試環境

- Provider：Gemini
- Model：待填
- 測試頁：`/gemini-poc`
- Prompt 版本：待填
- Schema 版本：待填

## 總結

| 項目 | 結果 |
|---|---|
| 總測試次數 | 9 |
| 成功預覽次數 | 待填 |
| validate error 次數 | 待填 |
| warning 次數 | 待填 |
| normalize 修正次數 | 待填 |
| 明顯內容品質問題次數 | 待填 |
| 初步結論 | 待填 |

## 測試紀錄表

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

## 問題紀錄

### JSON / Schema 問題

待填

### 報告內容問題

待填

### 產品樣貌問題

待填

### 風險判斷問題

待填

### 其他問題

待填

## 最後決策

請填入其中一項：

- Gemini 可進入正式 provider 候選
- Gemini 需要修 Prompt 後再測
- Gemini 需要修 Schema 後再測
- Gemini 暫不適合，改測 OpenAI
- 暫時不接真 AI，維持 mock / 手動流程

---

## 四、新增 Gemini PoC 測試紀錄功能，可選但建議

請在 `/gemini-poc` 頁面新增一個「測試紀錄輔助區」。

這不是正式資料庫，只是方便我人工複製紀錄。

功能：

1. Gemini 回應成功後，整理一段可複製的測試紀錄文字。
2. 內容包含：
   - 測試題名稱
   - 是否成功呼叫
   - 是否有 validate errors
   - warnings
   - 是否有 normalize 修正
   - 最終 score
   - scoreLabel
   - 是否可預覽
3. 提供按鈕：

```text
複製本次測試紀錄
```

4. 複製格式用 Markdown，方便貼到 `docs/gemini-poc-test-results.md`

範例格式：

```md
| 寵物飼料分析網站 | 1 | 是 | 是 | 無 | 有：score 已自動修正 | 是 | 是 | 待人工評估 | 待人工評估 | 待人工評估 | 待人工評估 | 無 | 備註 |
```

注意：

- 不要儲存到資料庫
- 不要新增正式歷史紀錄
- 只做複製輔助

---

## 五、Gemini PoC 頁面增加人工評估提醒

請在 `/gemini-poc` 頁面驗證結果下方加一段提醒：

```text
技術驗證通過不代表 Gemini 適合作為正式 Provider。請人工檢查 productShape、dontBuild、7 天驗證計畫與語氣是否符合「冷靜、保守、具體」的產品定位。
```

---

## 六、README 更新

請更新 README，新增一段：

```md
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
```

---

## 七、這次不要做的事

請不要：

- 不要把正式 `/evaluate` 預設切到 Gemini
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增正式報告歷史紀錄
- 不要刪除 mock provider
- 不要刪除 `/prompt-preview`
- 不要刪除 `/json-preview`
- 不要刪除 `/gemini-poc`
- 不要新增複雜儀表板
- 不要做自動評分內容品質

這次只做：

> Gemini PoC 穩定性測試文件與簡單紀錄輔助。

---

## 八、完成後請回報

完成後請回報：

1. 新增或修改了哪些檔案
2. `docs/gemini-poc-test-plan.md` 包含哪些內容
3. `docs/gemini-poc-test-results.md` 是否已建立 9 次測試表格
4. `/gemini-poc` 是否新增「複製本次測試紀錄」功能
5. 是否有新增人工評估提醒
6. README 是否有補充 Gemini 穩定性測試說明
7. build 是否通過
8. 如何啟動與驗證

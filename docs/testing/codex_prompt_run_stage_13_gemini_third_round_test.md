# Codex 提示詞：執行 Gemini PoC 第三輪 9 次測試

目前專案已完成第十三階段：

- Gemini 保留第一候選
- 正式 `/evaluate` 仍暫緩切換
- 已完成 Schema / validate 對齊
- 已處理 `pricingTiers 必須是 array` 問題
- 已強化所有必要 array 欄位的 schema / prompt 要求
- 已補 `GEMINI_TEMPORARY_ERROR` fallback
- 已新增「複製 Prompt，改用手動測試」
- `/json-preview` fallback 連結已保留
- 10 秒 cooldown 已保留
- `docs/gemini-poc-test-results.md` 已新增第三輪測試表
- `docs/gemini-poc-test-plan.md` 已新增第三輪測試說明

現在請幫我執行第三輪 Gemini PoC 測試。

---

## 一、重要安全規則

請注意：

- 不要顯示、複製、輸出或記錄我的 `GEMINI_API_KEY`
- 不要把 `.env` commit
- 不要修改 `.env` 裡的 API Key
- 不要把 API Key 寫入任何文件
- 不要把正式 `/evaluate` 預設切到 Gemini
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增正式使用者歷史紀錄
- 不要刪除 mock provider
- 不要刪除 `/gemini-poc`
- 不要刪除 `/json-preview`
- 不要刪除 `/prompt-preview`

這次只做：

> 執行第三輪 Gemini PoC 測試，並更新測試結果文件。

---

## 二、第三輪測試目標

第三輪測試目標：

1. 驗證 `pricingTiers` 不再造成 validate error
2. 驗證 MockReport type / Gemini schema / validate / prompt 是否已對齊
3. 驗證 Gemini 是否仍能穩定輸出合法 JSON
4. 驗證 `validateReportData` 是否仍可通過
5. 驗證 `normalizeReportData` 是否仍正常
6. 驗證 `GEMINI_TEMPORARY_ERROR` 發生時 fallback 是否清楚可用
7. 驗證「複製 Prompt，改用手動測試」是否可用
8. 執行人工內容複查
9. 更新 `docs/gemini-poc-test-results.md`
10. 回報是否可讓 Gemini 進入正式 provider 候選

---

## 三、啟動專案

請先確認專案可正常啟動。

依照目前 `package.json` 使用正確指令，例如：

```bash
npm run dev
```

或如果專案需要同時啟動前後端，請使用目前專案定義的指令，例如：

```bash
npm run dev:all
```

請自行檢查 `package.json` scripts，不要猜錯。

啟動後請確認：

- 前端可以開啟
- `/gemini-poc` 可以開啟
- Gemini PoC 頁面可以操作
- API endpoint 可以被呼叫
- `/json-preview` 可以開啟
- 如果發生 temporary error，可以看到 fallback 操作

---

## 四、測試頁

請前往：

```text
/gemini-poc
```

使用目前頁面內建的三組測試題。

---

## 五、測試題與次數

請執行共 9 次測試。

每次測試間隔至少 10 秒，遵守目前頁面 cooldown。

---

### 測試題 1：寵物飼料分析網站

執行 3 次。

```json
{
  "idea": "我想做一個 AI 寵物飼料分析推薦網站",
  "availableTime": "下班後每天 1～2 小時，週末半天",
  "avoidThings": "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料"
}
```

人工複查重點：

- 是否提到寵物健康 / 營養 / 醫療責任風險
- 是否避免過度推薦
- 是否沒有亂承諾改善軟便、過敏、疾病
- 是否建議縮小成報告產生器，而不是完整推薦平台
- productShape 是否能讓人想像第一版產品，而不是只有抽象建議

---

### 測試題 2：AI 寵物監控摘要

執行 3 次。

```json
{
  "idea": "我想做一個 AI 寵物監控摘要工具，可以分析家用監視器影片，讓飼主知道寵物什麼時候尿尿、便便、焦慮或破壞家具",
  "availableTime": "下班後每天 1～2 小時",
  "avoidThings": "不想處理複雜安裝、不想長期維護影像資料、不想碰第三方平台違規串接"
}
```

人工複查重點：

- 是否低估技術難度
- 是否提到監控器串接、雲端影片、隱私與維護風險
- 是否建議縮小成「短影片上傳分析」而不是即時監控
- 是否避免做 24 小時背景常駐分析
- productShape 是否具體，而不是只有 Landing Page 或概念頁

---

### 測試題 3：AI 副業啟動包

執行 3 次。

```json
{
  "idea": "我想做一套 AI 副業啟動包，包含 Notion 主控台、Google Sheet 評分器、Prompt 工作流與 14 天行動清單",
  "availableTime": "下班後每天 1～2 小時，假日可以整理內容",
  "avoidThings": "不想做大量客服、不想客製化服務、不想長期人工維護資料"
}
```

人工複查重點：

- 是否指出差異化不足
- 是否指出「使用者為什麼不直接問 ChatGPT」的風險
- 是否避免把它說成容易爆賣
- 是否建議先做小型數位產品，而不是完整課程平台
- dontBuild 是否針對模板包 / 副業啟動包，而不是通用建議

---

## 六、每次測試要記錄的技術結果

每次測試請記錄：

1. 是否成功呼叫 Gemini
2. 是否回傳合法 JSON
3. 是否有 validate errors
4. 是否有 `pricingTiers` 相關錯誤
5. 是否有 warnings
6. 是否有 normalize 修正
7. 是否可預覽報告
8. 是否出現 HTTP 429
9. 是否出現 `GEMINI_TEMPORARY_ERROR`
10. 若出現 temporary error，retry 後是否成功
11. 若 retry 後仍失敗，前端錯誤提示是否清楚
12. 若 retry 後仍失敗，「複製 Prompt，改用手動測試」是否可用
13. cooldown 是否正常運作

---

## 七、每次測試要做人工內容複查

每次成功產生報告後，請人工檢查並填寫 `/gemini-poc` 的人工內容複查欄位。

欄位包括：

1. ProductShape 是否具體：是 / 普通 / 否
2. DontBuild 是否有針對性：是 / 普通 / 否
3. 7 天計畫是否偏驗證：是 / 普通 / 否
4. 語氣是否冷靜保守：是 / 普通 / 否
5. 是否有過度承諾：無 / 輕微 / 明顯
6. 風險判斷是否足夠：是 / 普通 / 否
7. 是否可接受作為產品報告：是 / 需小修 / 否
8. 人工備註

請不要只填「待人工複查」。

這次目標是完成真正的人工複查。

---

## 八、人工複查判斷標準

請用偏保守標準判斷。

### ProductShape 是否具體

判斷為「是」的標準：

- 能想像第一版產品頁面或流程
- 有明確產品形式
- 有明確使用者會看到什麼
- 不是只有「提供分析」「給建議」這類抽象描述

如果只是泛泛而談，填「普通」或「否」。

---

### DontBuild 是否有針對性

判斷為「是」的標準：

- 砍掉的功能和該副業點子高度相關
- 不是每份報告都可以套用的通用建議
- 有明確說明第一版不要做什麼

如果只是「不要做 App、不要做登入、不要做會員」這類通用內容，最多填「普通」。

---

### 7 天計畫是否偏驗證

判斷為「是」的標準：

- 前幾天偏向 landing page、假門測試、訪談替代、社群貼文、收集名單
- 目標是驗證需求或收第一筆錢
- 不是直接安排大量開發完整產品

如果 7 天計畫主要是在開發功能，填「普通」或「否」。

---

### 語氣是否冷靜保守

判斷為「是」的標準：

- 有指出限制和風險
- 不鼓勵盲目開發
- 不使用熱血創業語氣
- 不畫大餅

---

### 是否有過度承諾

判斷為「無」的標準：

- 沒有保證賺錢
- 沒有保證市場會買單
- 沒有保證醫療、法律、財務效果
- 沒有說「一定」「保證」「必然成功」

如果有輕微暗示，也請填「輕微」。

---

### 風險判斷是否足夠

判斷為「是」的標準：

- 有針對該點子指出主要風險
- 寵物飼料題要提健康 / 營養 / 醫療責任
- 寵物監控題要提技術、隱私、平台串接、長期維護
- AI 副業啟動包要提差異化不足、同質性、為何不直接問 ChatGPT

---

## 九、更新測試結果文件

請更新：

```text
docs/gemini-poc-test-results.md
```

請填寫「第三輪測試結果：Schema 對齊後」區塊。

需要更新：

### 總結表

請填入：

- 總測試次數
- 成功預覽次數
- HTTP 429 次數
- temporary error 次數
- retry 後成功次數
- retry 後仍失敗次數
- validate error 次數
- pricingTiers 錯誤次數
- warning 次數
- normalize 修正次數
- 明顯內容品質問題次數
- 初步結論

### 第三輪測試紀錄表

請填滿 9 筆。

不要留下空白列。

如果某次失敗，也要記錄失敗原因。

---

## 十、第三輪決策

測試完成後，請在 `docs/gemini-poc-test-results.md` 的「第三輪決策」填入其中一項：

- Gemini 可進入正式 provider 候選
- Gemini 需要繼續修 temporary error / fallback
- Gemini 需要修 Prompt 後再測
- Gemini 需要修 Schema 後再測
- Gemini 暫不適合，改測 OpenAI
- 暫時不接真 AI，維持 mock / 手動流程

請根據測試結果保守判斷。

---

## 十一、通過標準

可以判定：

```text
Gemini 可進入正式 provider 候選
```

的標準：

1. 9 次測試中至少 8 次可成功預覽報告
2. validate errors 不超過 1 次
3. `pricingTiers` 錯誤 0 次
4. HTTP 429 不超過 1 次，且 retry 或提示處理正常
5. `GEMINI_TEMPORARY_ERROR` 不超過 1 次，且 fallback 正常可用
6. 明顯內容品質問題不超過 2 次
7. 多數報告 ProductShape 是「是」或「普通」
8. 多數報告 DontBuild 是「是」或「普通」
9. 多數 7 天計畫偏驗證
10. 多數報告語氣冷靜保守
11. 不出現明顯過度承諾

若未達標，請不要勉強判定通過。

---

## 十二、如果第三輪未達標

如果第三輪仍未達標，請不要直接改測 OpenAI，先回報原因。

請分類是哪一種問題：

1. Schema / validate 問題
2. Gemini temporary error 問題
3. Prompt 內容品質問題
4. ProductShape 太抽象
5. DontBuild 太通用
6. 7 天驗證計畫偏開發
7. 其他問題

請給出保守建議：

- 修 Schema 後再測
- 修 Prompt 後再測
- 修 temporary error / fallback 後再測
- 改測 OpenAI
- 暫時維持 mock / 手動流程

---

## 十三、完成後請回報

完成後請回報：

1. 使用了哪個啟動指令
2. `/gemini-poc` 是否成功開啟
3. `/json-preview` 是否成功開啟
4. 是否完成 9 次測試
5. 成功預覽幾次
6. HTTP 429 出現幾次
7. temporary error 出現幾次
8. retry 後成功幾次
9. retry 後仍失敗幾次
10. validate errors 幾次
11. pricingTiers 錯誤幾次
12. warnings 幾次
13. normalize 修正幾次
14. 明顯內容品質問題幾次
15. 第三輪決策是什麼
16. `docs/gemini-poc-test-results.md` 是否已更新
17. 是否有任何需要我人工再判斷的內容

請不要輸出或顯示 API Key。

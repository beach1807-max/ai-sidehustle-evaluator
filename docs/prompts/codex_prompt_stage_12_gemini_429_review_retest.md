# Codex 提示詞：第十二階段 Gemini 429 防護與人工內容複查

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
12. Gemini PoC 穩定性測試紀錄與評估表

第十一階段測試結果：

- Gemini 保留第一候選
- 正式切換暫緩
- 9 次測試中 8 次成功預覽
- validate errors：0
- warnings：0
- normalize 修正：0
- 第 8 次遇到 Gemini API HTTP 429
- 內容品質欄位仍待人工複查

現在進入第十二階段。

本階段決策：

```text
Gemini：保留第一候選
正式切換：暫緩
下一步：補 429 防護 + 人工內容複查
再測：同樣 9 次
```

---

## 一、階段目標

這次不要把正式 `/evaluate` 預設切到 Gemini。

這次只做兩件事：

1. 補 Gemini API HTTP 429 防護
2. 補人工內容複查輔助流程

完成後，再用同樣三組測試題，每題三次，共 9 次重新測試。

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
- 不要改成多 provider 比較系統
- 不要改測 OpenAI
- 不要大幅重寫 Prompt
- 不要把 API key 寫進前端
- 不要把 API key 寫進 git
- 不要建立複雜後台或儀表板

這次只做：

> Gemini 429 防護 + 人工內容複查輔助 + 再測 9 次的紀錄準備。

---

## 三、補 Gemini 429 防護

目前第十一階段 9 次測試中，第 8 次遇到：

```text
Gemini API 呼叫失敗，HTTP 429
```

這代表 Gemini Free Tier 或目前用量限制下，正式流程不能裸接 API。

請在 Gemini PoC API 呼叫流程中加入 429 防護。

---

## 四、後端 retry / backoff

請修改 Gemini API 呼叫邏輯。

可能位置：

```text
src/lib/ai/geminiProvider.ts
```

或目前實際呼叫 Gemini 的 server / API route，例如：

```text
/api/gemini-poc
/api/evaluate-gemini
```

請加入 retry 機制：

### retry 規則

- 只針對 HTTP 429 或暫時性 5xx 錯誤 retry
- 最多 retry 2 次
- 不要無限 retry
- 使用簡單 exponential backoff
- 建議等待：
  - 第一次 retry：2 秒
  - 第二次 retry：5 秒
- 若 Gemini response header 有 `Retry-After`，優先尊重 `Retry-After`
- 若 retry 後仍失敗，回傳清楚錯誤給前端

### 建議 helper

可以新增：

```text
src/lib/ai/retry.ts
```

或放在 Gemini provider 內。

範例概念：

```ts
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries: number;
    retryOn: (error: unknown) => boolean;
  }
): Promise<T> {
  // 最多重試 maxRetries 次
}
```

或直接在 Gemini provider 中實作簡單版本即可。

不需要做過度抽象。

---

## 五、429 錯誤回傳格式

如果最後仍遇到 429，後端 response 請回傳：

```json
{
  "ok": false,
  "error": "Gemini API 目前請求過於頻繁，請稍後再試。",
  "code": "GEMINI_RATE_LIMITED",
  "retryable": true,
  "details": []
}
```

請注意：

- 不要回傳 API key
- 不要回傳完整敏感 request
- 不要讓前端 crash
- 錯誤訊息要讓一般人看得懂

---

## 六、前端節流與按鈕鎖定

請修改 `/gemini-poc` 頁面。

當使用者按下：

```text
測試 Gemini 產生報告
```

後，請做：

1. loading 中禁用按鈕
2. request 完成前不可重複點擊
3. 成功或失敗後，啟動短暫 cooldown
4. cooldown 期間按鈕仍禁用
5. cooldown 結束後才允許再次測試

建議 cooldown：

```text
10 秒
```

按鈕文案可依狀態變化：

- 預設：`測試 Gemini 產生報告`
- loading：`正在呼叫 Gemini...`
- cooldown：`請稍候 10 秒後再測試`
- rate limited：`Gemini 請求過於頻繁，請稍後再試`

不需要做精緻倒數動畫，但如果容易實作，可以顯示剩餘秒數。

---

## 七、前端錯誤提示

如果後端回傳：

```text
GEMINI_RATE_LIMITED
```

請在 `/gemini-poc` 顯示明確提示：

```text
Gemini API 目前請求過於頻繁。請等待一段時間後再測，這通常是 Free Tier 或短時間多次呼叫造成的。
```

並保留原本輸入內容，不要清空表單。

---

## 八、人工內容複查輔助

第十一階段測試結果中，以下欄位仍多數是：

```text
待人工複查
```

包括：

- ProductShape 是否具體
- DontBuild 是否有針對性
- 7 天計畫是否偏驗證
- 語氣是否冷靜
- 有無過度承諾

請在 `/gemini-poc` 頁面新增「人工內容複查」區塊。

這不是自動評分，也不要接資料庫。

目標是讓我人工看完 Gemini 報告後，可以快速勾選並複製成 Markdown 測試紀錄。

---

## 九、人工內容複查欄位

請在 Gemini 成功產出報告後，顯示以下欄位：

### 1. ProductShape 是否具體

選項：

- 是
- 普通
- 否

說明文字：

```text
檢查 productShape 是否讓人能想像第一版產品長什麼樣，而不是只有抽象功能描述。
```

### 2. DontBuild 是否有針對性

選項：

- 是
- 普通
- 否

說明文字：

```text
檢查 dontBuild 是否針對這個副業點子，而不是每份報告都一樣的通用建議。
```

### 3. 7 天計畫是否偏驗證

選項：

- 是
- 普通
- 否

說明文字：

```text
檢查 validationPlan 是否偏向驗證需求與收第一筆錢，而不是直接開發完整產品。
```

### 4. 語氣是否冷靜保守

選項：

- 是
- 普通
- 否

說明文字：

```text
檢查報告是否冷靜、直接、偏保守，而不是鼓勵創業或畫大餅。
```

### 5. 是否有過度承諾

選項：

- 無
- 輕微
- 明顯

說明文字：

```text
檢查是否出現不合理保證，例如醫療效果保證、法律安全保證、一定會賺錢、一定有市場。
```

### 6. 風險判斷是否足夠

選項：

- 是
- 普通
- 否

說明文字：

```text
檢查是否有明確指出該點子的主要風險，例如法律、平台、維護、獲客、技術或責任風險。
```

### 7. 是否可接受作為產品報告

選項：

- 是
- 需小修
- 否

說明文字：

```text
人工綜合判斷這份 Gemini 報告是否可接受作為使用者會看到的產品報告。
```

### 8. 人工備註

textarea。

placeholder：

```text
記錄這次報告的具體問題，例如：productShape 太抽象、dontBuild 太通用、風險講太輕、分數偏高等。
```

---

## 十、複製測試紀錄 Markdown

請更新原本的「複製本次測試紀錄」功能。

讓它包含技術結果 + 人工複查結果。

格式要能直接貼進：

```text
docs/gemini-poc-test-results.md
```

範例格式：

```md
| 1 | 寵物飼料分析網站 | 1 | 是 | 是 | 無 | 無 | 無需修正 | 是 | 是 | 是 | 是 | 是 | 無 | score 61 / 風險有涵蓋，但 productShape 稍微偏抽象 |
```

欄位對應：

```text
| 編號 | 測試題 | 次數 | 成功呼叫 | JSON 合法 | Validate Errors | Warnings | Normalize | 可預覽 | ProductShape 具體 | DontBuild 有針對性 | 7 天計畫偏驗證 | 語氣冷靜 | 有無過度承諾 | 備註 |
```

如果某些人工欄位未填，請輸出：

```text
待人工複查
```

---

## 十一、測試結果文件更新

請更新：

```text
docs/gemini-poc-test-results.md
```

保留原本第十一階段結果，不要覆蓋掉。

請新增一個新區塊：

```md
# Gemini PoC 第二輪測試結果：429 防護後

## 測試日期

待填

## 測試環境

- Provider：Gemini
- Model：gemini-2.5-flash
- 測試頁：`/gemini-poc`
- 變更內容：429 retry / cooldown / 人工內容複查輔助

## 總結

| 項目 | 結果 |
|---|---|
| 總測試次數 | 9 |
| 成功預覽次數 | 待填 |
| HTTP 429 次數 | 待填 |
| retry 後成功次數 | 待填 |
| retry 後仍失敗次數 | 待填 |
| validate error 次數 | 待填 |
| warning 次數 | 待填 |
| normalize 修正次數 | 待填 |
| 明顯內容品質問題次數 | 待填 |
| 初步結論 | 待填 |

## 第二輪測試紀錄表

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

## 第二輪決策

請填入其中一項：

- Gemini 可進入正式 provider 候選
- Gemini 需要繼續修 429 / rate limit 防護
- Gemini 需要修 Prompt 後再測
- Gemini 需要修 Schema 後再測
- Gemini 暫不適合，改測 OpenAI
- 暫時不接真 AI，維持 mock / 手動流程
```

---

## 十二、測試計畫文件更新

請更新：

```text
docs/gemini-poc-test-plan.md
```

新增：

```md
## 第二輪測試：429 防護後

第一輪測試中，第 8 次遇到 Gemini API HTTP 429。

第二輪測試目的：

1. 驗證 retry / backoff 是否能降低 429 對測試流程的影響
2. 驗證前端 cooldown 是否能減少連續點擊造成的 API 壓力
3. 同時完成人工內容複查
4. 重新判斷 Gemini 是否可作為第一版 AI Provider 候選

第二輪仍使用三個固定測試題，每題三次，共 9 次。

第二輪額外觀察：

- 是否再次出現 HTTP 429
- 429 後 retry 是否成功
- 若 retry 失敗，前端錯誤提示是否清楚
- cooldown 是否正常避免連續呼叫
- 人工複查欄位是否方便使用
```

---

## 十三、README 更新

請更新 README，新增或補充：

```md
## Gemini 429 防護與第二輪測試

第一輪 Gemini PoC 測試中曾出現 HTTP 429，因此進入正式 provider 前，需要先處理 rate limit。

目前 Gemini PoC 包含：

- 後端 retry / backoff
- 429 友善錯誤提示
- 前端 loading 鎖定
- 前端 cooldown
- 人工內容複查欄位
- 可複製 Markdown 測試紀錄

完成後請再執行同樣 9 次測試，並記錄於：

- `docs/gemini-poc-test-results.md`
```

---

## 十四、完成後請回報

完成後請回報：

1. 新增或修改了哪些檔案
2. 429 retry / backoff 實作在哪裡
3. retry 次數是多少
4. backoff 秒數是多少
5. 前端 cooldown 秒數是多少
6. 429 時前端會顯示什麼
7. `/gemini-poc` 是否新增人工內容複查區
8. 複製 Markdown 測試紀錄是否包含人工複查欄位
9. `docs/gemini-poc-test-results.md` 是否新增第二輪測試表
10. `docs/gemini-poc-test-plan.md` 是否新增第二輪測試說明
11. README 是否更新
12. build 是否通過
13. 如何啟動與驗證

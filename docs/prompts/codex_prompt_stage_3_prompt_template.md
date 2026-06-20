# Codex 提示詞：第三階段建立 AI 分析 Prompt 模板

目前「副業點子冷靜評分器」Mock 版已完成，且 `/examples` 的三份範例報告都可以導向各自完整報告。

請進行第三階段：建立 AI 分析 Prompt 模板。

這次不要真正接 AI API、不要新增登入、不要新增付款、不要新增資料庫。

## 目標

先建立一個可維護的 `promptTemplate`，未來接 AI API 時可以讓模型依照目前 `MockReport` type 回傳相同資料結構。

---

## 一、新增 prompt template 檔案

請新增：

```text
src/lib/promptTemplate.ts
```

內容包含一個 function，例如：

```ts
buildEvaluationPrompt(input: EvaluationInput): string
```

`EvaluationInput` 結構應包含目前表單的三個欄位：

```ts
{
  idea: string;
  availableTime: string;
  avoidThings: string;
}
```

這個 function 要回傳完整 Prompt 字串。

---

## 二、Prompt 角色設定

Prompt 裡請設定 AI 的角色：

你是一位冷靜、務實、偏保守的副業產品策略顧問，專門幫一人副業者評估副業點子是否值得做。

你的任務不是鼓勵使用者創業，而是幫他判斷：

- 這個點子該做、該縮小，還是該放棄
- 是否適合一人下班時間完成
- 7～14 天內能不能做出 MVP
- 有沒有明顯法律、平台、維護、獲客風險
- 第一版產品應該長什麼樣
- 哪些功能應該立刻砍掉

語氣要冷靜、直接、具體，不要熱血、不畫大餅。

---

## 三、Prompt 要求 AI 產出 JSON

請在 Prompt 中明確要求：

只輸出 JSON，不要輸出 Markdown，不要輸出額外說明文字。

JSON 結構要符合目前 `MockReport` type。

請參考目前：

```text
src/data/mockReports.ts
```

輸出格式需包含：

```json
{
  "id": "generated-report",
  "title": "string",
  "score": 0,
  "scoreLabel": "string",
  "summary": "string",
  "dimensions": [
    {
      "name": "string",
      "score": 0,
      "maxScore": 0,
      "comment": "string"
    }
  ],
  "oneSentenceVerdict": "string",
  "strengths": ["string"],
  "risks": ["string"],
  "fatalWarnings": ["string"],
  "productShape": {
    "format": "string",
    "userFlow": ["string"],
    "userSees": ["string"],
    "firstVersionLook": ["string"]
  },
  "dontBuild": ["string"],
  "pricingSuggestion": "string",
  "validationPlan": [
    {
      "day": "string",
      "task": "string"
    }
  ]
}
```

---

## 四、評分維度規則

Prompt 裡請固定七大評分維度：

1. 個人契合度：滿分 15
2. MVP 難度：滿分 20
3. 需求強度：滿分 20
4. 付費可能性：滿分 15
5. 獲客難度：滿分 15
6. 法律與平台風險：滿分 10
7. 維護成本：滿分 5

總分為以上七項加總，滿分 100。

請提醒 AI：

- 高分不代表一定成功
- 分數要保守
- 如果資訊不足，不要自行過度腦補
- 使用者沒有提供的商業模式，不要硬寫得太肯定
- 遇到醫療、法律、金融、侵權、平台違規、第三方 API、官方素材等風險，要明確扣分
- 如果點子需要大量人際接觸、業務拜訪、人工維護，也要扣分

---

## 五、分數解讀規則

Prompt 裡請加入：

- 80～100：可以進入 MVP，但仍要縮小驗證
- 65～79：可以做，但必須縮小範圍
- 50～64：只適合做驗證頁，不建議直接開發
- 35～49：應大幅改題目或改商業模式
- 0～34：建議放棄或暫緩

`scoreLabel` 要依照分數產生，例如：

- 適合進入 MVP
- 可做，但必須縮小範圍
- 只適合先做驗證頁
- 不建議直接開發
- 建議放棄或暫緩

---

## 六、產品樣貌要求

`productShape` 是重點，請在 Prompt 裡明確要求 AI 不要只列功能。

AI 必須讓使用者看完後能想像第一版產品長什麼樣。

`productShape` 必須包含：

### format

描述產品形式，例如：

- 單頁式網頁工具
- 報告產生器
- 模板產生器
- 檢查清單工具

### userFlow

描述使用者操作流程，至少 4 步。

### userSees

描述使用者最後會看到什麼結果，至少 5 項。

### firstVersionLook

描述第一版畫面長相，至少 4 項。

---

## 七、立即砍掉清單要求

`dontBuild` 要非常具體。

請要求 AI 根據使用者限制，列出第一版不該做的功能。

常見應砍掉項目包括：

- 會員系統
- App
- 訂閱制
- 完整後台
- 大型資料庫
- 社群功能
- 長期追蹤
- 第三方平台串接
- 需要人工審核的流程
- 需要大量客服的功能

但 AI 要根據實際點子調整，不要每次完全一樣。

---

## 八、7 天驗證行動清單

`validationPlan` 固定輸出 7 天。

每一天一個 task。

任務要偏向驗證，不要偏向完整開發。

例如：

- Day 1：寫出一頁式 Landing Page 文案
- Day 2：製作 2～3 份範例成果
- Day 3：整理簡單表單或付款意願按鈕
- Day 4：到目標社群測試痛點
- Day 5：收集回饋
- Day 6：人工服務第一批使用者
- Day 7：判斷是否有人願意付費或留下聯絡方式

---

## 九、新增開發者測試頁，可選

如果方便，請新增一個只在開發階段使用的頁面：

```text
/prompt-preview
```

這個頁面不用正式設計，只要能：

- 顯示一組 sample input
- 顯示 `buildEvaluationPrompt(sampleInput)` 的輸出
- 方便我複製 Prompt 到 ChatGPT 測試

如果覺得會影響正式網站，也可以不加路由，只建立 `promptTemplate.ts` 即可。

---

## 十、完成後請回報

請完成後回報：

1. 新增或修改了哪些檔案
2. `buildEvaluationPrompt` 的輸入欄位
3. Prompt 要求輸出的 JSON shape
4. 是否有新增 `/prompt-preview`
5. 後續若要接 AI API，建議下一步改哪裡

# Codex 提示詞：第五階段手動 AI 產報告測試流程

目前「副業點子冷靜評分器」已完成：

1. Mock 版網站
2. 三份範例完整報告
3. Prompt Template
4. JSON Preview
5. Report JSON 驗證工具
6. Generated Report 預覽頁

請進行第五階段：建立「手動 AI 產報告測試流程」。

這次仍然不要真正接 AI API、不要新增登入、不要新增付款、不要新增資料庫。

## 目標

建立一個完整的開發測試閉環：

```text
使用者輸入副業點子
→ 網站產生完整 Prompt
→ 使用者複製 Prompt 到 ChatGPT
→ ChatGPT 回傳 JSON
→ 使用者貼回 JSON Preview
→ 網站驗證 JSON
→ 通過後渲染成完整報告
```

這一階段的目的，是在正式接 AI API 前，先測試：

- Prompt 產出的報告是否穩定
- JSON 是否容易通過驗證
- 報告內容是否夠具體
- productShape 是否真的能讓人想像產品樣貌
- dontBuild 是否有針對性
- validationPlan 是否偏向驗證，而不是直接開發
- 使用者體驗是否順

---

## 一、強化 /prompt-preview 頁面

如果目前已有 `/prompt-preview`，請強化它。

如果還沒有，請新增：

```text
/prompt-preview
```

這個頁面定位為開發測試工具，不是正式使用者功能。

頁面標題：

```text
Prompt Preview
```

頁面說明：

```text
這是開發測試用頁面。先輸入副業點子，產生給 AI 的完整 Prompt，再複製到 ChatGPT 測試 JSON 回傳品質。
```

---

## 二、/prompt-preview 表單欄位

請讓 `/prompt-preview` 使用與正式輸入頁相同的三個欄位：

1. 你的副業點子是什麼？
2. 你能投入多少時間？
3. 你不想做哪些事？

欄位名稱請對應目前 `EvaluationInput`：

```ts
{
  idea: string;
  availableTime: string;
  avoidThings: string;
}
```

請提供一組預設 sample input：

```ts
{
  idea: "我想做一個 AI 寵物飼料分析推薦網站",
  availableTime: "下班後每天 1～2 小時，週末半天",
  avoidThings: "不想拜訪客戶、不想做客服、不想上架 App、不想長期人工維護資料"
}
```

---

## 三、產生 Prompt 顯示區

在 `/prompt-preview` 頁面中，根據目前表單內容呼叫：

```ts
buildEvaluationPrompt(input)
```

並將產生的完整 Prompt 顯示在一個大型 textarea 或 code block 中。

需要提供按鈕：

```text
複製 Prompt
```

點擊後把完整 Prompt 複製到剪貼簿。

複製成功後顯示簡短提示：

```text
已複製 Prompt，可以貼到 ChatGPT 測試。
```

---

## 四、新增測試流程提示

在 `/prompt-preview` 頁面下方新增一個「測試流程」區塊。

內容：

```text
測試流程：

1. 在本頁填入副業點子
2. 複製下方 Prompt
3. 貼到 ChatGPT，要求它只回傳 JSON
4. 複製 ChatGPT 回傳的 JSON
5. 前往 JSON Preview
6. 貼上 JSON 並驗證
7. 驗證通過後查看 generated report
```

請在這個區塊放一個按鈕：

```text
前往 JSON Preview
```

連到：

```text
/json-preview
```

---

## 五、強化 /json-preview 頁面

請在 `/json-preview` 頁面上方新增提示：

```text
請貼上 AI 依照 Prompt 產出的 JSON。系統會先檢查 JSON 格式與報告資料結構，通過後才會產生報告預覽。
```

如果尚未有以下功能，請補上：

1. 載入範例 JSON
2. 清空 textarea
3. 驗證並預覽報告
4. 顯示驗證錯誤
5. 通過後導向 `/report/generated-preview`

---

## 六、新增「回到 Prompt Preview」連結

請在 `/json-preview` 頁面加入一個連結或按鈕：

```text
回到 Prompt Preview
```

連到：

```text
/prompt-preview
```

讓測試流程可以來回操作。

---

## 七、更新導覽列

請在 Header 或開發用導覽區加入兩個連結：

```text
Prompt Preview
JSON Preview
```

這兩個可以放在較不醒目的地方，因為是開發階段工具。

正式上線前可以移除。

---

## 八、驗證工具可用性檢查

請確認：

1. `/prompt-preview` 可以產生 Prompt
2. 複製 Prompt 按鈕可用
3. `/json-preview` 可以貼上 JSON
4. 錯誤 JSON 會顯示 parse error
5. 缺欄位 JSON 會顯示 validate error
6. 合格 JSON 會存入 localStorage
7. `/report/generated-preview` 可以正常渲染合格 JSON
8. 三份範例報告路由仍正常

---

## 九、這次不要做的事

請不要：

- 不要接 OpenAI API
- 不要新增後端
- 不要新增資料庫
- 不要新增登入
- 不要新增付款
- 不要做正式的報告歷史紀錄
- 不要把開發測試頁包裝成正式產品功能

---

## 十、完成後請回報

完成後請回報：

1. 修改或新增了哪些檔案
2. `/prompt-preview` 目前如何使用
3. `/json-preview` 目前如何使用
4. 是否有新增複製 Prompt 功能
5. 是否有新增 Prompt Preview 與 JSON Preview 導覽連結
6. 如何啟動與驗證
7. 下一步若要正式接 AI API，建議從哪個檔案開始

# Codex 提示詞：A 階段｜正式 AI MVP 接入 + 公開 Demo 整理

目前專案「副業點子冷靜評分器」已完成 Gemini PoC 第三輪測試。

第三輪結果：

- 總測試次數：9
- 成功預覽次數：9
- HTTP 429：0
- `GEMINI_TEMPORARY_ERROR`：0
- validate error：0
- `pricingTiers` error：0
- warning：0
- normalize 修正：0
- 明顯內容品質問題：1
- 結論：Gemini 可進入正式 provider 候選，但不代表立刻正式公開收費

現在要進入 A 階段：

```text
A 階段：正式 AI MVP 接入 + 公開 Demo 整理
```

目標：

> 讓正式輸入頁 `/evaluate` 可以使用 Gemini provider 產生真正 AI 報告，同時整理成可以給外部小流量測試的 AI 版 MVP。

---

## 一、重要原則

請務必遵守：

- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要新增正式使用者報告歷史
- 不要做會員系統
- 不要做後台
- 不要刪除 mock provider
- 不要刪除 Gemini PoC 頁
- 不要刪除 `/json-preview`
- 不要刪除 `/prompt-preview`
- 不要把 API key 寫進前端
- 不要把 API key 寫進 git
- 不要把 `.env` commit
- 不要輸出或顯示 `GEMINI_API_KEY`
- 不要把產品包裝成正式收費版
- 不要宣稱 AI 報告保證賺錢、保證成功、保證避開風險

這階段只做：

> 正式 AI MVP 接入 + 外部測試前整理。

---

## 二、目前技術狀態假設

專案應該已有或類似已有以下結構：

```text
src/lib/ai/types.ts
src/lib/ai/mockProvider.ts
src/lib/ai/geminiProvider.ts
src/lib/ai/getAiProvider.ts
src/lib/ai/evaluateWithProvider.ts
src/lib/promptTemplate.ts
src/lib/validateReport.ts
src/pages/EvaluatePage.tsx
src/pages/ReportPage.tsx
src/pages/GeminiPocPage.tsx
src/pages/JsonPreviewPage.tsx
src/pages/PromptPreviewPage.tsx
src/components/ReportView.tsx
```

如果檔名不同，請依現有專案結構調整，不要硬新增重複檔案。

---

## 三、A 階段核心決策

正式 `/evaluate` 要接 AI provider，但必須可切換：

```text
AI_PROVIDER=mock    → /evaluate 使用 mock provider
AI_PROVIDER=gemini  → /evaluate 使用 Gemini provider
```

Gemini 成功時：

```text
使用者填寫 /evaluate
→ 呼叫 evaluateWithProvider(input)
→ 取得 report
→ normalize / validate
→ 存入 localStorage 或目前既有 generated report 狀態
→ 導向 /report/generated-preview
```

Gemini 失敗時：

```text
不要清空使用者輸入
不要讓頁面 crash
顯示友善錯誤
提供 fallback：
1. 改用 Mock 報告
2. 複製 Prompt，改用手動測試
3. 前往 JSON Preview
```

---

## 四、正式 /evaluate 接 evaluateWithProvider

請修改 `/evaluate` 頁面。

送出表單時，不要只導向固定 mock report。

應改為：

1. 讀取表單資料：
   - idea
   - availableTime
   - avoidThings

2. 呼叫：

```ts
evaluateWithProvider(input)
```

3. 成功後：
   - 取得 `report`
   - 取得 `warnings`
   - 執行必要 validate / normalize
   - 儲存成 generated report
   - 導向：

```text
/report/generated-preview
```

4. 如果目前已有 `generated-preview` 的 localStorage key，沿用既有 key。
5. 如果沒有，請建立清楚命名，例如：

```text
side-project-generated-report
```

不要新增資料庫。

---

## 五、保留 Mock Provider

請確認 mock provider 仍可用。

當 `.env` 設定：

```env
AI_PROVIDER=mock
```

或 provider 未設定時，應使用 mock provider。

Mock provider 的用途：

- 本機展示
- API 失敗 fallback
- 不想消耗 Gemini API 時測試 UI
- 外部展示前緊急備援

請不要刪除 mock provider，也不要讓 mock provider 壞掉。

---

## 六、Gemini Provider 使用條件

當 `.env` 設定：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

`/evaluate` 應使用 Gemini provider。

請注意：

- API Key 只能在 server side / backend 使用
- 不得使用 `VITE_GEMINI_API_KEY`
- 不得把 key 暴露給前端 bundle
- `.env.example` 只保留空值
- README 補充設定方式，但不要寫真實 key

---

## 七、/evaluate loading 狀態

請新增或調整 loading UX。

按下送出後：

- 禁用送出按鈕
- 防止重複送出
- 顯示 loading 文案

建議文案：

```text
正在產生 AI 評估報告，通常需要 10～30 秒...
```

或：

```text
正在冷靜評估這個副業點子...
```

loading 中不要清空表單。

如果成功導向報告頁，loading 自然結束。

如果失敗，恢復按鈕狀態。

---

## 八、/evaluate 錯誤處理

如果 Gemini 或 provider 呼叫失敗，請顯示友善錯誤。

### Rate limit

如果錯誤 code 是：

```text
GEMINI_RATE_LIMITED
```

顯示：

```text
AI 目前請求過於頻繁，請稍後再試。你的輸入內容已保留。
```

### Temporary error

如果錯誤 code 是：

```text
GEMINI_TEMPORARY_ERROR
```

顯示：

```text
AI 暫時無法回應，請稍後重試。你也可以改用 Mock 報告或複製 Prompt 手動測試。
```

### 其他錯誤

顯示：

```text
AI 報告產生失敗，請稍後重試。你的輸入內容已保留。
```

請避免顯示過度技術化錯誤，例如完整 stack trace、API response 原文、API key、request body。

---

## 九、/evaluate fallback：改用 Mock 報告

在 AI 失敗時，提供按鈕：

```text
改用 Mock 報告預覽
```

功能：

- 不重新呼叫 Gemini
- 使用 mock provider 或既有 mock report
- 產生一份可預覽報告
- 導向 `/report/generated-preview` 或既有 mock report 頁

目的：

> 讓外部測試時即使 Gemini 失敗，也不會整個流程中斷。

請在備註或 UI 中清楚標示：

```text
這是 Mock 報告，用於展示報告格式，不代表你的點子已被 AI 實際分析。
```

---

## 十、/evaluate fallback：複製 Prompt 手動測試

在 AI 失敗時，提供按鈕：

```text
複製 Prompt，改用手動測試
```

功能：

1. 使用目前表單輸入
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

---

## 十一、報告頁 generated-preview

請確認 `/report/generated-preview` 可以正確讀取 `/evaluate` 產出的 generated report。

成功報告頁應顯示：

- score
- scoreLabel
- summary
- oneSentenceVerdict
- dimensions
- strengths
- risks
- fatalWarnings
- productShape
- dontBuild
- pricingSuggestion
- validationPlan

如果 localStorage 沒有 generated report，請顯示友善狀態：

```text
目前沒有可預覽的 AI 報告。請先回到輸入頁產生報告。
```

並提供按鈕：

```text
回到輸入頁
```

連到：

```text
/evaluate
```

不要讓頁面 crash。

---

## 十二、公開 Demo 整理：導覽列

一般使用者主導覽只保留：

```text
首頁
輸入點子
範例報告
```

不要在一般主導覽顯示：

```text
/gemini-poc
/json-preview
/prompt-preview
/report/generated-preview
```

但這些頁面不要刪除。

它們應該只在 dev tools 區塊顯示，並由 env 控制：

```env
VITE_SHOW_DEV_TOOLS=true
```

當 `VITE_SHOW_DEV_TOOLS=false` 或未設定時，一般使用者不應在導覽或 footer 看到開發工具入口。

---

## 十三、公開 Demo 整理：首頁文案

請調整首頁文案，避免仍像純 Mock Demo。

首頁可以改成：

```text
用 AI 幫你冷靜評估副業點子：該做、縮小，還是先放棄。
```

加入測試版提醒：

```text
目前為 AI 測試版，報告僅供副業規劃參考，不保證市場需求、收入結果或法律風險完全正確。
```

保留產品定位：

```text
這不是創業打氣工具，而是幫你提早看見阻力、砍掉不必要功能，避免投入太多時間在錯的方向。
```

首頁 CTA：

```text
開始評估我的副業點子
```

連到：

```text
/evaluate
```

---

## 十四、公開 Demo 整理：輸入頁文案

`/evaluate` 頁面請明確說明：

```text
請輸入你的副業點子、可投入時間，以及你不想做的事。AI 會用偏保守、冷靜的標準，產生一份 MVP 可行性評估報告。
```

加入提醒：

```text
這份報告是初步決策輔助，不是創業保證，也不是法律、財務或專業顧問意見。
```

保留三個欄位：

1. 副業點子
2. 可投入時間
3. 不想做的事情

不要重新加回太多欄位。

---

## 十五、公開 Demo 整理：報告頁免責

在 AI generated report 頁或 ReportView 底部加入輕量免責：

```text
本報告由 AI 根據你的輸入產生，僅供副業規劃與 MVP 驗證參考，不保證市場需求、收入結果、法律合規或平台審核結果。
```

如果報告涉及寵物、健康、金融、法律等高風險領域，仍提醒使用者需要專業判斷。

不要把免責做得太嚇人，但要清楚。

---

## 十六、公開 Demo 整理：不要過度包裝

請避免新增以下類型文案：

- 保證找到賺錢副業
- 幫你打造被動收入
- AI 幫你找到高勝率創業機會
- 立即變現
- 保證避開失敗
- 保證市場會買單

產品語氣應保持：

- 冷靜
- 保守
- 直接
- 具體
- 不畫大餅

---

## 十七、成本與使用提醒

由於 Gemini 已開啟付費，請在 README 或開發文件補充：

```text
Gemini 已可作為正式 provider 候選。
目前 PoC 測試 9 次成本估算約 1.5 台幣，費用暫不作為主要限制。
但正式公開前仍需保留 cooldown、錯誤提示、fallback 與使用限制，避免重複送出造成不必要成本。
```

不需要在使用者前台顯示 API 成本。

---

## 十八、README 更新

請更新 README，新增：

```md
## AI MVP 模式

目前 `/evaluate` 可透過 `AI_PROVIDER` 切換 provider。

### 使用 Mock Provider

```env
AI_PROVIDER=mock
```

用途：

- UI 開發
- Demo 展示
- 不消耗 Gemini API
- Gemini 失敗時 fallback

### 使用 Gemini Provider

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

注意：

- `GEMINI_API_KEY` 只能放在 server side `.env`
- 不要使用 `VITE_GEMINI_API_KEY`
- 不要 commit `.env`
- `.env.example` 不應包含真實 key

### 正式 AI MVP 流程

```text
/evaluate
→ evaluateWithProvider(input)
→ Gemini 或 Mock provider
→ validate / normalize report
→ localStorage generated report
→ /report/generated-preview
```

### Fallback

如果 Gemini 失敗：

- 可改用 Mock 報告預覽
- 可複製 Prompt 手動測試
- 可前往 JSON Preview 貼上手動 JSON
```

---

## 十九、更新 docs

請新增或更新文件：

```text
docs/ai-mvp-flow.md
```

內容簡要描述：

1. `/evaluate` 如何呼叫 provider
2. `AI_PROVIDER=mock` 與 `AI_PROVIDER=gemini` 的差異
3. 成功時如何導向 `/report/generated-preview`
4. 失敗時有哪些 fallback
5. 哪些頁面是 dev tools
6. 目前尚未做登入、付款、資料庫
7. 這階段只適合小流量外部測試，不是正式收費版

---

## 二十、基本驗證

完成後請執行：

```bash
npm run build
```

如果專案有 lint / test，也請執行：

```bash
npm run lint
npm test
```

如果沒有這些 script，請不要硬跑不存在的指令。

---

## 二十一、手動驗證流程

請手動驗證：

### Mock provider

設定：

```env
AI_PROVIDER=mock
```

驗證：

1. 開啟 `/evaluate`
2. 填入三個欄位
3. 送出
4. 成功產生 mock generated report
5. 導向 `/report/generated-preview`
6. 報告頁不 crash

### Gemini provider

設定：

```env
AI_PROVIDER=gemini
```

驗證：

1. 開啟 `/evaluate`
2. 填入三個欄位
3. 送出
4. 顯示 loading
5. 成功產生 Gemini report
6. 導向 `/report/generated-preview`
7. 報告頁不 crash
8. 不出現 validate error

### fallback

可以用臨時方式模擬 Gemini 失敗，但不要破壞正式程式。

驗證：

1. AI 失敗時，表單內容保留
2. 錯誤訊息友善
3. 「改用 Mock 報告預覽」可用
4. 「複製 Prompt，改用手動測試」可用
5. `/json-preview` 連結可用

### dev tools visibility

驗證：

1. `VITE_SHOW_DEV_TOOLS=true` 時可看到 dev tools 入口
2. `VITE_SHOW_DEV_TOOLS=false` 或未設定時，一般導覽不顯示 dev tools
3. `/gemini-poc`、`/json-preview`、`/prompt-preview` 頁面仍可直接開啟，不被刪除

---

## 二十二、完成後請回報

完成後請回報：

1. 修改了哪些檔案
2. `/evaluate` 是否已接 `evaluateWithProvider`
3. `AI_PROVIDER=mock` 是否可用
4. `AI_PROVIDER=gemini` 是否可用
5. Gemini 成功後是否導向 `/report/generated-preview`
6. generated report 儲存在哪個 localStorage key
7. Gemini 失敗時有哪些 fallback
8. 是否新增「改用 Mock 報告預覽」
9. 是否新增「複製 Prompt，改用手動測試」
10. `/json-preview` fallback 連結是否可用
11. dev tools 是否只在 `VITE_SHOW_DEV_TOOLS=true` 顯示
12. 首頁文案是否已改成 AI 測試版
13. `/evaluate` 文案是否已改成 AI 測試版
14. 報告頁是否加入免責說明
15. README 是否更新
16. `docs/ai-mvp-flow.md` 是否新增或更新
17. build 是否通過
18. 是否有任何需要我人工確認的地方

請不要輸出 API Key。

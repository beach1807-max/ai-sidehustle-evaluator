# Codex 提示詞：第七階段公開展示前整理

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

現在請進行第七階段：公開展示前整理。

這次不要接真實 AI API、不要新增登入、不要新增付款、不要新增資料庫。

---

## 目標

讓網站可以比較安全地作為 Mock Demo 給別人看。

目前 `/prompt-preview` 與 `/json-preview` 是開發工具，應該保留，但不要出現在一般使用者主要導覽中。

這一階段要做：

1. 隱藏開發工具導覽
2. 建立開發工具入口控制
3. 讓首頁、輸入頁、範例報告頁、報告頁看起來像正式產品
4. 保留開發工具頁面，方便我自己測試
5. 增加 Mock Demo 提示，避免使用者誤以為已經是真 AI 分析

---

## 一、導覽列調整

請修改 Header / Layout 導覽列。

一般使用者主要導覽只保留：

- 首頁
- 輸入點子
- 範例報告

請不要在主要導覽列顯示：

- Prompt Preview
- JSON Preview

但路由仍然保留：

- `/prompt-preview`
- `/json-preview`
- `/report/generated-preview`

---

## 二、新增開發工具入口控制

請新增一個環境變數控制是否顯示開發工具入口。

在 `.env.example` 加入：

```env
VITE_SHOW_DEV_TOOLS=false
```

如果 `VITE_SHOW_DEV_TOOLS=true`，才在導覽列或 Footer 顯示：

- Prompt Preview
- JSON Preview

如果沒有設定或是 false，就不要顯示。

注意：

- 這只是 UI 隱藏，不是安全機制
- 路由可以繼續存在
- 目標只是避免一般使用者看到開發工具

---

## 三、Footer 調整

請新增或調整 Footer。

Footer 內容可以包含：

```text
副業點子冷靜評分器
Mock 版產品體驗，適合先驗證價值感。
冷靜、直接、先縮小。
```

如果 `VITE_SHOW_DEV_TOOLS=true`，Footer 可以顯示一個小區塊：

```text
開發工具：
Prompt Preview
JSON Preview
```

如果 false，不顯示這個區塊。

---

## 四、首頁增加 Mock Demo 提示

請在首頁 Hero 區塊附近加入一個不干擾的提示：

```text
目前為 Mock Demo：評估流程與報告版型已完成，AI 客製化分析仍在測試中。
```

這個提示不要太大，不要破壞產品感。

目標是：

- 讓使用者知道目前不是正式 AI 分析
- 但不要讓網站看起來很陽春

---

## 五、輸入頁提示調整

目前 `/evaluate` 若已經改成走 mock provider，請在輸入頁加上小提示：

```text
目前為 Mock Demo，送出後會產生一份模擬評估報告，用來展示未來 AI 分析體驗。
```

如果目前走的是 mock provider，請不要誤導使用者說這是真 AI 分析。

送出按鈕可以維持：

```text
開始冷靜評估
```

但 loading 文案請避免說「AI 正在分析」，可以改成：

```text
正在產生模擬評估報告...
```

---

## 六、Generated Preview 頁面提示

如果 `/report/generated-preview` 顯示的是 mock provider 產生的資料，請在報告上方加一個小型提示：

```text
這是 Mock Provider 產生的報告，用於測試未來 AI 評估流程。
```

如果資料來源無法判斷，至少保留一般提示：

```text
目前為測試版報告，請以產品體驗與報告結構為主。
```

---

## 七、ExamplesPage 調整

範例報告頁請保持公開可見。

請確認三份範例卡片仍然可以正常連到：

- `/report/ai-pet-monitor`
- `/report/pet-food-analysis`
- `/report/side-project-scorer`

範例頁可以加一句說明：

```text
以下範例用來展示這套評分器的判斷風格。正式 AI 客製化分析仍在測試中。
```

---

## 八、README 更新

請更新 README，加入：

```md
## 開發工具頁面

本專案保留以下開發測試頁：

- `/prompt-preview`：產生給 AI 的 Prompt
- `/json-preview`：貼上 AI 回傳 JSON 並驗證
- `/report/generated-preview`：預覽 generated report

預設不在導覽列顯示開發工具。

若要在導覽列或 Footer 顯示開發工具入口，請設定：

```env
VITE_SHOW_DEV_TOOLS=true
```

正式展示或部署 Mock Demo 時，建議維持：

```env
VITE_SHOW_DEV_TOOLS=false
```
```

---

## 九、確認 build

請執行：

```bash
npm run build
```

並確認 build 通過。

請也確認以下路由可用：

- `/`
- `/evaluate`
- `/examples`
- `/report/ai-pet-monitor`
- `/report/pet-food-analysis`
- `/report/side-project-scorer`
- `/prompt-preview`
- `/json-preview`
- `/report/generated-preview`

---

## 十、這次不要做的事

請不要：

- 不要接真實 AI API
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要刪除開發工具頁
- 不要刪除 AI Provider 抽象層
- 不要移除 mock provider
- 不要讓主要導覽列塞滿開發工具

這次只做：

> 讓 Mock Demo 看起來更像可以給別人看的產品，同時保留開發測試工具。

---

## 十一、完成後請回報

完成後請回報：

1. 修改了哪些檔案
2. 主要導覽列現在顯示哪些項目
3. `VITE_SHOW_DEV_TOOLS` 如何控制開發工具入口
4. `/prompt-preview` 與 `/json-preview` 是否仍可直接輸入網址使用
5. 首頁與輸入頁新增了哪些 Mock Demo 提示
6. build 是否通過
7. 如何啟動與驗證

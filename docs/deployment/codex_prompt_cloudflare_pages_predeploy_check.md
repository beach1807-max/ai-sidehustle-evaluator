# Codex 提示詞：Cloudflare Pages 部署前檢查

目前專案「副業點子冷靜評分器」已完成：

- Gemini PoC 第三輪測試通過
- `/evaluate` 已接 `evaluateWithProvider`
- `AI_PROVIDER=mock` / `AI_PROVIDER=gemini` 可切換
- `/report/generated-preview` 可顯示 generated report
- Gemini 失敗時已有 fallback
- 公開 Demo 文案已整理
- dev tools 入口應由 `VITE_SHOW_DEV_TOOLS` 控制

現在要做的是：

> Cloudflare Pages 部署前檢查。

這次只檢查，不要直接部署，不要推送，不要改金流，不要新增登入、付款、資料庫。

---

## 一、這次檢查目標

請幫我確認以下 7 件事：

1. `npm run build` 是否通過
2. `dist` 是否正常產生
3. `.env` 是否沒有被 commit / 追蹤
4. API Key 是否沒有使用 `VITE_` 前綴
5. `/evaluate` 線上需要的 API route 是否存在
6. 是否需要 `public/_redirects`
7. `VITE_SHOW_DEV_TOOLS=false` 是否能隱藏工具入口

---

## 二、重要安全規則

請務必遵守：

- 不要輸出、顯示、複製或記錄 `GEMINI_API_KEY`
- 不要把 `.env` commit
- 不要把 API Key 寫進任何文件
- 不要把 API Key 改成 `VITE_GEMINI_API_KEY`
- 不要刪除 mock provider
- 不要刪除 Gemini provider
- 不要刪除 `/gemini-poc`
- 不要刪除 `/json-preview`
- 不要刪除 `/prompt-preview`
- 不要直接部署
- 不要直接 push，除非我之後明確要求
- 不要新增登入、付款、資料庫、會員或後台

---

## 三、檢查 1：npm run build 是否通過

請先確認專案根目錄有：

```text
package.json
```

再執行：

```bash
npm install
npm run build
```

如果有 lint 或 test script，可以檢查但不要硬跑不存在的指令。

請回報：

- 使用的 Node / npm 版本
- `npm install` 是否成功
- `npm run build` 是否成功
- 如果失敗，請列出錯誤摘要與需要修的檔案

不要只貼整段冗長 log，請整理重點。

---

## 四、檢查 2：dist 是否正常產生

build 通過後，請確認是否產生：

```text
dist/
```

請檢查：

- `dist/index.html` 是否存在
- `dist/assets/` 是否存在
- build output directory 是否應設定為 `dist`

如果不是 Vite 或輸出資料夾不同，請根據專案實際設定回報。

Cloudflare Pages build output directory 預設建議：

```text
dist
```

---

## 五、檢查 3：.env 是否沒被 commit

請檢查：

```bash
git status
git ls-files | grep ".env"
```

Windows 環境可改用等效指令。

請確認：

- `.env` 沒有出現在 git tracked files
- `.env.local` 沒有出現在 git tracked files
- `.gitignore` 有包含：

```gitignore
.env
.env.local
```

如果 `.env` 已被 git 追蹤，請不要直接 push，先回報並建議處理方式：

```bash
git rm --cached .env
git rm --cached .env.local
```

但除非確定檔案存在且被追蹤，否則不要亂執行。

---

## 六、檢查 4：API Key 是否沒有 VITE_ 前綴

請搜尋專案內是否出現以下危險字串：

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_ANTHROPIC_API_KEY
```

也請檢查是否有把 API Key 放在前端可見檔案，例如：

```text
src/
public/
README
docs/
.env.example
```

正確做法：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
VITE_SHOW_DEV_TOOLS=false
```

錯誤做法：

```env
VITE_GEMINI_API_KEY=
```

請回報：

- 是否找到 `VITE_GEMINI_API_KEY`
- 是否找到任何疑似真實 API Key
- `.env.example` 是否只保留空值
- README 是否沒有真實 key

如果有疑似 key，請不要輸出完整內容，只回報「疑似有 key，位於哪個檔案」。

---

## 七、檢查 5：/evaluate 線上需要的 API route 是否存在

這是最重要的部署前檢查。

請確認 `/evaluate` 在部署到 Cloudflare Pages 後，是否仍能呼叫 Gemini。

重點：

```text
瀏覽器前端不能直接呼叫 Gemini API。
Gemini API Key 只能在 server side / Pages Function / API route 使用。
```

請檢查目前架構是以下哪一種：

### 情境 A：已有 serverless API route / Cloudflare Pages Function

例如存在：

```text
functions/api/evaluate.ts
functions/api/gemini.ts
src/pages/api/evaluate.ts
app/api/evaluate/route.ts
server/api/evaluate.ts
```

或專案框架對應的 API route。

如果有，請確認：

- route 是否讀取 server-side `GEMINI_API_KEY`
- route 是否呼叫 Gemini
- 前端 `/evaluate` 是否呼叫這個 route
- route 是否回傳 report / error
- Cloudflare Pages 是否支援這個 route 結構

### 情境 B：目前只有純前端，沒有 API route

如果專案是純 Vite SPA，且沒有 Cloudflare Pages Function 或其他後端 route，請明確回報：

```text
目前純靜態部署到 Cloudflare Pages 後，/evaluate 可能無法安全呼叫 Gemini，因為缺少 server-side API route。
```

這時請不要把 API Key 放前端。

請建議下一步需要新增：

```text
functions/api/evaluate.ts
```

或依專案架構建立正確的 Cloudflare Pages Function。

### 情境 C：目前本機可用，但線上不確定

如果本機是透過 Node server 或 dev middleware 呼叫 Gemini，但 Cloudflare Pages 部署後沒有對應 serverless route，也請回報風險。

請在回報中明確寫：

- `/evaluate` 線上可部署為純靜態嗎？
- 是否需要 Pages Function？
- 現有 API route 路徑是什麼？
- 前端目前呼叫哪個 URL？
- Cloudflare Pages 需要設定哪些環境變數？

---

## 八、檢查 6：是否需要 public/_redirects

如果這是 Vite / React Router / SPA 專案，Cloudflare Pages 直接重新整理：

```text
/evaluate
/report/generated-preview
/examples
```

可能會出現 404。

請檢查是否已有：

```text
public/_redirects
```

內容應類似：

```text
/* /index.html 200
```

如果沒有，而且專案是 SPA，請新增：

```text
public/_redirects
```

內容：

```text
/* /index.html 200
```

新增後請再次執行：

```bash
npm run build
```

確認 `dist/_redirects` 有被產生。

如果專案不是 SPA 或已有其他 Cloudflare Pages routing 設定，請回報實際狀況，不要重複新增。

---

## 九、檢查 7：VITE_SHOW_DEV_TOOLS=false 是否能隱藏工具入口

請檢查 dev tools 顯示邏輯。

當環境變數為：

```env
VITE_SHOW_DEV_TOOLS=true
```

可以顯示開發工具入口，例如：

```text
/gemini-poc
/json-preview
/prompt-preview
```

當環境變數為：

```env
VITE_SHOW_DEV_TOOLS=false
```

或未設定時，一般使用者導覽列 / footer 不應顯示：

```text
/gemini-poc
/json-preview
/prompt-preview
/report/generated-preview
```

但頁面不要刪除，直接輸入網址仍可開啟沒關係。

請檢查：

- Header / Navbar
- Footer
- Home page links
- Examples page links
- 其他可能露出 dev tools 的地方

請回報：

- `VITE_SHOW_DEV_TOOLS=false` 是否能隱藏入口
- 是否有任何 dev tools 連結仍出現在一般 UI
- 如有，請修正

---

## 十、Cloudflare Pages 建議設定輸出

請最後整理一份部署設定建議：

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Production branch: main
```

Production environment variables 建議：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<在 Cloudflare Pages 後台設定，不要寫入 repo>
GEMINI_MODEL=gemini-2.5-flash
VITE_SHOW_DEV_TOOLS=false
```

Preview environment variables 可以建議：

```env
AI_PROVIDER=mock
VITE_SHOW_DEV_TOOLS=true
```

如果目前專案需要 Pages Function，請補充 Cloudflare Pages 是否需要特殊設定。

---

## 十一、完成後請回報

完成後請回報以下項目：

1. `npm run build` 是否通過
2. `dist` 是否正常產生
3. `dist/index.html` 是否存在
4. `.env` 是否未被 git 追蹤
5. `.gitignore` 是否包含 `.env` / `.env.local`
6. 是否找到任何 `VITE_GEMINI_API_KEY`
7. 是否找到疑似真實 API Key 被寫進 repo
8. `/evaluate` 線上需要的 API route 是否存在
9. 現有 API route 路徑是什麼
10. 前端 `/evaluate` 呼叫哪個 endpoint
11. 是否需要新增或已新增 `public/_redirects`
12. build 後 `dist/_redirects` 是否存在
13. `VITE_SHOW_DEV_TOOLS=false` 是否能隱藏工具入口
14. Cloudflare Pages build command 建議
15. Cloudflare Pages output directory 建議
16. Production env vars 建議
17. Preview env vars 建議
18. 是否有任何部署前阻塞問題

請用「通過 / 需修正 / 阻塞」分類回報。

請不要輸出 API Key。

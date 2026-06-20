# Codex 提示詞：Cloudflare Pages 部署前複檢

目前專案「副業點子冷靜評分器」已完成：

- A 階段：正式 AI MVP 接入 + 公開 Demo 整理
- `/evaluate` 已接 `evaluateWithProvider`
- `AI_PROVIDER=mock` / `AI_PROVIDER=gemini` 可切換
- `/report/generated-preview` 可顯示 generated report
- dev tools 入口已由 `VITE_SHOW_DEV_TOOLS` 控制
- Gemini PoC 第三輪測試通過
- Cloudflare Pages 部署前曾發現缺少 `/api/evaluate` Pages Function
- 已新增 Cloudflare Pages Function：`functions/api/evaluate.ts`

現在要做的是：

> Cloudflare Pages 部署前複檢。

這次只做檢查與必要的小修正，不要直接部署，不要 push，不要新增功能。

---

## 一、這次複檢目標

請確認以下 10 件事：

1. `npm run build` 是否通過
2. `dist` 是否正常產生
3. `dist/_redirects` 是否存在
4. `functions/api/evaluate.ts` 是否存在
5. `/api/evaluate` 是否從 `context.env` 讀 `GEMINI_API_KEY`
6. 前端是否呼叫 `/api/evaluate`，而不是 localhost 或 Gemini 官方 URL
7. repo 裡沒有 `VITE_GEMINI_API_KEY`
8. `.env` 沒被 git 追蹤
9. `VITE_SHOW_DEV_TOOLS=false` 是否能隱藏工具入口
10. Cloudflare Pages env vars 清單是否明確

---

## 二、重要安全規則

請務必遵守：

- 不要輸出、顯示、複製或記錄 `GEMINI_API_KEY`
- 不要把 `.env` commit
- 不要把 API Key 寫進任何文件
- 不要新增 `VITE_GEMINI_API_KEY`
- 不要把 API Key 放進 `src/`、`public/`、README、docs
- 不要刪除 mock provider
- 不要刪除 Gemini provider
- 不要刪除 `/gemini-poc`
- 不要刪除 `/json-preview`
- 不要刪除 `/prompt-preview`
- 不要直接部署
- 不要直接 push
- 不要新增登入、付款、資料庫、會員或後台

這次只做：

> 部署前複檢與必要的小修正。

---

## 三、檢查 1：npm run build 是否通過

請確認在專案根目錄。

先檢查：

```bash
node -v
npm -v
```

再執行：

```bash
npm install
npm run build
```

請回報：

- Node 版本
- npm 版本
- `npm install` 是否成功
- `npm run build` 是否成功

如果 build 失敗，請整理錯誤重點：

- 哪個檔案
- 哪個錯誤
- 是否為部署阻塞
- 是否已修正

不要貼整段冗長 log。

---

## 四、檢查 2：dist 是否正常產生

build 成功後，請確認：

```text
dist/
dist/index.html
dist/assets/
```

請回報：

- `dist` 是否存在
- `dist/index.html` 是否存在
- `dist/assets/` 是否存在
- Cloudflare Pages build output directory 是否應設定為 `dist`

---

## 五、檢查 3：dist/_redirects 是否存在

請確認專案是否有：

```text
public/_redirects
```

內容應為：

```text
/* /index.html 200
```

build 後請確認：

```text
dist/_redirects
```

存在。

如果 `public/_redirects` 不存在，而專案是 Vite / React Router / SPA，請新增：

```text
public/_redirects
```

內容：

```text
/* /index.html 200
```

新增後重新執行：

```bash
npm run build
```

並確認：

```text
dist/_redirects
```

存在。

原因：

> Cloudflare Pages 上直接刷新 `/evaluate`、`/examples`、`/report/generated-preview` 時，需要 SPA fallback，避免 404。

---

## 六、檢查 4：functions/api/evaluate.ts 是否存在

請確認：

```text
functions/api/evaluate.ts
```

存在。

請檢查它是否支援：

```text
POST /api/evaluate
```

並確認至少包含：

- 讀取 request body
- 驗證 `idea`
- 驗證 `availableTime`
- 驗證 `avoidThings`
- 呼叫 provider
- 回傳 JSON
- 錯誤時回傳友善錯誤格式

---

## 七、檢查 5：/api/evaluate 是否從 context.env 讀 GEMINI_API_KEY

請檢查 `functions/api/evaluate.ts` 是否從 Cloudflare Pages Function 的 `context.env` 讀取：

```text
AI_PROVIDER
GEMINI_API_KEY
GEMINI_MODEL
```

正確概念：

```ts
export async function onRequestPost(context) {
  const { request, env } = context;
}
```

請確認：

- `GEMINI_API_KEY` 是從 `context.env` 取得
- 不是從前端取得
- 不依賴 `VITE_GEMINI_API_KEY`
- 不把 key 回傳給前端
- 不在 console log 中印出 key

如果現有 provider 也支援本機 `process.env`，可以保留，但 Cloudflare Pages Function 不能只依賴 `process.env`。

---

## 八、檢查 6：前端是否呼叫 /api/evaluate

請檢查 `/evaluate` 前端送出表單時，是否呼叫：

```text
/api/evaluate
```

正確：

```ts
fetch("/api/evaluate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input)
})
```

錯誤：

```text
http://localhost:xxxx/api/evaluate
https://generativelanguage.googleapis.com/...
```

請確認：

- 前端沒有硬寫 localhost endpoint
- 前端沒有直接呼叫 Gemini 官方 API
- 前端沒有帶 API key
- 前端保留錯誤 fallback

---

## 九、檢查 7：repo 裡沒有 VITE_GEMINI_API_KEY

請搜尋：

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_ANTHROPIC_API_KEY
```

如果找到，請判斷是否只是文件中的「錯誤示範」。

- 如果只是文件中明確寫「不要使用 VITE_GEMINI_API_KEY」，可接受
- 如果是 `.env.example` 或程式碼實際使用，需修正
- 如果疑似真實 key，請不要輸出完整 key，只回報檔案位置

請確認 `.env.example` 應該是：

```env
AI_PROVIDER=mock

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

VITE_SHOW_DEV_TOOLS=true
```

不要有：

```env
VITE_GEMINI_API_KEY=
```

---

## 十、檢查 8：.env 沒被 git 追蹤

請檢查：

```bash
git status
git ls-files
```

確認以下檔案沒有被追蹤：

```text
.env
.env.local
```

也請確認 `.gitignore` 包含：

```gitignore
.env
.env.local
```

如果 `.env` 已被追蹤，這是部署前阻塞。

請不要 push。

請回報建議處理方式：

```bash
git rm --cached .env
git rm --cached .env.local
```

但不要在不確定檔案是否存在時亂執行。

---

## 十一、檢查 9：VITE_SHOW_DEV_TOOLS=false 是否能隱藏工具入口

請檢查 dev tools 顯示邏輯。

當：

```env
VITE_SHOW_DEV_TOOLS=false
```

或未設定時，一般使用者導覽列 / footer / 首頁不應顯示：

```text
/gemini-poc
/json-preview
/prompt-preview
/report/generated-preview
```

但這些頁面可以保留，不需要刪除。

請檢查：

- Header / Navbar
- Footer
- Home page
- Examples page
- 其他一般使用者會看到的連結

如果有 dev tools 入口仍出現在一般 UI，請修正。

---

## 十二、檢查 10：Cloudflare Pages env vars 清單

請整理最後建議設定。

Cloudflare Pages Build settings：

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Production branch: main
```

Production environment variables：

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<在 Cloudflare Pages 後台設定，不要寫入 repo>
GEMINI_MODEL=gemini-2.5-flash
VITE_SHOW_DEV_TOOLS=false
```

Preview environment variables：

```env
AI_PROVIDER=mock
VITE_SHOW_DEV_TOOLS=true
```

請確認文件中有提醒：

```text
GEMINI_API_KEY 不可使用 VITE_ 前綴。
```

---

## 十三、可選：本機 API route 測試

如果本機 dev server 可用，請測：

```bash
npm run dev
```

再測 `/evaluate` 是否可送出。

也可用 PowerShell 測：

```powershell
Invoke-RestMethod -Uri "http://localhost:5173/api/evaluate" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"idea":"AI 寵物飼料分析網站","availableTime":"下班後每天 1～2 小時","avoidThings":"不想拜訪客戶、不想做客服"}'
```

如果沒有啟動本機 dev server，不需要強迫測。

---

## 十四、完成後請回報格式

請用以下格式回報。

```text
# Cloudflare Pages 部署前複檢結果

## 總結

- 整體狀態：通過 / 需修正 / 阻塞
- 是否可以進入 Cloudflare Pages 部署：是 / 否
- 主要阻塞：無 / 列出

## 檢查結果

1. npm run build：通過 / 需修正 / 阻塞
2. dist 產生：通過 / 需修正 / 阻塞
3. dist/_redirects：通過 / 需修正 / 阻塞
4. functions/api/evaluate.ts：通過 / 需修正 / 阻塞
5. context.env 讀 GEMINI_API_KEY：通過 / 需修正 / 阻塞
6. 前端呼叫 /api/evaluate：通過 / 需修正 / 阻塞
7. VITE_GEMINI_API_KEY 搜尋：通過 / 需修正 / 阻塞
8. .env git 追蹤狀態：通過 / 需修正 / 阻塞
9. VITE_SHOW_DEV_TOOLS=false：通過 / 需修正 / 阻塞
10. Cloudflare Pages 設定清單：通過 / 需修正 / 阻塞

## Cloudflare Pages 建議設定

- Framework preset:
- Build command:
- Build output directory:
- Production branch:

## Production env vars

請列出 key 名稱，不要列出實際 secret 值。

## Preview env vars

請列出 key 名稱，不要列出實際 secret 值。

## 仍需人工確認

列出需要我人工確認的事項。
```

請不要輸出 API Key。

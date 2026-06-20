# Cloudflare Pages Predeploy Check

## Build

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

## Dist

Build 後應產生：

- `dist/index.html`
- `dist/assets/`
- `dist/_redirects`

## Env Safety

Production environment variables:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<Cloudflare Pages 後台設定，不要寫入 repo>
GEMINI_MODEL=gemini-2.5-flash
VITE_SHOW_DEV_TOOLS=false
```

Preview environment variables:

```env
AI_PROVIDER=mock
VITE_SHOW_DEV_TOOLS=true
```

`GEMINI_API_KEY` 不可使用 `VITE_` 前綴。

## API Route

Cloudflare Pages Function 已新增：

```text
functions/api/evaluate.ts
```

線上 `/evaluate` 會呼叫：

```text
POST /api/evaluate
```

Pages Function 會從 `context.env` 讀取：

- `AI_PROVIDER`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

本機開發仍保留 Vite dev middleware，且與 Pages Function 共用 `src/lib/ai/serverEvaluate.ts` 的 request / response 邏輯。

## SPA Redirects

`public/_redirects` 已存在：

```text
/* /index.html 200
```

## Dev Tools

一般導覽不顯示 dev tools。只有：

```env
VITE_SHOW_DEV_TOOLS=true
```

時才顯示：

- `/gemini-poc`
- `/json-preview`
- `/prompt-preview`

頁面保留，可直接輸入網址開啟。

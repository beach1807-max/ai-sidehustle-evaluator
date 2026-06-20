# 修正頁面切換後未回到頁首問題

## 任務目標

目前使用者透過任何按鈕或導覽連結切換到新頁面時，新頁面預設顯示位置可能停留在上一頁的中段或底部。

這會造成使用者進入新頁面後，無法從頁首開始閱讀內容。

本次任務目標：

當路由切換到新頁面時，自動將視窗捲動到頁首，讓使用者每次進入新頁面都能從最上方開始閱讀。

---

## 問題範圍

可能受影響的頁面包含但不限於：

* 首頁
* 輸入點子頁
* 範例報告頁
* Deep Report 頁
* Prompt Preview 頁
* JSON Preview 頁
* AI Agent 開工包頁
* Gemini PoC 頁

只要是透過 React Router 切換頁面，都應該自動回到頁首。

---

## 建議實作方式

請新增一個共用元件：

```text id="krba36"
src/components/ScrollToTop.tsx
```

內容邏輯：

* 使用 `useLocation()` 監聽 pathname 變化
* 每次 pathname 改變時執行：

```ts id="mq5bso"
window.scrollTo({
  top: 0,
  left: 0,
  behavior: "instant",
});
```

如果 TypeScript 或瀏覽器型別不接受 `"instant"`，請改用：

```ts id="uyib95"
window.scrollTo(0, 0);
```

或：

```ts id="o5666o"
window.scrollTo({
  top: 0,
  left: 0,
});
```

---

## 範例實作

```tsx id="m9klnk"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  return null;
}
```

---

## 掛載位置

請在 App 的 Router 內、Routes 之前掛載。

可能檔案：

```text id="6rwb4s"
src/App.tsx
```

範例：

```tsx id="tp0la1"
<BrowserRouter>
  <ScrollToTop />
  <AppShell>
    <Routes>
      ...
    </Routes>
  </AppShell>
</BrowserRouter>
```

如果目前專案不是這種結構，請依現有 `App.tsx` 結構調整，但原則是：

```text id="mvkm3l"
ScrollToTop 必須在 Router 內
Routes 之前或同層
```

---

## 注意事項

本次只修正頁面切換後的捲動位置。

不要修改：

* 路由路徑
* 頁面內容
* Deep Report 產生邏輯
* JSON Preview 驗證邏輯
* AI Agent 開工包產生邏輯
* Gemini API 呼叫流程
* localStorage key
* UI 大改版

不要新增：

* 金流
* 會員
* 登入
* 資料庫
* 新 API
* 新 AI Provider

---

## 驗收標準

請確認以下情境都會回到頁首：

1. 從首頁點到「輸入點子」。
2. 從輸入點子頁點到結果頁。
3. 從結果頁點到範例報告。
4. 從 Deep Report 點到 AI Agent 開工包。
5. 從 Prompt Preview 點到 JSON Preview。
6. 從任何頁面中段或底部點擊導覽列連結，切到新頁面後都顯示頁首。

---

## Build 驗證

完成後請執行：

```bash id="ixg3kv"
npm run build
```

如果目前環境沒有 npm，請執行專案原本可用的 build 指令，例如：

```bash id="qvtjyr"
tsc -b
vite build
```

---

## 完成後回報

請回報：

* 新增或修改的檔案
* ScrollToTop 掛載位置
* 是否有修改功能邏輯
* Build 結果

不要 commit。

不要 push。

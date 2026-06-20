# Codex 提示詞：第六階段改為 AI Provider 抽象層

目前「副業點子冷靜評分器」已完成：

1. Mock 版網站
2. 三份範例完整報告
3. Prompt Template
4. JSON Preview
5. Report JSON 驗證工具
6. Generated Report 預覽頁
7. 手動 AI 產報告測試流程
8. score 與 dimensions 分數不一致時的 warning + normalize 機制

目前還沒有決定要使用哪一家 AI API。

因此第六階段不要直接串 OpenAI、Anthropic、Gemini 或任何特定供應商。

請改成建立「AI Provider 抽象層」，讓未來可以切換不同 AI API。

這次不要真正接任何 AI API、不要新增登入、不要新增付款、不要新增資料庫。

---

## 目標

建立一個可替換的 AI 呼叫架構。

未來流程會是：

```text
使用者填寫副業點子、可投入時間、不想做的事情
→ 前端呼叫 /api/evaluate
→ /api/evaluate 呼叫 aiProvider.generateReport(input)
→ aiProvider 使用 buildEvaluationPrompt(input) 產生 Prompt
→ 未來串接實際 AI API
→ 回傳 AI 文字
→ extractJsonFromAiText
→ validateReportData
→ normalizeReportData
→ 回傳乾淨 report JSON 給前端
```

目前階段先不要串真實 AI。

先做：

```text
mock provider / stub provider
```

讓整個架構先跑起來。

---

## 一、建立 AI Provider 介面

請新增：

```text
src/lib/ai/types.ts
```

定義：

```ts
import type { EvaluationInput } from "../promptTemplate";
import type { MockReport } from "../../data/mockReports";

export type AiProviderName = "mock" | "openai" | "anthropic" | "gemini";

export type GenerateReportResult = {
  report: MockReport;
  warnings: string[];
};

export interface AiProvider {
  name: AiProviderName;
  generateReport(input: EvaluationInput): Promise<GenerateReportResult>;
}
```

如果目前型別路徑不同，請依照專案實際結構調整。

---

## 二、建立 Mock AI Provider

請新增：

```text
src/lib/ai/mockProvider.ts
```

功能：

1. 實作 `AiProvider`
2. 使用現有 `buildEvaluationPrompt(input)`，但暫時不呼叫外部 API
3. 回傳一份現有 mock report，例如 `pet-food-analysis`
4. 回傳前可以把 title 或 summary 略微改成與使用者輸入的 idea 有關
5. 回傳前仍然跑：
   - validateReportData
   - normalizeReportData

目標是讓未來串真實 provider 前，整個 API 流程可以先測試。

---

## 三、建立 Provider Factory

請新增：

```text
src/lib/ai/getAiProvider.ts
```

功能：

```ts
import { mockProvider } from "./mockProvider";

export function getAiProvider(): AiProvider {
  const providerName = import.meta.env.VITE_AI_PROVIDER || "mock";

  switch (providerName) {
    case "mock":
      return mockProvider;
    case "openai":
      throw new Error("OpenAI provider 尚未實作");
    case "anthropic":
      throw new Error("Anthropic provider 尚未實作");
    case "gemini":
      throw new Error("Gemini provider 尚未實作");
    default:
      return mockProvider;
  }
}
```

如果 provider factory 需要在 server side 使用，不適合使用 `import.meta.env`，請依照專案目前架構改用 `process.env.AI_PROVIDER`。

重點是：

- 現在預設使用 mock provider
- 不要真的串外部 API
- 未來可以擴充不同 provider

---

## 四、更新環境變數範例

請新增或更新：

```text
.env.example
```

內容：

```env
AI_PROVIDER=mock

# 未來要串 OpenAI 時使用
OPENAI_API_KEY=
OPENAI_MODEL=

# 未來要串 Anthropic 時使用
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

# 未來要串 Gemini 時使用
GEMINI_API_KEY=
GEMINI_MODEL=
```

如果目前專案仍是純前端 Vite，請不要把真正 API key 放到 `VITE_` 開頭的環境變數。

說明：

- `VITE_` 變數會暴露到前端
- 真正 API key 未來只能放在後端環境變數
- 目前階段只用 mock provider，不需要 API key

---

## 五、建立 API evaluate 的預留架構

如果目前專案已經有 `/api/evaluate`，請改成使用 provider 架構。

如果目前還沒有後端，請先不要硬加完整後端。

可以先建立：

```text
src/lib/ai/evaluateWithProvider.ts
```

內容：

```ts
export async function evaluateWithProvider(input: EvaluationInput): Promise<GenerateReportResult> {
  const provider = getAiProvider();
  return provider.generateReport(input);
}
```

之後真正有後端時，`/api/evaluate` 可以呼叫這個 function。

---

## 六、EvaluatePage 暫時不要直接接真實 API

請不要讓 `/evaluate` 直接呼叫外部 AI API。

目前可以選擇兩種做法之一：

### 做法 A：保守維持現況

`/evaluate` 送出後仍然導向 mock report。

但在程式中保留註解：

```ts
// TODO: 未來改成呼叫 /api/evaluate，再將回傳 report 存入 generatedReportPreview
```

### 做法 B：使用 mock provider 模擬 AI 流程

`/evaluate` 送出後呼叫 `evaluateWithProvider(input)`。

因為目前 provider 是 mock，所以不會有外部 API 成本。

成功後：

1. 將 report 存入 localStorage key：

```text
generatedReportPreview
```

2. 導向：

```text
/report/generated-preview
```

我建議採用做法 B，因為可以先測試未來流程，但仍不需要真正 API key。

---

## 七、保留手動測試工具

請保留：

- `/prompt-preview`
- `/json-preview`
- `/report/generated-preview`

不要刪除。

這些仍然是重要的 debugging 工具。

---

## 八、保留 Mock 報告

請保留：

- `/examples`
- `/report/ai-pet-monitor`
- `/report/pet-food-analysis`
- `/report/side-project-scorer`

不要因為建立 provider 架構就移除 mock data。

---

## 九、新增文件說明

請新增或更新：

```text
README.md
```

加入一段：

```md
## AI Provider 設定

目前專案尚未串接真實 AI API，預設使用 mock provider。

目前支援的 provider 設計：

- mock：目前預設，使用本地 mock report
- openai：預留，尚未實作
- anthropic：預留，尚未實作
- gemini：預留，尚未實作

未來要切換 provider，會透過後端環境變數 `AI_PROVIDER` 控制。

注意：正式 API key 不可放在前端 `VITE_` 環境變數中。
```

---

## 十、這次不要做的事

請不要：

- 不要串 OpenAI API
- 不要串 Anthropic API
- 不要串 Gemini API
- 不要新增真正 API key
- 不要把 API key 寫進前端
- 不要新增登入
- 不要新增付款
- 不要新增資料庫
- 不要移除 JSON Preview
- 不要移除 Prompt Preview
- 不要刪除 mock reports

這次只做：

> 建立可替換 AI Provider 架構，並用 mock provider 模擬未來 AI 流程。

---

## 十一、完成後請回報

完成後請回報：

1. 新增或修改了哪些檔案
2. AI Provider 介面放在哪裡
3. mockProvider 如何運作
4. getAiProvider 如何決定 provider
5. EvaluatePage 目前是否有改成走 mock provider
6. `.env.example` 新增了哪些變數
7. README 是否有補充 AI Provider 說明
8. 未來如果決定使用 OpenAI / Anthropic / Gemini，要從哪個檔案開始實作
9. 如何啟動與驗證

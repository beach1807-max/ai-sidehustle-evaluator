\# 將第三方服務規則整合至 AI Agent 開工包



\## 任務目標



將以下規則整合進：



```text

src/lib/agentStarterKit.ts

```



中的：



```ts

buildAgentStarterPrompt()

```



讓未來所有產生的：



```text

AI Agent 開工包

```



都自動包含這份規則。



\---



\## 重要



這份規則是：



```text

AI Agent 執行規則

```



不是：



```text

使用者閱讀內容

```



因此：



\### 不要



顯示在：



\* Deep Report 畫面

\* AI Agent 開工包 UI

\* DeepReportView

\* AgentStarterKitPage

\* 前端頁面



\---



\### 要



存在於：



```text

複製全部 Prompt

```



的實際內容中。



也就是：



```text

使用者按下：



複製全部



↓



貼到：



Codex

Claude Code

Cursor

ChatGPT Agent



↓



AI Agent 能看到這份規則

```



\---



\## 修改位置



請修改：



```text

src/lib/agentStarterKit.ts

```



\---



找到：



```ts

buildAgentStarterPrompt(report)

```



\---



目前開頭類似：



```text

你是一位資深全端工程師與產品工程師。



請根據以下規格建立 MVP。

```



\---



請將以下規則插入：



```text

系統規則

↓



第三方服務與外部整合規則

↓



產品需求

```



\---



\## 新增固定規則



請加入以下內容：



\---



\# 第三方服務與外部整合規則



若產品需要使用以下服務：



\* 金流

\* 外部 API

\* Email

\* 會員系統

\* 資料庫

\* 第三方 SaaS

\* OAuth 登入

\* 雲端儲存

\* 推播服務

\* AI 模型服務



第一版 MVP 請不要進行正式串接。



目標：



先完成產品框架與操作流程驗證。



\---



\## 必須完成



\### 1. 建立功能框架



完成：



\* UI

\* 頁面流程

\* 使用者操作流程



讓使用者可以完整預覽產品運作方式。



\---



\### 2. 建立 Mock Function



例如：



```text

mockPayment()

mockEmailSend()

mockGenerateReport()

mockUserLogin()

```



或等效模擬流程。



確保：



即使沒有第三方服務，



產品仍可正常展示與測試。



\---



\### 3. 建立 Placeholder



例如：



```text

TODO: Replace with Stripe API



TODO: Replace with Gemini API



TODO: Replace with Resend API

```



\---



\### 4. 建立 .env.example



若產品涉及第三方服務，



必須建立：



```env

\# Gemini



VITE\_GEMINI\_API\_KEY=



\# Stripe



STRIPE\_SECRET\_KEY=

VITE\_STRIPE\_PUBLISHABLE\_KEY=



\# Resend



RESEND\_API\_KEY=

```



僅保留範例。



禁止填入真實金鑰。



\---



\### 5. 建立 README 設定說明



README 必須包含：



\* 啟動步驟

\* 環境變數設定

\* 第三方服務設定方式

\* 部署方式



讓非工程師也能完成設定。



\---



\### 6. 建立待使用者設定項目



README 或專案文件中必須新增：



```text

待使用者設定項目

```



格式：



```text

用途：

設定位置：

環境變數名稱：

取得方式：

是否必填：

```



範例：



```text

用途：

AI 報告生成



設定位置：

.env.local



環境變數名稱：

VITE\_GEMINI\_API\_KEY



取得方式：

Google AI Studio



是否必填：

是

```



\---



\## 必須保證



即使：



\* API Key 為空

\* Stripe 未設定

\* 資料庫不存在

\* Email 未設定



專案仍可：



```bash

npm install

npm run dev

```



正常啟動。



並可展示完整 MVP 流程。



\---



\## 禁止事項



禁止：



\* 寫死 API Key

\* 建立正式付款流程

\* 強制登入

\* 建立正式資料庫架構

\* 要求使用者先申請第三方服務才能啟動專案

\* 因缺少第三方服務導致專案無法啟動

\* 自動產生真實金鑰



\---



\## 開發原則



優先：



```text

可展示

可驗證

可部署

可操作

```



之後再進行正式串接。



\---



\## 驗收標準



請使用以下點子測試：



\* AI 漫畫平台

\* AI 文字辨識工具

\* 寵物飼料分析



確認：



\### AI Agent 開工包內容中



包含：



\* 第三方服務規則

\* Mock Function 要求

\* .env.example 要求

\* README 要求

\* 待使用者設定項目要求



\---



確認：



\### Deep Report UI



不要出現這些規則。



\---



確認：



\### AI Agent 開工包頁面



只顯示：



產品需求內容。



不要把這份規則另外渲染成獨立區塊。



\---



\## 完成後回報



請回報：



\* 修改檔案

\* buildAgentStarterPrompt 修改位置

\* 規則插入位置

\* 三個測試案例結果

\* Build 結果



不要 commit



不要 push




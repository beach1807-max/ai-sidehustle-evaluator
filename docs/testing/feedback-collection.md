# Google Sheet 回饋收集設定

本功能用於公開測試期間，讓使用者填寫回饋後免費解鎖一次完整 Deep Report / AI Agent 開工包。

## 資料流

1. 使用者在免費報告頁點擊「我想取得完整開工包」。
2. 前端顯示回饋表單。
3. 表單送出後，前端寫入 `latestFeedbackUnlockSubmission`。
4. 前端建立 `deepReportFeedbackUnlock`，讓使用者可產生一次完整 Deep Report。
5. 前端呼叫 `/api/feedback`。
6. Cloudflare Pages Function 轉送到 Google Apps Script Web App。
7. Google Apps Script 將資料寫入 Google Sheet。

localStorage 只用於本機 fallback 與一次性解鎖，不是正式資料庫。

## localStorage keys

- `anonymousFeedbackUserId`：同一個瀏覽器的匿名 ID。
- `latestFeedbackUnlockSubmission`：最近一次回饋內容，方便本機 debug。
- `deepReportFeedbackUnlock`：一次性 Deep Report 解鎖狀態。

`deepReportFeedbackUnlock` 格式：

```json
{
  "unlocked": true,
  "used": false,
  "createdAt": "2026-06-21T12:00:00.000Z",
  "source": "feedback"
}
```

Deep Report 產生成功後，`used` 會改成 `true`，不可再次使用。

## Cloudflare Pages 環境變數

請在 Cloudflare Pages 後台手動設定：

```env
GOOGLE_SHEET_WEBHOOK_URL=
FEEDBACK_SECRET=
```

- `GOOGLE_SHEET_WEBHOOK_URL`：Google Apps Script Web App URL。
- `FEEDBACK_SECRET`：與 Apps Script 中 `SECRET` 相同的字串。

不要把 Google Apps Script URL 或 secret 寫死在前端或程式碼中。

## Google Sheet 欄位

目前 Google Sheet 第一列欄位：

```text
createdAt
idea
score
decision
feedbackOptions
feedbackText
wantsDeepReport
contact
userAgent
source
```

## Webhook 未設定時

如果 Cloudflare Pages 沒有設定 `GOOGLE_SHEET_WEBHOOK_URL` 或 `FEEDBACK_SECRET`：

- `/api/feedback` 會回傳 `Feedback webhook is not configured`
- 前端仍會把回饋寫入 localStorage
- 前端仍會解鎖一次 Deep Report
- 開發者無法在 Google Sheet 集中看到該筆回饋

## Webhook 失敗時

如果 Google Apps Script 回傳錯誤或網路失敗：

- 使用者不會卡住
- 前端仍會把回饋寫入 localStorage
- 前端仍會解鎖一次 Deep Report
- 頁面會提示回饋送出可能失敗

## Apps Script 範例

```javascript
const SHEET_NAME = '工作表1';
const SECRET = '請填入你自己的 secret，並與 Cloudflare FEEDBACK_SECRET 相同';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),
      body.idea || '',
      body.score || '',
      body.decision || '',
      Array.isArray(body.feedbackOptions) ? body.feedbackOptions.join(', ') : '',
      body.feedbackText || '',
      body.wantsDeepReport ? 'yes' : 'no',
      body.contact || '',
      body.userAgent || '',
      body.source || 'web'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 查看回饋資料

設定完成後，使用者送出的回饋會出現在你手動建立的 Google Sheet。若 webhook 尚未設定或失敗，只能在使用者瀏覽器 localStorage 中看到最近一次回饋。

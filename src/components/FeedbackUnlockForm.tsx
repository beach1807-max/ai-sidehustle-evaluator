import { FormEvent, useState } from "react";
import {
  getOrCreateAnonymousFeedbackUserId,
  submitFeedback,
  type FeedbackSubmitResult,
  type FeedbackUnlockSubmission,
} from "../lib/feedback";

const understandingOptions = ["看得懂", "大致看得懂", "不太懂", "完全看不懂"];
const desiredOutputOptions = [
  "副業點子可行性判斷",
  "7 天 MVP 行動計畫",
  "AI Agent 開工包",
  "給 AI 的完整開發任務說明",
  "銷售頁文案",
  "第一版收費建議",
  "推廣文案",
  "風險修正與砍功能建議",
];
const willingnessOptions = [
  "NT$49 可以接受",
  "NT$99 可以接受",
  "想先免費試用",
  "不會付費",
  "還不確定",
];

type FeedbackUnlockFormProps = {
  idea: string;
  score?: number | string;
  decision?: string;
  sourcePage: string;
  onUnlocked: (result: FeedbackSubmitResult) => void;
};

export function FeedbackUnlockForm({
  idea,
  score,
  decision,
  sourcePage,
  onUnlocked,
}: FeedbackUnlockFormProps) {
  const [understandingLevel, setUnderstandingLevel] = useState("");
  const [desiredOutputs, setDesiredOutputs] = useState<string[]>([]);
  const [willingnessToPay, setWillingnessToPay] = useState("");
  const [confusingPart, setConfusingPart] = useState("");
  const [paidExpectation, setPaidExpectation] = useState("");
  const [contactPermission, setContactPermission] = useState("暫時不用");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const submission: FeedbackUnlockSubmission = {
      createdAt: new Date().toISOString(),
      idea,
      score,
      decision,
      understandingLevel,
      desiredOutputs,
      willingnessToPay,
      confusingPart: confusingPart.trim(),
      paidExpectation: paidExpectation.trim(),
      contactPermission,
      contact: contact.trim() || undefined,
      userId: getOrCreateAnonymousFeedbackUserId(),
      sourcePage,
    };

    setIsSubmitting(true);
    const result = await submitFeedback(submission);
    setIsSubmitting(false);
    onUnlocked(result);
  }

  function validateForm() {
    if (!understandingLevel) {
      return "請選擇你是否看得懂這個工具在做什麼。";
    }

    if (desiredOutputs.length === 0) {
      return "請至少選擇一個你最想拿到的內容。";
    }

    if (!willingnessToPay) {
      return "請選擇如果完整開工包收費，你的接受程度。";
    }

    if (confusingPart.trim().length < 5) {
      return "請簡單寫一下你最看不懂的地方，至少 5 個字。";
    }

    if (paidExpectation.trim().length < 5) {
      return "請簡單寫一下如果要付費，你最希望買到什麼，至少 5 個字。";
    }

    if (contactPermission === "可以，以下是我的聯絡方式" && !contact.trim()) {
      return "如果願意讓我後續詢問，請留下 Email 或 Line ID。";
    }

    return "";
  }

  function toggleDesiredOutput(option: string) {
    setDesiredOutputs((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-lg border border-steel/25 bg-frost p-5"
    >
      <h3 className="text-lg font-bold text-ink">回饋換一次完整開工包</h3>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
        <p>目前完整 Deep Report / AI Agent 開工包採限量測試。</p>
        <p>
          為了控制 AI 成本，公開測試期間先採用「填寫回饋，免費解鎖一次」的方式。
        </p>
        <p>
          你的回饋會幫助我判斷這個工具是否真的有價值，以及未來是否適合收取 NT$49～99。
        </p>
      </div>

      <fieldset className="mt-5">
        <legend className="font-semibold text-ink">你看得懂這個工具在做什麼嗎？</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {understandingOptions.map((option) => (
            <RadioOption
              key={option}
              name="understandingLevel"
              option={option}
              selectedValue={understandingLevel}
              onChange={setUnderstandingLevel}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="font-semibold text-ink">你最想拿到哪個內容？</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {desiredOutputOptions.map((option) => (
            <label
              key={option}
              className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700"
            >
              <input
                type="checkbox"
                checked={desiredOutputs.includes(option)}
                onChange={() => toggleDesiredOutput(option)}
                className="mt-1"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="font-semibold text-ink">如果完整開工包收費，你的接受程度？</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {willingnessOptions.map((option) => (
            <RadioOption
              key={option}
              name="willingnessToPay"
              option={option}
              selectedValue={willingnessToPay}
              onChange={setWillingnessToPay}
            />
          ))}
        </div>
      </fieldset>

      <label className="mt-5 grid gap-2">
        <span className="font-semibold text-ink">你最看不懂或最卡的地方是什麼？</span>
        <textarea
          value={confusingPart}
          onChange={(event) => setConfusingPart(event.target.value)}
          placeholder="例如：不知道 AI Agent 是什麼、看不懂 MVP、不知道拿到開工包後要貼去哪裡"
          className="focus-ring min-h-24 resize-y rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-ink placeholder:text-slate-400"
        />
      </label>

      <label className="mt-5 grid gap-2">
        <span className="font-semibold text-ink">如果要你付費，你最希望買到什麼？</span>
        <textarea
          value={paidExpectation}
          onChange={(event) => setPaidExpectation(event.target.value)}
          placeholder="例如：完整開發提示詞、可以直接給 AI 做網站的說明書、推廣文案、收費建議"
          className="focus-ring min-h-24 resize-y rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-ink placeholder:text-slate-400"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="font-semibold text-ink">願意讓我後續詢問使用心得嗎？</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {["暫時不用", "可以，以下是我的聯絡方式"].map((option) => (
            <RadioOption
              key={option}
              name="contactPermission"
              option={option}
              selectedValue={contactPermission}
              onChange={setContactPermission}
            />
          ))}
        </div>
      </fieldset>

      {contactPermission === "可以，以下是我的聯絡方式" && (
        <label className="mt-5 grid gap-2">
          <span className="font-semibold text-ink">聯絡方式</span>
          <input
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Email 或 Line ID"
            className="focus-ring rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400"
          />
        </label>
      )}

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium leading-6 text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring mt-5 inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:bg-slate-500"
      >
        {isSubmitting ? "正在送出回饋..." : "送出回饋並解鎖一次"}
      </button>
    </form>
  );
}

function RadioOption({
  name,
  option,
  selectedValue,
  onChange,
}: {
  name: string;
  option: string;
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
      <input
        type="radio"
        name={name}
        checked={selectedValue === option}
        onChange={() => onChange(option)}
        className="mt-1"
      />
      {option}
    </label>
  );
}

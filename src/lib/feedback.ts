export type DeepReportFeedbackUnlock = {
  unlocked: boolean;
  used: boolean;
  createdAt: string;
  source: "feedback";
};

export type FeedbackUnlockSubmission = {
  createdAt: string;
  idea: string;
  score?: number | string;
  decision?: string;
  understandingLevel: string;
  desiredOutputs: string[];
  willingnessToPay: string;
  confusingPart: string;
  paidExpectation: string;
  contactPermission: string;
  contact?: string;
  userId: string;
  sourcePage: string;
};

export type FeedbackSubmitResult =
  | { status: "sent"; message: string }
  | { status: "local-only"; message: string }
  | { status: "send-failed"; message: string };

const unlockKey = "deepReportFeedbackUnlock";
const userIdKey = "anonymousFeedbackUserId";
const latestSubmissionKey = "latestFeedbackUnlockSubmission";

export function getOrCreateAnonymousFeedbackUserId(): string {
  const existingId = localStorage.getItem(userIdKey);
  if (existingId) {
    return existingId;
  }

  const randomPart = Math.random().toString(36).slice(2, 10);
  const userId = `anon_${Date.now()}_${randomPart}`;
  localStorage.setItem(userIdKey, userId);
  return userId;
}

export function saveFeedbackToLocalStorage(submission: FeedbackUnlockSubmission) {
  localStorage.setItem(latestSubmissionKey, JSON.stringify(submission));
}

export function createDeepReportFeedbackUnlock(): DeepReportFeedbackUnlock {
  const unlock: DeepReportFeedbackUnlock = {
    unlocked: true,
    used: false,
    createdAt: new Date().toISOString(),
    source: "feedback",
  };
  localStorage.setItem(unlockKey, JSON.stringify(unlock));
  return unlock;
}

export function getDeepReportFeedbackUnlock(): DeepReportFeedbackUnlock | null {
  try {
    const raw = localStorage.getItem(unlockKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as DeepReportFeedbackUnlock;
    if (parsed.unlocked !== true || parsed.source !== "feedback") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function canUseDeepReportFeedbackUnlock(): boolean {
  const unlock = getDeepReportFeedbackUnlock();
  return Boolean(unlock?.unlocked && !unlock.used);
}

export function markDeepReportFeedbackUnlockUsed() {
  const unlock = getDeepReportFeedbackUnlock();
  if (!unlock) {
    return;
  }

  localStorage.setItem(
    unlockKey,
    JSON.stringify({
      ...unlock,
      used: true,
    })
  );
}

export async function submitFeedback(
  submission: FeedbackUnlockSubmission
): Promise<FeedbackSubmitResult> {
  saveFeedbackToLocalStorage(submission);
  createDeepReportFeedbackUnlock();

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      code?: string;
      error?: string;
    } | null;

    if (response.ok && result?.ok) {
      return {
        status: "sent",
        message:
          "感謝你的回饋，已暫時開放 1 次完整 Deep Report / AI Agent 開工包產出。",
      };
    }

    if (result?.code === "FEEDBACK_WEBHOOK_NOT_CONFIGURED") {
      return {
        status: "local-only",
        message:
          "回饋已在本機記錄，並暫時開放 1 次完整 Deep Report。目前尚未設定集中收集 webhook，請開發者稍後補上環境變數。",
      };
    }

    return {
      status: "send-failed",
      message:
        "回饋已在本機記錄，並暫時開放 1 次完整 Deep Report。但回饋送出可能失敗，若你願意，也可以截圖或複製回饋內容傳給開發者。",
    };
  } catch {
    return {
      status: "send-failed",
      message:
        "回饋已在本機記錄，並暫時開放 1 次完整 Deep Report。但回饋送出可能失敗，若你願意，也可以截圖或複製回饋內容傳給開發者。",
    };
  }
}

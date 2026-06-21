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
export type FeedbackSubmitResult = {
    status: "sent";
    message: string;
} | {
    status: "local-only";
    message: string;
} | {
    status: "send-failed";
    message: string;
};
export declare function getOrCreateAnonymousFeedbackUserId(): string;
export declare function saveFeedbackToLocalStorage(submission: FeedbackUnlockSubmission): void;
export declare function createDeepReportFeedbackUnlock(): DeepReportFeedbackUnlock;
export declare function getDeepReportFeedbackUnlock(): DeepReportFeedbackUnlock | null;
export declare function canUseDeepReportFeedbackUnlock(): boolean;
export declare function markDeepReportFeedbackUnlockUsed(): void;
export declare function submitFeedback(submission: FeedbackUnlockSubmission): Promise<FeedbackSubmitResult>;

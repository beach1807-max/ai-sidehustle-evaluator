type UsageRecord = {
    date: string;
    count: number;
};
export declare function getTodayDateKey(): string;
export declare function getFreeEvaluationLimit(): number;
export declare function getDeepReportDailyLimit(): number;
export declare function getFreeEvaluationUsage(): UsageRecord;
export declare function canUseFreeEvaluation(): boolean;
export declare function recordFreeEvaluationUsed(): void;
export declare function getDeepReportUsage(): UsageRecord;
export declare function canUseDeepReportDailyLimit(): boolean;
export declare function recordDeepReportUsed(): void;
export {};

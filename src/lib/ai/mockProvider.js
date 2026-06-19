import { mockReport } from "../../data/mockReports";
import { buildEvaluationPrompt } from "../promptTemplate";
import { normalizeReportData, validateReportData } from "../validateReport";
export const mockProvider = {
    name: "mock",
    async generateReport(input) {
        const prompt = buildEvaluationPrompt(input);
        void prompt;
        const idea = input.idea.trim();
        const reportCandidate = {
            ...JSON.parse(JSON.stringify(mockReport)),
            id: "generated-report",
            title: idea || mockReport.title,
            summary: idea
                ? `這是 mock provider 依照「${idea}」產生的測試報告。目前尚未呼叫外部 AI API，內容沿用寵物飼料分析報告的本地範例結構。`
                : mockReport.summary,
        };
        const validation = validateReportData(reportCandidate);
        if (!validation.isValid) {
            throw new Error(validation.errors.join("\n"));
        }
        return {
            report: normalizeReportData(reportCandidate),
            warnings: validation.warnings,
        };
    },
};

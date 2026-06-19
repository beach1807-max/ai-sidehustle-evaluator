export type DimensionScore = {
    name: string;
    score: number;
    maxScore: number;
    comment: string;
};
export type ValidationStep = {
    day: string;
    task: string;
};
export type ProductShape = {
    format: string;
    userFlow: string[];
    userSees: string[];
    firstVersionLook: string[];
};
export type MockReport = {
    id: string;
    title: string;
    score: number;
    scoreLabel: string;
    summary: string;
    dimensions: DimensionScore[];
    oneSentenceVerdict: string;
    strengths: string[];
    risks: string[];
    fatalWarnings: string[];
    productShape: ProductShape;
    dontBuild: string[];
    pricingSuggestion: string;
    pricingTiers?: string[];
    validationGoal: string;
    validationPlan: ValidationStep[];
};
export type ExampleReport = {
    id: string;
    title: string;
    score: number;
    label: string;
    conclusion: string;
    risk: string;
    smallerVersion: string;
};
export declare const mockReports: MockReport[];
export declare const defaultReportId = "pet-food-analysis";
export declare const mockReport: MockReport;
export declare function getMockReport(reportId?: string): MockReport;
export declare const exampleReports: ExampleReport[];

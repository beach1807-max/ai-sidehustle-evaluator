export type EvaluationInput = {
    idea: string;
    availableTime: string;
    avoidThings: string;
};
export declare function buildEvaluationPrompt(input: EvaluationInput): string;

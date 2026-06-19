import type { AiRuntimeEnv } from "./types";
export type EvaluateApiResult = {
    ok: true;
    report: unknown;
    warnings: string[];
} | {
    ok: false;
    error: string;
    code: string;
    retryable: boolean;
    details: string[];
};
export declare function evaluateFromApiRequest(payload: unknown, env?: AiRuntimeEnv): Promise<{
    status: number;
    body: EvaluateApiResult;
}>;
export declare function methodNotAllowedResponse(): {
    status: number;
    body: {
        ok: false;
        error: string;
        code: string;
        retryable: boolean;
        details: any[];
    };
};

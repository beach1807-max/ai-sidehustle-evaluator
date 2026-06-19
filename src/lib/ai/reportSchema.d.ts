export declare const geminiReportResponseSchema: {
    readonly type: "OBJECT";
    readonly properties: {
        readonly id: {
            readonly type: "STRING";
        };
        readonly title: {
            readonly type: "STRING";
        };
        readonly score: {
            readonly type: "NUMBER";
        };
        readonly scoreLabel: {
            readonly type: "STRING";
        };
        readonly summary: {
            readonly type: "STRING";
        };
        readonly dimensions: {
            readonly type: "ARRAY";
            readonly minItems: 7;
            readonly maxItems: 7;
            readonly items: {
                readonly type: "OBJECT";
                readonly properties: {
                    readonly name: {
                        readonly type: "STRING";
                    };
                    readonly score: {
                        readonly type: "NUMBER";
                    };
                    readonly maxScore: {
                        readonly type: "NUMBER";
                    };
                    readonly comment: {
                        readonly type: "STRING";
                    };
                };
                readonly required: readonly ["name", "score", "maxScore", "comment"];
            };
        };
        readonly oneSentenceVerdict: {
            readonly type: "STRING";
        };
        readonly strengths: {
            readonly type: "ARRAY";
            readonly items: {
                readonly type: "STRING";
            };
        };
        readonly risks: {
            readonly type: "ARRAY";
            readonly items: {
                readonly type: "STRING";
            };
        };
        readonly fatalWarnings: {
            readonly type: "ARRAY";
            readonly items: {
                readonly type: "STRING";
            };
        };
        readonly productShape: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly format: {
                    readonly type: "STRING";
                };
                readonly userFlow: {
                    readonly type: "ARRAY";
                    readonly minItems: 4;
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly userSees: {
                    readonly type: "ARRAY";
                    readonly minItems: 5;
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly firstVersionLook: {
                    readonly type: "ARRAY";
                    readonly minItems: 4;
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["format", "userFlow", "userSees", "firstVersionLook"];
        };
        readonly dontBuild: {
            readonly type: "ARRAY";
            readonly minItems: 3;
            readonly items: {
                readonly type: "STRING";
            };
        };
        readonly pricingSuggestion: {
            readonly type: "STRING";
        };
        readonly validationGoal: {
            readonly type: "STRING";
        };
        readonly validationPlan: {
            readonly type: "ARRAY";
            readonly minItems: 7;
            readonly maxItems: 7;
            readonly items: {
                readonly type: "OBJECT";
                readonly properties: {
                    readonly day: {
                        readonly type: "STRING";
                    };
                    readonly task: {
                        readonly type: "STRING";
                    };
                };
                readonly required: readonly ["day", "task"];
            };
        };
    };
    readonly required: readonly ["id", "title", "score", "scoreLabel", "summary", "dimensions", "oneSentenceVerdict", "strengths", "risks", "fatalWarnings", "productShape", "dontBuild", "pricingSuggestion", "validationPlan"];
};

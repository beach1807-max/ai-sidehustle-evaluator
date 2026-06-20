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
export declare const geminiDeepReportResponseSchema: {
    readonly type: "OBJECT";
    readonly properties: {
        readonly feasibility: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly soloDeveloperFit: {
                    readonly type: "STRING";
                };
                readonly estimatedBuildTime: {
                    readonly type: "STRING";
                };
                readonly mainRisks: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly recommendation: {
                    readonly type: "STRING";
                };
            };
            readonly required: readonly ["soloDeveloperFit", "estimatedBuildTime", "mainRisks", "recommendation"];
        };
        readonly mvpFeatures: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly mustHave: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly later: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly notRecommended: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["mustHave", "later", "notRecommended"];
        };
        readonly sevenDayPlan: {
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
        readonly agentMvpKit: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly productGoal: {
                    readonly type: "STRING";
                };
                readonly targetAudience: {
                    readonly type: "STRING";
                };
                readonly mvpRequirements: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly pageRequirements: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly uiRequirements: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly dataStructure: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly technicalConstraints: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly acceptanceCriteria: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["productGoal", "targetAudience", "mvpRequirements", "pageRequirements", "uiRequirements", "dataStructure", "technicalConstraints", "acceptanceCriteria"];
        };
        readonly landingPageCopy: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly headline: {
                    readonly type: "STRING";
                };
                readonly subheadline: {
                    readonly type: "STRING";
                };
                readonly features: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly cta: {
                    readonly type: "STRING";
                };
            };
            readonly required: readonly ["headline", "subheadline", "features", "cta"];
        };
        readonly pricing: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly freePlan: {
                    readonly type: "STRING";
                };
                readonly oneTimePrice: {
                    readonly type: "STRING";
                };
                readonly futureSubscription: {
                    readonly type: "STRING";
                };
            };
            readonly required: readonly ["freePlan", "oneTimePrice", "futureSubscription"];
        };
        readonly acquisition: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly firstUsers: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly suitablePlatforms: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly lowCostPromotion: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["firstUsers", "suitablePlatforms", "lowCostPromotion"];
        };
        readonly mvpReduction: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly sevenDayScope: {
                    readonly type: "STRING";
                };
                readonly remove: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly keep: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["sevenDayScope", "remove", "keep"];
        };
        readonly agentExecutionStrategy: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly recommendedTech: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly deploymentPlatform: {
                    readonly type: "STRING";
                };
                readonly buildOrder: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly estimatedPageCount: {
                    readonly type: "STRING";
                };
                readonly estimatedFileCount: {
                    readonly type: "STRING";
                };
                readonly mvpDoneCriteria: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["recommendedTech", "deploymentPlatform", "buildOrder", "estimatedPageCount", "estimatedFileCount", "mvpDoneCriteria"];
        };
        readonly agentDevelopmentKit: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly projectBrief: {
                    readonly type: "STRING";
                };
                readonly suggestedFileStructure: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly coreComponents: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly stateAndDataFlow: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly implementationSteps: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly copyPasteAgentBrief: {
                    readonly type: "STRING";
                };
            };
            readonly required: readonly ["projectBrief", "suggestedFileStructure", "coreComponents", "stateAndDataFlow", "implementationSteps", "copyPasteAgentBrief"];
        };
        readonly agentPromptPack: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly buildPrompt: {
                    readonly type: "STRING";
                };
                readonly uiPrompt: {
                    readonly type: "STRING";
                };
                readonly dataPrompt: {
                    readonly type: "STRING";
                };
                readonly QARevisionPrompt: {
                    readonly type: "STRING";
                };
            };
            readonly required: readonly ["buildPrompt", "uiPrompt", "dataPrompt", "QARevisionPrompt"];
        };
        readonly marketingStarterPack: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly positioning: {
                    readonly type: "STRING";
                };
                readonly audiencePainPoints: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly launchChannels: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly contentIdeas: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly validationMessages: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
            };
            readonly required: readonly ["positioning", "audiencePainPoints", "launchChannels", "contentIdeas", "validationMessages"];
        };
        readonly salesPageCopyPack: {
            readonly type: "OBJECT";
            readonly properties: {
                readonly heroTitle: {
                    readonly type: "STRING";
                };
                readonly heroSubtitle: {
                    readonly type: "STRING";
                };
                readonly problemSection: {
                    readonly type: "STRING";
                };
                readonly solutionSection: {
                    readonly type: "STRING";
                };
                readonly featureBullets: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "STRING";
                    };
                };
                readonly proofSection: {
                    readonly type: "STRING";
                };
                readonly faq: {
                    readonly type: "ARRAY";
                    readonly items: {
                        readonly type: "OBJECT";
                        readonly properties: {
                            readonly question: {
                                readonly type: "STRING";
                            };
                            readonly answer: {
                                readonly type: "STRING";
                            };
                        };
                        readonly required: readonly ["question", "answer"];
                    };
                };
                readonly finalCta: {
                    readonly type: "STRING";
                };
            };
            readonly required: readonly ["heroTitle", "heroSubtitle", "problemSection", "solutionSection", "featureBullets", "proofSection", "faq", "finalCta"];
        };
    };
    readonly required: readonly ["feasibility", "mvpFeatures", "sevenDayPlan", "agentMvpKit", "landingPageCopy", "pricing", "acquisition", "mvpReduction", "agentExecutionStrategy", "agentDevelopmentKit", "agentPromptPack", "marketingStarterPack", "salesPageCopyPack"];
};

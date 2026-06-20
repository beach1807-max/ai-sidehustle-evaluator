export type DeepReport = {
    feasibility: {
        soloDeveloperFit: string;
        estimatedBuildTime: string;
        mainRisks: string[];
        recommendation: string;
    };
    mvpFeatures: {
        mustHave: string[];
        later: string[];
        notRecommended: string[];
    };
    sevenDayPlan: {
        day: string;
        task: string;
    }[];
    agentMvpKit: {
        productGoal: string;
        targetAudience: string;
        mvpRequirements: string[];
        pageRequirements: string[];
        uiRequirements: string[];
        dataStructure: string[];
        technicalConstraints: string[];
        acceptanceCriteria: string[];
    };
    landingPageCopy: {
        headline: string;
        subheadline: string;
        features: string[];
        cta: string;
    };
    pricing: {
        freePlan: string;
        oneTimePrice: string;
        futureSubscription: string;
    };
    acquisition: {
        firstUsers: string[];
        suitablePlatforms: string[];
        lowCostPromotion: string[];
    };
    mvpReduction: {
        sevenDayScope: string;
        remove: string[];
        keep: string[];
    };
    agentExecutionStrategy?: {
        recommendedTech: string[];
        deploymentPlatform: string;
        buildOrder: string[];
        estimatedPageCount: string;
        estimatedFileCount: string;
        mvpDoneCriteria: string[];
    };
    agentDevelopmentKit: {
        projectBrief: string;
        suggestedFileStructure: string[];
        coreComponents: string[];
        stateAndDataFlow: string[];
        implementationSteps: string[];
        copyPasteAgentBrief: string;
    };
    agentPromptPack: {
        buildPrompt: string;
        uiPrompt: string;
        dataPrompt: string;
        QARevisionPrompt: string;
    };
    marketingStarterPack: {
        positioning: string;
        audiencePainPoints: string[];
        launchChannels: string[];
        contentIdeas: string[];
        validationMessages: string[];
    };
    salesPageCopyPack: {
        heroTitle: string;
        heroSubtitle: string;
        problemSection: string;
        solutionSection: string;
        featureBullets: string[];
        proofSection: string;
        faq: {
            question: string;
            answer: string;
        }[];
        finalCta: string;
    };
};
export declare const sampleDeepReport: DeepReport;

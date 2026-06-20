export const geminiReportResponseSchema = {
  type: "OBJECT",
  properties: {
    id: { type: "STRING" },
    title: { type: "STRING" },
    score: { type: "NUMBER" },
    scoreLabel: { type: "STRING" },
    summary: { type: "STRING" },
    dimensions: {
      type: "ARRAY",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          score: { type: "NUMBER" },
          maxScore: { type: "NUMBER" },
          comment: { type: "STRING" },
        },
        required: ["name", "score", "maxScore", "comment"],
      },
    },
    oneSentenceVerdict: { type: "STRING" },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    risks: { type: "ARRAY", items: { type: "STRING" } },
    fatalWarnings: { type: "ARRAY", items: { type: "STRING" } },
    productShape: {
      type: "OBJECT",
      properties: {
        format: { type: "STRING" },
        userFlow: {
          type: "ARRAY",
          minItems: 4,
          items: { type: "STRING" },
        },
        userSees: {
          type: "ARRAY",
          minItems: 5,
          items: { type: "STRING" },
        },
        firstVersionLook: {
          type: "ARRAY",
          minItems: 4,
          items: { type: "STRING" },
        },
      },
      required: ["format", "userFlow", "userSees", "firstVersionLook"],
    },
    dontBuild: {
      type: "ARRAY",
      minItems: 3,
      items: { type: "STRING" },
    },
    pricingSuggestion: { type: "STRING" },
    validationGoal: { type: "STRING" },
    validationPlan: {
      type: "ARRAY",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "STRING" },
          task: { type: "STRING" },
        },
        required: ["day", "task"],
      },
    },
  },
  required: [
    "id",
    "title",
    "score",
    "scoreLabel",
    "summary",
    "dimensions",
    "oneSentenceVerdict",
    "strengths",
    "risks",
    "fatalWarnings",
    "productShape",
    "dontBuild",
    "pricingSuggestion",
    "validationPlan",
  ],
} as const;

const stringArraySchema = {
  type: "ARRAY",
  items: { type: "STRING" },
} as const;

const faqItemSchema = {
  type: "OBJECT",
  properties: {
    question: { type: "STRING" },
    answer: { type: "STRING" },
  },
  required: ["question", "answer"],
} as const;

export const geminiDeepReportResponseSchema = {
  type: "OBJECT",
  properties: {
    feasibility: {
      type: "OBJECT",
      properties: {
        soloDeveloperFit: { type: "STRING" },
        estimatedBuildTime: { type: "STRING" },
        mainRisks: stringArraySchema,
        recommendation: { type: "STRING" },
      },
      required: [
        "soloDeveloperFit",
        "estimatedBuildTime",
        "mainRisks",
        "recommendation",
      ],
    },
    mvpFeatures: {
      type: "OBJECT",
      properties: {
        mustHave: stringArraySchema,
        later: stringArraySchema,
        notRecommended: stringArraySchema,
      },
      required: ["mustHave", "later", "notRecommended"],
    },
    sevenDayPlan: {
      type: "ARRAY",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "STRING" },
          task: { type: "STRING" },
        },
        required: ["day", "task"],
      },
    },
    agentMvpKit: {
      type: "OBJECT",
      properties: {
        productGoal: { type: "STRING" },
        targetAudience: { type: "STRING" },
        mvpRequirements: stringArraySchema,
        pageRequirements: stringArraySchema,
        uiRequirements: stringArraySchema,
        dataStructure: stringArraySchema,
        technicalConstraints: stringArraySchema,
        acceptanceCriteria: stringArraySchema,
      },
      required: [
        "productGoal",
        "targetAudience",
        "mvpRequirements",
        "pageRequirements",
        "uiRequirements",
        "dataStructure",
        "technicalConstraints",
        "acceptanceCriteria",
      ],
    },
    landingPageCopy: {
      type: "OBJECT",
      properties: {
        headline: { type: "STRING" },
        subheadline: { type: "STRING" },
        features: stringArraySchema,
        cta: { type: "STRING" },
      },
      required: ["headline", "subheadline", "features", "cta"],
    },
    pricing: {
      type: "OBJECT",
      properties: {
        freePlan: { type: "STRING" },
        oneTimePrice: { type: "STRING" },
        futureSubscription: { type: "STRING" },
      },
      required: ["freePlan", "oneTimePrice", "futureSubscription"],
    },
    acquisition: {
      type: "OBJECT",
      properties: {
        firstUsers: stringArraySchema,
        suitablePlatforms: stringArraySchema,
        lowCostPromotion: stringArraySchema,
      },
      required: ["firstUsers", "suitablePlatforms", "lowCostPromotion"],
    },
    mvpReduction: {
      type: "OBJECT",
      properties: {
        sevenDayScope: { type: "STRING" },
        remove: stringArraySchema,
        keep: stringArraySchema,
      },
      required: ["sevenDayScope", "remove", "keep"],
    },
    agentExecutionStrategy: {
      type: "OBJECT",
      properties: {
        recommendedTech: stringArraySchema,
        deploymentPlatform: { type: "STRING" },
        buildOrder: stringArraySchema,
        estimatedPageCount: { type: "STRING" },
        estimatedFileCount: { type: "STRING" },
        mvpDoneCriteria: stringArraySchema,
      },
      required: [
        "recommendedTech",
        "deploymentPlatform",
        "buildOrder",
        "estimatedPageCount",
        "estimatedFileCount",
        "mvpDoneCriteria",
      ],
    },
    agentDevelopmentKit: {
      type: "OBJECT",
      properties: {
        projectBrief: { type: "STRING" },
        suggestedFileStructure: stringArraySchema,
        coreComponents: stringArraySchema,
        stateAndDataFlow: stringArraySchema,
        implementationSteps: stringArraySchema,
        copyPasteAgentBrief: { type: "STRING" },
      },
      required: [
        "projectBrief",
        "suggestedFileStructure",
        "coreComponents",
        "stateAndDataFlow",
        "implementationSteps",
        "copyPasteAgentBrief",
      ],
    },
    agentPromptPack: {
      type: "OBJECT",
      properties: {
        buildPrompt: { type: "STRING" },
        uiPrompt: { type: "STRING" },
        dataPrompt: { type: "STRING" },
        QARevisionPrompt: { type: "STRING" },
      },
      required: ["buildPrompt", "uiPrompt", "dataPrompt", "QARevisionPrompt"],
    },
    marketingStarterPack: {
      type: "OBJECT",
      properties: {
        positioning: { type: "STRING" },
        audiencePainPoints: stringArraySchema,
        launchChannels: stringArraySchema,
        contentIdeas: stringArraySchema,
        validationMessages: stringArraySchema,
      },
      required: [
        "positioning",
        "audiencePainPoints",
        "launchChannels",
        "contentIdeas",
        "validationMessages",
      ],
    },
    salesPageCopyPack: {
      type: "OBJECT",
      properties: {
        heroTitle: { type: "STRING" },
        heroSubtitle: { type: "STRING" },
        problemSection: { type: "STRING" },
        solutionSection: { type: "STRING" },
        featureBullets: stringArraySchema,
        proofSection: { type: "STRING" },
        faq: {
          type: "ARRAY",
          items: faqItemSchema,
        },
        finalCta: { type: "STRING" },
      },
      required: [
        "heroTitle",
        "heroSubtitle",
        "problemSection",
        "solutionSection",
        "featureBullets",
        "proofSection",
        "faq",
        "finalCta",
      ],
    },
  },
  required: [
    "feasibility",
    "mvpFeatures",
    "sevenDayPlan",
    "agentMvpKit",
    "landingPageCopy",
    "pricing",
    "acquisition",
    "mvpReduction",
    "agentExecutionStrategy",
    "agentDevelopmentKit",
    "agentPromptPack",
    "marketingStarterPack",
    "salesPageCopyPack",
  ],
} as const;

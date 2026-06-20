import type { DeepReport } from "../data/deepReport";

export type DeepReportValidationResult = {
  isValid: boolean;
  errors: string[];
};

export function validateDeepReport(data: unknown): DeepReportValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { isValid: false, errors: ["Deep Report 必須是 object"] };
  }

  const report = data as Record<string, unknown>;
  requireObject(report.feasibility, "feasibility", errors);
  requireObject(report.mvpFeatures, "mvpFeatures", errors);
  requireObject(report.agentMvpKit, "agentMvpKit", errors);
  requireObject(report.landingPageCopy, "landingPageCopy", errors);
  requireObject(report.pricing, "pricing", errors);
  requireObject(report.acquisition, "acquisition", errors);
  requireObject(report.mvpReduction, "mvpReduction", errors);
  requireObject(report.agentDevelopmentKit, "agentDevelopmentKit", errors);
  requireObject(report.agentPromptPack, "agentPromptPack", errors);
  requireObject(report.marketingStarterPack, "marketingStarterPack", errors);
  requireObject(report.salesPageCopyPack, "salesPageCopyPack", errors);
  requireArray(report.sevenDayPlan, "sevenDayPlan", errors, 7);

  return { isValid: errors.length === 0, errors };
}

export function normalizeDeepReport(report: DeepReport): DeepReport {
  return {
    ...report,
    feasibility: {
      ...report.feasibility,
      mainRisks: report.feasibility.mainRisks ?? [],
    },
    mvpFeatures: {
      mustHave: report.mvpFeatures.mustHave ?? [],
      later: report.mvpFeatures.later ?? [],
      notRecommended: report.mvpFeatures.notRecommended ?? [],
    },
    sevenDayPlan: report.sevenDayPlan ?? [],
    agentMvpKit: {
      ...report.agentMvpKit,
      mvpRequirements: report.agentMvpKit.mvpRequirements ?? [],
      pageRequirements: report.agentMvpKit.pageRequirements ?? [],
      uiRequirements: report.agentMvpKit.uiRequirements ?? [],
      dataStructure: report.agentMvpKit.dataStructure ?? [],
      technicalConstraints: report.agentMvpKit.technicalConstraints ?? [],
      acceptanceCriteria: report.agentMvpKit.acceptanceCriteria ?? [],
    },
    landingPageCopy: {
      ...report.landingPageCopy,
      features: report.landingPageCopy.features ?? [],
    },
    acquisition: {
      firstUsers: report.acquisition.firstUsers ?? [],
      suitablePlatforms: report.acquisition.suitablePlatforms ?? [],
      lowCostPromotion: report.acquisition.lowCostPromotion ?? [],
    },
    mvpReduction: {
      ...report.mvpReduction,
      remove: report.mvpReduction.remove ?? [],
      keep: report.mvpReduction.keep ?? [],
    },
    agentExecutionStrategy: report.agentExecutionStrategy
      ? {
          recommendedTech: report.agentExecutionStrategy.recommendedTech ?? [],
          deploymentPlatform: report.agentExecutionStrategy.deploymentPlatform ?? "",
          buildOrder: report.agentExecutionStrategy.buildOrder ?? [],
          estimatedPageCount: report.agentExecutionStrategy.estimatedPageCount ?? "",
          estimatedFileCount: report.agentExecutionStrategy.estimatedFileCount ?? "",
          mvpDoneCriteria: report.agentExecutionStrategy.mvpDoneCriteria ?? [],
        }
      : undefined,
    agentDevelopmentKit: {
      ...report.agentDevelopmentKit,
      suggestedFileStructure:
        report.agentDevelopmentKit.suggestedFileStructure ?? [],
      coreComponents: report.agentDevelopmentKit.coreComponents ?? [],
      stateAndDataFlow: report.agentDevelopmentKit.stateAndDataFlow ?? [],
      implementationSteps: report.agentDevelopmentKit.implementationSteps ?? [],
    },
    agentPromptPack: {
      ...report.agentPromptPack,
    },
    marketingStarterPack: {
      ...report.marketingStarterPack,
      audiencePainPoints: report.marketingStarterPack.audiencePainPoints ?? [],
      launchChannels: report.marketingStarterPack.launchChannels ?? [],
      contentIdeas: report.marketingStarterPack.contentIdeas ?? [],
      validationMessages: report.marketingStarterPack.validationMessages ?? [],
    },
    salesPageCopyPack: {
      ...report.salesPageCopyPack,
      featureBullets: report.salesPageCopyPack.featureBullets ?? [],
      faq: report.salesPageCopyPack.faq ?? [],
    },
  };
}

function requireObject(value: unknown, path: string, errors: string[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${path} 必須是 object`);
  }
}

function requireArray(
  value: unknown,
  path: string,
  errors: string[],
  exactLength?: number
) {
  if (!Array.isArray(value)) {
    errors.push(`${path} 必須是 array`);
    return;
  }

  if (exactLength !== undefined && value.length !== exactLength) {
    errors.push(`${path} 必須剛好 ${exactLength} 項`);
  }
}

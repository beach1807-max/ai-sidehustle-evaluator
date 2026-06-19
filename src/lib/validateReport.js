function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isNumberInRange(value, min, max) {
    return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}
function requireString(object, key, errors, label = key) {
    if (!isNonEmptyString(object[key])) {
        errors.push(`缺少 ${label}`);
    }
}
function requireArray(object, key, errors, label = key) {
    if (!Array.isArray(object[key])) {
        errors.push(`${label} 必須是 array`);
        return null;
    }
    return object[key];
}
export function validateReportData(data) {
    const errors = [];
    const warnings = [];
    if (!isRecord(data)) {
        return {
            isValid: false,
            errors: ["JSON 根層必須是 object"],
            warnings,
        };
    }
    requireString(data, "id", errors, "id");
    requireString(data, "title", errors, "title");
    requireString(data, "scoreLabel", errors, "scoreLabel");
    requireString(data, "summary", errors, "summary");
    requireString(data, "oneSentenceVerdict", errors, "oneSentenceVerdict");
    requireString(data, "pricingSuggestion", errors, "pricingSuggestion");
    requireString(data, "validationGoal", errors, "validationGoal");
    if (!isNumberInRange(data.score, 0, 100)) {
        errors.push("score 必須是 number，且介於 0～100");
    }
    const dimensions = requireArray(data, "dimensions", errors, "dimensions");
    if (dimensions) {
        if (dimensions.length !== 7) {
            errors.push("dimensions 必須剛好有 7 個項目");
        }
        let dimensionScoreTotal = 0;
        let dimensionMaxScoreTotal = 0;
        dimensions.forEach((dimension, index) => {
            const prefix = `dimensions[${index}]`;
            if (!isRecord(dimension)) {
                errors.push(`${prefix} 必須是 object`);
                return;
            }
            requireString(dimension, "name", errors, `${prefix}.name`);
            requireString(dimension, "comment", errors, `${prefix}.comment`);
            const dimensionScore = dimension.score;
            const dimensionMaxScore = dimension.maxScore;
            if (!isNumberInRange(dimensionScore, 0, 100)) {
                errors.push(`${prefix}.score 必須是 number`);
            }
            else if (typeof dimensionMaxScore === "number" &&
                Number.isFinite(dimensionMaxScore) &&
                dimensionScore > dimensionMaxScore) {
                errors.push(`${prefix}.score 不可以大於 maxScore`);
            }
            else {
                dimensionScoreTotal += dimensionScore;
            }
            if (!isNumberInRange(dimensionMaxScore, 1, 100)) {
                errors.push(`${prefix}.maxScore 必須是 number`);
            }
            else {
                dimensionMaxScoreTotal += dimensionMaxScore;
            }
        });
        if (dimensionMaxScoreTotal !== 100) {
            errors.push("dimensions maxScore 加總必須等於 100");
        }
        if (typeof data.score === "number" &&
            Number.isFinite(data.score) &&
            dimensionScoreTotal !== data.score) {
            warnings.push("dimensions 分數加總與 score 不一致，系統將自動以 dimensions 加總修正 score。");
        }
    }
    const strengths = requireArray(data, "strengths", errors, "strengths");
    if (strengths && strengths.length < 1) {
        errors.push("strengths 必須至少 1 項");
    }
    const risks = requireArray(data, "risks", errors, "risks");
    if (risks && risks.length < 1) {
        errors.push("risks 必須至少 1 項");
    }
    requireArray(data, "fatalWarnings", errors, "fatalWarnings");
    if (!isRecord(data.productShape)) {
        errors.push("productShape 必須存在");
    }
    else {
        requireString(data.productShape, "format", errors, "productShape.format");
        const userFlow = requireArray(data.productShape, "userFlow", errors, "productShape.userFlow");
        if (userFlow && userFlow.length < 4) {
            errors.push("productShape.userFlow 必須至少 4 項");
        }
        const userSees = requireArray(data.productShape, "userSees", errors, "productShape.userSees");
        if (userSees && userSees.length < 5) {
            errors.push("productShape.userSees 必須至少 5 項");
        }
        const firstVersionLook = requireArray(data.productShape, "firstVersionLook", errors, "productShape.firstVersionLook");
        if (firstVersionLook && firstVersionLook.length < 4) {
            errors.push("productShape.firstVersionLook 必須至少 4 項");
        }
    }
    const dontBuild = requireArray(data, "dontBuild", errors, "dontBuild");
    if (dontBuild && dontBuild.length < 3) {
        errors.push("dontBuild 必須至少 3 項");
    }
    if ("pricingTiers" in data && !Array.isArray(data.pricingTiers)) {
        warnings.push("pricingTiers 格式不是 array，系統將忽略此 optional 欄位。");
    }
    const validationPlan = requireArray(data, "validationPlan", errors, "validationPlan");
    if (validationPlan) {
        if (validationPlan.length !== 7) {
            errors.push("validationPlan 必須剛好 7 天");
        }
        validationPlan.forEach((step, index) => {
            const prefix = `validationPlan[${index}]`;
            if (!isRecord(step)) {
                errors.push(`${prefix} 必須是 object`);
                return;
            }
            requireString(step, "day", errors, `${prefix}.day`);
            requireString(step, "task", errors, `${prefix}.task`);
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
export function getScoreLabel(score) {
    if (score >= 80) {
        return "適合進入 MVP";
    }
    if (score >= 65) {
        return "可做，但必須縮小範圍";
    }
    if (score >= 50) {
        return "只適合先做驗證頁";
    }
    if (score >= 35) {
        return "不建議直接開發";
    }
    return "建議放棄或暫緩";
}
export function normalizeReportData(report) {
    const normalizedScore = report.dimensions.reduce((total, dimension) => total + dimension.score, 0);
    return {
        ...report,
        score: normalizedScore,
        scoreLabel: getScoreLabel(normalizedScore),
    };
}

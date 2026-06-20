export const sampleDeepReport = {
    feasibility: {
        soloDeveloperFit: "適合一人先做出可驗證版本，但必須避免完整平台、會員系統與大量人工服務。",
        estimatedBuildTime: "7 天可完成可展示 MVP，14～21 天可整理成較完整的公開測試版。",
        mainRisks: [
            "範圍容易膨脹成完整 SaaS",
            "使用者可能覺得直接問 AI 工具也能做到",
            "若輸出太泛，付費意願會偏低",
        ],
        recommendation: "建議執行，但第一版只做單頁輸入與固定格式報告，先驗證使用者是否願意依照報告行動或付費。",
    },
    mvpFeatures: {
        mustHave: [
            "三欄輸入表單",
            "冷靜評分報告",
            "7 天驗證行動清單",
            "深度報告預覽 CTA",
        ],
        later: ["歷史紀錄", "多種報告模板", "付款流程", "分享連結"],
        notRecommended: ["會員系統", "完整後台", "社群功能", "複雜資料庫"],
    },
    sevenDayPlan: [
        { day: "Day1", task: "確認目標使用者與主要痛點，寫出一頁式產品假設。" },
        { day: "Day2", task: "完成免費評估表單與報告版型。" },
        { day: "Day3", task: "整理深度報告的固定 JSON 結構與顯示頁。" },
        { day: "Day4", task: "準備 3 份範例報告與公開測試文案。" },
        { day: "Day5", task: "找 5 位一人副業者測試免費報告。" },
        { day: "Day6", task: "詢問是否願意為深度報告支付 NT$49～99。" },
        { day: "Day7", task: "依照回饋判斷是否加入付款流程。" },
    ],
    agentMvpKit: {
        productGoal: "建立一個讓一人副業者快速判斷點子可行性，並取得下一步 MVP 行動方案的網頁工具。",
        targetAudience: "有副業點子、時間有限、想先縮小驗證的一人開發者或知識工作者。",
        mvpRequirements: [
            "使用者可輸入副業點子與可投入時間",
            "系統產生冷靜評分報告",
            "系統產生深度 MVP 執行建議",
        ],
        pageRequirements: ["首頁", "輸入頁", "免費報告頁", "深度報告預覽頁"],
        uiRequirements: [
            "表單欄位清楚",
            "報告以卡片分段",
            "CTA 不要像強迫推銷",
            "手機版可讀",
        ],
        dataStructure: [
            "EvaluationInput: idea, availableTime, avoidThings, mode",
            "DeepReport: feasibility, mvpFeatures, sevenDayPlan, agentMvpKit, landingPageCopy, pricing, acquisition, mvpReduction",
        ],
        technicalConstraints: [
            "不新增登入",
            "不新增資料庫",
            "不新增金流",
            "沿用既有 /api/evaluate",
        ],
        acceptanceCriteria: [
            "免費評估流程正常",
            "mode=deep 可產生 Deep Report JSON",
            "前端可顯示所有深度報告區塊",
        ],
    },
    landingPageCopy: {
        headline: "用一份冷靜報告，把副業點子縮成 7 天可驗證 MVP",
        subheadline: "輸入你的點子與可投入時間，取得保守評分、風險提醒與下一步行動方案。",
        features: ["冷靜總分", "風險判斷", "MVP 功能切分", "7 天行動計畫"],
        cta: "開始評估我的副業點子",
    },
    pricing: {
        freePlan: "免費取得冷靜評分、主要風險與簡版 7 天驗證清單。",
        oneTimePrice: "深度報告可先測 NT$49～99 單次付費。",
        futureSubscription: "除非有穩定重複需求，否則不建議第一版做訂閱制。",
    },
    acquisition: {
        firstUsers: ["一人副業者", "正在學 AI 工具的人", "想用 Codex 做產品的人"],
        suitablePlatforms: ["Threads", "Facebook 社團", "Indie Hackers", "個人電子報"],
        lowCostPromotion: ["公開拆解範例報告", "分享 7 天 MVP 挑戰", "提供前 10 份人工回饋"],
    },
    mvpReduction: {
        sevenDayScope: "只做單頁輸入、報告產生與深度報告預覽，不做完整平台。",
        remove: ["登入", "付款", "歷史紀錄", "後台", "多模板切換"],
        keep: ["輸入表單", "免費報告", "深度報告 JSON", "深度報告顯示頁"],
    },
    agentExecutionStrategy: {
        recommendedTech: ["React", "Vite", "Tailwind CSS", "Cloudflare Pages Functions"],
        deploymentPlatform: "Cloudflare Pages",
        buildOrder: ["首頁", "輸入頁", "免費報告頁", "深度報告頁"],
        estimatedPageCount: "4 頁",
        estimatedFileCount: "10～15 個檔案",
        mvpDoneCriteria: [
            "使用者可輸入副業點子",
            "系統可產生免費報告",
            "開發者模式可產生深度報告",
            "所有頁面可在手機與桌機閱讀",
        ],
    },
};

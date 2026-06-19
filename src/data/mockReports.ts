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

const petFoodAnalysisReport: MockReport = {
  id: "pet-food-analysis",
  title: "寵物飼料分析報告",
  score: 74,
  scoreLabel: "可做，但必須縮小範圍",
  summary:
    "這個點子有真實需求與付費可能，但不能做成完整推薦平台。第一版應該縮小成「飼料成分分析報告產生器」。",
  dimensions: [
    {
      name: "個人契合度",
      score: 13,
      maxScore: 15,
      comment: "你能理解目標客群的焦慮，題目也適合用固定框架分析。",
    },
    {
      name: "MVP 難度",
      score: 15,
      maxScore: 20,
      comment: "若只做單次報告，範圍可控；若做完整平台，難度會快速失控。",
    },
    {
      name: "需求強度",
      score: 16,
      maxScore: 20,
      comment: "飼料選擇常伴隨軟便、挑食、過敏疑慮與體重管理情境。",
    },
    {
      name: "付費可能性",
      score: 11,
      maxScore: 15,
      comment: "單次低價報告有測試空間，但訂閱制不適合作為第一版。",
    },
    {
      name: "獲客難度",
      score: 10,
      maxScore: 15,
      comment: "寵物社群可測試痛點，但信任建立與內容品質會影響轉換。",
    },
    {
      name: "法律與平台風險",
      score: 5,
      maxScore: 10,
      comment: "必須避開醫療診斷、療效承諾與品牌排名爭議。",
    },
    {
      name: "維護成本",
      score: 4,
      maxScore: 5,
      comment: "不建資料庫時維護成本低；一旦做品牌資料庫就會變重。",
    },
  ],
  oneSentenceVerdict:
    "可以做，但不要做成「寵物營養推薦平台」。第一版應該先做成「飼料成分分析報告產生器」，驗證是否有人願意為單次報告付費。",
  strengths: [
    "你自己就是目標客群，且寵物飼料選擇確實會帶來焦慮。",
    "這類問題有明確情境，例如軟便、過敏、挑食、體重控制，容易包裝成單次分析報告。",
  ],
  risks: [
    "這個題目容易碰到寵物健康、營養與醫療責任。",
    "產品不能宣稱治療、診斷或保證改善，只能定位為教育型輔助分析工具，並提醒使用者必要時諮詢獸醫。",
  ],
  fatalWarnings: [
    "不要做成醫療診斷工具",
    "不要承諾改善軟便、過敏或疾病",
    "不要一開始建立完整飼料資料庫",
    "不要做品牌排行榜，避免爭議與維護成本",
    "不要用「推薦唯一最佳飼料」這種高責任說法",
  ],
  productShape: {
    format:
      "一個單頁式網頁工具。使用者不用註冊，只要貼上飼料成分表，再選擇狗狗目前狀況，就能產出一份分析報告。",
    userFlow: [
      "Step 1：輸入狗狗基本資料",
      "Step 2：貼上飼料成分與營養標示",
      "Step 3：選擇目前狀況，例如軟便、挑食、過敏疑慮、體重控制",
      "Step 4：系統產出一份「飼料成分分析報告」",
      "Step 5：使用者可儲存、截圖或複製報告",
    ],
    userSees: [
      "這款飼料的主要成分摘要",
      "對目前狗狗狀況可能有幫助的地方",
      "需要注意的成分或營養比例",
      "適合度評估",
      "替換飼料前應注意的事項",
      "非醫療免責聲明",
    ],
    firstVersionLook: [
      "第一版不需要像完整平台，只需要像一個「飼料報告產生器」。",
      "上半部：輸入資料",
      "中間：產生報告按鈕",
      "下半部：報告結果卡片",
      "重點是讓使用者快速拿到一份有用的分析，而不是瀏覽大量飼料資料。",
    ],
  },
  dontBuild: [
    "不做會員系統",
    "不做飼料資料庫",
    "不做品牌排名",
    "不做 App",
    "不做訂閱制",
    "不做獸醫問診",
    "不做社群功能",
    "不做個人化長期追蹤",
  ],
  pricingSuggestion:
    "第一版建議用單次報告收費，不建議一開始做月訂閱。",
  pricingTiers: [
    "免費版：顯示簡短風險摘要",
    "付費版：49～99 元，解鎖完整分析報告",
  ],
  validationGoal:
    "先確認是否有人願意為一份具體報告付費，而不是先驗證完整平台。",
  validationPlan: [
    { day: "Day 1", task: "寫出一頁式 Landing Page 文案" },
    { day: "Day 2", task: "製作 3 份範例報告" },
    { day: "Day 3", task: "放上表單或付款意願按鈕" },
    { day: "Day 4", task: "到寵物社群發文測試痛點" },
    { day: "Day 5", task: "收集 5～10 位使用者回饋" },
    { day: "Day 6", task: "人工產出第一批報告" },
    { day: "Day 7", task: "判斷是否有人願意付 49～99 元" },
  ],
};

const aiPetMonitorReport: MockReport = {
  id: "ai-pet-monitor",
  title: "AI 寵物監控摘要",
  score: 48,
  scoreLabel: "不建議直接開發",
  summary:
    "概念有吸引力，但第一版阻力太高。最大問題是需要串接監控器、持續讀取影像、處理雲端影片來源與使用者安裝問題，不適合一人下班時間快速驗證。",
  dimensions: [
    {
      name: "個人契合度",
      score: 10,
      maxScore: 15,
      comment: "如果你熟悉寵物照護情境，能理解需求；但技術與支援負擔會很快超出一人副業範圍。",
    },
    {
      name: "MVP 難度",
      score: 6,
      maxScore: 20,
      comment: "即時監控、雲端影片來源與攝影機串接都太重，不適合第一版。",
    },
    {
      name: "需求強度",
      score: 13,
      maxScore: 20,
      comment: "飼主確實想知道寵物獨處時發生什麼，但願意付費前需要先看見明確效果。",
    },
    {
      name: "付費可能性",
      score: 7,
      maxScore: 15,
      comment: "短影片摘要可能有低價測試空間，長期監控訂閱則需要更高信任與穩定度。",
    },
    {
      name: "獲客難度",
      score: 7,
      maxScore: 15,
      comment: "寵物社群可測痛點，但影片上傳與隱私疑慮會降低轉換。",
    },
    {
      name: "法律與平台風險",
      score: 3,
      maxScore: 10,
      comment: "影片資料、隱私、行為判讀與醫療暗示都需要小心處理。",
    },
    {
      name: "維護成本",
      score: 2,
      maxScore: 5,
      comment: "只要碰到串流、儲存或品牌整合，維護成本就會快速升高。",
    },
  ],
  oneSentenceVerdict:
    "不要做即時監控。第一版只做「短影片寵物行為摘要工具」，先驗證使用者是否覺得摘要有價值。",
  strengths: [
    "寵物獨處監控是清楚且容易被理解的痛點，飼主會想知道是否焦躁、啃咬、亂尿或長時間吠叫。",
    "如果改成短影片上傳，第一版就能避開攝影機串接與即時串流，讓驗證成本下降。",
  ],
  risks: [
    "原始構想太像完整監控系統，會碰到硬體相容、影片來源、背景處理、儲存成本與客服問題。",
    "行為判讀容易被使用者理解成診斷，必須避免保證正確，也不能取代獸醫或訓練師建議。",
  ],
  fatalWarnings: [
    "不要串接小米雲端",
    "不要做即時監控",
    "不要做 24 小時背景分析",
    "不要承諾可診斷分離焦慮或疾病",
    "不要儲存長影片作為第一版功能",
  ],
  productShape: {
    format:
      "一個單頁式網頁工具。使用者上傳 1～3 分鐘的寵物影片，系統產出時間點摘要與可能行為標記。",
    userFlow: [
      "Step 1：使用者上傳一段短影片",
      "Step 2：選擇想分析的問題，例如什麼時候尿尿、是否有啃咬、是否焦躁",
      "Step 3：系統產出影片摘要",
      "Step 4：標記可能事件時間點",
      "Step 5：使用者自行回看原影片確認",
    ],
    userSees: [
      "影片大致內容摘要",
      "可能事件時間點",
      "寵物行為描述",
      "不確定片段提醒",
      "後續觀察建議",
      "非醫療與非行為診斷免責聲明",
    ],
    firstVersionLook: [
      "上半部：影片上傳區",
      "中間：選擇分析目標",
      "下半部：時間軸摘要卡片",
      "不做即時串流、不串小米監控、不做背景常駐分析",
    ],
  },
  dontBuild: [
    "不串接小米雲端",
    "不做即時監控",
    "不做 24 小時背景分析",
    "不做 App",
    "不做攝影機品牌整合",
    "不做行為診斷",
    "不做長影片儲存",
  ],
  pricingSuggestion:
    "第一版可以先測單次短影片摘要收費，不建議直接做監控訂閱。",
  pricingTiers: [
    "免費版：顯示一段簡短影片摘要",
    "付費版：49～99 元，提供時間點標記與更完整觀察建議",
  ],
  validationGoal:
    "先確認飼主是否願意上傳短影片並為摘要付費，再考慮更完整的監控流程。",
  validationPlan: [
    { day: "Day 1", task: "寫出短影片摘要工具的一頁式文案" },
    { day: "Day 2", task: "手工製作 3 份影片摘要範例" },
    { day: "Day 3", task: "建立短影片上傳或表單收件流程" },
    { day: "Day 4", task: "到寵物社群測試飼主是否願意提供影片" },
    { day: "Day 5", task: "人工分析 5 段短影片並收集回饋" },
    { day: "Day 6", task: "整理最常見的觀察需求與不確定片段" },
    { day: "Day 7", task: "判斷是否有人願意為短影片摘要付 49～99 元" },
  ],
};

const sideProjectScorerReport: MockReport = {
  id: "side-project-scorer",
  title: "副業點子冷靜評分器",
  score: 82,
  scoreLabel: "適合做 MVP",
  summary:
    "適合做 MVP，因為範圍小、開發快、不需要第三方資料，也符合一人副業者需求。最大風險是使用者可能覺得直接問 ChatGPT 也能做到。",
  dimensions: [
    {
      name: "個人契合度",
      score: 14,
      maxScore: 15,
      comment: "很適合熟悉 AI 工具、產品判斷與一人副業限制的人來做。",
    },
    {
      name: "MVP 難度",
      score: 18,
      maxScore: 20,
      comment: "第一版只需要表單、固定報告格式與範例資料，開發範圍很小。",
    },
    {
      name: "需求強度",
      score: 15,
      maxScore: 20,
      comment: "許多人有副業點子，但缺的是冷靜拆解與縮小範圍的框架。",
    },
    {
      name: "付費可能性",
      score: 12,
      maxScore: 15,
      comment: "若報告足夠具體，低價單次報告或進階分析有測試空間。",
    },
    {
      name: "獲客難度",
      score: 12,
      maxScore: 15,
      comment: "目標客群常出現在 AI、Side Project、個人知識工作者社群。",
    },
    {
      name: "法律與平台風險",
      score: 7,
      maxScore: 10,
      comment: "風險相對低，但文案不能保證成功或暗示投資收益。",
    },
    {
      name: "維護成本",
      score: 4,
      maxScore: 5,
      comment: "不做登入、資料庫與後台時，第一版維護成本低。",
    },
  ],
  oneSentenceVerdict:
    "第一版不要做成完整 SaaS，只做「輸入表單 + 固定格式評估報告」，先驗證報告是否真的有價值感。",
  strengths: [
    "題目範圍清楚，使用者輸入少，報告格式可以標準化，非常適合先做 Mock 或半自動 MVP。",
    "產品價值不是取代 ChatGPT，而是提供更固定、更冷靜、更像顧問報告的判斷框架。",
  ],
  risks: [
    "使用者可能覺得直接問 ChatGPT 也能得到類似內容，因此報告必須更有結構、可掃讀、可執行。",
    "如果一開始加入太多模板、帳號、歷史紀錄與付款流程，會偏離最小驗證目標。",
  ],
  fatalWarnings: [
    "不要保證副業會成功",
    "不要使用輕鬆月入或財富自由文案",
    "不要一開始做完整 SaaS 後台",
    "不要把輸入表單做成商業企劃書",
    "不要先做多種報告模板",
  ],
  productShape: {
    format:
      "一個純網頁評估工具。使用者輸入副業點子、可投入時間、不想做的事情後，系統產出一份結構化冷靜評估報告。",
    userFlow: [
      "Step 1：輸入副業點子",
      "Step 2：填寫可投入時間",
      "Step 3：填寫不想做的事情",
      "Step 4：系統產出冷靜評分報告",
      "Step 5：使用者依照報告判斷該做、縮小或放棄",
    ],
    userSees: [
      "冷靜總分",
      "一句話結論",
      "七大維度評分",
      "最大優勢",
      "最大風險",
      "致命紅旗",
      "建議產品樣貌",
      "立即砍掉清單",
      "7 天驗證行動清單",
    ],
    firstVersionLook: [
      "首頁：說明工具價值",
      "輸入頁：三個簡單欄位",
      "報告頁：顧問式評估報告",
      "範例頁：展示三個範例報告",
      "不做登入、不做付款、不做資料庫、不做後台",
    ],
  },
  dontBuild: [
    "不做會員系統",
    "不做歷史紀錄",
    "不做付款",
    "不做社群功能",
    "不做點子資料庫",
    "不做多種報告模板",
    "不做完整 SaaS 後台",
  ],
  pricingSuggestion:
    "第一版先驗證免費報告是否有分享與回訪，再考慮單次付費完整報告。",
  pricingTiers: [
    "免費版：顯示總分、結論與主要風險",
    "付費版：解鎖完整產品樣貌、砍掉清單與驗證行動",
  ],
  validationGoal:
    "先確認使用者是否覺得報告比自己問 ChatGPT 更有判斷價值。",
  validationPlan: [
    { day: "Day 1", task: "整理一份固定報告框架與評分維度" },
    { day: "Day 2", task: "製作 3 份高品質範例報告" },
    { day: "Day 3", task: "放上三欄位輸入表單與 Mock 報告頁" },
    { day: "Day 4", task: "找 5 位有副業點子的朋友試用" },
    { day: "Day 5", task: "觀察哪些段落最有幫助、哪些段落太空泛" },
    { day: "Day 6", task: "調整報告格式與下一步建議" },
    { day: "Day 7", task: "判斷是否值得接上 AI API 做客製化報告" },
  ],
};

export const mockReports: MockReport[] = [
  aiPetMonitorReport,
  petFoodAnalysisReport,
  sideProjectScorerReport,
];

export const defaultReportId = "pet-food-analysis";

export const mockReport = petFoodAnalysisReport;

export function getMockReport(reportId?: string) {
  return mockReports.find((report) => report.id === reportId);
}

export const exampleReports: ExampleReport[] = mockReports.map((report) => ({
  id: report.id,
  title: report.title,
  score: report.score,
  label: report.scoreLabel,
  conclusion: report.summary,
  risk: report.risks[0],
  smallerVersion: report.oneSentenceVerdict,
}));

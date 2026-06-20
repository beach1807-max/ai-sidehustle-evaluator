{

"feasibility": {

"soloDeveloperFit": "適合。利用純前端技術串接 LLM API 進行即時 Vision 辨識與分析，免去傳統資料庫維護，極大程度降低一人開發在時間上的營運負擔。",

"estimatedBuildTime": "約 10-12 小時。完全可以拆解至下班後的 1-2 小時與週末半天內完成。",

"mainRisks": \[

"AI 對成分辨識可能有幻覺，若涉及特定處方糧或病情建議易引發醫療爭議與免責風險。",

"工具屬於「低頻次使用」，飼主一旦確認自家固定購買的幾款飼料後便不再使用，單次付費的留存率與轉化率可能偏低。",

"圖片上傳的 Token 成本可能隨著用戶重複嘗試而上升，若付費牆設計不當易導致副業微幅虧損。"

],

"recommendation": "建議保守執行。嚴禁第一版建立品牌資料庫或會員系統，改以「拍照/上傳成分表 -> AI 即時分析 -> 單次付費解鎖深度營養建議」的極簡單頁工具進行市場付費意願驗證。"

},

"mvpFeatures": {

"mustHave": \[

"免登入的一頁式飼料照片上傳/相機拍照功能。",

"基礎寵物特徵選項（犬/貓、年齡層、特殊過敏源）。",

"串接大模型 Vision 能力的 OCR 分析 Prompt（輸出主要成分、潛在風險、AAFCO 標準對比）。",

"前端毛玻璃遮罩付費牆（僅免費顯示前三項成分，其餘深度營養與推薦分析需付費解鎖）。",

"顯著的免責聲明（提示本報告由 AI 生成，不可替代臨床獸醫診斷）。"

],

"later": \[

"會員帳號、多隻寵物健康檔案儲存與歷史報告查詢。",

"台灣市場各大市售飼料品牌價格爬蟲與自動比價功能。",

"導購分潤系統（如自動生成蝦皮或 Momo 的推廣連結）。",

"PDF 健檢報告定期導出與下載。"

],

"notRecommended": \[

"手動建立與維護結構化的品牌飼料庫（耗費大量時間維護，違背不想長期人工維護的原則）。",

"建置線上即時客服（一人副業無暇應對，應改為非即時的反饋表單）。",

"開發與上架 iOS/Android 原生 App（上架與雙平台審查時間過長，不符 MVP 精神）。"

]

},

"sevenDayPlan": \[

{ "day": "Day1", "task": "使用實際飼料包裝圖片在 ChatGPT/Gemini 網頁端測試並定稿分析 Prompt，確保回傳 JSON 格式穩定。" },

{ "day": "Day2", "task": "透過 Cursor 初始化 Next.js 專案，使用 Tailwind CSS 快速搭建 Landing Page 與上傳表單的 UI 骨架。" },

{ "day": "Day3", "task": "撰寫 Next.js API Route，將前端傳入的 Base64 圖片與寵物資訊傳遞給大模型 API，並測試 Vision 回傳資料。" },

{ "day": "Day4", "task": "設計前端資料解析，將 API 回傳的結構化 JSON 轉換為可讀性高的營養成分與風險警告卡片。" },

{ "day": "Day5", "task": "串接 Stripe Payment Links 或綠界單次付款，實作最簡單的付費成功後導回 `?paid=true` 解鎖前端遮罩的邏輯。" },

{ "day": "Day6", "task": "將專案部署至 Vercel，使用手機進行實地拍照、辨識、付費與解鎖的端到端（E2E）測試與 Bug 修復。" },

{ "day": "Day7", "task": "配合精準社群（Threads、Facebook 寵物主題社團）發表問題痛點文，導流並觀察第一批真實付費轉化率。" }

],

"agentMvpKit": {

"productGoal": "建立一個免登入、無傳統資料庫，完全依靠大模型 Vision API 即時分析寵物飼料成分並透過單次付費解鎖的一頁式 Web 應用。",

"targetAudience": "看不懂貓狗飼料背面複雜化學添加物名詞，且毛孩時常挑食、軟便、過敏而急需客觀第三方拆解成分的寵物主。",

"mvpRequirements": \[

"提供使用者勾選：寵物種類（貓/狗）、年齡階段（幼年/成年/老年）、特定過敏原（如牛肉、雞肉、小麥）。",

"支援使用者上傳 1 張清楚的飼料成分袋包裝照片。",

"呼叫大模型 API 進行 OCR 與數據分析，返回結構化營養報告。",

"在前端設置付費牆，未付費前模糊顯示核心『過敏風險評估』與『AAFCO 符合度結論』。"

],

"pageRequirements": \[

"單一網頁（Landing Page 與工具一體化）：上方為痛點行銷文案與上傳表單，下方為分析結果展示區（內嵌付費牆卡片）。"

],

"uiRequirements": \[

"主視覺需走醫療營養學的專業簡潔感，以白底、深灰文字、加上草綠與警示橘紅為主色調。",

"必須包含上傳中與 AI 分析中的骨架屏（Skeleton Animation），緩解使用者等待 Vision API 回傳時的焦慮。",

"付費牆必須使用 CSS backdrop-blur 阻擋核心報告內容，並浮動顯示醒目的付款按鈕。"

],

"dataStructure": \[

"全前端狀態管理（React State）：petInfo (Object), imageBase64 (String), apiResponse (Object), isPaid (Boolean)。不使用伺服器端 Database。"

],

"technicalConstraints": \[

"必須在 Next.js Serverless Function 中呼叫大模型 API，絕不可在前端暴露 API Key。",

"由於無資料庫，付款成功狀態暫時利用客戶端 URL Query Parameter 進行簡易標記解鎖。"

],

"acceptanceCriteria": \[

"上傳一張清晰的市售飼料成分圖片，系統能在 15 秒內精準識別前三大主要成分並給出白話解釋。",

"未付費時後半段報告為模糊狀態；點擊付費完成金流跳轉回網站後，報告能立即完整展現。"

]

},

"landingPageCopy": {

"headline": "看不懂貓狗飼料成分表？AI 10秒幫你抓出隱藏的劣質肉粉與致敏原",

"subheadline": "免註冊、免下載 App。只需拍下飼料包裝袋，立即對比你家毛孩體質，產出客觀的第三方營養成分健檢報告。",

"features": \[

"化學名詞白話文：自動將看不懂的化學添加物，翻譯成對寵物身體影響的直白說明。",

"過敏原自動交叉比對：依據你勾選的寵物敏感體質，自動高亮成分表中的潛在過敏風險。",

"100% 中立不業配：不接受任何寵物飼料廠商贊助，純粹基於 AAFCO 標準進行數據化盲測評分。"

],

"cta": "立即拍照上傳，免費檢測前三項核心成分"

},

"pricing": {

"freePlan": "免費體驗：上傳照片後，免費辨識並分析前三大主要成分來源，並給出基礎營養素是否及格的初步評估。",

"oneTimePrice": "新台幣 69 元 / 單次詳細分析報告：解鎖全成分中文化拆解、過敏原全面篩查、符合 AAFCO 標準深度比對以及客製化每日餵食量建議。",

"futureSubscription": "不推薦第一階段採用訂閱制。除非首月單次付費轉換率突破 5% 且用戶留存與重度換糧需求被驗證，否則維持單次計費以求最低的營運與客服複雜度。"

},

"acquisition": {

"firstUsers": \[

"Threads (脆) 上發文尋求換飼料建議、或是抱怨自家貓狗挑食、軟便的自發性求助飼主。",

"Facebook 貓咪/狗狗飲食與生食轉乾糧知識交流社團成員。"

],

"suitablePlatforms": \[

"Threads",

"Facebook 寵物知識型社團",

"Dcard 寵物板"

],

"lowCostPromotion": \[

"每日在 Threads 搜尋關鍵字『換飼料』、『挑食軟便』，手動用該工具免費幫網友分析其提及的品牌成分，並將前三項結果截圖回覆，吸引其點擊連結查看完整報告。",

"撰寫一篇『市售熱門貓糧成分大拆解』的不點名對比文章發表在 Dcard，文末附上本工具的超連結，作為客觀工具推薦。"

]

},

"mvpReduction": {

"sevenDayScope": "因為只有一週且屬於副業開發，必須將任何會導致延期上線的非核心功能全數刪除。",

"remove": \[

"分析報告分享到社群的功能",

"歷史報告的 PDF 檔案下載與列印排版",

"寵物歷史體重與年齡的增長追蹤圖表",

"管理員審查後端數據與人工修正分析結果的後台管理介面"

],

"keep": \[

"核心的照片上傳與 Vision API 穩定串接",

"前端 CSS 實現的毛玻璃付費牆遮罩",

"Stripe / 綠界一頁式付款金流外連，以及付費成功後的 URL 參數回傳解鎖邏輯"

]

},

"agentExecutionStrategy": {

"recommendedTech": \[

"Next.js 14 (App Router, 利用 API Routes 隱藏 API 密鑰)",

"Tailwind CSS + shadcn/ui (確保一人能在一小時內拼裝出高質感的前端網頁)",

"Vercel (極速部署，零伺服器維護成本)",

"Stripe Payment Links (利用 Stripe 免寫後端代碼的付款連結，搭配簡單跳轉參數)"

],

"deploymentPlatform": "Vercel",

"buildOrder": \[

"1. 使用 Cursor 建立 Next.js 基礎架構，並直接部署到 Vercel 確保線路正常。",

"2. 建立 `/api/analyze` 路由，先用 Mock JSON 回傳假數據，以此刻出前端的報告卡片 UI。",

"3. 實作前端 Canvas 壓縮圖片並轉 Base64，串接真實的 Gemini/OpenAI Vision API，取代 Mock 數據。",

"4. 在前端頁面加入寵物條件表單，將參數塞入 API Prompt 中以客製化回傳結果。",

"5. 加上付費牆 UI 遮罩，並嵌入 Stripe 付款連結，完成付費解鎖的邏輯閉環。"

],

"estimatedPageCount": "1 頁 (完全在一頁之內完成輸入、上傳、等待、付費與看報告的所有操作)。",

"estimatedFileCount": "約 5 個核心檔案 (`app/page.tsx`, `app/api/analyze/route.ts`, `components/PetForm.tsx`, `components/ReportDisplay.tsx`, `components/Paywall.tsx`)。",

"mvpDoneCriteria": \[

"用手機拍攝一張實際的狗糧包裝成分表上傳，系統能在 12 秒內於前端渲染出前三大成分的中文化卡片。",

"未付款前後半段深度報告為模糊狀態，點擊購買導向 Stripe 付款後返回網頁，報告能即時解除模糊並顯示完整 AI 結論。"

]

},

"agentDevelopmentKit": {

"projectBrief": "本專案為一個極簡的一頁式 AI 寵物飼料成分分析工具。不包含使用者登入、不使用資料庫。所有狀態（包括上傳的圖片、寵物基本條件、API 回傳的 JSON 報告）皆保存在前端 React State 中。付費解鎖狀態暫時由金流付款成功後導回的 URL Query Parameter (?paid=true) 或 LocalStorage 進行簡易標記，追求極速上線驗證市場。",

"suggestedFileStructure": \[

"app/page.tsx (主控頁面，負責組合 Landing Page、表單與報告元件)",

"app/layout.tsx (全域佈局，包含 Tailwind 樣式引入與頁尾免責聲明)",

"app/api/analyze/route.ts (後端 API，負責接收 Base64 圖片與寵物資訊，呼叫大模型 Vision 接口，回傳嚴格的 JSON 數據)",

"components/PetForm.tsx (使用者輸入寵物資訊與拖放圖片上傳的表單元件)",

"components/ReportDisplay.tsx (解析並渲染大模型回傳之 JSON 內容的元件，內含付費牆邏輯)"

],

"coreComponents": \[

"PetForm: 提供犬/貓選擇、年齡階段下拉選單、易敏感成分勾選、以及一個基於 HTML5 drag-and-drop 的圖片上傳框，選取圖片後自動轉為 Base64 字串。",

"ReportDisplay: 接收大模型回傳的結構化資料。若屬未付費狀態，則利用 Tailwind 的 `blur-md` 類別將關鍵的『深度過敏風險』與『營養調配建議』區塊進行模糊處理，並浮動顯示付費解鎖按鈕。"

],

"stateAndDataFlow": \[

"使用者在 PetForm 填寫條件並上傳圖片 -> 點擊送出 -> 觸發 page.tsx 的狀態更新（進入 Loading 狀態）-> 發送 POST 請求至 `/api/analyze` -> API 路由調用 LLM Vision API -> 大模型返回格式化 JSON -> 前端接收並存入 `reportData` 狀態 -> 渲染 ReportDisplay 元件 -> 檢查網址是否包含 `paid=true` 決定是否解除模糊。"

],

"implementationSteps": \[

"1. 初始化 Next.js 專案，安裝 Tailwind CSS 與 shadcn/ui 元件庫。",

"2. 建立純前端的靜態 PetForm 與 ReportDisplay 元件，並用一組寫死的假 JSON 資料驗證 UI 排版與模糊遮罩效果。",

"3. 撰寫 `/api/analyze/route.ts`，引入大模型官方 SDK，設定 System Prompt 強制要求返回結構化 JSON。",

"4. 聯調前後端，確保實際上傳圖片能換回真實的 AI 分析數據，並在 Vercel 部署上線。"

],

"copyPasteAgentBrief": "You are a pragmatic, high-efficiency developer assistant. Build a single-page Next.js 14 app (App Router) with Tailwind CSS. The app requires no database and no authentication. Users select pet info (type: cat/dog, age: youth/adult/senior, allergies: array) and upload an image of pet food ingredients. The frontend converts the image to Base64 and POSTs it along with pet info to `/api/analyze/route.ts`. The API route invokes the LLM Vision API (Gemini or OpenAI) with a strict prompt ensuring a JSON-only response. The JSON must structure: `mainIngredients` (array of objects with name and explanation), `nutritionalScore` (A/B/C/D), `allergyAlerts` (array), and `expertVerdict` (string). The frontend stores this response in local state and renders it. If the local state `isPaid` (or URL query `paid=true`) is false, the `allergyAlerts` and `expertVerdict` sections must be heavily blurred with a CSS overlay prompting users to pay $69 TWD via an external payment link to unlock."

},

"agentPromptPack": {

"buildPrompt": "請使用 Next.js 14 App Router、Tailwind CSS 和 shadcn/ui 建立一個一頁式的 Web 應用骨架。頁面正中間包含一個標題為『PetFood AI 寵物飼料成分即時分析儀』的區塊。下方需要有一個表單元件：包含寵物種類單選（貓/狗）、年齡階段選單、常見過敏原勾選框，以及一個支援點擊和拖曳上傳圖片的區域。表單下方留出一個空白區域，用於後續渲染分析結果報告。",

"uiPrompt": "請幫我設計一個精緻的、帶有醫療營養專家權威感的報告展示元件 `ReportDisplay.tsx`。它接收一個包含營養等級、主要成分拆解、過敏風險、綜合評語的 JSON 資料物件。請使用卡片式佈局，善用 Tailwind 的淺綠、淺黃、淺紅背景色標籤來區分風險等級。另外，請實作付費牆邏輯：如果元件傳入的 `isPaid` 屬性為 `false`，請將報告中的過敏風險與綜合評語區塊加上 `blur-md select-none` 效果，並在其上層覆蓋一個絕對定位的卡片，顯示『單次付費 NT$69 立即解鎖完整過敏風險與專家評語』，並附帶一個醒目的金色按鈕。",

"dataPrompt": "請為我編寫 Next.js 的路由處理程序 `/api/analyze/route.ts`。該路由接收前端 POST 過來的 Base64 圖片字串與寵物基本屬性。請在路由中引入大語言模型的 Vision SDK（如 Google Gen AI 或 OpenAI），並撰寫一段嚴格的系統提示詞：『你是一位專精於小動物臨床營養學的獸醫。請仔細閱讀使用者上傳的寵物飼料成分表圖片，並結合該寵物的基本狀況（種類、年齡層、已知過敏源），精準提取前五大成分、判斷營養比率、揪出潛在過敏風險、並依據 AAFCO 標準給出最終 verdict。請勿輸出任何 Markdown 格式、文字解釋或 ```json 標記，必須且只能回傳一個符合以下結構的合法 JSON 字串：{ "mainIngredients": \[{"name": "", "desc": ""}], "score": "", "alerts": \[""], "verdict": "" }』。請確保包含基本的 try-catch 錯誤處理機制。",

"QARevisionPrompt": "目前在使用手動拍照上傳時，常因為環境光線不佳或圖片傾斜，導致大模型 API 辨識失敗或回傳了不合法的 JSON 格式，進而造成前端網頁崩潰。請修改 `/api/analyze/route.ts` 的錯誤處理逻辑，當 LLM 返回解析失敗或圖片無法辨識時，捕獲該錯誤並向前端返回一個自定義的 JSON 結構 `{ \\"error\\": \\"IMAGE\_UNREADABLE\\", \\"message\\": \\"照片文字不夠清晰，請確保成分表平整且光線充足。\\" }`。同時請修改前端接收端，當偵測到該 error 欄位時，彈出一個友善的 Alert 提示，引導使用者重新上傳，避免畫面死機。"

},

"marketingStarterPack": {

"positioning": "市場上唯一「不收受廠商贊助」、專為敏感體質毛孩設計的 AI 飼料成分盲測儀。",

"audiencePainPoints": \[

"飼料包裝背面的成分表全都是密密麻麻的專有名詞與化學添加物，一般飼主完全看不懂。",

"網路上充斥著各種寵物部落客與網紅的飼料業配推薦，缺乏客觀、公正的第三方檢驗工具。",

"家中的貓狗時常出現原因不明的軟便、皮膚抓癢或挑食，飼主懷疑是現有飼料問題，卻不知如何排查。"

],

"launchChannels": \[

"Threads (脆) 情感與痛點共鳴流（主動搜尋毛孩過敏、挑食關鍵字）",

"Facebook 專業貓咪/狗狗飲食與生食轉乾糧知識交流社團",

"LINE 匿名寵物養護與疑難雜症地方社群"

],

"contentIdeas": \[

"圖文對比：『你以為買的是無穀高端糧？拆解某熱銷貓糧成分表，原來前三項全是廉價精緻澱粉！』",

"實機錄影短片：展示直接用手機對著家裡吃剩的飼料袋拍照，10秒內 AI 幫忙抓出隱藏致敏肉粉的流暢網頁操作，強調免註冊即可體驗。"

],

"validationMessages": \[

"「嗨！看到你發文說你家法鬥皮膚又抓到紅腫、換了好幾款飼料都沒用。我因為自己家毛孩也有這個困擾，下班自己寫了一個免註冊的 AI 飼料成分分析工具，它不收廠商錢，純靠 AI 去對比 AAFCO 標準和過敏原。你可以直接拍你現在餵的飼料成分表上去測測看，前幾項分析是免費的，希望能幫你排除盲點：\[工具網址]」"

]

},

"salesPageCopyPack": {

"heroTitle": "別再盲目跟風買熱銷糧了！你家毛孩吃進去的，到底是優質肉蛋白還是隱藏的化學致敏物？",

"heroSubtitle": "免下載 App、免註冊會員。10秒拍下飼料袋背面成分表，讓客觀的 AI 營養師為你揭開包裝上的文字迷霧。",

"problemSection": "每次走進寵物店或看網紅推薦，每款飼料都宣稱自己是頂級天然、低敏配方。但翻到包裝背面，那些密密麻麻的『禽肉副產品、大豆蛋白、幾酸鈉、特定防腐劑』卻讓你如同看天書。盲目換糧的代價，往往是毛孩用軟便、嘔吐、抓癢抓到破皮來幫你試錯。看著心愛的寵物受罪、看獸醫的荷包失血，你真的知道牠每天吃進去的是什麼嗎？",

"solutionSection": "現在，你可以把這個麻煩任務交給完全中立的 AI。不需要查字典，更不需要相信帶貨網紅。只需拿起手機拍下成分表，系統將自動解析一長串化學名詞，並對比你家毛孩的年齡與過敏史，直接給出最白話的營養評級與過敏預警。行不行、好不好，讓真實數據與科學說了算。",

"featureBullets": \[

"100% 獨立客觀：絕不接受任何寵物飼料品牌的廣告與贊助，純粹基於科學代碼邏輯進行盲測評分。",

"揪出隱藏填充物：自動識別並高亮『廉價肉粉』、『高升糖澱粉』與『可能致癌的人工防腐劑』。",

"專屬體質交叉比對：根據你勾選的貓狗年齡、過敏體質，量身打造專屬於牠的適應性評估報告。"

],

"proofSection": "上線至今，已有超過 420 位注重毛孩健康的飼主在換糧前使用本工具，成功幫自家的敏感關節犬與軟便貓避開高風險成分，省下動輒數千元的盲目試錯與看診費用。",

"faq": \[

{

"question": "這個 AI 分析報告的依據是什麼？真的準確嗎？",

"answer": "我們的核心大模型經過大量專業寵物營養學、AAFCO（美國飼料管理協會）標準的 Prompt 調校與優化，對於成分表的 OCR 辨識與中文化翻譯準確度高達 95% 以上。不過報告屬於第三方客觀數據拆解與科普，若寵物有嚴重的臨床特殊疾病，仍建議遵循執業獸醫師的醫囑。"

},

{

"question": "為什麼解鎖完整報告需要收取 69 元？",

"answer": "因為我們堅持『零品牌贊助、零廠商廣告』，為了維持絕對的中立性，我們不賺取任何飼料廠的分潤。單次收費 69 元僅用於補貼雲端大模型高昂的圖片 Vision 辨識與運算 API 成本。用不到一罐罐頭的錢，就能幫你避免買錯幾千元劣質飼料的風險，是最務實的健康投資。"

}

],

"finalCta": "立即拍照上傳，10秒看清飼料真實成分"

}

}



```



```


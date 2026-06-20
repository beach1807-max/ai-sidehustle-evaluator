import type { DeepReport } from "../data/deepReport";
import { ButtonLink } from "./Buttons";
import { PlainList } from "./ReportSection";

type DeepReportViewProps = {
  report: DeepReport;
};

export function DeepReportView({ report }: DeepReportViewProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-steel">Deep Report</p>
        <h1 className="text-3xl font-bold text-ink">副業點子深度驗證報告</h1>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          這份報告供開發與測試使用，協助把副業點子縮成可執行 MVP。
        </p>
      </div>

      <div className="grid gap-6">
        <DeepSection title="MVP 可行性分析">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock title="是否適合一人開發" value={report.feasibility.soloDeveloperFit} />
            <InfoBlock title="預估開發時間" value={report.feasibility.estimatedBuildTime} />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <ListBlock title="主要風險" items={report.feasibility.mainRisks} />
            <InfoBlock title="是否建議執行" value={report.feasibility.recommendation} />
          </div>
        </DeepSection>

        <DeepSection title="MVP 功能清單">
          <div className="grid gap-5 md:grid-cols-3">
            <ListBlock title="必做功能" items={report.mvpFeatures.mustHave} />
            <ListBlock title="延後功能" items={report.mvpFeatures.later} />
            <ListBlock title="不建議功能" items={report.mvpFeatures.notRecommended} />
          </div>
        </DeepSection>

        <DeepSection title="7 天行動計畫">
          <div className="grid gap-3">
            {report.sevenDayPlan.map((step) => (
              <div
                key={`${step.day}-${step.task}`}
                className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[96px_1fr]"
              >
                <span className="font-bold text-steel">{step.day}</span>
                <span className="leading-7 text-slate-700">{step.task}</span>
              </div>
            ))}
          </div>
        </DeepSection>

        <DeepSection title="AI Agent MVP 啟動包">
          <div className="mb-5 rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-ink">取得可直接開工的 AI Agent Prompt</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  系統會把產品目標、功能需求、頁面、資料結構、限制與驗收條件整理成單一 Prompt。
                </p>
              </div>
              <ButtonLink to="/agent-starter-kit">AI Agent 開工包</ButtonLink>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoBlock title="產品目標" value={report.agentMvpKit.productGoal} />
            <InfoBlock title="目標客群" value={report.agentMvpKit.targetAudience} />
            <ListBlock title="MVP 功能需求" items={report.agentMvpKit.mvpRequirements} />
            <ListBlock title="頁面需求" items={report.agentMvpKit.pageRequirements} />
            <ListBlock title="UI 需求" items={report.agentMvpKit.uiRequirements} />
            <ListBlock title="資料結構" items={report.agentMvpKit.dataStructure} />
            <ListBlock title="技術限制" items={report.agentMvpKit.technicalConstraints} />
            <ListBlock title="驗收條件" items={report.agentMvpKit.acceptanceCriteria} />
          </div>
        </DeepSection>

        <DeepSection title="首頁銷售文案">
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoBlock title="主標題" value={report.landingPageCopy.headline} />
            <InfoBlock title="副標題" value={report.landingPageCopy.subheadline} />
            <ListBlock title="功能特色" items={report.landingPageCopy.features} />
            <InfoBlock title="CTA 文案" value={report.landingPageCopy.cta} />
          </div>
        </DeepSection>

        <DeepSection title="第一版收費建議">
          <div className="grid gap-5 md:grid-cols-3">
            <InfoBlock title="免費方案" value={report.pricing.freePlan} />
            <InfoBlock title="單次收費建議" value={report.pricing.oneTimePrice} />
            <InfoBlock title="未來訂閱制建議" value={report.pricing.futureSubscription} />
          </div>
        </DeepSection>

        <DeepSection title="獲客建議">
          <div className="grid gap-5 md:grid-cols-3">
            <ListBlock title="第一批用戶來源" items={report.acquisition.firstUsers} />
            <ListBlock title="適合的平台" items={report.acquisition.suitablePlatforms} />
            <ListBlock title="低成本推廣方式" items={report.acquisition.lowCostPromotion} />
          </div>
        </DeepSection>

        <DeepSection title="MVP 瘦身方案">
          <InfoBlock title="若只有 7 天可開發" value={report.mvpReduction.sevenDayScope} />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <ListBlock title="應刪除哪些功能" items={report.mvpReduction.remove} />
            <ListBlock title="保留哪些功能" items={report.mvpReduction.keep} />
          </div>
        </DeepSection>

        {report.agentExecutionStrategy && (
          <DeepSection title="AI Agent 執行策略">
            <div className="grid gap-5 lg:grid-cols-2">
              <ListBlock
                title="推薦技術"
                items={report.agentExecutionStrategy.recommendedTech}
              />
              <InfoBlock
                title="推薦部署平台"
                value={report.agentExecutionStrategy.deploymentPlatform}
              />
              <ListBlock
                title="建議開發順序"
                items={report.agentExecutionStrategy.buildOrder}
              />
              <InfoBlock
                title="預估頁面數"
                value={report.agentExecutionStrategy.estimatedPageCount}
              />
              <InfoBlock
                title="預估檔案數"
                value={report.agentExecutionStrategy.estimatedFileCount}
              />
              <ListBlock
                title="MVP 完成條件"
                items={report.agentExecutionStrategy.mvpDoneCriteria}
              />
            </div>
          </DeepSection>
        )}

        <DeepSection title="AI Agent 開發包">
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoBlock title="專案簡介" value={report.agentDevelopmentKit.projectBrief} />
            <InfoBlock
              title="可直接交給 Agent 的 Brief"
              value={report.agentDevelopmentKit.copyPasteAgentBrief}
            />
            <ListBlock
              title="建議檔案結構"
              items={report.agentDevelopmentKit.suggestedFileStructure}
            />
            <ListBlock title="核心元件" items={report.agentDevelopmentKit.coreComponents} />
            <ListBlock
              title="狀態與資料流"
              items={report.agentDevelopmentKit.stateAndDataFlow}
            />
            <ListBlock
              title="實作步驟"
              items={report.agentDevelopmentKit.implementationSteps}
            />
          </div>
        </DeepSection>

        <DeepSection title="AI Agent Prompt Pack">
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoBlock title="MVP 建立 Prompt" value={report.agentPromptPack.buildPrompt} />
            <InfoBlock title="UI Prompt" value={report.agentPromptPack.uiPrompt} />
            <InfoBlock title="資料結構 Prompt" value={report.agentPromptPack.dataPrompt} />
            <InfoBlock title="QA 修正 Prompt" value={report.agentPromptPack.QARevisionPrompt} />
          </div>
        </DeepSection>

        <DeepSection title="推廣啟動包">
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoBlock title="產品定位" value={report.marketingStarterPack.positioning} />
            <ListBlock
              title="受眾痛點"
              items={report.marketingStarterPack.audiencePainPoints}
            />
            <ListBlock
              title="啟動推廣平台"
              items={report.marketingStarterPack.launchChannels}
            />
            <ListBlock title="內容題材" items={report.marketingStarterPack.contentIdeas} />
            <ListBlock
              title="驗證訊息"
              items={report.marketingStarterPack.validationMessages}
            />
          </div>
        </DeepSection>

        <DeepSection title="收費頁文案包">
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoBlock title="Hero 標題" value={report.salesPageCopyPack.heroTitle} />
            <InfoBlock title="Hero 副標題" value={report.salesPageCopyPack.heroSubtitle} />
            <InfoBlock title="問題段落" value={report.salesPageCopyPack.problemSection} />
            <InfoBlock title="解法段落" value={report.salesPageCopyPack.solutionSection} />
            <ListBlock title="功能賣點" items={report.salesPageCopyPack.featureBullets} />
            <InfoBlock title="證明段落" value={report.salesPageCopyPack.proofSection} />
            <ListBlock
              title="FAQ"
              items={report.salesPageCopyPack.faq.map(
                (item) => `${item.question}：${item.answer}`
              )}
            />
            <InfoBlock title="最終 CTA" value={report.salesPageCopyPack.finalCta} />
          </div>
        </DeepSection>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/report/generated-preview">回到免費報告</ButtonLink>
        <ButtonLink to="/evaluate" variant="secondary">
          重新評估
        </ButtonLink>
      </div>
    </section>
  );
}

function DeepSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-3 leading-7 text-slate-700">{value}</p>
    </article>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      <div className="mt-3">
        <PlainList items={items} />
      </div>
    </article>
  );
}

import type { MockReport } from "../data/mockReports";
import { ButtonLink } from "./Buttons";
import { DimensionScoreList } from "./DimensionScoreList";
import { PaidReportPreview } from "./PaidReportPreview";
import { PlainList, ReportSection } from "./ReportSection";
import { ScoreCard } from "./ScoreCard";
import { ValidationPlan } from "./ValidationPlan";
import { WarningCard } from "./WarningCard";

type ReportViewProps = {
  report: MockReport;
  displayedIdea: string;
  notice?: string;
  exampleReportId?: string;
};

export function ReportView({
  report,
  displayedIdea,
  notice,
  exampleReportId,
}: ReportViewProps) {
  const hasPricingTiers =
    Array.isArray(report.pricingTiers) && report.pricingTiers.length > 0;

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      {notice && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-signal">
          {notice}
        </div>
      )}

      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-steel">顧問式評估報告</p>
        <h1 className="text-3xl font-bold text-ink">你正在評估的點子</h1>
        <p
          data-testid="report-idea"
          className="mt-3 rounded-lg border border-slate-200 bg-white p-5 text-lg leading-8 text-slate-700 shadow-sm"
        >
          {displayedIdea}
        </p>
      </div>

      <div className="grid gap-6">
        <ScoreCard
          score={report.score}
          label={report.scoreLabel}
          summary={report.summary}
        />

        <ReportSection title="七大維度評分">
          <DimensionScoreList dimensions={report.dimensions} />
        </ReportSection>

        <ReportSection title="一句話結論">
          <p className="text-lg leading-8">{report.oneSentenceVerdict}</p>
        </ReportSection>

        <div className="grid gap-6 lg:grid-cols-2">
          <ReportSection title="最大優勢">
            <PlainList items={report.strengths} />
          </ReportSection>
          <ReportSection title="最大風險">
            <PlainList items={report.risks} />
          </ReportSection>
        </div>

        <ReportSection title="致命紅旗">
          <WarningCard items={report.fatalWarnings} />
        </ReportSection>

        <ReportSection title="建議產品樣貌">
          <div className="grid gap-4 lg:grid-cols-2">
            <ProductShapeCard title="產品形式">
              <p className="leading-8">{report.productShape.format}</p>
            </ProductShapeCard>

            <ProductShapeCard title="使用流程">
              <ol className="space-y-3">
                {report.productShape.userFlow.map((step) => (
                  <li key={step} className="leading-7 text-slate-700">
                    {step}
                  </li>
                ))}
              </ol>
            </ProductShapeCard>

            <ProductShapeCard title="使用者會看到什麼">
              <PlainList items={report.productShape.userSees} />
            </ProductShapeCard>

            <ProductShapeCard title="第一版長相">
              <PlainList items={report.productShape.firstVersionLook} />
            </ProductShapeCard>
          </div>
        </ReportSection>

        <ReportSection title="立即砍掉清單">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {report.dontBuild.map((item) => (
              <div
                key={item}
                className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="建議收費方式">
          <p className="leading-8">{report.pricingSuggestion}</p>
          {hasPricingTiers && <PlainList items={report.pricingTiers ?? []} />}
          <p className="mt-4 rounded-md bg-frost p-4 font-medium leading-7 text-steel">
            {report.validationGoal}
          </p>
        </ReportSection>

        <ReportSection title="7 天驗證行動清單">
          <ValidationPlan steps={report.validationPlan} />
        </ReportSection>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-signal">
          本報告由 AI 根據你的輸入產生，僅供副業規劃與 MVP 驗證參考，不保證市場需求、收入結果、法律合規或平台審核結果。若點子涉及健康、金融、法律、寵物照護等高風險領域，請再尋求專業判斷。
        </div>

        <PaidReportPreview
          displayedIdea={displayedIdea}
          score={report.score}
          decision={report.scoreLabel}
          exampleReportId={exampleReportId}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/evaluate">重新評估另一個點子</ButtonLink>
        <ButtonLink to="/examples" variant="secondary">
          查看範例報告
        </ButtonLink>
        <ButtonLink to="/" variant="ghost">
          回首頁
        </ButtonLink>
      </div>
    </section>
  );
}

function ProductShapeCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h3 className="mb-3 text-base font-bold text-ink">{title}</h3>
      {children}
    </article>
  );
}

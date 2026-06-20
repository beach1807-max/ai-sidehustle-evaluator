import { ButtonLink } from "../components/Buttons";
import { Section } from "../components/Section";

const valueCards = [
  {
    title: "幫你降溫",
    text: "避免因為一時興奮，投入太多時間做錯方向。",
  },
  {
    title: "幫你縮小",
    text: "把模糊的大點子，縮成 7～14 天可驗證的 MVP。",
  },
  {
    title: "幫你下一步",
    text: "產出評分、風險、建議產品樣貌、不該做功能與 7 天驗證清單。",
  },
];

const goodFit = [
  "有副業點子，但不知道該不該做的人",
  "想用 AI / Codex 做一人產品的人",
  "下班時間有限，不想做高維護產品的人",
  "想先驗證，不想一開始就做完整 SaaS 的人",
];

const badFit = [
  "想找人幫忙保證成功的人",
  "想直接得到暴富點子的人",
  "不願意縮小產品範圍的人",
  "想一開始就做完整平台的人",
];

export function HomePage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold text-steel">
              風險健檢，不是靈感產生器
            </p>
            <p className="mb-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-signal">
              目前為 AI 測試版：報告僅供副業規劃參考，不保證市場需求、收入結果或法律風險完全正確。
            </p>
            <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
              用 AI 幫你冷靜評估副業點子：該做、縮小，還是先放棄。
            </h1>
            <p className="mt-5 text-xl leading-8 text-slate-700">
              這不是創業打氣工具，而是幫你提早看見阻力、砍掉不必要功能，避免投入太多時間在錯的方向。
            </p>
            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              很多副業不是不能做，而是一開始想得太大、太難、太需要維護。這個工具會用固定框架幫你做一次冷靜評估，找出最小可行版本與主要風險。
            </p>
            <div className="mt-8">
              <ButtonLink to="/evaluate">開始評估我的副業點子</ButtonLink>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="border-b border-slate-200 pb-4">
              <p className="text-sm text-slate-500">範例判斷</p>
              <p className="mt-2 text-3xl font-bold text-ink">74 / 100</p>
              <p className="mt-2 font-semibold text-signal">可做，但必須縮小範圍</p>
            </div>
            <div className="space-y-4 pt-5 text-sm leading-7 text-slate-700">
              <p>先做報告，不要先做平台。</p>
              <p>先驗證付費意願，不要先建立完整資料庫。</p>
              <p>先避開醫療責任，不要宣稱診斷或保證改善。</p>
            </div>
          </div>
        </div>
      </section>

      <Section title="這個工具會幫你做三件事" tone="white">
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-ink">{card.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{card.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="什麼是 AI Agent？">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="max-w-3xl space-y-4 leading-8 text-slate-700">
            <p>AI Agent 可以理解成「會幫你執行任務的 AI 助手」。</p>
            <p>一般 AI 聊天是你問一句、它回一句。</p>
            <p>
              AI Agent 更像是：你給它一份清楚的任務說明，它可以幫你建立檔案、修改程式、整理架構，甚至一步步做出第一版網站。
            </p>
            <p className="font-medium text-ink">
              本工具會幫你把副業點子整理成 AI Agent 看得懂的開發任務，讓你不用從零開始寫需求。
            </p>
          </div>
        </div>
      </Section>

      <Section title="適合誰使用">
        <div className="grid gap-5 md:grid-cols-2">
          <AudienceCard title="適合" items={goodFit} tone="good" />
          <AudienceCard title="不適合" items={badFit} tone="bad" />
        </div>
      </Section>
    </>
  );
}

function AudienceCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3
        className={`text-lg font-bold ${
          tone === "good" ? "text-emerald-700" : "text-danger"
        }`}
      >
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-slate-700">
            <span
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                tone === "good" ? "bg-emerald-600" : "bg-danger"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

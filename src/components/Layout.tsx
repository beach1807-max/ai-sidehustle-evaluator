import { NavLink } from "react-router-dom";

const links = [
  { href: "/", label: "首頁" },
  { href: "/evaluate", label: "輸入點子" },
  { href: "/examples", label: "範例報告" },
];

const devLinks = [
  { href: "/prompt-preview", label: "Prompt Preview" },
  { href: "/json-preview", label: "JSON Preview" },
  { href: "/deep-report-prompt-preview", label: "Deep Prompt Preview" },
  { href: "/deep-report-json-preview", label: "Deep JSON Preview" },
  { href: "/gemini-poc", label: "Gemini PoC" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const showDevTools = import.meta.env.VITE_SHOW_DEV_TOOLS === "true";
  const visibleLinks = showDevTools ? [...links, ...devLinks] : links;

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-ink">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/92 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <NavLink to="/" className="focus-ring text-base font-bold text-ink">
            副業點子冷靜評分器
          </NavLink>
          <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `focus-ring rounded-md px-3 py-2 transition ${
                    isActive
                      ? "bg-frost text-ink"
                      : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-slate-600 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-ink">副業點子冷靜評分器</p>
            <p className="mt-2">AI 測試版產品體驗，適合先做小流量驗證。</p>
            <p className="mt-1">冷靜、直接、先縮小。</p>
          </div>
          {showDevTools && (
            <div>
              <p className="font-semibold text-ink">開發工具：</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {devLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className="focus-ring rounded-md text-steel hover:text-ink"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

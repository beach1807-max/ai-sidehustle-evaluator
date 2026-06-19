import { Link } from "react-router-dom";

const base =
  "focus-ring inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition";

export function ButtonLink({
  to,
  children,
  variant = "primary",
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary: "bg-ink text-white hover:bg-slate-700",
    secondary: "border border-slate-300 bg-white text-ink hover:bg-frost",
    ghost: "text-steel hover:bg-frost",
  };

  return (
    <Link to={to} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}

export function ActionButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${base} w-full bg-ink text-white hover:bg-slate-700 disabled:cursor-wait disabled:bg-slate-500 sm:w-auto`}
    >
      {children}
    </button>
  );
}

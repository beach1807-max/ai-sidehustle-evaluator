import type { ValidationStep } from "../data/mockReports";

export function ValidationPlan({ steps }: { steps: ValidationStep[] }) {
  return (
    <div className="grid gap-3">
      {steps.map((step) => (
        <div
          key={step.day}
          className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[96px_1fr] sm:items-center"
        >
          <span className="font-bold text-steel">{step.day}</span>
          <span className="leading-7 text-slate-700">{step.task}</span>
        </div>
      ))}
    </div>
  );
}

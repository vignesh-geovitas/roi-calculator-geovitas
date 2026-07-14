import type { LucideIcon } from "lucide-react";

type Tone = "plain" | "hero" | "dark";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  tone?: Tone;
}

const CARD: Record<Tone, string> = {
  plain: "border border-slate-200 bg-white shadow-sm",
  hero: "bg-linear-to-br from-brand-cyan to-brand-green text-white shadow-md",
  dark: "bg-brand-dark text-white shadow-md",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "plain",
}: StatCardProps) {
  const onColor = tone !== "plain";
  return (
    <div className={`rounded-xl p-5 ${CARD[tone]}`}>
      <div className="flex items-center gap-2">
        <Icon
          className={`size-4 ${onColor ? "text-white/90" : "text-brand-cyan"}`}
          aria-hidden
        />
        <p
          className={`text-xs font-semibold tracking-wide uppercase ${
            onColor ? "text-white/90" : "text-slate-500"
          }`}
        >
          {label}
        </p>
      </div>
      <p
        className={`mt-2 text-3xl font-bold ${
          onColor ? "text-white" : "text-brand-dark"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-xs leading-relaxed ${
          onColor ? "text-white/80" : "text-slate-500"
        }`}
      >
        {hint}
      </p>
    </div>
  );
}

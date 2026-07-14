import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  hero?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  hero = false,
}: StatCardProps) {
  return (
    <div
      className={
        hero
          ? "rounded-xl bg-linear-to-br from-brand-cyan to-brand-green p-5 text-white shadow-md sm:col-span-2 lg:col-span-1"
          : "rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      }
    >
      <div className="flex items-center gap-2">
        <Icon
          className={hero ? "size-4 text-white/90" : "size-4 text-brand-cyan"}
          aria-hidden
        />
        <p
          className={`text-xs font-semibold tracking-wide uppercase ${
            hero ? "text-white/90" : "text-slate-500"
          }`}
        >
          {label}
        </p>
      </div>
      <p
        className={`mt-2 text-3xl font-bold ${
          hero ? "text-white" : "text-brand-dark"
        }`}
      >
        {value}
      </p>
      <p className={`mt-1 text-xs ${hero ? "text-white/80" : "text-slate-500"}`}>
        {hint}
      </p>
    </div>
  );
}

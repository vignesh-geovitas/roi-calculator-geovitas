import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RoiModel } from "../lib/roi";
import { formatLakh } from "../lib/format";

const SERIES = [
  { key: "costOfInaction", name: "Cost of inaction", color: "#0095d6" },
  { key: "netBenefit", name: "Net benefit with GF360", color: "#5fa332" },
] as const;

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number | string }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-semibold text-brand-dark">Year {label}</p>
      {SERIES.map((s) => {
        const item = payload.find((p) => p.dataKey === s.key);
        if (item === undefined) return null;
        return (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="text-slate-600">{s.name}</span>
            <span className="ml-auto pl-3 font-semibold text-brand-dark tabular-nums">
              {formatLakh(Number(item.value))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function RoiChart({ model }: { model: RoiModel }) {
  const data = model.years.map((r) => ({
    year: r.year,
    costOfInaction: r.costOfInaction,
    netBenefit: r.netBenefit,
  }));

  return (
    <div>
      {/* Legend — identity never rides on color alone; totals direct-labeled here */}
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            {s.name}
            <span className="font-semibold text-brand-dark tabular-nums">
              {formatLakh(
                s.key === "costOfInaction"
                  ? model.totalCostOfInaction
                  : model.totalNetBenefit,
              )}{" "}
              / 5 yr
            </span>
          </span>
        ))}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="28%">
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(y) => `Yr ${y}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={62}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(v: number) =>
                Math.abs(v) >= 100
                  ? `₹${(v / 100).toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`
                  : `₹${v} L`
              }
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
            />
            {SERIES.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                maxBarSize={22}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

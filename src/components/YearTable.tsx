import type { RoiModel } from "../lib/roi";
import { formatLakh } from "../lib/format";

/** Accessible table view of the 5-year model (all values ₹ Lakh). */
export default function YearTable({ model }: { model: RoiModel }) {
  const rows = [
    ["Hard benefits", model.years.map((r) => r.hardBenefits)],
    ["GF360 investment", model.years.map((r) => r.investment)],
    ["Net benefit", model.years.map((r) => r.netBenefit)],
    ["Cumulative net benefit", model.years.map((r) => r.cumulativeNetBenefit)],
    ["Cost of inaction", model.years.map((r) => r.costOfInaction)],
  ] as const;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[540px] text-xs">
        <caption className="sr-only">
          GF360 five-year ROI projection in Rs Lakh
        </caption>
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th scope="col" className="py-2 pr-3 text-left font-medium">
              ₹ Lakh
            </th>
            {model.years.map((r) => (
              <th
                key={r.year}
                scope="col"
                className="px-2 py-2 text-right font-medium"
              >
                Year {r.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, values]) => (
            <tr
              key={label}
              className="border-b border-slate-100 last:border-0"
            >
              <th
                scope="row"
                className="py-2 pr-3 text-left font-medium text-slate-600"
              >
                {label}
              </th>
              {values.map((v, i) => (
                <td
                  key={i}
                  className="px-2 py-2 text-right font-semibold text-brand-dark tabular-nums"
                >
                  {formatLakh(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

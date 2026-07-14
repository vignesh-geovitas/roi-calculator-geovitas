import { useMemo, useState } from "react";
import { BarChart3, Clock, TrendingUp } from "lucide-react";
import type { RoiInputs } from "./lib/roi";
import { computeRoi, DEFAULT_INPUTS } from "./lib/roi";
import { formatLakh, formatPayback, formatNumber } from "./lib/format";
import InputsPanel from "./components/InputsPanel";
import StatCard from "./components/StatCard";
import RoiChart from "./components/RoiChart";
import YearTable from "./components/YearTable";
import LeadForm from "./components/LeadForm";

function Wordmark() {
  return (
    <span className="text-2xl font-bold tracking-tight lowercase select-none">
      <span className="bg-linear-to-r from-brand-cyan to-brand-green bg-clip-text text-transparent">
        geo
      </span>
      <span className="text-brand-dark">vitas</span>
    </span>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_INPUTS);
  const model = useMemo(() => computeRoi(inputs), [inputs]);

  const patch = (p: Partial<RoiInputs>) =>
    setInputs((prev) => ({ ...prev, ...p }));

  return (
    <div className="min-h-screen">
      <div className="h-1.5 bg-linear-to-r from-brand-cyan to-brand-green" />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Wordmark />
          <span className="rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-bold tracking-wide text-brand-cyan uppercase">
            GF360 ROI Calculator
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-2xl font-bold text-brand-dark sm:text-3xl">
            What is carbon compliance worth to your business?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Model your 5-year return from GF360 — CBAM cost avoidance, energy
            efficiency savings, and automated ESG reporting — against the cost
            of doing nothing. Adjust the inputs; results update live.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Left column — inputs */}
          <InputsPanel inputs={inputs} onChange={patch} />

          {/* Right column — live results */}
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                hero
                icon={TrendingUp}
                label="5-Year Net Benefit"
                value={formatLakh(model.totalNetBenefit)}
                hint={`on ${formatLakh(model.totalInvestment)} total investment`}
              />
              <StatCard
                icon={Clock}
                label="Payback Period"
                value={formatPayback(model.paybackMonths)}
                hint="to recover one-time implementation"
              />
              <StatCard
                icon={BarChart3}
                label="5-Year ROI"
                value={`${formatNumber(model.roiMultiple, 1)}×`}
                hint="net benefit per rupee invested"
              />
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold tracking-wide text-brand-dark uppercase">
                Cost of Inaction vs Net Benefit
              </h2>
              <p className="mt-0.5 mb-4 text-xs text-slate-500">
                Year-by-year, ₹ Lakh. Cost of inaction = CBAM at default values
                + consultant fees + manual reporting effort.
              </p>
              <RoiChart model={model} />
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold tracking-wide text-brand-dark uppercase">
                5-Year Projection Detail
              </h2>
              <YearTable model={model} />
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                Assumes {formatNumber(8)}% annual revenue growth, 5% annual
                subscription/advisory escalation, 70% reporting-effort
                automation, and energy savings ramping 3% → 8% → 12% of energy
                spend. CBAM exposure: {formatNumber(model.yr1.cbamEmissions)}{" "}
                tCO₂e in Year 1. Illustrative estimates — not a commercial
                quote.
              </p>
            </section>

            <LeadForm inputs={inputs} model={model} />
          </div>
        </div>
      </main>

      <footer className="mt-4 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>© 2026 Geovitas · Growth in harmony with nature</span>
          <a
            href="https://www.geovitas.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-cyan hover:underline"
          >
            www.geovitas.com
          </a>
        </div>
      </footer>
    </div>
  );
}

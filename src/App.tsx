import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Hourglass,
  Lock,
  Timer,
  TrendingUp,
} from "lucide-react";
import type { RoiInputs } from "./lib/roi";
import { computeRoi, DEFAULT_INPUTS, recommendTier, TIER_PRICING } from "./lib/roi";
import { formatLakh, formatPayback, formatNumber } from "./lib/format";
import { useCountUp } from "./lib/useCountUp";
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
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const tier = recommendTier(inputs.annualTurnover);
  const model = useMemo(
    () => computeRoi({ ...inputs, gf360Tier: tier }),
    [inputs, tier],
  );

  const costOfInaction = useCountUp(model.totalCostOfInaction);
  const netBenefit = useCountUp(model.totalNetBenefit);
  const monthlyBleed = useCountUp(model.yr1.costOfInaction / 12);

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

      <main className="mx-auto max-w-6xl px-4 pt-8 pb-28 sm:px-6 lg:pb-10">
        {/* ——— Hero: problem, promise, zero friction ——— */}
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold tracking-widest text-brand-cyan uppercase">
            For Indian manufacturers exporting to the EU
          </p>
          <h1 className="mt-2 text-2xl leading-tight font-bold text-brand-dark sm:text-4xl">
            The EU is taxing the carbon in your exports.
            <br className="hidden sm:block" /> Every year you wait, the bill
            compounds.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            See what doing nothing costs you over the next 5 years — and how
            fast fixing it pays for itself. Six inputs, sixty seconds. Your
            number appears instantly:{" "}
            <strong className="text-brand-dark">
              no email, no call, no spreadsheet.
            </strong>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <InputsPanel inputs={inputs} onChange={patch} />

          <div className="min-w-0 space-y-5">
            <p className="text-xs font-bold tracking-widest text-brand-cyan uppercase">
              Step 2 · What the numbers say
            </p>

            {/* ——— Agitate, then resolve ——— */}
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                tone="dark"
                icon={AlertTriangle}
                label="If you do nothing"
                value={formatLakh(costOfInaction)}
                hint="your 5-year cost of inaction — CBAM settled at penalty default values, consultant fees, manual reporting"
              />
              <StatCard
                icon={Hourglass}
                label="Every month you wait"
                value={formatLakh(monthlyBleed)}
                hint="of that cost accrues — whether you measure it or not"
              />
              <StatCard
                tone="hero"
                icon={TrendingUp}
                label="If you act now"
                value={formatLakh(netBenefit)}
                hint={`5-year net benefit — after every rupee of GF360 investment (${formatNumber(model.roiMultiple, 1)}× return)`}
              />
              <StatCard
                icon={Timer}
                label="Pays for itself in"
                value={formatPayback(model.paybackMonths)}
                hint={
                  model.paybackMonths === null
                    ? "at these inputs the investment doesn't clear within 5 years — talk to us about Starter"
                    : "after that, every month is upside"
                }
              />
            </div>

            <p className="flex items-center gap-2 rounded-lg bg-brand-cyan/5 px-4 py-3 text-xs text-slate-600">
              <BadgeCheck className="size-4 shrink-0 text-brand-cyan" aria-hidden />
              <span>
                Modelled on the <strong>{tier}</strong> plan —{" "}
                {TIER_PRICING[tier].band}, sized automatically from your
                turnover. Plan details are in your report.
              </span>
            </p>

            {/* ——— Proof: the gap, year by year ——— */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold tracking-wide text-brand-dark uppercase">
                The gap compounds every year
              </h2>
              <p className="mt-0.5 mb-4 text-xs text-slate-500">
                Blue is what standing still costs. Green is what acting nets
                you — both from your inputs, year by year (₹ Lakh).
              </p>
              <RoiChart model={model} />
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                Every assumption is visible: 8% annual revenue growth, 5%
                subscription escalation, 70% reporting-effort automation,
                energy savings ramping 3% → 8% → 12% of energy spend. CBAM
                exposure at your inputs: {formatNumber(model.yr1.cbamEmissions)}{" "}
                tCO₂e in Year 1. Illustrative estimates — not a commercial
                quote.
              </p>
            </section>

            {/* ——— The gate: real value, one step away ——— */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold tracking-wide text-brand-dark uppercase">
                Your year-by-year breakdown
              </h2>
              <div className="relative mt-3">
                <div className="pointer-events-none blur-[5px] select-none" aria-hidden>
                  <YearTable model={model} />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/55 px-4 text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-dark text-white shadow-md">
                    <Lock className="size-4" aria-hidden />
                  </span>
                  <p className="max-w-sm text-sm text-slate-700">
                    The full projection — investment, benefits and cumulative
                    payback for all 5 years — is in your{" "}
                    <strong>free report</strong>.
                  </p>
                  <a
                    href="#report-form"
                    className="flex items-center gap-1.5 rounded-md bg-brand-dark px-4 py-2 text-sm font-bold text-white shadow transition hover:opacity-90"
                  >
                    Unlock my full report
                    <ArrowRight className="size-4" aria-hidden />
                  </a>
                </div>
              </div>
            </section>

            <LeadForm
              inputs={inputs}
              model={model}
              recommendedTier={tier}
              onSubmitted={() => setLeadSubmitted(true)}
            />
          </div>
        </div>
      </main>

      {/* ——— Mobile sticky CTA — the result follows you to the form ——— */}
      {!leadSubmitted && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] tracking-wide text-slate-500 uppercase">
                Your 5-yr net benefit
              </p>
              <p className="truncate text-lg font-bold text-chart-green">
                {formatLakh(model.totalNetBenefit)}
              </p>
            </div>
            <a
              href="#report-form"
              className="shrink-0 rounded-md bg-linear-to-r from-brand-cyan to-brand-green px-4 py-2.5 text-sm font-bold text-white shadow"
            >
              Get full report
            </a>
          </div>
        </div>
      )}

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

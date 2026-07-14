import { Building2, ChevronDown, Scale } from "lucide-react";
import type { RoiInputs } from "../lib/roi";
import SliderField from "./SliderField";

interface InputsPanelProps {
  inputs: RoiInputs;
  onChange: (patch: Partial<RoiInputs>) => void;
}

export default function InputsPanel({ inputs, onChange }: InputsPanelProps) {
  return (
    <div className="min-w-0 space-y-5">
      <p className="text-xs font-bold tracking-widest text-brand-cyan uppercase">
        Step 1 · Takes about 60 seconds
      </p>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-brand-dark uppercase">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
            <Building2 className="size-4" />
          </span>
          Your business in six numbers
        </h2>
        <p className="mt-1 mb-4 text-xs text-slate-500">
          Defaults reflect a typical mid-size exporter. Drag until it looks
          like your company — the results update as you move.
        </p>
        <div className="space-y-4">
          <SliderField
            label="Annual turnover"
            unit="₹ Cr"
            value={inputs.annualTurnover}
            min={50}
            max={1500}
            step={10}
            onChange={(v) => onChange({ annualTurnover: v })}
          />
          <SliderField
            label="Annual energy spend"
            unit="₹ Lakh"
            value={inputs.annualEnergySpend}
            min={50}
            max={3000}
            step={10}
            onChange={(v) => onChange({ annualEnergySpend: v })}
          />
          <SliderField
            label="Revenue from EU exports"
            unit="%"
            value={inputs.euExportPercent}
            min={0}
            max={100}
            step={1}
            onChange={(v) => onChange({ euExportPercent: v })}
          />
          <SliderField
            label="Embedded emissions intensity"
            unit="tCO₂e per ₹ Cr"
            value={inputs.embeddedEmissions}
            min={5}
            max={150}
            step={1}
            onChange={(v) => onChange({ embeddedEmissions: v })}
          />
          <SliderField
            label="Staff days on manual ESG reporting"
            unit="days / yr"
            value={inputs.staffDays}
            min={10}
            max={300}
            step={5}
            onChange={(v) => onChange({ staffDays: v })}
          />
          <SliderField
            label="Blended internal staff cost"
            unit="₹ / day"
            value={inputs.staffCost}
            min={1500}
            max={15000}
            step={250}
            onChange={(v) => onChange({ staffCost: v })}
          />
        </div>
      </section>

      <details className="group rounded-xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 p-5 text-sm font-bold tracking-wide text-brand-dark uppercase [&::-webkit-details-marker]:hidden">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
            <Scale className="size-4" />
          </span>
          Regulatory assumptions
          <span className="ml-1 hidden text-[11px] font-normal text-slate-400 normal-case sm:inline">
            optional
          </span>
          <ChevronDown
            className="ml-auto size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-4 px-5 pb-5">
          <p className="text-xs text-slate-500">
            Preloaded with current market defaults — every assumption is
            yours to challenge.
          </p>
          <SliderField
            label="EU CBAM certificate price"
            unit="EUR / tCO₂e"
            value={inputs.cbamPrice}
            min={40}
            max={200}
            step={5}
            onChange={(v) => onChange({ cbamPrice: v })}
          />
          <SliderField
            label="EUR to INR exchange rate"
            unit="₹"
            value={inputs.eurInrRate}
            min={80}
            max={125}
            step={1}
            onChange={(v) => onChange({ eurInrRate: v })}
          />
          <SliderField
            label="CBAM default-value cost premium"
            unit="%"
            value={inputs.cbamPremium}
            min={0}
            max={100}
            step={5}
            onChange={(v) => onChange({ cbamPremium: v })}
          />
        </div>
      </details>
    </div>
  );
}

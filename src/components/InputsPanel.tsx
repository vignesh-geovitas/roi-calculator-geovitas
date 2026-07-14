import { Building2, Layers, Scale } from "lucide-react";
import type { RoiInputs, Tier } from "../lib/roi";
import { TIER_PRICING } from "../lib/roi";
import SliderField from "./SliderField";

interface InputsPanelProps {
  inputs: RoiInputs;
  onChange: (patch: Partial<RoiInputs>) => void;
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-brand-dark uppercase">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
          {icon}
        </span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function InputsPanel({ inputs, onChange }: InputsPanelProps) {
  const tier = TIER_PRICING[inputs.gf360Tier];

  return (
    <div className="space-y-5">
      <SectionCard icon={<Building2 className="size-4" />} title="Company Profile">
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
      </SectionCard>

      <SectionCard icon={<Layers className="size-4" />} title="GF360 Tier Selection">
        <div>
          <label
            htmlFor="tier-select"
            className="mb-1.5 block text-sm font-medium text-brand-dark"
          >
            Engagement tier
          </label>
          <select
            id="tier-select"
            value={inputs.gf360Tier}
            onChange={(e) => onChange({ gf360Tier: e.target.value as Tier })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan focus:outline-none"
          >
            {(Object.keys(TIER_PRICING) as Tier[]).map((t) => (
              <option key={t} value={t}>
                {t} — {TIER_PRICING[t].band}
              </option>
            ))}
          </select>
        </div>
        <dl className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center">
          {(
            [
              ["Subscription", tier.subscription, "/ yr"],
              ["Implementation", tier.implementation, "one-time"],
              ["Advisory", tier.advisory, "/ yr"],
            ] as const
          ).map(([name, amount, note]) => (
            <div key={name}>
              <dt className="text-[11px] text-slate-500">{name}</dt>
              <dd className="text-sm font-bold text-brand-dark">
                ₹{amount} L
                <span className="block text-[10px] font-normal text-slate-400">
                  {note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-xs leading-relaxed text-slate-500">{tier.features}</p>
      </SectionCard>

      <SectionCard
        icon={<Scale className="size-4" />}
        title="Regulatory Assumptions"
      >
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
      </SectionCard>
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export default function SliderField({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: SliderFieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <label className="text-sm font-medium text-brand-dark">
          {label}
          <span className="ml-1 text-xs font-normal text-slate-500">
            ({unit})
          </span>
        </label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 rounded-md border border-slate-300 px-2 py-1 text-right text-base font-semibold tabular-nums focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan focus:outline-none sm:text-sm"
        />
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

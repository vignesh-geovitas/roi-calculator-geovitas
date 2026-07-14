/** Format a Rs Lakh amount compactly: ₹85.9 L / ₹6.2 Cr. */
export function formatLakh(value: number): string {
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  if (abs >= 100) {
    const cr = abs / 100;
    return `${sign}₹${cr.toLocaleString("en-IN", {
      maximumFractionDigits: cr >= 100 ? 0 : 1,
    })} Cr`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 1 })} L`;
}

export function formatPayback(months: number | null): string {
  if (months === null) return "> 5 years";
  if (months < 1) return "< 1 month";
  if (months >= 12) {
    return `${(months / 12).toLocaleString("en-IN", { maximumFractionDigits: 1 })} years`;
  }
  return `${months.toLocaleString("en-IN", { maximumFractionDigits: 1 })} months`;
}

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString("en-IN", { maximumFractionDigits: digits });
}

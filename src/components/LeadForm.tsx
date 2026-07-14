import { useState } from "react";
import { CheckCircle2, FileText, Loader2, Send } from "lucide-react";
import type { RoiInputs, RoiModel, Tier } from "../lib/roi";

/**
 * TODO: point this at your WordPress lead endpoint.
 * Easiest options: a Fluent Forms / WPForms / WP Webhooks inbound webhook URL,
 * or a small custom REST route (register_rest_route) that stores the lead and
 * triggers the report email. The payload arrives as JSON.
 */
const LEAD_WEBHOOK_URL = "";

interface LeadFormProps {
  inputs: RoiInputs;
  model: RoiModel;
  recommendedTier: Tier;
  onSubmitted?: () => void;
}

type Status = "idle" | "sending" | "sent" | "error";

const REPORT_CONTENTS = [
  "Your exact year-by-year projection — the locked table above, in full",
  "CBAM exposure mapping and sensitivity analysis for your inputs",
  "The compliance roadmap and plan sizing we recommend for your profile",
];

export default function LeadForm({
  inputs,
  model,
  recommendedTier,
  onSubmitted,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const payload = {
      name,
      email,
      company,
      source: "GF360 ROI Calculator",
      submittedAt: new Date().toISOString(),
      recommendedTier,
      calculatorInputs: inputs,
      calculatorResults: {
        fiveYearNetBenefitLakh: Number(model.totalNetBenefit.toFixed(1)),
        fiveYearCostOfInactionLakh: Number(
          model.totalCostOfInaction.toFixed(1),
        ),
        fiveYearInvestmentLakh: Number(model.totalInvestment.toFixed(1)),
        paybackMonths: model.paybackMonths,
        roiMultiple: Number(model.roiMultiple.toFixed(2)),
      },
    };

    try {
      if (LEAD_WEBHOOK_URL) {
        const res = await fetch(LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      } else {
        // Placeholder until the WordPress endpoint is connected
        console.info("[GF360 lead capture] webhook not configured", payload);
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("sent");
      onSubmitted?.();
    } catch (err) {
      console.error("[GF360 lead capture] submission failed", err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        id="report-form"
        className="flex items-start gap-3 rounded-xl border border-brand-green/40 bg-brand-green/10 p-5"
      >
        <CheckCircle2
          className="mt-0.5 size-8 shrink-0 text-chart-green"
          aria-hidden
        />
        <div>
          <p className="font-bold text-brand-dark">
            Done, {name.split(" ")[0]} — your report is being prepared.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Your personalised 5-year projection for {company} lands in{" "}
            <strong>{email}</strong> within one business day, prepared by a
            GF360 specialist. Keep this tab open if you want to keep exploring
            scenarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="report-form"
      className="scroll-mt-6 rounded-xl border-2 border-brand-cyan/30 bg-white p-5 shadow-md sm:p-6"
    >
      <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-cyan uppercase">
        <FileText className="size-4" aria-hidden />
        Your free personalised report
      </p>
      <h2 className="mt-2 text-xl font-bold text-brand-dark">
        Take these numbers to your board
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        The calculator shows the headline. The report makes the case:
      </p>
      <ul className="mt-3 mb-5 space-y-2">
        {REPORT_CONTENTS.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-chart-green"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 sm:grid-cols-3 sm:items-end"
      >
        {(
          [
            ["Name", name, setName, "text", "Priya Sharma"],
            ["Work email", email, setEmail, "email", "priya@company.com"],
            ["Company", company, setCompany, "text", "Company Pvt Ltd"],
          ] as const
        ).map(([label, value, setter, type, placeholder]) => (
          <div key={label}>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {label}
            </label>
            <input
              type={type}
              required
              value={value}
              placeholder={placeholder}
              onChange={(e) => setter(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan focus:outline-none sm:text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-brand-cyan to-brand-green px-4 py-3 text-sm font-bold text-white shadow transition hover:opacity-90 disabled:opacity-60 sm:col-span-3"
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          {status === "sending"
            ? "Sending…"
            : "Email me my full report — free"}
        </button>
      </form>
      <p className="mt-3 text-center text-[11px] text-slate-400">
        One email with your report, one follow-up from a GF360 specialist.
        No newsletters, no spam, ever.
      </p>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          Something went wrong while submitting. Please try again or write to
          us at venu@geovitas.com.
        </p>
      )}
    </div>
  );
}

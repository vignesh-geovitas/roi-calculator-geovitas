import { useState } from "react";
import { CheckCircle2, FileText, Loader2, Send } from "lucide-react";
import type { RoiInputs, RoiModel } from "../lib/roi";

/**
 * TODO: paste your GoHighLevel inbound-webhook URL here.
 * Automation > Workflows > (workflow) > Inbound Webhook trigger > copy URL.
 * The payload below arrives as JSON and can be mapped to contact fields
 * for automated outbound sequencing.
 */
const GHL_WEBHOOK_URL = "";

interface LeadFormProps {
  inputs: RoiInputs;
  model: RoiModel;
}

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadForm({ inputs, model }: LeadFormProps) {
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
      if (GHL_WEBHOOK_URL) {
        const res = await fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      } else {
        // Placeholder until the GoHighLevel webhook is connected
        console.info("[GF360 lead capture] webhook not configured", payload);
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("sent");
    } catch (err) {
      console.error("[GF360 lead capture] submission failed", err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-brand-green/40 bg-brand-green/10 p-5">
        <CheckCircle2 className="size-8 shrink-0 text-chart-green" aria-hidden />
        <div>
          <p className="font-bold text-brand-dark">Thank you, {name.split(" ")[0]}!</p>
          <p className="text-sm text-slate-600">
            Your detailed GF360 ROI report is on its way to {email}. Our team
            will reach out shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-brand-dark uppercase">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-green/15 text-chart-green">
          <FileText className="size-4" />
        </span>
        Get Your Detailed Report
      </h2>
      <p className="mt-1 mb-4 text-xs text-slate-500">
        Receive a personalised 5-year ROI breakdown with sensitivity analysis
        and CBAM exposure mapping for your company.
      </p>
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan focus:outline-none"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-brand-cyan to-brand-green px-4 py-2 text-sm font-bold text-white shadow transition hover:opacity-90 disabled:opacity-60 sm:col-span-3"
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          {status === "sending" ? "Sending…" : "Get Detailed Report"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          Something went wrong while submitting. Please try again or write to
          us at venu@geovitas.com.
        </p>
      )}
    </div>
  );
}

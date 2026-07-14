# GF360 ROI Calculator

Interactive B2B ROI calculator for **GF360** — Geovitas' sustainability
compliance and decarbonisation platform. Prospects model their 5-year net
benefit, CBAM cost avoidance and payback period live, then request a detailed
report (lead capture).

Built with **Vite + React 19 + TypeScript + Tailwind CSS 4 + Recharts +
lucide-react**, branded per the Geovitas brand book.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
```

## Deploy (Vercel)

Import the repo in Vercel — it auto-detects Vite. No configuration needed
(`npm run build`, output `dist/`).

## Connect GoHighLevel lead capture

The "Get Detailed Report" form posts JSON to a GoHighLevel inbound webhook.
Set the URL in [src/components/LeadForm.tsx](src/components/LeadForm.tsx)
(`GHL_WEBHOOK_URL`). Payload includes `name`, `email`, `company`, plus a
snapshot of `calculatorInputs` and headline `calculatorResults` for
segmentation in outbound sequences. Until configured, submissions are logged
to the browser console and the UI shows the success state.

## Model

The math in [src/lib/roi.ts](src/lib/roi.ts) is a 1:1 port of
`GF360_ROI_Model_1.xlsx` (hard benefits only — the workbook's illustrative
risk-mitigation layer is intentionally excluded):

- CBAM emissions = turnover × EU-export % × embedded-emissions intensity
- CBAM cost avoidance = liability × default-value premium; cost of inaction
  prices the liability at default values (declared + premium)
- 8% assumed revenue growth; 5% annual subscription/advisory escalation
  (implementation fee is one-time); 70% reporting-effort automation
- Energy savings ramp: 3% (Yr 1) → 8% (Yr 2) → 12% (Yr 3+) of energy spend
- Payback follows the workbook's `ROI Summary` formula verbatim

Tier pricing (Starter / Growth / Enterprise) mirrors the `Pricing Tiers`
sheet.

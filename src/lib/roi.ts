/**
 * GF360 ROI model — ported 1:1 from GF360_ROI_Model_1.xlsx
 * ("Cost of Inaction", "GF360 Investment", "GF360 Benefits", "ROI Summary" sheets).
 * All money values are in Rs Lakh unless noted otherwise.
 */

export type Tier = "Starter" | "Growth" | "Enterprise";

export interface TierPricing {
  subscription: number; // Rs Lakh / yr
  implementation: number; // Rs Lakh, one-time (Year 1)
  advisory: number; // Rs Lakh / yr
  band: string;
  features: string;
}

export const TIER_PRICING: Record<Tier, TierPricing> = {
  Starter: {
    subscription: 3,
    implementation: 1,
    advisory: 1.5,
    band: "< ₹100 Cr turnover",
    features:
      "Scope 1 & 2 tracking, basic MRV dashboards, single-facility, self-serve reporting",
  },
  Growth: {
    subscription: 8,
    implementation: 2.5,
    advisory: 3,
    band: "₹100 – 500 Cr turnover",
    features:
      "Scope 1/2/3, CBAM/CCTS/BRSR compliance modules, multi-facility, supplier engagement portal, quarterly advisory",
  },
  Enterprise: {
    subscription: 18,
    implementation: 5,
    advisory: 6,
    band: "> ₹500 Cr turnover",
    features:
      "Full MRV, ERP/API integrations, carbon-credit monetisation support, dedicated CSM, verification support",
  },
};

/** Tier bands from the 'Pricing Tiers' sheet — recommended, never asked. */
export function recommendTier(annualTurnoverCr: number): Tier {
  if (annualTurnoverCr < 100) return "Starter";
  if (annualTurnoverCr <= 500) return "Growth";
  return "Enterprise";
}

export interface RoiInputs {
  annualTurnover: number; // Rs Cr
  annualEnergySpend: number; // Rs Lakh
  euExportPercent: number; // %
  embeddedEmissions: number; // tCO2e per Rs Cr revenue
  staffDays: number; // person-days / yr on manual ESG data
  staffCost: number; // Rs per person-day
  gf360Tier: Tier;
  cbamPrice: number; // EUR per tCO2e
  eurInrRate: number; // Rs per EUR
  cbamPremium: number; // % default-value cost premium
}

export const DEFAULT_INPUTS: RoiInputs = {
  annualTurnover: 250,
  annualEnergySpend: 450,
  euExportPercent: 18,
  embeddedEmissions: 45,
  staffDays: 60,
  staffCost: 4500,
  gf360Tier: "Growth",
  cbamPrice: 85,
  eurInrRate: 95,
  cbamPremium: 30,
};

export const YEARS = 5;
export const REVENUE_GROWTH = 0.08; // assumed annual revenue growth
export const FEE_ESCALATION = 0.05; // annual subscription/advisory escalation
export const AUTOMATION_EFFICIENCY = 0.7; // staff-effort reduction via GF360
export const AVOIDED_CONSULTANT_FEE = 35; // Rs Lakh / yr (Big-4 assessment)
export const ENERGY_SAVINGS_RAMP = [0.03, 0.08, 0.12, 0.12, 0.12]; // % of energy spend, Yr1..Yr5

export interface YearRow {
  year: number; // 1-based
  turnover: number; // Rs Cr
  cbamEmissions: number; // tCO2e subject to CBAM
  cbamLiability: number; // at declared values (Rs Lakh)
  costOfInaction: number; // CBAM at default values + consultant + staff time
  investment: number;
  cbamCostAvoidance: number;
  staffTimeSavings: number;
  energySavings: number;
  hardBenefits: number;
  netBenefit: number;
  cumulativeNetBenefit: number;
}

export interface RoiModel {
  years: YearRow[];
  staffTimeCost: number; // Rs Lakh / yr, constant
  totalInvestment: number;
  totalHardBenefits: number;
  totalNetBenefit: number;
  totalCostOfInaction: number;
  roiMultiple: number; // 5-yr net benefit / 5-yr investment
  paybackMonths: number | null; // null = beyond 5 years
  yr1: YearRow;
}

export function computeRoi(inputs: RoiInputs): RoiModel {
  const tier = TIER_PRICING[inputs.gf360Tier];
  const staffTimeCost = (inputs.staffDays * inputs.staffCost) / 100000;

  const years: YearRow[] = [];
  let cumulative = 0;

  for (let y = 0; y < YEARS; y++) {
    const turnover = inputs.annualTurnover * (1 + REVENUE_GROWTH) ** y;
    const cbamEmissions =
      turnover * (inputs.euExportPercent / 100) * inputs.embeddedEmissions;
    const cbamLiability =
      (cbamEmissions * inputs.cbamPrice * inputs.eurInrRate) / 100000;
    const cbamCostAvoidance = cbamLiability * (inputs.cbamPremium / 100);
    // Without GF360 the liability is settled at default values (declared + premium)
    const costOfInaction =
      cbamLiability * (1 + inputs.cbamPremium / 100) +
      AVOIDED_CONSULTANT_FEE +
      staffTimeCost;

    const escalation = (1 + FEE_ESCALATION) ** y;
    const investment =
      y === 0
        ? tier.subscription + tier.implementation + tier.advisory
        : (tier.subscription + tier.advisory) * escalation;

    const staffTimeSavings = staffTimeCost * AUTOMATION_EFFICIENCY;
    const energySavings = inputs.annualEnergySpend * ENERGY_SAVINGS_RAMP[y];
    const hardBenefits =
      cbamCostAvoidance +
      AVOIDED_CONSULTANT_FEE +
      staffTimeSavings +
      energySavings;
    const netBenefit = hardBenefits - investment;
    cumulative += netBenefit;

    years.push({
      year: y + 1,
      turnover,
      cbamEmissions,
      cbamLiability,
      costOfInaction,
      investment,
      cbamCostAvoidance,
      staffTimeSavings,
      energySavings,
      hardBenefits,
      netBenefit,
      cumulativeNetBenefit: cumulative,
    });
  }

  const totalInvestment = years.reduce((s, r) => s + r.investment, 0);
  const totalHardBenefits = years.reduce((s, r) => s + r.hardBenefits, 0);
  const totalNetBenefit = years.reduce((s, r) => s + r.netBenefit, 0);
  const totalCostOfInaction = years.reduce((s, r) => s + r.costOfInaction, 0);

  return {
    years,
    staffTimeCost,
    totalInvestment,
    totalHardBenefits,
    totalNetBenefit,
    totalCostOfInaction,
    roiMultiple: totalInvestment > 0 ? totalNetBenefit / totalInvestment : 0,
    paybackMonths: paybackMonths(years, tier.implementation),
    yr1: years[0],
  };
}

/** Excel 'ROI Summary'!B17 payback logic, verbatim. */
function paybackMonths(
  years: YearRow[],
  implementation: number,
): number | null {
  if (implementation <= 0) return 0;
  if (years[0].cumulativeNetBenefit >= 0) {
    return (implementation * 12) / (years[0].netBenefit + implementation);
  }
  for (let y = 1; y < years.length; y++) {
    if (years[y].cumulativeNetBenefit >= 0) {
      return (
        (-years[y - 1].cumulativeNetBenefit / years[y].netBenefit) * 12 + 12 * y
      );
    }
  }
  return null;
}

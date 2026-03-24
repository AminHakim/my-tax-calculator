/**
 * Malaysian Income Tax Calculator Engine — YA 2025
 * Based on LHDN progressive tax rates and relief schedules.
 *
 * Design: "Batik Modernism" — warm teal + gold palette
 */

// ─── Tax Brackets (YA 2023–2025, Resident) ────────────────────────────
export interface TaxBracket {
  min: number;
  max: number;       // Infinity for the last bracket
  rate: number;      // percentage
  cumTaxBefore: number; // cumulative tax at the start of this bracket
}

export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0,        max: 5000,      rate: 0,  cumTaxBefore: 0 },
  { min: 5001,     max: 20000,     rate: 1,  cumTaxBefore: 0 },
  { min: 20001,    max: 35000,     rate: 3,  cumTaxBefore: 150 },
  { min: 35001,    max: 50000,     rate: 6,  cumTaxBefore: 600 },
  { min: 50001,    max: 70000,     rate: 11, cumTaxBefore: 1500 },
  { min: 70001,    max: 100000,    rate: 19, cumTaxBefore: 3700 },
  { min: 100001,   max: 400000,    rate: 25, cumTaxBefore: 9400 },
  { min: 400001,   max: 600000,    rate: 26, cumTaxBefore: 84400 },
  { min: 600001,   max: 2000000,   rate: 28, cumTaxBefore: 136400 },
  { min: 2000001,  max: Infinity,  rate: 30, cumTaxBefore: 528400 },
];

// ─── Tax Relief Categories (YA 2025) ──────────────────────────────────
export interface ReliefCategory {
  id: string;
  label: string;
  maxAmount: number;
  description: string;
  group: "personal" | "family" | "lifestyle" | "insurance" | "savings";
  isPerChild?: boolean;
  isAutomatic?: boolean;
}

export const RELIEF_CATEGORIES: ReliefCategory[] = [
  // Personal
  {
    id: "individual",
    label: "Individual & Dependents",
    maxAmount: 9000,
    description: "Automatic relief for self and dependent relatives",
    group: "personal",
    isAutomatic: true,
  },
  {
    id: "disabled_individual",
    label: "Disabled Individual (Additional)",
    maxAmount: 7000,
    description: "Additional relief if certified disabled by DSW",
    group: "personal",
  },
  {
    id: "spouse",
    label: "Spouse / Alimony",
    maxAmount: 4000,
    description: "Spouse with no income or joint assessment, or alimony to former wife",
    group: "family",
  },
  {
    id: "disabled_spouse",
    label: "Disabled Spouse (Additional)",
    maxAmount: 6000,
    description: "Additional relief for disabled spouse",
    group: "family",
  },
  // Education
  {
    id: "education_self",
    label: "Education Fees (Self)",
    maxAmount: 7000,
    description: "Tertiary education, upskilling courses (sub-limit RM2,000 for upskilling)",
    group: "personal",
  },
  // Lifestyle
  {
    id: "lifestyle_core",
    label: "Lifestyle (Reading, Computer, Internet)",
    maxAmount: 2500,
    description: "Books, e-newspapers, computer/tablet, internet subscription",
    group: "lifestyle",
  },
  {
    id: "lifestyle_sports",
    label: "Lifestyle (Sports)",
    maxAmount: 1000,
    description: "Sports equipment, gym membership, facility fees",
    group: "lifestyle",
  },
  {
    id: "ev_charging",
    label: "EV Charging Facilities",
    maxAmount: 2500,
    description: "Installation, rental or purchase of EV charging facilities",
    group: "lifestyle",
  },
  // Medical
  {
    id: "medical_self",
    label: "Medical Expenses (Self/Spouse/Child)",
    maxAmount: 10000,
    description: "Serious diseases, fertility, vaccination (RM1k), dental (RM1k), mental health",
    group: "personal",
  },
  {
    id: "medical_parents",
    label: "Medical Expenses (Parents/Grandparents)",
    maxAmount: 8000,
    description: "Medical, dental, special needs, carer expenses for parents/grandparents",
    group: "family",
  },
  {
    id: "supporting_equipment",
    label: "Basic Supporting Equipment (Disabled)",
    maxAmount: 6000,
    description: "For self, spouse, children, or parents who are disabled",
    group: "personal",
  },
  // Children
  {
    id: "child_under18",
    label: "Child Under 18",
    maxAmount: 2000,
    description: "Per unmarried child below 18 years old",
    group: "family",
    isPerChild: true,
  },
  {
    id: "child_18_studying",
    label: "Child 18+ (Studying, Pre-University)",
    maxAmount: 2000,
    description: "Per unmarried child 18+ in full-time education (A-Level, certificate)",
    group: "family",
    isPerChild: true,
  },
  {
    id: "child_18_higher_ed",
    label: "Child 18+ (Higher Education)",
    maxAmount: 8000,
    description: "Per unmarried child 18+ in Diploma/Degree or above",
    group: "family",
    isPerChild: true,
  },
  {
    id: "child_disabled",
    label: "Disabled Child",
    maxAmount: 8000,
    description: "Per unmarried disabled child",
    group: "family",
    isPerChild: true,
  },
  {
    id: "child_disabled_higher_ed",
    label: "Disabled Child (Higher Education)",
    maxAmount: 14000,
    description: "Disabled child 18+ in professional diploma or higher degree",
    group: "family",
    isPerChild: true,
  },
  {
    id: "breastfeeding",
    label: "Breastfeeding Equipment",
    maxAmount: 1000,
    description: "For child aged 2 and below (once every 2 years)",
    group: "family",
  },
  {
    id: "childcare",
    label: "Childcare Fees",
    maxAmount: 3000,
    description: "Registered childcare/kindergarten for child 6 and below",
    group: "family",
  },
  // Insurance & Savings
  {
    id: "epf_life_insurance",
    label: "EPF & Life Insurance",
    maxAmount: 7000,
    description: "EPF (max RM4,000) + Life Insurance (max RM3,000)",
    group: "insurance",
  },
  {
    id: "education_medical_insurance",
    label: "Education & Medical Insurance",
    maxAmount: 4000,
    description: "Premiums for education or medical benefits",
    group: "insurance",
  },
  {
    id: "socso_eis",
    label: "SOCSO & EIS Contributions",
    maxAmount: 350,
    description: "Social security and employment insurance contributions",
    group: "insurance",
  },
  {
    id: "prs",
    label: "Private Retirement Scheme (PRS)",
    maxAmount: 3000,
    description: "Deferred annuity and PRS contributions",
    group: "savings",
  },
  {
    id: "sspn",
    label: "SSPN (Education Savings)",
    maxAmount: 8000,
    description: "Net deposits in National Education Savings Scheme",
    group: "savings",
  },
  {
    id: "housing_loan",
    label: "Housing Loan Interest (First Home)",
    maxAmount: 7000,
    description: "First-time homebuyer, first 3 years. RM7k (≤RM500k) or RM5k (RM500k–RM750k)",
    group: "savings",
  },
];

// ─── Relief Group Labels ──────────────────────────────────────────────
export const RELIEF_GROUP_LABELS: Record<string, string> = {
  personal: "Personal & Education",
  family: "Family & Children",
  lifestyle: "Lifestyle",
  insurance: "Insurance & Contributions",
  savings: "Savings & Investments",
};

// ─── Calculation Types ────────────────────────────────────────────────
export interface TaxInput {
  annualIncome: number;
  reliefs: Record<string, number>;
  zakat: number;
  isMarried: boolean;
  assessmentType: "separate" | "joint";
}

export interface BracketBreakdown {
  bracket: TaxBracket;
  taxableInBracket: number;
  taxForBracket: number;
}

export interface TaxResult {
  grossIncome: number;
  totalReliefs: number;
  chargeableIncome: number;
  taxBeforeRebate: number;
  rebateAmount: number;
  zakatDeduction: number;
  finalTax: number;
  effectiveRate: number;
  bracketBreakdown: BracketBreakdown[];
  currentBracketRate: number;
}

// ─── Calculation Logic ────────────────────────────────────────────────
export function calculateTax(input: TaxInput): TaxResult {
  const { annualIncome, reliefs, zakat, isMarried, assessmentType } = input;

  // 1. Sum reliefs
  const totalReliefs = Object.values(reliefs).reduce((sum, v) => sum + (v || 0), 0);

  // 2. Chargeable income
  const chargeableIncome = Math.max(0, annualIncome - totalReliefs);

  // 3. Progressive tax calculation
  let taxBeforeRebate = 0;
  let currentBracketRate = 0;
  const bracketBreakdown: BracketBreakdown[] = [];

  for (const bracket of TAX_BRACKETS) {
    if (chargeableIncome <= 0) break;
    if (chargeableIncome < bracket.min) break;

    const taxableInBracket = Math.min(
      chargeableIncome - (bracket.min - 1),
      bracket.max - (bracket.min - 1)
    );

    // For the first bracket (0-5000), min is 0 so we handle it slightly differently
    const actualTaxable = bracket.min === 0
      ? Math.min(chargeableIncome, bracket.max)
      : Math.min(chargeableIncome - bracket.min + 1, bracket.max - bracket.min + 1);

    if (actualTaxable > 0) {
      const taxForBracket = (actualTaxable * bracket.rate) / 100;
      taxBeforeRebate += taxForBracket;
      currentBracketRate = bracket.rate;

      bracketBreakdown.push({
        bracket,
        taxableInBracket: actualTaxable,
        taxForBracket,
      });
    }
  }

  // Round to 2 decimal places
  taxBeforeRebate = Math.round(taxBeforeRebate * 100) / 100;

  // 4. Tax rebate (RM400 if chargeable income <= RM35,000)
  let rebateAmount = 0;
  if (chargeableIncome <= 35000) {
    rebateAmount = 400;
    if (isMarried && assessmentType === "joint") {
      rebateAmount = 800;
    }
  }

  // 5. Zakat deduction (max = tax charged after rebate)
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  const zakatDeduction = Math.min(zakat, taxAfterRebate);

  // 6. Final tax
  const finalTax = Math.max(0, taxAfterRebate - zakatDeduction);

  // 7. Effective rate
  const effectiveRate = annualIncome > 0 ? (finalTax / annualIncome) * 100 : 0;

  return {
    grossIncome: annualIncome,
    totalReliefs,
    chargeableIncome,
    taxBeforeRebate,
    rebateAmount: Math.min(rebateAmount, taxBeforeRebate),
    zakatDeduction,
    finalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    bracketBreakdown,
    currentBracketRate,
  };
}

// ─── Formatting Helpers ───────────────────────────────────────────────
export function formatRM(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(amount: number): string {
  return amount.toLocaleString("en-MY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

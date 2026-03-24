import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import {
  calculateTax,
  RELIEF_CATEGORIES,
  type TaxInput,
  type TaxResult,
} from "@/lib/taxEngine";

interface TaxContextType {
  // Inputs
  annualIncome: number;
  setAnnualIncome: (v: number) => void;
  reliefs: Record<string, number>;
  setRelief: (id: string, value: number) => void;
  resetReliefs: () => void;
  zakat: number;
  setZakat: (v: number) => void;
  isMarried: boolean;
  setIsMarried: (v: boolean) => void;
  assessmentType: "separate" | "joint";
  setAssessmentType: (v: "separate" | "joint") => void;

  // Results
  result: TaxResult;
}

const TaxContext = createContext<TaxContextType | null>(null);

function getDefaultReliefs(): Record<string, number> {
  const defaults: Record<string, number> = {};
  for (const cat of RELIEF_CATEGORIES) {
    defaults[cat.id] = cat.isAutomatic ? cat.maxAmount : 0;
  }
  return defaults;
}

export function TaxProvider({ children }: { children: ReactNode }) {
  const [annualIncome, setAnnualIncome] = useState(0);
  const [reliefs, setReliefs] = useState<Record<string, number>>(getDefaultReliefs);
  const [zakat, setZakat] = useState(0);
  const [isMarried, setIsMarried] = useState(false);
  const [assessmentType, setAssessmentType] = useState<"separate" | "joint">("separate");

  const setRelief = useCallback((id: string, value: number) => {
    setReliefs((prev) => ({ ...prev, [id]: value }));
  }, []);

  const resetReliefs = useCallback(() => {
    setReliefs(getDefaultReliefs());
  }, []);

  const input: TaxInput = useMemo(
    () => ({
      annualIncome,
      reliefs,
      zakat,
      isMarried,
      assessmentType,
    }),
    [annualIncome, reliefs, zakat, isMarried, assessmentType]
  );

  const result = useMemo(() => calculateTax(input), [input]);

  const value = useMemo(
    () => ({
      annualIncome,
      setAnnualIncome,
      reliefs,
      setRelief,
      resetReliefs,
      zakat,
      setZakat,
      isMarried,
      setIsMarried,
      assessmentType,
      setAssessmentType,
      result,
    }),
    [annualIncome, reliefs, setRelief, resetReliefs, zakat, isMarried, assessmentType, result]
  );

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
}

export function useTax() {
  const ctx = useContext(TaxContext);
  if (!ctx) throw new Error("useTax must be used within TaxProvider");
  return ctx;
}

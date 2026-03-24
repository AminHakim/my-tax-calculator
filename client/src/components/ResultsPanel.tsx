/**
 * ResultsPanel — Sticky results summary with bracket breakdown
 * "Batik Modernism" — warm gold accents, animated numbers
 */
import { useTax } from "@/contexts/TaxContext";
import { formatRM, TAX_BRACKETS } from "@/lib/taxEngine";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const RESULTS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663447009819/huqXytPENSZEcSRLxLGy7g/results-bg-SUJrFGK9oWfJfZEvMpxK9Z.webp";

function AnimatedNumber({ value, prefix = "RM " }: { value: number; prefix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-mono"
    >
      {prefix}
      {value.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </motion.span>
  );
}

function BracketBar() {
  const { result } = useTax();
  const { chargeableIncome } = result;

  if (chargeableIncome <= 0) return null;

  // Find which brackets are active
  const maxBracketEnd = Math.min(chargeableIncome, 2000000);
  const activeBrackets = TAX_BRACKETS.filter((b) => chargeableIncome >= b.min);

  return (
    <div className="mt-4">
      <div className="text-xs font-medium text-[#8A8580] mb-2">Tax Bracket Breakdown</div>
      <div className="flex rounded-lg overflow-hidden h-6 bg-[#F0EBE3]">
        {activeBrackets.map((bracket, i) => {
          const bracketStart = bracket.min === 0 ? 0 : bracket.min - 1;
          const bracketEnd = Math.min(chargeableIncome, bracket.max);
          const width = ((bracketEnd - bracketStart) / Math.max(chargeableIncome, 1)) * 100;

          if (width <= 0) return null;

          const colors = [
            "bg-[#B8E6E6]",
            "bg-[#8DD4D4]",
            "bg-[#5BBFBF]",
            "bg-[#3AABAB]",
            "bg-[#1E9696]",
            "bg-[#0D6E6E]",
            "bg-[#0B5E5E]",
            "bg-[#094E4E]",
            "bg-[#073E3E]",
            "bg-[#052E2E]",
          ];

          return (
            <div
              key={i}
              className={`${colors[i] || colors[colors.length - 1]} relative group`}
              style={{ width: `${Math.max(width, 2)}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                <div className="bg-[#2D2A26] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                  {bracket.rate}% ({formatRM(bracketEnd - bracketStart)})
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#B0AAA0]">0%</span>
        <span className="text-[10px] text-[#B0AAA0] font-mono">{result.currentBracketRate}%</span>
      </div>
    </div>
  );
}

export default function ResultsPanel() {
  const { result } = useTax();
  const [showDetails, setShowDetails] = useState(false);

  const summaryRows = [
    { label: "Gross Income", value: result.grossIncome, color: "text-[#2D2A26]" },
    { label: "Total Reliefs", value: -result.totalReliefs, color: "text-[#0D6E6E]" },
    { label: "Chargeable Income", value: result.chargeableIncome, color: "text-[#2D2A26]", bold: true },
    { label: "Tax (Before Rebate)", value: result.taxBeforeRebate, color: "text-[#5A5550]" },
  ];

  if (result.rebateAmount > 0) {
    summaryRows.push({ label: "Tax Rebate", value: -result.rebateAmount, color: "text-[#0D6E6E]" });
  }
  if (result.zakatDeduction > 0) {
    summaryRows.push({ label: "Zakat Deduction", value: -result.zakatDeduction, color: "text-[#0D6E6E]" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:sticky lg:top-6"
    >
      {/* Main result card */}
      <div
        className="rounded-2xl border border-[#E8E3DA] shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${RESULTS_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D6E6E] to-[#0B5E5E] p-6">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-5 h-5 text-[#D4A843]" />
              <span className="text-sm font-medium text-teal-100">Your Tax Summary</span>
            </div>
            <div className="text-4xl font-extrabold text-white tracking-tight">
              <AnimatedNumber value={result.finalTax} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="w-3.5 h-3.5 text-[#D4A843]" />
              <span className="text-sm text-teal-100">
                Effective rate:{" "}
                <span className="font-semibold text-white font-mono">{result.effectiveRate}%</span>
              </span>
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="px-6 py-4 bg-[#FAF7F2]/80 border-b border-[#E8E3DA]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8A8580]">Monthly Tax</span>
              <span className="text-lg font-bold text-[#2D2A26] font-mono">
                <AnimatedNumber value={result.finalTax / 12} />
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-[#8A8580]">Monthly Take-Home (est.)</span>
              <span className="text-sm font-semibold text-[#0D6E6E] font-mono">
                <AnimatedNumber value={Math.max(0, (result.grossIncome - result.finalTax) / 12)} />
              </span>
            </div>
          </div>

          {/* Summary breakdown */}
          <div className="px-6 py-4 space-y-2.5">
            {summaryRows.map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className={`text-sm ${row.bold ? "font-semibold text-[#2D2A26]" : "text-[#8A8580]"}`}>
                  {row.label}
                </span>
                <span className={`text-sm font-mono font-semibold ${row.color}`}>
                  {row.value < 0 ? "- " : ""}
                  {formatRM(Math.abs(row.value))}
                </span>
              </div>
            ))}

            {/* Final tax line */}
            <div className="pt-2.5 mt-2.5 border-t-2 border-[#0D6E6E]/20 flex justify-between items-center">
              <span className="text-base font-bold text-[#2D2A26]">Tax Payable</span>
              <span className="text-xl font-extrabold text-[#0D6E6E] font-mono">
                <AnimatedNumber value={result.finalTax} />
              </span>
            </div>
          </div>

          {/* Bracket visualization */}
          <div className="px-6 pb-4">
            <BracketBar />
          </div>

          {/* Detailed bracket breakdown toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-3 flex items-center justify-center gap-1.5 text-sm font-medium text-[#0D6E6E] hover:bg-[#0D6E6E]/5 transition-colors border-t border-[#E8E3DA]"
          >
            {showDetails ? "Hide" : "Show"} Bracket Details
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[#8A8580]">
                        <th className="text-left py-1.5 font-medium">Bracket</th>
                        <th className="text-right py-1.5 font-medium">Rate</th>
                        <th className="text-right py-1.5 font-medium">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.bracketBreakdown.map((item, i) => (
                        <tr key={i} className="border-t border-[#F0EBE3]">
                          <td className="py-1.5 text-[#5A5550] font-mono">
                            {formatRM(item.bracket.min === 0 ? 0 : item.bracket.min - 1)} –{" "}
                            {item.bracket.max === Infinity
                              ? "..."
                              : formatRM(Math.min(result.chargeableIncome, item.bracket.max))}
                          </td>
                          <td className="text-right py-1.5 text-[#0D6E6E] font-semibold font-mono">
                            {item.bracket.rate}%
                          </td>
                          <td className="text-right py-1.5 text-[#2D2A26] font-semibold font-mono">
                            {formatRM(item.taxForBracket)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-[#B0AAA0] mt-3 text-center leading-relaxed">
        This calculator provides estimates based on LHDN YA 2025 rates.
        For official filing, visit{" "}
        <a
          href="https://mytax.hasil.gov.my/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0D6E6E] underline"
        >
          MyTax
        </a>
        .
      </p>
    </motion.div>
  );
}

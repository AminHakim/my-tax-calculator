/**
 * IncomeInput — Annual income entry with marital status
 * "Batik Modernism" — warm, approachable input section
 */
import { useTax } from "@/contexts/TaxContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Banknote, Heart, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function IncomeInput() {
  const {
    annualIncome,
    setAnnualIncome,
    isMarried,
    setIsMarried,
    assessmentType,
    setAssessmentType,
    zakat,
    setZakat,
  } = useTax();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-[#E8E3DA] shadow-sm p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0D6E6E]/10 flex items-center justify-center">
          <Banknote className="w-5 h-5 text-[#0D6E6E]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2D2A26]">Your Income</h2>
          <p className="text-sm text-[#8A8580]">Enter your total annual employment income</p>
        </div>
      </div>

      {/* Annual income */}
      <div className="mb-6">
        <Label htmlFor="annual-income" className="text-sm font-medium text-[#5A5550] mb-2 block">
          Annual Income (RM)
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D6E6E] font-semibold text-lg">
            RM
          </span>
          <input
            id="annual-income"
            type="number"
            min={0}
            step={1000}
            value={annualIncome || ""}
            onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-full pl-14 pr-4 py-4 text-2xl font-mono font-semibold text-[#2D2A26] bg-[#FAF7F2] border-2 border-[#E8E3DA] rounded-xl focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 transition-all outline-none"
          />
        </div>
        <p className="text-xs text-[#8A8580] mt-2">
          Tip: Enter your total annual salary before EPF deduction. Monthly salary x 12.
        </p>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[36000, 60000, 84000, 120000, 200000, 500000].map((amount) => (
          <button
            key={amount}
            onClick={() => setAnnualIncome(amount)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              annualIncome === amount
                ? "bg-[#0D6E6E] text-white shadow-sm"
                : "bg-[#FAF7F2] text-[#5A5550] hover:bg-[#0D6E6E]/10 hover:text-[#0D6E6E]"
            }`}
          >
            {(amount / 1000).toFixed(0)}k
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8E3DA] to-transparent my-6" />

      {/* Marital status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-[#D4A843]" />
          <Label htmlFor="married" className="text-sm font-medium text-[#5A5550]">
            Married
          </Label>
        </div>
        <Switch
          id="married"
          checked={isMarried}
          onCheckedChange={setIsMarried}
        />
      </div>

      {isMarried && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 pl-7"
        >
          <Label className="text-sm text-[#8A8580] mb-2 block">Assessment Type</Label>
          <div className="flex gap-3">
            {(["separate", "joint"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setAssessmentType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  assessmentType === type
                    ? "bg-[#0D6E6E] text-white"
                    : "bg-[#FAF7F2] text-[#5A5550] hover:bg-[#0D6E6E]/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8E3DA] to-transparent my-6" />

      {/* Zakat */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="zakat" className="text-sm font-medium text-[#5A5550]">
            Zakat / Fitrah (RM)
          </Label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-[#8A8580]" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Zakat payments are deducted directly from your tax payable, up to the maximum tax charged.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8580] font-medium">
            RM
          </span>
          <input
            id="zakat"
            type="number"
            min={0}
            value={zakat || ""}
            onChange={(e) => setZakat(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-full pl-14 pr-4 py-3 font-mono text-[#2D2A26] bg-[#FAF7F2] border-2 border-[#E8E3DA] rounded-xl focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 transition-all outline-none"
          />
        </div>
      </div>
    </motion.div>
  );
}

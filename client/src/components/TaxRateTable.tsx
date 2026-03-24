/**
 * TaxRateTable — Reference table showing progressive tax rates
 * "Batik Modernism" — clean table with teal highlights
 */
import { TAX_BRACKETS, formatRM } from "@/lib/taxEngine";
import { useTax } from "@/contexts/TaxContext";
import { motion } from "framer-motion";
import { Table2 } from "lucide-react";

export default function TaxRateTable() {
  const { result } = useTax();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl border border-[#E8E3DA] shadow-sm p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0D6E6E]/10 flex items-center justify-center">
          <Table2 className="w-5 h-5 text-[#0D6E6E]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2D2A26]">Tax Rate Table</h2>
          <p className="text-sm text-[#8A8580]">YA 2023–2025 Resident Individual Rates</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#0D6E6E]/20">
              <th className="text-left py-2.5 px-2 font-semibold text-[#2D2A26]">Chargeable Income</th>
              <th className="text-center py-2.5 px-2 font-semibold text-[#2D2A26]">Rate</th>
              <th className="text-right py-2.5 px-2 font-semibold text-[#2D2A26]">Cumulative Tax</th>
            </tr>
          </thead>
          <tbody>
            {TAX_BRACKETS.map((bracket, i) => {
              const isActive = result.chargeableIncome >= bracket.min;
              const isCurrent =
                result.chargeableIncome >= bracket.min &&
                (result.chargeableIncome <= bracket.max || bracket.max === Infinity);

              return (
                <tr
                  key={i}
                  className={`border-b border-[#F0EBE3] transition-colors ${
                    isCurrent
                      ? "bg-[#0D6E6E]/8 font-semibold"
                      : isActive
                      ? "bg-[#FAF7F2]"
                      : ""
                  }`}
                >
                  <td className="py-2.5 px-2 font-mono text-xs">
                    {isCurrent && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4A843] mr-1.5 animate-pulse" />
                    )}
                    {formatRM(bracket.min === 0 ? 0 : bracket.min)}{" "}
                    <span className="text-[#B0AAA0]">–</span>{" "}
                    {bracket.max === Infinity ? "Above" : formatRM(bracket.max)}
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold font-mono ${
                        isCurrent
                          ? "bg-[#0D6E6E] text-white"
                          : "bg-[#F0EBE3] text-[#5A5550]"
                      }`}
                    >
                      {bracket.rate}%
                    </span>
                  </td>
                  <td className="text-right py-2.5 px-2 font-mono text-xs text-[#5A5550]">
                    {bracket.max === Infinity
                      ? `${formatRM(bracket.cumTaxBefore)} + ...`
                      : formatRM(bracket.cumTaxBefore + ((bracket.max - (bracket.min === 0 ? 0 : bracket.min - 1)) * bracket.rate) / 100)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#B0AAA0] mt-4">
        Non-resident individuals are taxed at a flat rate of 30%.
      </p>
    </motion.div>
  );
}

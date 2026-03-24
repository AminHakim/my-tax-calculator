/**
 * ReliefSection — Tax relief input with grouped accordion
 * "Batik Modernism" — warm, progressive disclosure
 */
import { useTax } from "@/contexts/TaxContext";
import {
  RELIEF_CATEGORIES,
  RELIEF_GROUP_LABELS,
  formatRM,
  type ReliefCategory,
} from "@/lib/taxEngine";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  User,
  Users,
  Dumbbell,
  Shield,
  PiggyBank,
  Info,
  RotateCcw,
  Check,
} from "lucide-react";

const GROUP_ICONS: Record<string, typeof User> = {
  personal: User,
  family: Users,
  lifestyle: Dumbbell,
  insurance: Shield,
  savings: PiggyBank,
};

function ReliefInput({ category }: { category: ReliefCategory }) {
  const { reliefs, setRelief } = useTax();
  const value = reliefs[category.id] || 0;
  const isMaxed = value >= category.maxAmount;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-[#F0EBE3] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-[#2D2A26] truncate">{category.label}</span>
          {category.isAutomatic && (
            <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0D6E6E]/10 text-[#0D6E6E]">
              <Check className="w-2.5 h-2.5" /> Auto
            </span>
          )}
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-[#B0AAA0] shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              <p>{category.description}</p>
              <p className="mt-1 font-semibold">Max: {formatRM(category.maxAmount)}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-xs text-[#8A8580]">
          Max: {formatRM(category.maxAmount)}
          {category.isPerChild && " per child"}
        </span>
      </div>
      <div className="relative shrink-0 w-full sm:w-40">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8580]">RM</span>
        <input
          type="number"
          min={0}
          max={category.isPerChild ? undefined : category.maxAmount}
          value={value || ""}
          onChange={(e) => {
            let v = Math.max(0, Number(e.target.value));
            if (!category.isPerChild) v = Math.min(v, category.maxAmount);
            setRelief(category.id, v);
          }}
          className={`w-full pl-10 pr-3 py-2 text-sm font-mono rounded-lg border-2 transition-all outline-none ${
            isMaxed
              ? "border-[#0D6E6E]/30 bg-[#0D6E6E]/5 text-[#0D6E6E]"
              : "border-[#E8E3DA] bg-[#FAF7F2] text-[#2D2A26] focus:border-[#0D6E6E] focus:ring-1 focus:ring-[#0D6E6E]/20"
          }`}
        />
        {!category.isPerChild && (
          <button
            onClick={() => setRelief(category.id, category.maxAmount)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#0D6E6E] hover:text-[#0B5E5E] transition-colors"
          >
            MAX
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReliefSection() {
  const { reliefs, resetReliefs, result } = useTax();

  // Group categories
  const groups = Object.entries(RELIEF_GROUP_LABELS).map(([key, label]) => ({
    key,
    label,
    categories: RELIEF_CATEGORIES.filter((c) => c.group === key),
    subtotal: RELIEF_CATEGORIES.filter((c) => c.group === key).reduce(
      (sum, c) => sum + (reliefs[c.id] || 0),
      0
    ),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl border border-[#E8E3DA] shadow-sm p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4A843]/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#D4A843]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D2A26]">Tax Reliefs</h2>
            <p className="text-sm text-[#8A8580]">
              Total: <span className="font-semibold text-[#0D6E6E] font-mono">{formatRM(result.totalReliefs)}</span>
            </p>
          </div>
        </div>
        <button
          onClick={resetReliefs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8A8580] hover:text-[#E85D4A] hover:bg-[#E85D4A]/5 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Grouped accordion */}
      <Accordion type="multiple" defaultValue={["personal", "family"]} className="space-y-3">
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group.key] || User;
          return (
            <AccordionItem
              key={group.key}
              value={group.key}
              className="border border-[#F0EBE3] rounded-xl overflow-hidden data-[state=open]:border-[#0D6E6E]/20 transition-colors"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[#FAF7F2]/50 [&[data-state=open]]:bg-[#FAF7F2]/50">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-4 h-4 text-[#0D6E6E]" />
                  <span className="text-sm font-semibold text-[#2D2A26]">{group.label}</span>
                  {group.subtotal > 0 && (
                    <span className="ml-auto mr-2 text-xs font-mono font-semibold text-[#0D6E6E] bg-[#0D6E6E]/10 px-2 py-0.5 rounded-full">
                      {formatRM(group.subtotal)}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-2">
                {group.categories.map((cat) => (
                  <ReliefInput key={cat.id} category={cat} />
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </motion.div>
  );
}

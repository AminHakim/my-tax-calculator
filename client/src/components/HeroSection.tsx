/**
 * HeroSection — "Batik Modernism" design
 * Warm teal + gold palette, batik-inspired hero banner
 */
import { motion } from "framer-motion";
import { Calculator, ArrowDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663447009819/huqXytPENSZEcSRLxLGy7g/hero-banner-oGBJCSkRrjLMBWtcAAUXBY.webp";
const ILLUSTRATION = "https://d2xsxph8kpxj0f.cloudfront.net/310519663447009819/huqXytPENSZEcSRLxLGy7g/tax-illustration-96Hy7q6MtsS6ybH38azskg.webp";

export default function HeroSection() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D6E6E]/5 via-transparent to-[#D4A843]/5" />

      <div className="container relative z-10 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D6E6E]/10 text-[#0D6E6E] text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              <span>Year of Assessment 2025</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-[#2D2A26] mb-5">
              Malaysian Income{" "}
              <span className="text-[#0D6E6E]">Tax Calculator</span>
            </h1>

            <p className="text-lg md:text-xl text-[#5A5550] leading-relaxed max-w-xl mb-8">
              Calculate your income tax in minutes. Includes all{" "}
              <span className="font-semibold text-[#0D6E6E]">20+ tax reliefs</span>,
              rebates, and the latest LHDN progressive rates for YA 2025.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D6E6E] text-white font-semibold text-base shadow-lg shadow-[#0D6E6E]/20 hover:bg-[#0B5E5E] transition-all duration-200 hover:shadow-xl hover:shadow-[#0D6E6E]/30 hover:-translate-y-0.5"
              >
                Start Calculating
                <ArrowDown className="w-4 h-4" />
              </button>
              <a
                href="https://mytax.hasil.gov.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#0D6E6E]/20 text-[#0D6E6E] font-semibold text-base hover:bg-[#0D6E6E]/5 transition-all duration-200"
              >
                File on MyTax
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-10">
              {[
                { value: "0%–30%", label: "Progressive Rates" },
                { value: "20+", label: "Tax Reliefs" },
                { value: "YA 2025", label: "Latest Rates" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg font-bold text-[#0D6E6E] font-mono">{stat.value}</div>
                  <div className="text-xs text-[#8A8580] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#0D6E6E]/10 to-[#D4A843]/10 rounded-3xl blur-2xl" />
              <img
                src={ILLUSTRATION}
                alt="Tax calculation illustration"
                className="relative w-full max-w-md rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Batik divider */}
      <div className="h-3 bg-gradient-to-r from-[#0D6E6E] via-[#D4A843] to-[#0D6E6E] opacity-60" />
    </section>
  );
}

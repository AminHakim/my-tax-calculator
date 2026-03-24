/**
 * Home Page — Malaysian Income Tax Calculator
 * Design: "Batik Modernism" — warm teal + gold, Malaysian heritage
 *
 * Layout: Hero → Calculator (2-column: inputs left, results right) → Rate Table → Footer
 */
import { TaxProvider } from "@/contexts/TaxContext";
import HeroSection from "@/components/HeroSection";
import IncomeInput from "@/components/IncomeInput";
import ReliefSection from "@/components/ReliefSection";
import ResultsPanel from "@/components/ResultsPanel";
import TaxRateTable from "@/components/TaxRateTable";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <TaxProvider>
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* Hero */}
        <HeroSection />

        {/* Calculator Section */}
        <section id="calculator" className="container py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8">
            {/* Left: Inputs */}
            <div className="space-y-6">
              <IncomeInput />
              <ReliefSection />
              <TaxRateTable />
            </div>

            {/* Right: Results (sticky) */}
            <div>
              <ResultsPanel />
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </TaxProvider>
  );
}

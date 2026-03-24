/**
 * Footer — "Batik Modernism" design
 */
import { ExternalLink } from "lucide-react";

const PATTERN_DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663447009819/huqXytPENSZEcSRLxLGy7g/pattern-divider-GrCWUc6rTLtHMgRVttnsns.webp";

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* Batik divider */}
      <div
        className="h-12 opacity-30"
        style={{
          backgroundImage: `url(${PATTERN_DIVIDER})`,
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
        }}
      />

      <div className="bg-[#2D2A26] text-[#B0AAA0]">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">MyTax Calculator</h3>
              <p className="text-sm leading-relaxed">
                A free tool to estimate your Malaysian income tax for Year of Assessment 2025.
                Based on the latest LHDN progressive tax rates and relief schedules.
              </p>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Official Resources</h4>
              <ul className="space-y-2">
                {[
                  { label: "LHDN Official Website", url: "https://www.hasil.gov.my/" },
                  { label: "MyTax e-Filing Portal", url: "https://mytax.hasil.gov.my/" },
                  { label: "Tax Reliefs (LHDN)", url: "https://www.hasil.gov.my/en/individual/individual-life-cycle/income-declaration/tax-reliefs/" },
                  { label: "Tax Rates (LHDN)", url: "https://www.hasil.gov.my/en/individual/individual-life-cycle/income-declaration/tax-rate/" },
                ].map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-[#D4A843] transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Disclaimer</h4>
              <p className="text-xs leading-relaxed">
                This calculator is for estimation purposes only and does not constitute tax advice.
                Tax rates and reliefs are based on publicly available LHDN data for YA 2025.
                Always consult a qualified tax professional or refer to the official LHDN portal
                for your actual tax filing.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} MyTax Calculator Malaysia. For estimation purposes only.
            </p>
            <p className="text-xs">
              Filing deadline: <span className="text-[#D4A843] font-medium">30 April 2026</span> (non-business income)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

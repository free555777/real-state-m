import React from 'react';
import { Building2, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onOpenEmiCalculator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity, onOpenEmiCalculator }) => {
  return (
    <footer className="bg-white border-t border-[#e5e7eb] pt-12 pb-8 text-xs text-[#434343]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#e5e7eb]">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5e23dc] flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-[#191919] tracking-tight">
                PropTech<span className="text-[#5e23dc]">Horizon</span>
              </span>
            </div>
            <p className="text-xs text-[#6b7280] leading-relaxed max-w-sm">
              PropTech Horizon is India's next-generation residential and commercial real estate discovery platform. Committed to radical transparency, verified RERA legal compliance, and zero fake listings.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#006f61] bg-[#00bda6]/10 p-2.5 rounded-xl border border-[#00bda6]/20">
              <ShieldCheck className="w-4 h-4 text-[#00bda6] shrink-0" />
              <span>Compliant with Real Estate (Regulation & Development) Act, 2016</span>
            </div>
          </div>

          {/* Top Metros */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#191919] uppercase tracking-wider text-[11px]">
              Metros & Cities
            </h4>
            <ul className="space-y-2">
              {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad'].map((city) => (
                <li key={city}>
                  <button
                    onClick={() => onSelectCity(city)}
                    className="text-[#434343] hover:text-[#5e23dc] transition-colors cursor-pointer"
                  >
                    Properties in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PropTech Tools & Calculators */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#191919] uppercase tracking-wider text-[11px]">
              Calculators & Advisory
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenEmiCalculator}
                  className="text-[#434343] hover:text-[#5e23dc] transition-colors cursor-pointer"
                >
                  Home Loan EMI Calculator
                </button>
              </li>
              <li>
                <span className="text-[#6b7280]">Stamp Duty & Registration Guide</span>
              </li>
              <li>
                <span className="text-[#6b7280]">Carpet Area vs Super Built-up</span>
              </li>
              <li>
                <span className="text-[#6b7280]">RERA Verification Check</span>
              </li>
              <li>
                <span className="text-[#6b7280]">NRI Investment Regulations</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#191919] uppercase tracking-wider text-[11px]">
              Buyer Helpline
            </h4>
            <div className="space-y-2 text-xs text-[#6b7280]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#5e23dc]" />
                <span className="text-[#191919] font-bold">1800-419-7890 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5e23dc]" />
                <span>support@proptechhorizon.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#5e23dc]" />
                <span>BKC Bandra, Mumbai 400051</span>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#6b7280]">
          <p className="max-w-3xl">
            Disclaimer: PropTech Horizon is an online discovery facilitator. Real estate projects displayed are subject to respective state RERA authorities (MahaRERA, HRERA, TSRERA, Karnataka RERA). Verify all details directly with registered developers before any financial transaction.
          </p>
          <div className="whitespace-nowrap font-semibold">
            © {new Date().getFullYear()} PropTech Horizon India. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

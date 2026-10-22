import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  Percent, 
  Clock, 
  TrendingUp, 
  Building 
} from 'lucide-react';
import { calculateEMI, formatIndianPrice } from '../utils/propTechMath';

interface EMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EMICalculatorModal: React.FC<EMICalculatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [principal, setPrincipal] = useState(7500000); // ₹75 Lakh default
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const emiResult = calculateEMI(principal, interestRate, tenureYears);

  const principalRatio = emiResult.totalAmountPayable > 0 
    ? (emiResult.principalAmount / emiResult.totalAmountPayable) * 100 
    : 50;
  const interestRatio = 100 - principalRatio;

  const bankRates = [
    { name: 'State Bank of India (SBI)', rate: '8.40% - 9.05%', minEmi: '₹8,615 / L', tenure: 'Up to 30 yrs' },
    { name: 'HDFC Bank Home Loans', rate: '8.60% - 9.20%', minEmi: '₹8,737 / L', tenure: 'Up to 30 yrs' },
    { name: 'ICICI Bank', rate: '8.65% - 9.35%', minEmi: '₹8,768 / L', tenure: 'Up to 30 yrs' },
    { name: 'Axis Bank Home Loans', rate: '8.75% - 9.40%', minEmi: '₹8,837 / L', tenure: 'Up to 30 yrs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl border border-[#e5e7eb] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f3f0fc] text-[#5e23dc] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#191919]">
                Live Home Loan EMI & Affordability Hub
              </h2>
              <p className="text-xs text-[#6b7280]">
                Accurate mathematical monthly repayment planner based on Indian banking benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f2f3f8] text-[#6b7280] hover:text-[#191919] transition-colors cursor-pointer"
            aria-label="Close EMI calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6 bg-[#f8f9fd] p-5 sm:p-6 rounded-2xl border border-[#e5e7eb]">
              
              {/* Principal */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-[#434343]">Loan Amount (Principal)</span>
                  <span className="text-[#5e23dc] text-base font-extrabold">{formatIndianPrice(principal, 'Buy')}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={100000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full cursor-pointer h-2 bg-[#e5e7eb] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#6b7280] mt-1 font-medium">
                  <span>₹5 Lakh</span>
                  <span>₹2.5 Cr</span>
                  <span>₹5 Cr+</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-[#434343]">Annual Interest Rate</span>
                  <span className="text-[#5e23dc] text-base font-extrabold">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={6.5}
                  max={13}
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full cursor-pointer h-2 bg-[#e5e7eb] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#6b7280] mt-1 font-medium">
                  <span>6.5% (Special Scheme)</span>
                  <span>8.5% (Market Benchmark)</span>
                  <span>13%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-[#434343]">Loan Duration (Tenure)</span>
                  <span className="text-[#5e23dc] text-base font-extrabold">{tenureYears} Years ({tenureYears * 12} Months)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full cursor-pointer h-2 bg-[#e5e7eb] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#6b7280] mt-1 font-medium">
                  <span>1 Year</span>
                  <span>15 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

            </div>

            {/* Monthly EMI Result Card (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-[#5e23dc]/25 shadow-lg flex flex-col justify-between text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                Your Monthly EMI
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5e23dc] tracking-tight">
                ₹{emiResult.monthlyEMI.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-semibold text-[#6b7280]">/ month</span>
              </div>

              {/* Visual Breakdown bar */}
              <div className="space-y-2 pt-2">
                <div className="h-3.5 w-full bg-[#f2f3f8] rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${principalRatio}%` }}
                    className="bg-[#5e23dc]" 
                  />
                  <div 
                    style={{ width: `${interestRatio}%` }}
                    className="bg-[#00bda6]" 
                  />
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#5e23dc] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5e23dc]" /> Principal ({principalRatio.toFixed(0)}%)
                  </span>
                  <span className="text-[#00bda6] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00bda6]" /> Interest ({interestRatio.toFixed(0)}%)
                  </span>
                </div>
              </div>

              {/* Numbers Summary */}
              <div className="pt-3 border-t border-[#e5e7eb] space-y-1.5 text-xs text-left">
                <div className="flex justify-between text-[#434343]">
                  <span>Principal Loan Amount:</span>
                  <span className="font-bold text-[#191919]">{formatIndianPrice(emiResult.principalAmount, 'Buy')}</span>
                </div>
                <div className="flex justify-between text-[#434343]">
                  <span>Total Interest Payable:</span>
                  <span className="font-bold text-[#191919]">{formatIndianPrice(emiResult.totalInterest, 'Buy')}</span>
                </div>
                <div className="flex justify-between text-[#191919] font-extrabold pt-1 border-t border-[#e5e7eb]/60">
                  <span>Total Amount Payable:</span>
                  <span className="text-[#5e23dc]">{formatIndianPrice(emiResult.totalAmountPayable, 'Buy')}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#10b981]/10 text-[#006f61] text-xs font-bold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>Zero Hidden Fees Guarantee</span>
              </div>
            </div>

          </div>

          {/* Current Bank Partner Comparison Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#191919] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#5e23dc]" />
                <span>Top Indian Banks Home Loan Rates (March 2026)</span>
              </h3>
              <span className="text-xs text-[#6b7280]">Updated Daily</span>
            </div>

            <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8f9fd] text-[#6b7280] font-bold uppercase tracking-wider border-b border-[#e5e7eb]">
                  <tr>
                    <th className="p-3">Bank / Institution</th>
                    <th className="p-3">Interest Rate Range</th>
                    <th className="p-3">EMI per ₹1 Lakh (20 yrs)</th>
                    <th className="p-3">Max Tenure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {bankRates.map((bank, i) => (
                    <tr key={i} className="hover:bg-[#f8f9fd] transition-colors">
                      <td className="p-3 font-bold text-[#191919]">{bank.name}</td>
                      <td className="p-3 font-semibold text-[#5e23dc]">{bank.rate}</td>
                      <td className="p-3 font-semibold text-[#191919]">{bank.minEmi}</td>
                      <td className="p-3 text-[#6b7280]">{bank.tenure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 py-3 border-t border-[#e5e7eb] bg-[#f8f9fd] flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">
            *Calculations are for illustrative planning purposes. Final ROI depends on CIBIL score.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#5e23dc] hover:bg-[#4d1cb8] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

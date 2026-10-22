import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Heart, 
  PlusCircle, 
  Calculator, 
  PhoneCall, 
  ChevronDown, 
  Search,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { PropertyIntent } from '../types/property';

interface HeaderProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  activeIntent: PropertyIntent;
  onSelectIntent: (intent: PropertyIntent) => void;
  shortlistCount: number;
  onOpenShortlist: () => void;
  onOpenEmiCalculator: () => void;
  onOpenPostProperty: () => void;
}

const METRO_CITIES = [
  'All Cities',
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  activeIntent,
  onSelectIntent,
  shortlistCount,
  onOpenShortlist,
  onOpenEmiCalculator,
  onOpenPostProperty,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] transition-all">
      {/* Top micro-bar */}
      <div className="bg-[#5e23dc] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-[#66f6dd]" /> RERA Registered Hub
            </span>
            <span>100% Verified Indian Residential & Commercial Properties</span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <button 
              onClick={onOpenEmiCalculator}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-[#66f6dd]" /> Live EMI Estimator
            </button>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#66f6dd]" /> Buyer Helpline: 1800-419-7890
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectIntent('Buy'); }}
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#4500b4] via-[#5e23dc] to-[#6934e7] flex items-center justify-center text-white shadow-md shadow-[#5e23dc]/25 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-base sm:text-xl text-[#191919] tracking-tight">
                    PropTech<span className="text-[#5e23dc]">Horizon</span>
                  </span>
                </div>
                <p className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-[#6b7280]">
                  Verified India Real Estate
                </p>
              </div>
            </a>

            {/* City Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-[#e5e7eb] bg-white hover:border-[#5e23dc] text-xs sm:text-sm font-semibold text-[#191919] transition-colors cursor-pointer"
                aria-expanded={cityDropdownOpen}
                aria-label="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-[#5e23dc] shrink-0" />
                <span className="truncate max-w-[75px] sm:max-w-none">{currentCity}</span>
                <ChevronDown className="w-3 h-3 text-[#6b7280]" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white border border-[#e5e7eb] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                    Select Metro
                  </div>
                  {METRO_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        currentCity === city
                          ? 'bg-[#f3f0fc] text-[#5e23dc] font-semibold'
                          : 'text-[#434343] hover:bg-[#f8f9fd] hover:text-[#191919]'
                      }`}
                    >
                      <span>{city}</span>
                      {currentCity === city && (
                        <span className="w-2 h-2 rounded-full bg-[#5e23dc]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {(['Buy', 'Rent', 'Commercial', 'Plots'] as PropertyIntent[]).map((intent) => {
              const active = activeIntent === intent;
              return (
                <button
                  key={intent}
                  onClick={() => onSelectIntent(intent)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'text-[#5e23dc] bg-[#f3f0fc]'
                      : 'text-[#434343] hover:text-[#191919] hover:bg-[#f8f9fd]'
                  }`}
                >
                  {intent}
                </button>
              );
            })}
            <button
              onClick={onOpenEmiCalculator}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#434343] hover:text-[#5e23dc] hover:bg-[#f3f0fc] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#5e23dc]" />
              <span>EMI Hub</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Shortlist Heart Button */}
            <button
              onClick={onOpenShortlist}
              className="relative p-2.5 rounded-xl border border-[#e5e7eb] hover:border-[#5e23dc] text-[#434343] hover:text-[#5e23dc] transition-colors cursor-pointer"
              title="View Shortlisted Properties"
              aria-label="View Shortlisted Properties"
            >
              <Heart className={`w-5 h-5 ${shortlistCount > 0 ? 'text-[#f43f5e] fill-[#f43f5e]' : ''}`} />
              {shortlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#f43f5e] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Post Property Free Button */}
            <button
              onClick={onOpenPostProperty}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#5e23dc] hover:bg-[#4d1cb8] text-white text-sm font-semibold shadow-md shadow-[#5e23dc]/25 hover:shadow-lg hover:shadow-[#5e23dc]/35 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#66f6dd]" />
              <span>Post Property <span className="bg-[#66f6dd] text-[#006f61] text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold ml-1">Free</span></span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#434343] hover:text-[#191919] hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu sheet */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#e5e7eb] space-y-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {(['Buy', 'Rent', 'Commercial', 'Plots'] as PropertyIntent[]).map((intent) => (
                <button
                  key={intent}
                  onClick={() => {
                    onSelectIntent(intent);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg ${
                    activeIntent === intent
                      ? 'bg-[#5e23dc] text-white'
                      : 'bg-white border border-[#e5e7eb] text-[#434343]'
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onOpenEmiCalculator();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-[#434343] hover:bg-[#f3f0fc] hover:text-[#5e23dc] rounded-lg flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#5e23dc]" /> Live EMI Calculator
            </button>

            <button
              onClick={() => {
                onOpenPostProperty();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 rounded-full bg-[#5e23dc] text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#66f6dd]" /> Post Property for Free
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

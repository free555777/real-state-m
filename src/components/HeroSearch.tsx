import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  SlidersHorizontal, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { PropertyIntent, PropertyType } from '../types/property';

interface HeroSearchProps {
  intent: PropertyIntent;
  onChangeIntent: (intent: PropertyIntent) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedTypes: PropertyType[];
  onToggleType: (type: PropertyType) => void;
  selectedBhk: number[];
  onToggleBhk: (bhk: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (min: number, max: number) => void;
  onTriggerSearch: () => void;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'Villa',
  'Penthouse',
  'Builder Floor',
  'Commercial Office',
  'Residential Plot',
];

const POPULAR_LOCALITIES = [
  'Bandra West, Mumbai',
  'Whitefield, Bengaluru',
  'Golf Course Road, Gurgaon',
  'Hitec City, Hyderabad',
  'Koregaon Park, Pune',
  'Worli Sea Face, Mumbai',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  intent,
  onChangeIntent,
  searchQuery,
  onSearchQueryChange,
  selectedTypes,
  onToggleType,
  selectedBhk,
  onToggleBhk,
  priceRange,
  onPriceRangeChange,
  onTriggerSearch,
}) => {
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [bhkDropdownOpen, setBhkDropdownOpen] = useState(false);

  const budgetOptionsBuy = [
    { label: 'Any Budget', min: 0, max: 500000000 },
    { label: 'Under ₹50 Lakh', min: 0, max: 5000000 },
    { label: '₹50 L - ₹1.5 Cr', min: 5000000, max: 15000000 },
    { label: '₹1.5 Cr - ₹3 Cr', min: 15000000, max: 30000000 },
    { label: '₹3 Cr - ₹7 Cr', min: 30000000, max: 70000000 },
    { label: '₹7 Cr+ Ultra Luxury', min: 70000000, max: 500000000 },
  ];

  const budgetOptionsRent = [
    { label: 'Any Rent', min: 0, max: 1000000 },
    { label: 'Under ₹25,000', min: 0, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: '₹50,000 - ₹1 Lakh', min: 50000, max: 100000 },
    { label: '₹1 Lakh+', min: 100000, max: 1000000 },
  ];

  const activeBudgetOptions = intent === 'Rent' ? budgetOptionsRent : budgetOptionsBuy;

  const currentBudgetLabel = () => {
    if (priceRange[0] === 0 && priceRange[1] >= 100000000) return 'Budget: Any';
    const found = activeBudgetOptions.find(b => b.min === priceRange[0] && b.max === priceRange[1]);
    if (found) return found.label;
    return `₹${(priceRange[0] / 100000).toFixed(0)}L - ₹${(priceRange[1] / 100000).toFixed(0)}L`;
  };

  const currentTypeLabel = () => {
    if (selectedTypes.length === 0) return 'All Property Types';
    if (selectedTypes.length === 1) return selectedTypes[0];
    return `${selectedTypes.length} Types Selected`;
  };

  const currentBhkLabel = () => {
    if (selectedBhk.length === 0) return 'BHK: All';
    return `${selectedBhk.map(b => b === 4 ? '4+ BHK' : `${b} BHK`).join(', ')}`;
  };

  return (
    <div className="relative pt-6 pb-8 md:pt-10 md:pb-12 bg-gradient-to-b from-[#f3f0fc]/60 via-[#f8f9fd] to-[#f8f9fd] border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Headings */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f0fc] border border-[#5e23dc]/20 text-[#5e23dc] text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#5e23dc]" /> India's Radically Transparent PropTech
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191919] tracking-tight leading-tight">
            Find Your True Space. <br className="hidden sm:inline" />
            <span className="text-[#5e23dc] bg-clip-text">100% RERA Verified</span> Real Estate.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#6b7280] font-normal">
            Direct owner & verified builder listings across prime Indian metros with transparent pricing, 2D floor plans, and real-time EMI intelligence.
          </p>
        </div>

        {/* Elevated Search Bar Hub (Level 3 Depth) */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl md:rounded-3xl border border-[#e5e7eb] shadow-[0_20px_32px_-8px_rgba(94,35,220,0.14),0_8px_16px_-4px_rgba(25,25,25,0.06)] p-3 md:p-4">
          
          {/* Segment Selector Tabs */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-[#e5e7eb] overflow-x-auto no-scrollbar">
            {(['Buy', 'Rent', 'Commercial', 'Plots'] as PropertyIntent[]).map((tab) => {
              const active = intent === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onChangeIntent(tab)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#5e23dc] text-white shadow-sm shadow-[#5e23dc]/30'
                      : 'bg-transparent text-[#434343] hover:text-[#191919] hover:bg-[#f2f3f8]'
                  }`}
                >
                  {tab === 'Buy' ? 'Buy Home' : tab === 'Rent' ? 'Rent Flat' : tab}
                </button>
              );
            })}
          </div>

          {/* Integrated Search Inputs with Hairline Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 items-center pt-3">
            
            {/* Input 1: Locality / Project Search (Cols 1-4) */}
            <div className="md:col-span-4 relative px-2 md:px-3 py-1">
              <label className="block text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-0.5">
                Location / Project
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5e23dc] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="e.g. Bandra, Whitefield, Golf Course Rd..."
                  className="w-full text-sm font-semibold text-[#191919] placeholder:text-[#6b7280]/60 outline-none bg-transparent"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchQueryChange('')}
                    className="p-1 text-[#6b7280] hover:text-[#191919]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />

            {/* Input 2: Property Type Dropdown (Cols 5-6) */}
            <div className="md:col-span-2 relative px-2 md:px-3 py-1">
              <label className="block text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-0.5">
                Property Type
              </label>
              <button
                type="button"
                onClick={() => {
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setBudgetDropdownOpen(false);
                  setBhkDropdownOpen(false);
                }}
                className="w-full text-left text-sm font-semibold text-[#191919] truncate flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">{currentTypeLabel()}</span>
              </button>

              {typeDropdownOpen && (
                <div className="absolute left-0 mt-3 w-56 bg-white rounded-xl border border-[#e5e7eb] shadow-xl p-3 z-50">
                  <div className="text-xs font-bold text-[#6b7280] uppercase mb-2">Select Types</div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {PROPERTY_TYPES.map((type) => {
                      const isSelected = selectedTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => onToggleType(type)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#f3f0fc] text-[#5e23dc] font-bold'
                              : 'text-[#434343] hover:bg-[#f8f9fd]'
                          }`}
                        >
                          <span>{type}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#5e23dc]" />}
                        </button>
                      );
                    })}
                  </div>
                  {selectedTypes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => selectedTypes.forEach(t => onToggleType(t))}
                      className="mt-2 text-[11px] text-[#5e23dc] font-bold hover:underline block text-center w-full"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Hairline Divider */}
            <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />

            {/* Input 3: Budget Range (Cols 7-8) */}
            <div className="md:col-span-2 relative px-2 md:px-3 py-1">
              <label className="block text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-0.5">
                Budget Range
              </label>
              <button
                type="button"
                onClick={() => {
                  setBudgetDropdownOpen(!budgetDropdownOpen);
                  setTypeDropdownOpen(false);
                  setBhkDropdownOpen(false);
                }}
                className="w-full text-left text-sm font-semibold text-[#191919] truncate flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">{currentBudgetLabel()}</span>
              </button>

              {budgetDropdownOpen && (
                <div className="absolute left-0 mt-3 w-60 bg-white rounded-xl border border-[#e5e7eb] shadow-xl p-2.5 z-50">
                  <div className="text-xs font-bold text-[#6b7280] uppercase mb-2 px-1">Choose Budget</div>
                  <div className="space-y-1">
                    {activeBudgetOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          onPriceRangeChange(opt.min, opt.max);
                          setBudgetDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          priceRange[0] === opt.min && priceRange[1] === opt.max
                            ? 'bg-[#f3f0fc] text-[#5e23dc]'
                            : 'text-[#434343] hover:bg-[#f8f9fd]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {priceRange[0] === opt.min && priceRange[1] === opt.max && (
                          <Check className="w-3.5 h-3.5 text-[#5e23dc]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hairline Divider */}
            <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />

            {/* Input 4: BHK (Cols 9-10) */}
            <div className="md:col-span-2 relative px-2 md:px-3 py-1">
              <label className="block text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-0.5">
                Bedrooms (BHK)
              </label>
              <button
                type="button"
                onClick={() => {
                  setBhkDropdownOpen(!bhkDropdownOpen);
                  setTypeDropdownOpen(false);
                  setBudgetDropdownOpen(false);
                }}
                className="w-full text-left text-sm font-semibold text-[#191919] truncate flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">{currentBhkLabel()}</span>
              </button>

              {bhkDropdownOpen && (
                <div className="absolute left-0 mt-3 w-52 bg-white rounded-xl border border-[#e5e7eb] shadow-xl p-3 z-50">
                  <div className="text-xs font-bold text-[#6b7280] uppercase mb-2">Select BHK</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3, 4].map((bhk) => {
                      const isSelected = selectedBhk.includes(bhk);
                      return (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => onToggleBhk(bhk)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#5e23dc] text-white shadow-sm'
                              : 'bg-white border border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
                          }`}
                        >
                          {bhk === 4 ? '4+ BHK' : `${bhk} BHK`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Search CTA Button (Cols 11-12) */}
            <div className="md:col-span-2 pl-2">
              <button
                type="button"
                onClick={onTriggerSearch}
                className="w-full h-12 rounded-xl bg-[#5e23dc] hover:bg-[#4d1cb8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#5e23dc]/30 hover:shadow-lg hover:shadow-[#5e23dc]/40 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#66f6dd]" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </div>

        {/* Trending Searches Micro-Chips */}
        <div className="max-w-5xl mx-auto mt-4 flex items-center gap-2 flex-wrap justify-center text-xs text-[#6b7280]">
          <span className="font-semibold text-[#191919]">Trending:</span>
          {POPULAR_LOCALITIES.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                onSearchQueryChange(loc.split(',')[0]);
                onTriggerSearch();
              }}
              className="text-[#5e23dc] hover:text-[#4500b4] hover:underline cursor-pointer transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

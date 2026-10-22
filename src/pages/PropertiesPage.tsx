import React, { useState } from 'react';
import { ActivePage } from '../components/HousingHeader';
import { RealisticMap, MapPropertyItem } from '../components/RealisticMap';
import { SiteVisitModal } from '../components/SiteVisitModal';
import { ContactAgentModal } from '../components/ContactAgentModal';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { Property } from '../types/property';

interface PropertiesPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenSiteVisit?: (propertyTitle: string) => void;
  onOpenContactAgent?: (agentName: string) => void;
}

// 6 realistic properties in Bandra & Khar West, Mumbai with real coordinates & images
const PROPERTIES_DATA: MapPropertyItem[] = [
  {
    id: 'godrej-horizon',
    title: 'Godrej Horizon Luxury Tower',
    price: '₹1.85 Cr',
    priceNumeric: 18500000,
    ratePerSqFt: '₹42,000 / sq.ft',
    locality: '14th Road, Khar West, Western Suburbs, Mumbai',
    bhk: '2.5 BHK',
    carpetArea: '1,120 sq.ft',
    possession: 'Dec 2025',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    isReraVerified: true,
    dealBadge: 'Exclusive Deal',
    coordinates: { lat: 19.0702, lng: 72.8365 },
  },
  {
    id: 'rustomjee-paramount',
    title: 'Rustomjee Paramount Signature',
    price: '₹2.40 Cr',
    priceNumeric: 24000000,
    ratePerSqFt: '₹49,200 / sq.ft',
    locality: 'Off Turner Road, Bandra West, Mumbai',
    bhk: '3 BHK Luxe',
    carpetArea: '1,420 sq.ft',
    possession: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    isReraVerified: true,
    dealBadge: 'Vindhya Certified Partner',
    demandBadge: 'High Demand: 4 Visits Today',
    coordinates: { lat: 19.0625, lng: 72.8342 },
  },
  {
    id: 'pali-hill-residence',
    title: 'Boutique Residence Pali Hill',
    price: '₹95 Lac',
    priceNumeric: 9500000,
    ratePerSqFt: '₹16,960 / sq.ft',
    locality: 'Nargis Dutt Road, Pali Hill, Bandra West, Mumbai',
    bhk: '1 BHK Studio',
    carpetArea: '560 sq.ft',
    possession: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    isReraVerified: true,
    dealBadge: 'Direct from Owner',
    coordinates: { lat: 19.0668, lng: 72.8275 },
  },
  {
    id: 'carter-road-seafront',
    title: 'Carter Road Seafront Haven',
    price: '₹3.10 Cr',
    priceNumeric: 31000000,
    ratePerSqFt: '₹52,000 / sq.ft',
    locality: 'Carter Road Promenade, Bandra West, Mumbai',
    bhk: '3.5 BHK',
    carpetArea: '1,650 sq.ft',
    possession: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    isReraVerified: true,
    dealBadge: 'Seafront View',
    coordinates: { lat: 19.0692, lng: 72.8228 },
  },
  {
    id: 'lodha-solitaire',
    title: 'Lodha Solitaire Luxe Penthouse',
    price: '₹4.25 Cr',
    priceNumeric: 42500000,
    ratePerSqFt: '₹58,000 / sq.ft',
    locality: 'Waterfield Road, Bandra West, Mumbai',
    bhk: '4 BHK Luxe',
    carpetArea: '2,100 sq.ft',
    possession: 'Oct 2026',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    isReraVerified: true,
    dealBadge: 'Ultra Luxury Suite',
    coordinates: { lat: 19.0588, lng: 72.8338 },
  },
  {
    id: 'kalpataru-bliss',
    title: 'Kalpataru Bliss Khar Garden Home',
    price: '₹1.45 Cr',
    priceNumeric: 14500000,
    ratePerSqFt: '₹38,500 / sq.ft',
    locality: 'Near Khar Station Road, Khar West, Mumbai',
    bhk: '2 BHK',
    carpetArea: '890 sq.ft',
    possession: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    isReraVerified: true,
    dealBadge: 'Zero Brokerage',
    coordinates: { lat: 19.0718, lng: 72.8392 },
  },
];

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onNavigate,
  onOpenSiteVisit,
  onOpenContactAgent,
}) => {
  // Filter States
  const [selectedBhk, setSelectedBhk] = useState<string[]>(['2 BHK', '3 BHK']);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState('Relevance & RERA Verified');
  const [budgetRange, setBudgetRange] = useState<string>('₹80 L - ₹3.50 Cr');
  const [possessionFilter, setPossessionFilter] = useState<string>('Ready to Move');
  const [furnishingFilter, setFurnishingFilter] = useState<string>('All');
  const [activeAdvertisementTab, setActiveAdvertisementTab] = useState<'all' | 'sale' | 'rent'>('all');
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');

  // Popover Toggles
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [possessionDropdownOpen, setPossessionDropdownOpen] = useState(false);
  const [furnishingDropdownOpen, setFurnishingDropdownOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Map & Card Interactive State
  const [activePropertyId, setActivePropertyId] = useState<string | null>('rustomjee-paramount');
  const [savedCards, setSavedCards] = useState<string[]>(['rustomjee-paramount']);
  const [reportDownloaded, setReportDownloaded] = useState(false);

  // Modals
  const [modalProperty, setModalProperty] = useState<Property | null>(null);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [isContactAgentOpen, setIsContactAgentOpen] = useState(false);

  const toggleBhk = (bhk: string) => {
    setSelectedBhk((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  const toggleSaveCard = (id: string) => {
    setSavedCards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenSiteVisitModal = (title: string) => {
    if (onOpenSiteVisit) {
      onOpenSiteVisit(title);
      return;
    }
    const prop = INITIAL_PROPERTIES[0];
    setModalProperty({ ...prop, title });
    setIsSiteVisitOpen(true);
  };

  const handleOpenContactBuilderModal = (title: string) => {
    if (onOpenContactAgent) {
      onOpenContactAgent(title);
      return;
    }
    const prop = INITIAL_PROPERTIES[0];
    setModalProperty({ ...prop, title });
    setIsContactAgentOpen(true);
  };

  const handleDownloadReport = () => {
    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 4000);
  };

  // Filter properties based on active BHK & verified flags
  const filteredProperties = PROPERTIES_DATA.filter((item) => {
    if (verifiedOnly && !item.isReraVerified) return false;
    if (selectedBhk.length > 0) {
      const match = selectedBhk.some((bhk) => {
        if (bhk === '1 BHK') return item.bhk.includes('1 BHK');
        if (bhk === '2 BHK') return item.bhk.includes('2 BHK') || item.bhk.includes('2.5 BHK');
        if (bhk === '3 BHK') return item.bhk.includes('3 BHK') || item.bhk.includes('3.5 BHK');
        if (bhk === '4+ BHK') return item.bhk.includes('4 BHK');
        return true;
      });
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fcf9f8]">
      
      {/* =========================================================================
          1. REDESIGNED TOP FILTERS & SEARCH REFINEMENT BAR (From Image 1 & 2)
         ========================================================================= */}
      <section className="w-full bg-white shadow-[0_2px_12px_rgba(94,35,220,0.06)] z-20 border-b border-[#e5e7eb] sticky top-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5 flex flex-col gap-2.5 sm:gap-3">
          
          {/* Top Row: Location Tag, Property Count, RERA Certification & Sort By */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {/* Selected Locality Pill Tag */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#f3f0fc] text-[#5e23dc] rounded-full text-xs font-bold border border-purple-100 shadow-2xs">
                <span className="material-symbols-outlined text-sm sm:text-base">location_on</span>
                <span className="truncate max-w-[130px] sm:max-w-none">Bandra & Khar, Mumbai</span>
                <button
                  type="button"
                  aria-label="Clear location filter"
                  className="material-symbols-outlined text-sm cursor-pointer hover:text-[#4500b4] transition-colors ml-0.5"
                >
                  close
                </button>
              </div>

              <span className="text-xs text-[#7a7487] hidden sm:inline">|</span>

              {/* Verified Count */}
              <span className="text-xs text-[#494455] font-medium whitespace-nowrap">
                <strong className="text-[#1c1b1b] font-bold text-xs sm:text-sm">348</strong> verified
              </span>

              {/* 100% RERA Certified Localities Badge - hidden on tiny mobile, shown sm+ */}
              <div className="hidden sm:flex items-center gap-1 text-[#006b5d] bg-[#10b981]/10 px-2.5 py-1 rounded-full text-xs border border-[#10b981]/20 font-bold">
                <span className="material-symbols-outlined text-sm text-[#10b981]">verified</span>
                <span className="text-[10px] uppercase tracking-wider">100% RERA Certified Localities</span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] text-[#7a7487] uppercase tracking-wider font-bold hidden sm:inline">Sort:</span>
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#f6f3f2] hover:bg-[#ede9e8] text-[#1c1b1b] font-semibold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 pr-7 sm:pr-8 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-[#5e23dc] border border-gray-200/80 transition-all shadow-2xs"
                >
                  <option>Relevance & RERA Verified</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Launch</option>
                  <option>Price / Sq.Ft</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1.5 sm:top-2 pointer-events-none text-sm sm:text-base text-[#7a7487]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Filter Controls Strip */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none text-[#1c1b1b] text-xs">
            
            {/* BHK Quick Multi-Select */}
            <div className="flex items-center bg-[#f6f3f2] p-1 rounded-full flex-shrink-0 border border-gray-200/60 shadow-2xs">
              {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhk) => {
                const active = selectedBhk.includes(bhk);
                return (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => toggleBhk(bhk)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer font-semibold ${
                      active
                        ? 'bg-[#5e23dc] text-white shadow-xs'
                        : 'text-[#494455] hover:text-[#1c1b1b] hover:bg-white/60'
                    }`}
                  >
                    {bhk}
                  </button>
                );
              })}
            </div>

            {/* Budget Dropdown / Range */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setBudgetDropdownOpen(!budgetDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f3f0fc] text-[#5e23dc] text-xs font-bold hover:bg-[#e8ddff] transition-colors cursor-pointer border border-purple-200/60 shadow-2xs"
              >
                <span className="material-symbols-outlined text-base">currency_rupee</span>
                <span>{budgetRange}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>

              {budgetDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Budget Range</div>
                  <div className="flex flex-col gap-1 text-xs">
                    {['Under ₹80 L', '₹80 L - ₹1.50 Cr', '₹1.50 Cr - ₹2.50 Cr', '₹80 L - ₹3.50 Cr', '₹3.50 Cr - ₹5.00 Cr', '₹5.00 Cr+'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setBudgetRange(r);
                          setBudgetDropdownOpen(false);
                        }}
                        className={`text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          budgetRange === r ? 'bg-[#5e23dc] text-white font-bold' : 'hover:bg-[#f6f3f2] text-gray-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Status Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setPossessionDropdownOpen(!possessionDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#ede9e8] text-[#494455] hover:text-[#1c1b1b] text-xs font-semibold transition-colors cursor-pointer border border-gray-200/80 shadow-2xs"
              >
                <span>{possessionFilter}</span>
                <span className="material-symbols-outlined text-sm text-[#7a7487]">expand_more</span>
              </button>

              {possessionDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {['Ready to Move', 'Under Construction', 'Possession in 2025', 'All Possession Status'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setPossessionFilter(status);
                        setPossessionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        possessionFilter === status ? 'bg-[#5e23dc] text-white font-bold' : 'hover:bg-[#f6f3f2] text-gray-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Furnishing Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setFurnishingDropdownOpen(!furnishingDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#ede9e8] text-[#494455] hover:text-[#1c1b1b] text-xs font-semibold transition-colors cursor-pointer border border-gray-200/80 shadow-2xs"
              >
                <span>{furnishingFilter === 'All' ? 'Furnishing' : furnishingFilter}</span>
                <span className="material-symbols-outlined text-sm text-[#7a7487]">expand_more</span>
              </button>

              {furnishingDropdownOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {['All', 'Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setFurnishingFilter(f);
                        setFurnishingDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        furnishingFilter === f ? 'bg-[#5e23dc] text-white font-bold' : 'hover:bg-[#f6f3f2] text-gray-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Shield Toggle */}
            <label className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/10 text-[#006b5d] text-xs font-bold cursor-pointer flex-shrink-0 hover:bg-[#10b981]/20 transition-colors border border-[#10b981]/30 shadow-2xs">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#006b5d] rounded cursor-pointer"
              />
              <span className="material-symbols-outlined text-sm text-[#10b981]">verified</span>
              <span>Verified Only</span>
            </label>

            {/* All Filters Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#ede9e8] text-[#1c1b1b] text-xs font-bold transition-colors flex-shrink-0 ml-auto cursor-pointer border border-gray-200/80 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>All Filters (4)</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. MICRO-MARKET SNAPSHOT INTELLIGENCE BANNER (Image 1 design)
         ========================================================================= */}
      <section className="w-full bg-gradient-to-r from-[#e8ddff] via-[#f3f0fc] to-[#f6f3f2] shadow-[0_1px_4px_rgba(0,0,0,0.02)] border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-[#1c1b1b] text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5e23dc] text-xl">analytics</span>
              <span className="font-extrabold text-[#5e23dc]">Micro-Market Snapshot:</span>
              <span>Avg Khar/Bandra Rate: <strong className="font-bold text-[#1c1b1b]">₹48,500/sq.ft</strong></span>
              <span className="inline-flex items-center text-[#10b981] font-bold bg-white px-2 py-0.5 rounded-md shadow-2xs text-[10px] border border-emerald-100">
                <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>+6.8% YoY
              </span>
            </div>
            <div className="hidden xl:flex items-center gap-4 text-[#494455]">
              <span>• Demand Index: <strong className="text-[#006b5d] font-semibold">Very High (9.2/10)</strong></span>
              <span>• Avg Days to Deal: <strong className="font-semibold text-[#1c1b1b]">18 Days</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 text-[#5e23dc] hover:text-[#4500b4] text-xs font-bold transition-colors cursor-pointer bg-white/80 hover:bg-white px-3 py-1 rounded-full border border-purple-200/60 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{reportDownloaded ? '✓ Report Downloaded' : 'Download Khar & Bandra Q1 Report'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN CONTENT: ACTIVE ADVERTISEMENTS & SPLIT REALISTIC MAP (Image 2)
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 flex-1">
        
        {/* Mobile View Toggle: Listings vs Map (Only visible on mobile, lg:hidden) */}
        <div className="lg:hidden flex items-center justify-between p-1.5 mb-3.5 bg-white rounded-2xl border border-gray-200/90 shadow-2xs">
          <div className="flex items-center gap-1 bg-[#f6f3f2] p-1 rounded-xl w-full">
            <button
              type="button"
              onClick={() => setMobileViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mobileViewMode === 'list'
                  ? 'bg-white text-[#1c1b1b] shadow-xs'
                  : 'text-[#7a7487] hover:text-[#1c1b1b]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_list</span>
              <span>Listings ({filteredProperties.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mobileViewMode === 'map'
                  ? 'bg-[#5e23dc] text-white shadow-xs'
                  : 'text-[#7a7487] hover:text-[#1c1b1b]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Outer White Card Container (From Image 2) */}
        <div className="bg-white rounded-2xl sm:rounded-[28px] border border-[#e5e7eb] shadow-xs p-3.5 sm:p-5 md:p-7">
          
          {/* Mobile Map Mode Container */}
          {mobileViewMode === 'map' && (
            <div className="block lg:hidden mb-6">
              <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
                <RealisticMap
                  properties={filteredProperties}
                  activePropertyId={activePropertyId}
                  onSelectProperty={(id) => setActivePropertyId(id)}
                  onNavigateProduct={() => onNavigate('product')}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
            
            {/* LEFT COLUMN: ACTIVE ADVERTISEMENTS & 2-COLUMN PROPERTY GRID (User: 2-2 properties) */}
            <div className={`lg:col-span-7 flex flex-col gap-5 sm:gap-6 ${mobileViewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
              
              {/* Active Advertisements Header (Exactly as Image 2) */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#1c1b1b] tracking-tight">
                      Active Advertisements
                    </h1>
                    <p className="text-xs sm:text-[13px] text-[#7a7487] mt-1 max-w-xl leading-relaxed">
                      Advertisements are selected according to your needs. The price for accommodation may change during the day, the final price will be shown when booking.
                    </p>
                  </div>

                  {/* Image 2 Right Sort Button */}
                  <div className="relative inline-block flex-shrink-0">
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-[#f6f3f2] transition-colors cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm text-gray-500">sort</span>
                      <span>Sort by</span>
                      <span className="material-symbols-outlined text-sm text-gray-500">expand_more</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs (All 348, Sale 214, Long-term rent 134) */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveAdvertisementTab('all')}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeAdvertisementTab === 'all'
                        ? 'bg-[#1c1b1b] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All <span className="text-[11px] opacity-75">348</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdvertisementTab('sale')}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeAdvertisementTab === 'sale'
                        ? 'bg-[#1c1b1b] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sale <span className="text-[11px] text-gray-500">214</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdvertisementTab('rent')}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeAdvertisementTab === 'rent'
                        ? 'bg-[#1c1b1b] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Long-term rent <span className="text-[11px] text-gray-500">134</span>
                  </button>
                </div>
              </div>

              {/* 2-COLUMN PROPERTY GRID (User: "website me 2-2 properties show ho") */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4.5">
                {filteredProperties.map((property) => {
                  const isSaved = savedCards.includes(property.id);
                  const isCardActive = activePropertyId === property.id;

                  return (
                    <article
                      key={property.id}
                      onMouseEnter={() => setActivePropertyId(property.id)}
                      className={`bg-white rounded-2xl sm:rounded-[22px] overflow-hidden border transition-all duration-300 group flex flex-col justify-between shadow-2xs hover:shadow-xl ${
                        isCardActive
                          ? 'border-[#5e23dc] ring-2 ring-[#5e23dc]/30 shadow-lg'
                          : 'border-gray-200/90 hover:border-[#5e23dc]/40'
                      }`}
                    >
                      {/* Top: Tall Photographic Zone (Image 2 style) */}
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-100">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                          {property.isReraVerified && (
                            <span className="bg-[#10b981] text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs uppercase font-extrabold tracking-wide">
                              <span className="material-symbols-outlined text-xs">verified</span> RERA Verified
                            </span>
                          )}
                          {property.dealBadge && (
                            <span className="bg-[#5e23dc] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                              {property.dealBadge}
                            </span>
                          )}
                        </div>

                        {/* Top Right Heart Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveCard(property.id);
                          }}
                          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer z-10 ${
                            isSaved ? 'text-[#aa0032]' : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-base ${isSaved ? 'font-bold' : ''}`}>
                            favorite
                          </span>
                        </button>

                        {/* High Demand Floating Banner if present */}
                        {property.demandBadge && (
                          <div className="absolute top-10 right-2.5 bg-[#4500b4] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 z-10">
                            <span className="material-symbols-outlined text-xs text-[#f59e0b]">local_fire_department</span>
                            <span>High Demand</span>
                          </div>
                        )}

                        {/* Bottom Right Photo Indicator */}
                        <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 font-semibold z-10">
                          <span className="material-symbols-outlined text-xs">photo_camera</span> 18
                        </span>
                      </div>

                      {/* Bottom Info Section (Matching Image 2 Card Design) */}
                      <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                        
                        {/* Title and Top-Right Circular Arrow Button */}
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            onClick={() => onNavigate('product')}
                            className="text-[15px] font-bold text-[#1c1b1b] group-hover:text-[#5e23dc] transition-colors cursor-pointer line-clamp-1 leading-snug"
                          >
                            {property.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onNavigate('product')}
                            aria-label={`View details of ${property.title}`}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-[#5e23dc] group-hover:text-white group-hover:border-[#5e23dc] transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">north_east</span>
                          </button>
                        </div>

                        {/* Locality Subtitle */}
                        <p className="text-xs text-[#7a7487] flex items-center gap-1 line-clamp-1 -mt-1">
                          <span className="material-symbols-outlined text-xs text-[#5e23dc]">explore</span>
                          <span>{property.locality}</span>
                        </p>

                        {/* Specs Line with Clean Dividers (Image 2 style: 4 bedrooms | 2 bathrooms | 190 sqft) */}
                        <div className="flex items-center gap-2 text-xs text-[#494455] font-semibold py-1 border-y border-gray-100">
                          <span>{property.bhk}</span>
                          <span className="text-gray-300">|</span>
                          <span>2 Baths</span>
                          <span className="text-gray-300">|</span>
                          <span>{property.carpetArea}</span>
                        </div>

                        {/* Bold Price Display */}
                        <div className="flex items-baseline justify-between pt-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-[#1c1b1b]">{property.price}</span>
                            <span className="text-[11px] text-[#7a7487] font-medium">{property.ratePerSqFt}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#006b5d] bg-[#10b981]/10 px-2 py-0.5 rounded-md">
                            {property.possession}
                          </span>
                        </div>

                        {/* Quick CTA Buttons */}
                        <div className="flex items-center gap-2 pt-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenSiteVisitModal(property.title)}
                            className="flex-1 py-2 sm:py-2 px-2.5 rounded-xl bg-[#5e23dc] hover:bg-[#4500b4] text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[40px] sm:min-h-0"
                          >
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                            <span>Site Visit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenContactBuilderModal(property.title)}
                            className="py-2 sm:py-2 px-3 rounded-xl bg-[#f3f0fc] hover:bg-[#e8ddff] text-[#5e23dc] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-purple-100 min-h-[40px] sm:min-h-0"
                          >
                            <span className="material-symbols-outlined text-sm">call</span>
                            <span>Contact</span>
                          </button>
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Housing Edge PropTech Ad Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#5e23dc] to-[#4500b4] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#69f9e0] text-2xl">account_balance</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Vindhya Edge: Pre-Approved Home Loan @ 8.35%</h4>
                    <p className="text-xs text-[#cfbfff]">Instant online sanction with zero processing fee for Bandra & Khar.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('product')}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-[#69f9e0] text-[#00201b] text-xs font-bold hover:bg-[#46dcc4] transition-colors flex-shrink-0 cursor-pointer shadow-xs text-center"
                >
                  Check Rate
                </button>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-3 pb-2 text-xs font-semibold flex-wrap gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white text-[#7a7487] hover:text-[#1c1b1b] transition-colors border border-[#e5e7eb] cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  <span>Previous</span>
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-xl bg-[#5e23dc] text-white font-bold">1</button>
                  <button className="w-8 h-8 rounded-xl hover:bg-[#f6f3f2] text-[#1c1b1b]">2</button>
                  <button className="w-8 h-8 rounded-xl hover:bg-[#f6f3f2] text-[#1c1b1b] hidden sm:block">3</button>
                  <span className="px-1.5 sm:px-2 text-[#7a7487]">...</span>
                  <button className="w-8 h-8 rounded-xl hover:bg-[#f6f3f2] text-[#1c1b1b]">24</button>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white text-[#5e23dc] transition-colors hover:bg-[#f3f0fc] border border-purple-200 cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: STICKY REALISTIC MAP PANEL (Image 1 & Image 2) */}
            <div className="hidden lg:flex lg:col-span-5 sticky top-36 flex-col gap-3">
              <RealisticMap
                properties={filteredProperties}
                activePropertyId={activePropertyId}
                onSelectProperty={(id) => setActivePropertyId(id)}
                onNavigateProduct={() => onNavigate('product')}
              />
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. ALL FILTERS MODAL (Deep Refinement)
         ========================================================================= */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-3.5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5e23dc] text-lg sm:text-xl">tune</span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">All Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-5 text-xs text-gray-800">
              {/* Locality */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Locality</label>
                <input
                  type="text"
                  defaultValue="Bandra & Khar West, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-[#5e23dc] outline-none"
                />
              </div>

              {/* BHK */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Bedrooms</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhk) => {
                    const active = selectedBhk.includes(bhk);
                    return (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => toggleBhk(bhk)}
                        className={`py-2 text-center rounded-xl font-bold cursor-pointer transition-all ${
                          active ? 'bg-[#5e23dc] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {bhk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Amenities</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Swimming Pool', 'Clubhouse / Gym', 'Covered Car Parking', '24/7 Security & Concierge', 'EV Charging Station', 'Sea-Facing Balcony'].map((a) => (
                    <label key={a} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-purple-50 hover:border-purple-200 transition-colors">
                      <input type="checkbox" defaultChecked className="accent-[#5e23dc]" />
                      <span className="font-semibold text-gray-700">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedBhk(['2 BHK', '3 BHK']);
                  setVerifiedOnly(true);
                  setIsFilterModalOpen(false);
                }}
                className="text-xs font-bold text-gray-600 hover:text-black cursor-pointer px-2 py-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 sm:px-6 py-2.5 sm:py-2 rounded-xl bg-[#5e23dc] hover:bg-[#4500b4] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Apply (348 Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Visit Modal */}
      {isSiteVisitOpen && (
        <SiteVisitModal
          property={modalProperty}
          onClose={() => setIsSiteVisitOpen(false)}
        />
      )}

      {/* Contact Agent Modal */}
      {isContactAgentOpen && (
        <ContactAgentModal
          property={modalProperty}
          onClose={() => setIsContactAgentOpen(false)}
        />
      )}

    </div>
  );
};

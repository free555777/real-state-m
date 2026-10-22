import React, { useState } from 'react';
import { ActivePage } from '../components/HousingHeader';

interface PostPropertyPageProps {
  onNavigate: (page: ActivePage) => void;
  onListingPublished?: (propertyData: any) => void;
}

export const PostPropertyPage: React.FC<PostPropertyPageProps> = ({
  onNavigate,
  onListingPublished,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [intent, setIntent] = useState<'sell' | 'rent'>('sell');
  const [category, setCategory] = useState('Apartment');
  const [bhk, setBhk] = useState('3 BHK');
  const [baths, setBaths] = useState('2');
  const [balconies, setBalconies] = useState('2');
  const [carpetArea, setCarpetArea] = useState('1380');
  const [superArea, setSuperArea] = useState('1650');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [facing, setFacing] = useState('East (Vastu Compliant)');
  const [price, setPrice] = useState('1,85,00,000');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [includeParking, setIncludeParking] = useState(false);
  const [possession, setPossession] = useState<'ready' | 'construction'>('ready');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper to format spoken verbal text from numeric string
  const formatPriceWord = (val: string) => {
    const cleanNum = Number(val.replace(/,/g, ''));
    if (isNaN(cleanNum) || cleanNum <= 0) return 'Enter a valid amount';
    if (cleanNum >= 10000000) {
      const cr = (cleanNum / 10000000).toFixed(2);
      return `Expected Listing: ₹${cr} Cr`;
    }
    if (cleanNum >= 100000) {
      const l = (cleanNum / 100000).toFixed(2);
      return `Expected Listing: ₹${l} Lakhs`;
    }
    return `Expected Listing: ₹${cleanNum.toLocaleString('en-IN')}`;
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsSubmitted(true);
      onListingPublished?.({
        title: `${bhk} Ultra Luxury ${category}`,
        price: `₹${price}`,
        locality: 'Bandra West, Mumbai',
      });
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#fcf9f8]">
      
      {/* 1. Owner Portal Hero Banner */}
      <section className="relative w-full text-white overflow-hidden shadow-md py-10 sm:py-14 lg:py-18 flex items-center min-h-[320px] md:min-h-[380px]">
        {/* Background Image: Luxury Towers with Poolside Gardens (clearly visible) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/Luxury_Towers_with_Poolside_Gardens_4948e954.png"
            alt="Luxury Towers with Poolside Gardens"
            className="w-full h-full object-cover object-[75%_center] sm:object-center"
          />
          {/* Light, translucent gradient to ensure image is vividly visible while text is clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:from-black/65 sm:via-black/20 sm:to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="max-w-2xl flex flex-col gap-3 sm:gap-4">
            
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Sell or Rent Your Property for FREE in 3 Simple Steps
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-white/95 max-w-xl leading-relaxed drop-shadow-sm font-medium">
              List directly without paying commission. Get contacted by <strong className="text-[#69f9e0] font-bold">10x more verified buyers</strong>, backed by instant automated valuation and priority search placement.
            </p>

          </div>
        </div>
      </section>

      {/* 2. Multi-Step Stepper Header */}
      <section className="w-full bg-white shadow-sm sticky top-16 z-40 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5">
          
          {/* Mobile Compact Progress Bar */}
          <div className="block sm:hidden w-full">
            <div className="flex items-center justify-between text-xs font-bold text-[#1c1b1b] mb-1.5">
              <span className="text-[#5e23dc] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                Step {currentStep} of 4
              </span>
              <span className="text-gray-700">
                {currentStep === 1 && 'Property Details'}
                {currentStep === 2 && 'Location & Address'}
                {currentStep === 3 && 'Pricing & Terms'}
                {currentStep === 4 && 'Photos & Amenities'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5e23dc] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Stepper */}
          <div className="hidden sm:flex items-center justify-between gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {/* Step 1 */}
            <div 
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep === 1
                  ? 'bg-[#5e23dc] text-white shadow-md'
                  : 'bg-[#f3f0fc] text-[#4500b4]'
              }`}>
                1
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${currentStep === 1 ? 'text-[#4500b4]' : 'text-[#1c1b1b]'}`}>
                  Property Details
                </span>
                <span className="text-[10px] text-[#7a7487]">Configuration & Area</span>
              </div>
            </div>

            <div className="flex-1 h-0.5 bg-[#e5e7eb] mx-3 max-w-[80px]" />

            {/* Step 2 */}
            <div 
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-3 flex-shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 2 ? 'bg-[#5e23dc] text-white shadow-md' : 'bg-[#eae7e7] text-[#494455]'
              }`}>
                2
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-[#4500b4] font-bold' : 'text-[#1c1b1b]'}`}>
                  Location & Address
                </span>
                <span className="text-[10px] text-[#7a7487]">City, Locality, Society</span>
              </div>
            </div>

            <div className="flex-1 h-0.5 bg-[#e5e7eb] mx-3 max-w-[80px]" />

            {/* Step 3 */}
            <div 
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-3 flex-shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 3 ? 'bg-[#5e23dc] text-white shadow-md' : 'bg-[#eae7e7] text-[#494455]'
              }`}>
                3
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${currentStep === 3 ? 'text-[#4500b4] font-bold' : 'text-[#1c1b1b]'}`}>
                  Pricing & Terms
                </span>
                <span className="text-[10px] text-[#7a7487]">Expected Cost & Deposit</span>
              </div>
            </div>

            <div className="flex-1 h-0.5 bg-[#e5e7eb] mx-3 max-w-[80px]" />

            {/* Step 4 */}
            <div 
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-3 flex-shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 4 ? 'bg-[#5e23dc] text-white shadow-md' : 'bg-[#eae7e7] text-[#494455]'
              }`}>
                4
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${currentStep === 4 ? 'text-[#4500b4] font-bold' : 'text-[#1c1b1b]'}`}>
                  Photos & Amenities
                </span>
                <span className="text-[10px] text-[#7a7487]">Gallery & Features</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Grid */}
      <section className="w-full bg-[#f8f9fd] px-4 sm:px-6 lg:px-12 pt-6 pb-12 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Interactive Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {isSubmitted ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e5e7eb] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1c1b1b]">Property Listed Successfully!</h2>
                  <p className="text-sm text-[#494455] max-w-md mx-auto">
                    Your listing is now live on Vindhya Reality. 10x more verified buyers will be able to review your property directly.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => onNavigate('search')}
                      className="px-6 py-2.5 rounded-full bg-[#5e23dc] text-white font-bold text-xs hover:bg-[#4500b4] transition-colors cursor-pointer"
                    >
                      View in Property Feed
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 rounded-full bg-[#f6f3f2] text-[#1c1b1b] font-semibold text-xs hover:bg-[#f0eded] transition-colors cursor-pointer"
                    >
                      Edit Listing
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Card 1: Intent & Category */}
                  <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm border border-[#e5e7eb] flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e23dc]">Step {currentStep} of 4</span>
                      <h2 className="text-lg font-bold text-[#1c1b1b]">What type of listing are you posting?</h2>
                    </div>

                    {/* Sell vs Rent Toggle */}
                    <div>
                      <label className="block text-xs text-[#494455] mb-2 font-medium">I want to</label>
                      <div className="grid grid-cols-2 gap-3 p-1 bg-[#f2f3f8] rounded-xl max-w-md text-xs">
                        <button
                          type="button"
                          onClick={() => setIntent('sell')}
                          className={`py-2.5 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            intent === 'sell'
                              ? 'bg-[#5e23dc] text-white shadow-sm'
                              : 'text-[#494455] hover:text-[#1c1b1b]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">real_estate_agent</span>
                          <span>Sell Property</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIntent('rent')}
                          className={`py-2.5 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            intent === 'rent'
                              ? 'bg-[#5e23dc] text-white shadow-sm'
                              : 'text-[#494455] hover:text-[#1c1b1b]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">key</span>
                          <span>Rent / Lease Out</span>
                        </button>
                      </div>
                    </div>

                    {/* Property Category Selection */}
                    <div>
                      <label className="block text-xs text-[#494455] mb-2.5 font-medium">Property Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'Apartment', label: 'Apartment / Flat', icon: 'apartment' },
                          { id: 'Independent House', label: 'Villa / House', icon: 'home_work' },
                          { id: 'Plot', label: 'Plot / Land', icon: 'landscape' },
                          { id: 'Commercial', label: 'Commercial', icon: 'domain' },
                        ].map((cat) => {
                          const active = category === cat.id;
                          return (
                            <div
                              key={cat.id}
                              onClick={() => setCategory(cat.id)}
                              className={`p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                                active
                                  ? 'bg-[#f3f0fc] border-2 border-[#5e23dc] shadow-sm'
                                  : 'bg-[#f6f3f2] hover:bg-[#f0eded] border-2 border-transparent'
                              }`}
                            >
                              <span className={`material-symbols-outlined text-2xl ${active ? 'text-[#4500b4]' : 'text-[#7a7487]'}`}>
                                {cat.icon}
                              </span>
                              <span className={`text-xs ${active ? 'font-bold text-[#4500b4]' : 'font-medium text-[#1c1b1b]'}`}>
                                {cat.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Property Configuration & Sizing */}
                  <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm border border-[#e5e7eb] flex flex-col gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#1c1b1b]">Configuration & Floor Details</h3>
                      <p className="text-xs text-[#7a7487]">Accurate room configurations attract high-intent, qualified buyers.</p>
                    </div>

                    {/* BHK Selector */}
                    <div>
                      <label className="block text-xs text-[#494455] mb-2 font-medium">BHK Configuration</label>
                      <div className="flex flex-wrap gap-2.5 text-xs">
                        {['1 RK / 1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map((item) => {
                          const active = bhk === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setBhk(item)}
                              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                                active
                                  ? 'bg-[#f3f0fc] text-[#4500b4] border border-[#5e23dc] font-bold shadow-sm'
                                  : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1c1b1b] font-medium'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bathrooms & Balconies */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#494455] mb-2 font-medium">Bathrooms</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['1', '2', '3', '4+'].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setBaths(n)}
                              className={`py-2 rounded-lg cursor-pointer ${
                                baths === n
                                  ? 'bg-[#f3f0fc] text-[#4500b4] font-bold shadow-sm border border-[#5e23dc]'
                                  : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1c1b1b] font-medium'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#494455] mb-2 font-medium">Balconies</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1', '2', '3+'].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setBalconies(n)}
                              className={`py-2 rounded-lg cursor-pointer ${
                                balconies === n
                                  ? 'bg-[#f3f0fc] text-[#4500b4] font-bold shadow-sm border border-[#5e23dc]'
                                  : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1c1b1b] font-medium'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Area Dimensions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-[#494455] font-medium">Carpet Area (RERA Mandated)*</label>
                          <span className="text-[10px] text-[#10b981] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">verified</span> RERA
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={carpetArea}
                            onChange={(e) => setCarpetArea(e.target.value)}
                            placeholder="e.g. 1250"
                            className="w-full h-12 px-4 rounded-lg bg-[#f6f3f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-[#1c1b1b] text-base font-semibold transition-all border border-[#e5e7eb]"
                          />
                          <span className="absolute right-3.5 text-xs text-[#7a7487] font-semibold">sq.ft</span>
                        </div>
                        <span className="text-[11px] text-[#7a7487]">Excludes external walls & balconies</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#494455] font-medium">Super Built-up Area</label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={superArea}
                            onChange={(e) => setSuperArea(e.target.value)}
                            placeholder="e.g. 1500"
                            className="w-full h-12 px-4 rounded-lg bg-[#f6f3f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-[#1c1b1b] text-base font-semibold transition-all border border-[#e5e7eb]"
                          />
                          <span className="absolute right-3.5 text-xs text-[#7a7487] font-semibold">sq.ft</span>
                        </div>
                        <span className="text-[11px] text-[#7a7487]">Includes common elevators, passages</span>
                      </div>
                    </div>

                    {/* Furnishing & Facing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#494455] mb-2 font-medium">Furnishing Status</label>
                        <select
                          value={furnishing}
                          onChange={(e) => setFurnishing(e.target.value)}
                          className="w-full h-12 px-3.5 rounded-lg bg-[#f6f3f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-[#1c1b1b] font-medium border border-[#e5e7eb]"
                        >
                          <option>Semi-Furnished (Modular Kitchen, Wardrobes)</option>
                          <option>Fully Furnished</option>
                          <option>Unfurnished (Bare Shell)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#494455] mb-2 font-medium">Facing / Vastu</label>
                        <select
                          value={facing}
                          onChange={(e) => setFacing(e.target.value)}
                          className="w-full h-12 px-3.5 rounded-lg bg-[#f6f3f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-[#1c1b1b] font-medium border border-[#e5e7eb]"
                        >
                          <option>East (Vastu Compliant)</option>
                          <option>North</option>
                          <option>North-East</option>
                          <option>West</option>
                          <option>South</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Pricing & Timeline */}
                  <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm border border-[#e5e7eb] flex flex-col gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#1c1b1b]">Price & Possession Status</h3>
                      <p className="text-xs text-[#7a7487]">Clear pricing increases serious buyer inquiries by 68%.</p>
                    </div>

                    {/* Price Input with Live Lakhs / Crores read */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[#494455] font-medium">Expected Price (All-Inclusive)*</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-lg font-bold text-[#4500b4]">₹</span>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 1,85,00,000"
                          className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#f6f3f2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-[#1c1b1b] text-xl font-bold tracking-tight transition-all border border-[#e5e7eb]"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#4500b4] font-bold">{formatPriceWord(price)}</span>
                        <span className="text-[#7a7487]">~₹11,212 / sq.ft</span>
                      </div>
                    </div>

                    {/* Negotiable & Deposit check */}
                    <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNegotiable}
                          onChange={(e) => setIsNegotiable(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#4500b4]"
                        />
                        <span className="text-[#1c1b1b] font-medium">Price is Negotiable</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeParking}
                          onChange={(e) => setIncludeParking(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#4500b4]"
                        />
                        <span className="text-[#1c1b1b] font-medium">Include Covered Car Parking in Price</span>
                      </label>
                    </div>

                    {/* Possession Availability */}
                    <div>
                      <label className="block text-xs text-[#494455] mb-2 font-medium">Possession Status</label>
                      <div className="grid grid-cols-2 gap-3 max-w-md text-xs">
                        <button
                          type="button"
                          onClick={() => setPossession('ready')}
                          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            possession === 'ready'
                              ? 'bg-[#f3f0fc] text-[#4500b4] border border-[#5e23dc] shadow-sm'
                              : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1c1b1b]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">domain_verification</span>
                          <span>Ready to Move</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPossession('construction')}
                          className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            possession === 'construction'
                              ? 'bg-[#f3f0fc] text-[#4500b4] border border-[#5e23dc] shadow-sm'
                              : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1c1b1b]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">construction</span>
                          <span>Under Construction</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: High-Velocity Photo Uploader */}
                  <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm border border-[#e5e7eb] flex flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#1c1b1b]">Property Photos & Floor Plans</h3>
                        <p className="text-xs text-[#7a7487]">Listings with 5+ photos receive 3.5x higher click-through rates.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span> Verified Badge Ready
                      </span>
                    </div>

                    {/* Upload Dropzone */}
                    <div className="p-6 rounded-xl bg-[#f3f0fc]/60 hover:bg-[#f3f0fc] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2.5 border-2 border-dashed border-[#5e23dc]/30">
                      <div className="w-12 h-12 rounded-full bg-[#5e23dc] text-white flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#4500b4]">Drag & drop photos or Browse Computer</span>
                        <span className="text-xs text-[#7a7487]">Supports JPG, PNG, HEIC up to 15MB each</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs text-[#494455] shadow-xs mt-1">
                        <span className="material-symbols-outlined text-[#f59e0b] text-xs">lightbulb</span>
                        Daylight shots of Living Room & Kitchen get fastest responses
                      </div>
                    </div>

                    {/* Uploaded Thumbnails Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-[#f0eded]">
                        <img
                          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                          alt="Cover Living"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#4500b4] text-white text-[9px] font-bold shadow-sm">Cover</span>
                        <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] truncate">Living Room</div>
                      </div>
                      <div className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-[#f0eded]">
                        <img
                          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80"
                          alt="Master Bedroom"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] truncate">Master Bedroom</div>
                      </div>
                      <div className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-[#f0eded]">
                        <img
                          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
                          alt="Balcony View"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] truncate">Balcony View</div>
                      </div>
                      <div className="rounded-xl aspect-[4/3] bg-[#f2f3f8] hover:bg-[#f3f0fc] cursor-pointer transition-all flex flex-col items-center justify-center gap-1 text-center p-2 border border-[#e5e7eb]">
                        <span className="material-symbols-outlined text-[#4500b4] text-2xl">add_circle</span>
                        <span className="text-xs font-bold text-[#4500b4]">+ Add 3 More</span>
                        <span className="text-[10px] text-[#7a7487]">Kitchen, Floorplan</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Sticky Bottom Actions */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => onNavigate('search')}
                      className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-[#4500b4] hover:bg-[#f3f0fc] transition-colors cursor-pointer"
                    >
                      Save Draft & Exit
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#5e23dc] hover:bg-[#4500b4] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(94,35,220,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Publish & View Listing</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Right Column: Sticky Live Buyer-Facing Card Preview & Owner Assurance (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
              
              {/* Section Heading */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1c1b1b]">Live Buyer-Facing Preview</span>
                </div>
                <span className="text-[10px] text-[#7a7487]">Updates in Real-Time</span>
              </div>

              {/* Housing Listing Card Mockup */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-[#e5e7eb]">
                {/* Card Image Container */}
                <div className="relative w-full aspect-[16/10] bg-[#f0eded] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                    alt="Buyer preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1c1b1b] text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">photo_camera</span> 8 Photos
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#006b5d] text-[10px] font-bold">
                      Zero Brokerage
                    </span>
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-5 flex flex-col gap-3.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#1c1b1b]">₹{price}</span>
                      <span className="text-xs text-[#7a7487] ml-1.5">@ ₹11,212/sq.ft</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#69f9e0] text-[#00201b] text-[10px] font-bold uppercase tracking-wider">
                      {possession === 'ready' ? 'Ready to Move' : 'Under Construction'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-[#1c1b1b]">{bhk} Ultra Luxury {category}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#7a7487] mt-0.5">
                      <span className="material-symbols-outlined text-base text-[#4500b4]">location_on</span>
                      <span>Bandra West, Mumbai (Western Suburbs)</span>
                    </div>
                  </div>

                  {/* Spec Micro Strip */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-[#f2f3f8] rounded-xl text-center text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1c1b1b]">{carpetArea} sq.ft</span>
                      <span className="text-[10px] text-[#7a7487]">Carpet Area</span>
                    </div>
                    <div className="flex flex-col border-x border-[#e5e7eb]">
                      <span className="font-bold text-[#1c1b1b]">{baths} Baths</span>
                      <span className="text-[10px] text-[#7a7487]">Washrooms</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1c1b1b]">{furnishing.split(' ')[0]}</span>
                      <span className="text-[10px] text-[#7a7487]">Furnishing</span>
                    </div>
                  </div>

                  {/* Owner Contact Action Simulation */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#e5e7eb]/60">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[#4500b4] text-white font-bold flex items-center justify-center text-xs">
                        AK
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1c1b1b]">Amit Kumar (Owner)</span>
                        <span className="text-[10px] text-[#10b981] font-medium">Identity Confirmed</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onNavigate('product')}
                      className="px-4 py-2 rounded-full bg-[#006b5d] hover:bg-[#006b5d]/90 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                      <span>Contact Owner</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust & Value Assurance Box */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e5e7eb] flex flex-col gap-3.5">
                <h4 className="text-sm font-bold text-[#1c1b1b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4500b4] text-xl">workspace_premium</span>
                  Why list on Vindhya Reality?
                </h4>
                <ul className="flex flex-col gap-3 text-xs text-[#494455]">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#10b981] text-lg flex-shrink-0 mt-0.5">verified</span>
                    <span><strong>No spam calls:</strong> Phone numbers are never exposed to agents; only genuine OTP-verified home buyers get in touch.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#10b981] text-lg flex-shrink-0 mt-0.5">verified</span>
                    <span><strong>90 Days Active Listing:</strong> Your property stays visible until fully leased or sold without recurring fees.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#10b981] text-lg flex-shrink-0 mt-0.5">verified</span>
                    <span><strong>Free Legal Drafting:</strong> Download customizable Indian tenancy and sales agreements directly from your dashboard.</span>
                  </li>
                </ul>

                {/* Need Assistance Hotline */}
                <div className="mt-2 p-3.5 rounded-lg bg-[#f3f0fc] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#5e23dc] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">support_agent</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#7a7487]">Owner Assistance Desk</div>
                      <div className="font-bold text-[#4500b4]">1800-419-0900 (Toll-Free)</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#006b5d] font-bold">9 AM - 8 PM</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

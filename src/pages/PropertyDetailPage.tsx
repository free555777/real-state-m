import React, { useState } from 'react';
import { ActivePage } from '../components/HousingHeader';
import { calculateEMI, formatIndianPrice } from '../utils/propTechMath';

interface PropertyDetailPageProps {
  onNavigate: (page: ActivePage) => void;
  onBookSiteVisitSuccess?: (details: { name: string; date: string }) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  onNavigate,
  onBookSiteVisitSuccess,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(27000000); // ₹2.70 Cr
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.65);

  const emiData = calculateEMI(loanAmount, interestRate, tenureYears);
  const totalPayment = emiData.totalAmountPayable;
  const interestFraction = totalPayment > 0 ? emiData.totalInterest / totalPayment : 0.52;
  const fullCircumference = 238.76;
  const donutOffset = fullCircumference * (1 - interestFraction);

  // Booking Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitDate, setVisitDate] = useState('2026-04-18');
  const [loanAssist, setLoanAssist] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;
    setBookingSuccess(true);
    onBookSiteVisitSuccess?.({ name: visitorName, date: visitDate });
  };

  return (
    <div className="flex flex-col w-full bg-[#fcf9f8]">
      
      {/* 1. Top Breadcrumb & Quick Actions Sub-Header */}
      <section className="w-full bg-white py-2.5 sm:py-3 px-3.5 sm:px-6 lg:px-12 shadow-[0_2px_10px_rgba(94,35,220,0.03)] border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#494455] overflow-x-auto whitespace-nowrap font-medium py-0.5">
            <button onClick={() => onNavigate('home')} className="hover:text-[#4500b4] transition-colors cursor-pointer">
              Home
            </button>
            <span className="text-[#cbc3d8]">/</span>
            <button onClick={() => onNavigate('search')} className="hover:text-[#4500b4] transition-colors cursor-pointer">
              Mumbai
            </button>
            <span className="text-[#cbc3d8]">/</span>
            <button onClick={() => onNavigate('search')} className="hover:text-[#4500b4] transition-colors cursor-pointer">
              Bandra West
            </button>
            <span className="text-[#cbc3d8]">/</span>
            <span className="text-[#494455] truncate max-w-[100px] sm:max-w-none">Godrej Skyvue</span>
            <span className="text-[#cbc3d8]">/</span>
            <span className="text-[#1c1b1b] font-bold">3 BHK</span>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#f3f0fc] text-[#aa0032]'
                  : 'bg-[#f6f3f2] hover:bg-[#f3f0fc] text-[#1c1b1b] hover:text-[#4500b4]'
              }`}
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                favorite
              </span>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#f3f0fc] text-[#1c1b1b] hover:text-[#4500b4] transition-all text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">share</span>
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              className="p-1 sm:p-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#ffdad6] text-[#494455] hover:text-[#ba1a1a] transition-all cursor-pointer"
              title="Report Incorrect Listing"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">flag</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Showcase & Content Workspace */}
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-12 py-4 sm:py-6 pb-24 sm:pb-8 flex flex-col gap-6 sm:gap-8">
        
        {/* Hero Title & Price Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 pb-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#10b981] text-white text-[10px] sm:text-[11px] font-bold tracking-wide uppercase shadow-sm">
                <span className="material-symbols-outlined text-xs sm:text-sm">verified</span>
                RERA Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f3f0fc] text-[#4500b4] text-[10px] sm:text-[11px] font-bold">
                <span className="material-symbols-outlined text-xs sm:text-sm">gavel</span>
                MahaRERA: P51800032901
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f0eded] text-[#494455] text-[10px] sm:text-[11px] font-semibold">
                <span className="material-symbols-outlined text-xs sm:text-sm">schedule</span>
                Ready to Move
              </span>
            </div>
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1b1b] tracking-tight leading-snug">
              3 BHK Sea-View Luxury Apartment in Godrej Skyvue
            </h1>
            
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#494455]">
              <span className="material-symbols-outlined text-[#4500b4] text-base sm:text-lg shrink-0">location_on</span>
              <span className="line-clamp-1 sm:line-clamp-none">Pali Hill, Nargis Dutt Road, Bandra West, Mumbai 400050</span>
            </div>
          </div>

          <div className="flex flex-col lg:items-end gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#4500b4] tracking-tight">₹3.40 Cr</span>
              <span className="text-xs text-[#6b7280] font-medium">(₹20,606 / sq.ft)</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f6f3f2] text-[#1c1b1b] text-xs">
              <span className="material-symbols-outlined text-[#10b981] text-base">payments</span>
              <span>EMI starts at <strong>₹2.48 L/month</strong></span>
              <a href="#emi-calculator" className="text-[#4500b4] hover:underline font-semibold flex items-center">
                Check Loan Offer <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        {/* Media Showcase Bento Gallery */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 h-[250px] sm:h-[360px] md:h-[520px] rounded-2xl overflow-hidden shadow-xl bg-[#eae7e7] relative">
          {/* Main Panoramic Photo (7 cols) */}
          <div className="md:col-span-7 h-full relative group overflow-hidden cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
              alt="Living Room Godrej Skyvue"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#4500b4] text-xs font-bold flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-base">view_in_ar</span> 3D Walkthrough Ready
              </span>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-lg font-bold drop-shadow-md">Living & Balcony Lounge</p>
              <p className="text-xs opacity-90 drop-shadow">Facing Arabian Sea Coastline</p>
            </div>
          </div>

          {/* Right Nested Image Stack (5 cols) */}
          <div className="hidden md:grid md:col-span-5 grid-cols-2 grid-rows-2 gap-3 h-full">
            <div className="relative group overflow-hidden cursor-pointer rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
                alt="Master Suite"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 text-xs text-white font-semibold drop-shadow">Master Suite</span>
            </div>
            <div className="relative group overflow-hidden cursor-pointer rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
                alt="Modular Kitchen"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 text-xs text-white font-semibold drop-shadow">Modular Island Kitchen</span>
            </div>
            <div className="relative group overflow-hidden cursor-pointer rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                alt="Rooftop Infinity Deck"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 text-xs text-white font-semibold drop-shadow">Rooftop Infinity Deck</span>
            </div>
            <div className="relative group overflow-hidden cursor-pointer rounded-lg bg-[#313030]">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                alt="Bathroom"
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#4500b4]/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center">
                <span className="material-symbols-outlined text-3xl mb-1">photo_library</span>
                <span className="text-sm font-bold">View all 28 Photos</span>
                <span className="text-[10px] opacity-80 mt-0.5">Floor plans & Drone views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Key Specifications Ribbon */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-4 bg-white rounded-2xl shadow-sm border border-[#e5e7eb]">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f6f3f2]">
            <span className="material-symbols-outlined text-[#4500b4] text-2xl">square_foot</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b7280]">Super Built-up</span>
              <span className="text-sm font-bold text-[#1c1b1b]">1,650 sq.ft</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f6f3f2]">
            <span className="material-symbols-outlined text-[#4500b4] text-2xl">bed</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b7280]">Configuration</span>
              <span className="text-sm font-bold text-[#1c1b1b]">3 Bedrooms</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f6f3f2]">
            <span className="material-symbols-outlined text-[#4500b4] text-2xl">bathtub</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b7280]">Bathrooms</span>
              <span className="text-sm font-bold text-[#1c1b1b]">3 Luxury Baths</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f6f3f2]">
            <span className="material-symbols-outlined text-[#4500b4] text-2xl">balcony</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b7280]">Balconies</span>
              <span className="text-sm font-bold text-[#1c1b1b]">1 Wrap Deck</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f6f3f2]">
            <span className="material-symbols-outlined text-[#4500b4] text-2xl">apartment</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b7280]">Elevation</span>
              <span className="text-sm font-bold text-[#1c1b1b]">14th of 28 Flrs</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f6f3f2]">
            <span className="material-symbols-outlined text-[#4500b4] text-2xl">explore</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b7280]">Facing / Vastu</span>
              <span className="text-sm font-bold text-[#1c1b1b]">North-East 100%</span>
            </div>
          </div>
        </div>

        {/* Dual Layout Core: Detailed Data Column (Left 8 Cols) & Sticky Agent Desk (Right 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PRIMARY DATA DOSSIER (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. About the Residence */}
            <section className="flex flex-col gap-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1c1b1b]">About the Residence</h2>
                <span className="px-2.5 py-1 rounded bg-[#f3f0fc] text-[#4500b4] text-xs font-semibold">Resale Exclusive</span>
              </div>
              <p className="text-sm sm:text-base text-[#494455] leading-relaxed">
                Perched on the 14th level of Godrej Skyvue, this bespoke 3 BHK home redefines coastal Mumbai living. Offering uninterrupted west-facing panoramas of the Arabian Sea and Carter Road shoreline, the floor plan emphasizes open cross-ventilation and natural illumination throughout the day.
              </p>
              <p className="text-xs sm:text-sm text-[#494455] leading-relaxed">
                Crafted with Italian Botticino marble across all entertainment corridors, double-glazed soundproof acoustic windows, and a motorized sun-screen balcony. Includes 2 allocated basement mechanical parking slots, dedicated quarters for domestic support, and centralized VRV Daikin air conditioning.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-2 border-t border-[#e5e7eb]/60">
                <div className="p-4 rounded-xl bg-[#f6f3f2] flex flex-col">
                  <span className="text-[10px] text-[#6b7280] uppercase font-bold">Carpet Area</span>
                  <span className="text-sm font-bold text-[#1c1b1b] mt-1">1,380 sq.ft</span>
                  <span className="text-[11px] text-[#10b981] font-medium">83.6% Efficiency</span>
                </div>
                <div className="p-4 rounded-xl bg-[#f6f3f2] flex flex-col">
                  <span className="text-[10px] text-[#6b7280] uppercase font-bold">Reserved Parking</span>
                  <span className="text-sm font-bold text-[#1c1b1b] mt-1">2 Covered</span>
                  <span className="text-[11px] text-[#6b7280]">Basement L2</span>
                </div>
                <div className="p-4 rounded-xl bg-[#f6f3f2] flex flex-col">
                  <span className="text-[10px] text-[#6b7280] uppercase font-bold">Furnishing</span>
                  <span className="text-sm font-bold text-[#1c1b1b] mt-1">Semi-Furnished</span>
                  <span className="text-[11px] text-[#6b7280]">Modular Wardrobes</span>
                </div>
                <div className="p-4 rounded-xl bg-[#f6f3f2] flex flex-col">
                  <span className="text-[10px] text-[#6b7280] uppercase font-bold">Monthly Maintenance</span>
                  <span className="text-sm font-bold text-[#1c1b1b] mt-1">₹14,500</span>
                  <span className="text-[11px] text-[#6b7280]">Society inclusive</span>
                </div>
              </div>
            </section>

            {/* 2. Property Specifications */}
            <section className="flex flex-col gap-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e5e7eb]">
              <h2 className="text-lg font-bold text-[#1c1b1b]">Property Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Property Age</span>
                  <span className="font-semibold text-[#1c1b1b]">2 Years (New Construction)</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Ownership Type</span>
                  <span className="font-semibold text-[#1c1b1b]">Freehold / Co-op Society</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Water Availability</span>
                  <span className="font-semibold text-[#1c1b1b]">24 Hours (Borewell + BMC)</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Electricity Power Cut</span>
                  <span className="font-semibold text-[#1c1b1b]">Zero (100% DG Backup)</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Flooring</span>
                  <span className="font-semibold text-[#1c1b1b]">Italian Marble & Hardwood</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Overlooking</span>
                  <span className="font-semibold text-[#1c1b1b]">Arabian Sea & Club Greens</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Lifts in Tower</span>
                  <span className="font-semibold text-[#1c1b1b]">3 High-Speed Otis + 1 Service</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#494455]">Fire Safety</span>
                  <span className="font-semibold text-[#1c1b1b]">Sprinklers, Alarms & Hydrant</span>
                </div>
              </div>
            </section>

            {/* 3. Exclusive Club & Community Amenities */}
            <section className="flex flex-col gap-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1c1b1b]">Exclusive Club & Community Amenities</h2>
                  <p className="text-xs text-[#494455]">Audited and verified on-site by Vindhya Reality Inspection Team</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f3f0fc] text-[#4500b4] text-xs font-semibold">24 Amenities</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: 'pool', title: 'Infinity Lap Pool', sub: 'Rooftop 28th Flr' },
                  { icon: 'ev_station', title: 'EV Fast Chargers', sub: 'Dedicated Bays' },
                  { icon: 'fitness_center', title: 'Technogym Gym', sub: 'Personal Trainers' },
                  { icon: 'security', title: '3-Tier Smart Security', sub: 'Biometric Access' },
                  { icon: 'sports_tennis', title: 'Lawn Tennis Court', sub: 'Floodlit Synthetic' },
                  { icon: 'celebration', title: 'Banquet Hall', sub: 'Capacity: 150 pax' },
                  { icon: 'park', title: 'Zen Garden', sub: 'Aroma Pathway' },
                  { icon: 'spa', title: 'Steam & Sauna', sub: 'Unisex Wellness' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f6f3f2] hover:bg-[#f3f0fc] transition-colors text-center group cursor-pointer">
                    <span className="material-symbols-outlined text-[#4500b4] text-3xl group-hover:scale-110 transition-transform mb-2">{item.icon}</span>
                    <span className="text-xs font-semibold text-[#1c1b1b]">{item.title}</span>
                    <span className="text-[10px] text-[#6b7280] mt-0.5">{item.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Interactive EMI Calculator Component with SVG Donut */}
            <section className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e5e7eb]" id="emi-calculator">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-[#1c1b1b]">Home Loan EMI Calculator</h2>
                  <p className="text-xs text-[#494455]">Instant pre-approved rates with partner banks (HDFC, SBI, ICICI)</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f0fc] text-[#4500b4] text-xs font-semibold self-start md:self-auto">
                  <span className="material-symbols-outlined text-base">verified</span> Rate: {interestRate}% p.a.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                {/* Sliders Panel (7 cols) */}
                <div className="md:col-span-7 flex flex-col gap-6">
                  {/* Loan Amount */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#494455] font-semibold">Loan Amount</span>
                      <span className="text-sm font-bold text-[#4500b4]">{formatIndianPrice(loanAmount, 'Buy')}</span>
                    </div>
                    <input
                      type="range"
                      min={5000000}
                      max={32000000}
                      step={500000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-[#f0eded] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#6b7280]">
                      <span>₹50 Lac</span>
                      <span>₹3.20 Cr</span>
                    </div>
                  </div>

                  {/* Tenure */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#494455] font-semibold">Loan Tenure</span>
                      <span className="text-sm font-bold text-[#4500b4]">{tenureYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full h-2 bg-[#f0eded] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#6b7280]">
                      <span>5 Yrs</span>
                      <span>30 Yrs</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#494455] font-semibold">Interest Rate (% p.a.)</span>
                      <span className="text-sm font-bold text-[#4500b4]">{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={7.5}
                      max={12.0}
                      step={0.05}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-[#f0eded] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#6b7280]">
                      <span>7.5%</span>
                      <span>12.0%</span>
                    </div>
                  </div>
                </div>

                {/* Donut Visual & Result Box (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#f6f3f2] text-center">
                  <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#cebdff" strokeWidth="12" />
                      <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        r="38"
                        stroke="#5e23dc"
                        strokeDasharray={fullCircumference}
                        strokeDashoffset={donutOffset}
                        strokeLinecap="round"
                        strokeWidth="12"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#6b7280] uppercase font-bold">Monthly</span>
                      <span className="text-base font-extrabold text-[#4500b4]">
                        ₹{(emiData.monthlyEMI / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full pt-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5e23dc]" /> Principal</span>
                      <span className="font-bold text-[#1c1b1b]">{formatIndianPrice(emiData.principalAmount, 'Buy')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#cebdff]" /> Total Interest</span>
                      <span className="font-bold text-[#1c1b1b]">{formatIndianPrice(emiData.totalInterest, 'Buy')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate('search')}
                    className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#5e23dc] hover:bg-[#4500b4] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                  >
                    Get Pre-Approved Loan
                  </button>
                </div>
              </div>
            </section>

            {/* 5. Locality Intel & Commute Index */}
            <section className="flex flex-col gap-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e5e7eb]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-[#1c1b1b]">Locality Intel & Commute Index</h2>
                  <p className="text-xs text-[#494455]">Pali Hill, Bandra West • Premier Residential Enclave</p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f3f0fc] text-[#4500b4]">
                  <span className="text-2xl font-extrabold">9.4</span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-bold uppercase">Livability</span>
                    <span className="text-[10px] text-[#6b7280]">High Growth Zone</span>
                  </div>
                </div>
              </div>

              {/* Static Map Graphic with pin */}
              <div className="w-full h-72 rounded-xl relative overflow-hidden shadow-sm bg-[#e2e8f0] border border-[#e5e7eb]">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')` }}>
                  <div className="absolute inset-0 bg-blue-900/10" />
                  <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-white/95 backdrop-blur-md shadow-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4500b4] text-2xl">pin_drop</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1c1b1b]">Godrej Skyvue Location</span>
                      <span className="text-[10px] text-[#6b7280]">Nargis Dutt Rd, Pali Hill, Bandra</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Benchmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1 text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f6f3f2]">
                  <span className="material-symbols-outlined text-[#4500b4] text-2xl">train</span>
                  <div>
                    <p className="font-semibold text-[#1c1b1b]">Bandra Station</p>
                    <p className="text-[#6b7280]">1.2 km • 6 mins drive</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f6f3f2]">
                  <span className="material-symbols-outlined text-[#4500b4] text-2xl">flight</span>
                  <div>
                    <p className="font-semibold text-[#1c1b1b]">Mumbai Airport (BOM)</p>
                    <p className="text-[#6b7280]">8.5 km • 20 mins via WEH</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f6f3f2]">
                  <span className="material-symbols-outlined text-[#4500b4] text-2xl">local_hospital</span>
                  <div>
                    <p className="font-semibold text-[#1c1b1b]">Lilavati Hospital</p>
                    <p className="text-[#6b7280]">2.0 km • 8 mins drive</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f6f3f2]">
                  <span className="material-symbols-outlined text-[#4500b4] text-2xl">school</span>
                  <div>
                    <p className="font-semibold text-[#1c1b1b]">St. Stanislaus High</p>
                    <p className="text-[#6b7280]">0.9 km • 4 mins walk</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f6f3f2]">
                  <span className="material-symbols-outlined text-[#4500b4] text-2xl">shopping_cart</span>
                  <div>
                    <p className="font-semibold text-[#1c1b1b]">Linking Road High St</p>
                    <p className="text-[#6b7280]">0.7 km • 5 mins walk</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f6f3f2]">
                  <span className="material-symbols-outlined text-[#4500b4] text-2xl">waves</span>
                  <div>
                    <p className="font-semibold text-[#1c1b1b]">Carter Road Promenade</p>
                    <p className="text-[#6b7280]">0.5 km • 3 mins walk</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. MahaRERA Government Sanctioned Certificate */}
            <section className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#f3f0fc] border border-[#5e23dc]/20">
              <div className="w-24 h-24 rounded-xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-full h-full text-[#1c1b1b]" fill="currentColor" viewBox="0 0 100 100">
                  <rect fill="#4500b4" height="25" rx="3" width="25" x="10" y="10" />
                  <rect fill="#ffffff" height="15" width="15" x="15" y="15" />
                  <rect fill="#4500b4" height="9" width="9" x="18" y="18" />
                  <rect fill="#4500b4" height="25" rx="3" width="25" x="65" y="10" />
                  <rect fill="#ffffff" height="15" width="15" x="70" y="15" />
                  <rect fill="#4500b4" height="9" width="9" x="73" y="18" />
                  <rect fill="#4500b4" height="25" rx="3" width="25" x="10" y="65" />
                  <rect fill="#ffffff" height="15" width="15" x="15" y="70" />
                  <rect fill="#4500b4" height="9" width="9" x="18" y="73" />
                  <rect fill="#4500b4" height="10" width="10" x="45" y="15" />
                  <rect fill="#4500b4" height="10" width="10" x="45" y="45" />
                  <rect fill="#4500b4" height="10" width="10" x="65" y="45" />
                  <rect fill="#4500b4" height="10" width="10" x="45" y="70" />
                  <rect fill="#4500b4" height="20" rx="2" width="20" x="70" y="70" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-xl">verified_user</span>
                  <h3 className="text-sm font-bold text-[#1c1b1b]">MahaRERA Government Sanctioned Project</h3>
                </div>
                <p className="text-xs text-[#494455] leading-relaxed">
                  The project is officially registered under the Maharashtra Real Estate Regulatory Authority with certificate number <strong className="text-[#1c1b1b]">P51800032901</strong>. All title deeds, encumbrance certificates, layout plans, and completion notices are verified by Vindhya Reality Legal Cell.
                </p>
                <a
                  href="https://maharera.mahaonline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#4500b4] font-bold hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Verify On Government MahaRERA Portal <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </section>

          </div>

          {/* RIGHT STICKY DESK (4 Cols) */}
          <aside className="lg:col-span-4 sticky top-20 flex flex-col gap-6">
            
            {/* Verified Partner Agent Box */}
            <div id="site-visit-form" className="bg-white rounded-2xl p-6 shadow-xl border border-[#e5e7eb] flex flex-col gap-6 scroll-mt-24">
              <div className="flex items-start justify-between pb-4 border-b border-[#e5e7eb]/60">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80"
                      alt="Vikramaditya Shah"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#f3f0fc]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs shadow-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-[#1c1b1b]">Vikramaditya Shah</h3>
                    <span className="text-[10px] text-[#10b981] font-bold uppercase tracking-wider">Certified RERA Partner</span>
                    <div className="flex items-center gap-1 mt-0.5 text-xs">
                      <span className="text-[#f59e0b]">★</span>
                      <span className="font-bold text-[#1c1b1b]">4.9</span>
                      <span className="text-[#6b7280] text-[10px]">(124 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-[#f6f3f2] text-[#6b7280] text-[10px] text-center leading-tight">
                  &lt; 10 min<br /><span className="font-bold text-[#10b981]">Response</span>
                </div>
              </div>

              {/* Instant Site Visit Booking Form */}
              {bookingSuccess ? (
                <div className="p-4 rounded-xl bg-[#10b981]/15 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#10b981]">check_circle</span>
                  <div className="font-bold text-[#006f61] text-sm">Site Visit Scheduled!</div>
                  <p className="text-xs text-[#494455]">
                    Partner Advisor Vikramaditya Shah will contact you on {visitorPhone} within 10 minutes to coordinate gate passes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3.5 text-xs">
                  <div>
                    <label className="block text-[#494455] font-semibold mb-1">Your Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6b7280] text-base">person</span>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Rohan Malhotra"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#fcf9f8] text-[#1c1b1b] border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#494455] font-semibold mb-1">Mobile Number (OTP Verification)</label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg bg-[#f6f3f2] border border-r-0 border-[#e5e7eb] text-[#494455] font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2 rounded-r-lg bg-[#fcf9f8] text-[#1c1b1b] border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#494455] font-semibold mb-1">Preferred Date for Guided Tour</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#fcf9f8] text-[#1c1b1b] border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="loan-assist"
                      checked={loanAssist}
                      onChange={(e) => setLoanAssist(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-[#5e23dc] cursor-pointer"
                    />
                    <label htmlFor="loan-assist" className="text-[#494455] cursor-pointer text-[11px] leading-tight">
                      I am interested in exploring pre-negotiated home loan options with 0.5% lower processing fee.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#5e23dc] hover:bg-[#4500b4] text-white font-bold tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">event_available</span>
                    <span>Book Instant Site Visit</span>
                  </button>
                </form>
              )}

              {/* WhatsApp Direct Conversion Button */}
              <a
                href="https://api.whatsapp.com/send?text=Hi Vikramaditya, I am interested in 3 BHK Godrej Skyvue Pali Hill"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#10b981] hover:bg-[#006b5d] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>WhatsApp Chat with Agent</span>
              </a>

              {/* Housing Guarantee Pill */}
              <div className="p-3.5 rounded-xl bg-[#f6f3f2] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4500b4] text-2xl flex-shrink-0">shield</span>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-[#1c1b1b]">Zero Brokerage Guarantee</span>
                  <span className="text-[#6b7280] text-[11px]">Direct authorized developer partner desk. No hidden surcharges.</span>
                </div>
              </div>
            </div>

            {/* Price Trends & Locality Velocity Mini-Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-md flex flex-col gap-3 border border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#1c1b1b]">Bandra West Price Trend</h4>
                <span className="text-[11px] font-bold text-[#10b981] flex items-center">
                  <span className="material-symbols-outlined text-xs">trending_up</span> +8.4% YoY
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                Average locality capital value stands at <strong className="text-[#1c1b1b]">₹21,800/sq.ft</strong>. This property is listed 5.5% below current micro-market rate.
              </p>
              {/* Sparkline representation */}
              <div className="h-14 w-full flex items-end gap-1.5 pt-2">
                <div className="h-[50%] flex-1 bg-[#f3f0fc] hover:bg-[#4500b4] transition-colors rounded-t" title="Q1: ₹18.5k" />
                <div className="h-[60%] flex-1 bg-[#f3f0fc] hover:bg-[#4500b4] transition-colors rounded-t" title="Q2: ₹19.2k" />
                <div className="h-[65%] flex-1 bg-[#f3f0fc] hover:bg-[#4500b4] transition-colors rounded-t" title="Q3: ₹19.8k" />
                <div className="h-[80%] flex-1 bg-[#f3f0fc] hover:bg-[#4500b4] transition-colors rounded-t" title="Q4: ₹20.5k" />
                <div className="h-[100%] flex-1 bg-[#5e23dc] rounded-t" title="Q1: ₹21.8k" />
              </div>
            </div>

          </aside>

        </div>

      </div>

      {/* 3. Mobile-Only Sticky Bottom Conversion Bar (<sm only - positioned above MobileBottomNav) */}
      <div className="fixed bottom-[56px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-4 py-2 flex items-center justify-between sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div>
          <span className="text-[10px] text-[#7a7487] block font-semibold uppercase tracking-wider">All-Inclusive</span>
          <span className="text-xl font-extrabold text-[#4500b4] leading-none">₹3.40 Cr</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://api.whatsapp.com/send?text=Hi Vikramaditya, I am interested in 3 BHK Godrej Skyvue Pali Hill"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            aria-label="WhatsApp"
          >
            <span className="material-symbols-outlined text-xl">chat</span>
          </a>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('site-visit-form');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[#5e23dc] active:bg-[#4500b4] text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>Book Visit</span>
          </button>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Compass, 
  Calendar, 
  PhoneCall, 
  Share2, 
  Heart, 
  Calculator, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  CheckCircle2, 
  Building, 
  Clock, 
  Check,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { Property, FloorPlan, RoomSpec } from '../types/property';
import { formatIndianPrice, formatArea, calculateEMI } from '../utils/propTechMath';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (propertyId: string) => void;
  onBookSiteVisit: (property: Property) => void;
  onContactAgent: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onBookSiteVisit,
  onContactAgent,
}) => {
  if (!property) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'floorplan' | 'emi' | 'locality'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomSpec | null>(
    property.floorPlans[0]?.rooms[0] || null
  );
  const [planZoom, setPlanZoom] = useState(1);

  // EMI Calculator state inside modal
  const defaultLoanAmount = Math.round(property.price * 0.8);
  const [loanPrincipal, setLoanPrincipal] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const emiResult = calculateEMI(loanPrincipal, interestRate, tenureYears);
  const downPayment = Math.max(0, property.price - loanPrincipal);

  const activeFloorPlan = property.floorPlans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl border border-[#e5e7eb] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:px-6 py-3.5 border-b border-[#e5e7eb] flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg sm:text-xl text-[#191919]">
              {property.project || property.title}
            </span>
            {property.isReraVerified && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RERA Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(property.id)}
              className="p-2 rounded-full hover:bg-[#f3f0fc] text-[#434343] hover:text-[#f43f5e] transition-colors cursor-pointer"
              title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'text-[#f43f5e] fill-[#f43f5e]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f2f3f8] text-[#6b7280] hover:text-[#191919] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-[#e5e7eb]">
              <img
                src={property.images[selectedImageIndex] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                {selectedImageIndex + 1} of {property.images.length} Photos
              </div>
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#5e23dc] ring-2 ring-[#5e23dc]/20 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Summary Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#f8f9fd] border border-[#e5e7eb]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#191919] tracking-tight">
                  {formatIndianPrice(property.price, property.intent)}
                </span>
                {property.intent !== 'Rent' && (
                  <span className="text-sm font-semibold text-[#6b7280]">
                    (₹{property.pricePerSqFt.toLocaleString('en-IN')} / sq.ft)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#5e23dc]" />
                <span>{property.fullAddress}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onBookSiteVisit(property)}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-full bg-[#00bda6] hover:bg-[#00a38f] text-white text-sm font-bold shadow-md shadow-[#00bda6]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Free Site Visit</span>
              </button>
              <button
                type="button"
                onClick={() => onContactAgent(property)}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-full bg-[#5e23dc] hover:bg-[#4d1cb8] text-white text-sm font-bold shadow-md shadow-[#5e23dc]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#66f6dd]" />
                <span>Contact Agent</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#e5e7eb] gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Specs' },
              { id: 'floorplan', label: 'Interactive Floor Plan' },
              { id: 'emi', label: 'EMI & Affordability' },
              { id: 'locality', label: 'Locality & Transit Radar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#5e23dc] text-[#5e23dc]'
                    : 'border-transparent text-[#434343] hover:text-[#191919]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & SPECS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb]">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Carpet Area</span>
                  <span className="text-base font-extrabold text-[#191919]">{formatArea(property.carpetAreaSqFt)}</span>
                  <span className="text-[11px] text-[#6b7280] block mt-0.5">Super: {formatArea(property.superBuiltupAreaSqFt)}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb]">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Configuration</span>
                  <span className="text-base font-extrabold text-[#191919]">{property.bhk > 0 ? `${property.bhk} BHK` : property.type}</span>
                  <span className="text-[11px] text-[#6b7280] block mt-0.5">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb]">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Facing & Floor</span>
                  <span className="text-base font-extrabold text-[#191919]">{property.facing} Facing</span>
                  <span className="text-[11px] text-[#6b7280] block mt-0.5">Floor {property.floorNumber} of {property.totalFloors}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb]">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">RERA Status</span>
                  <span className="text-xs font-mono font-bold text-[#10b981] block truncate">{property.reraId}</span>
                  <span className="text-[11px] text-[#6b7280] block mt-0.5">Registered & Verified</span>
                </div>
              </div>

              {/* Property Overview Prose */}
              <div>
                <h3 className="text-base font-bold text-[#191919] mb-2">About the Property</h3>
                <p className="text-sm text-[#434343] leading-relaxed">
                  {property.overview}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-base font-bold text-[#191919] mb-3">Project & Society Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb] text-xs font-semibold text-[#191919]">
                      <CheckCircle2 className="w-4 h-4 text-[#00bda6] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Profile Box */}
              <div className="p-4 rounded-2xl bg-[#f3f0fc] border border-[#5e23dc]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#191919] text-sm">{property.agent.name}</span>
                      <span className="bg-[#10b981] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                        {property.agent.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7280]">{property.agent.company} · {property.agent.experienceYears} Years Exp</p>
                    <p className="text-[11px] text-[#5e23dc] font-semibold">⚡ Avg Response: {property.agent.responseTimeMin} mins</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onContactAgent(property)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#5e23dc] text-white text-xs font-bold hover:bg-[#4d1cb8] transition-colors cursor-pointer"
                  >
                    Contact {property.agent.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE FLOOR PLAN VIEWER */}
          {activeTab === 'floorplan' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#191919]">
                    {activeFloorPlan?.title || 'Architectural Floor Blueprint'}
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Carpet: {activeFloorPlan?.carpetAreaSqFt} sq.ft · Super Built-up: {activeFloorPlan?.superAreaSqFt} sq.ft · {activeFloorPlan?.balconies} Balconies
                  </p>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1.5 bg-[#f8f9fd] p-1 rounded-xl border border-[#e5e7eb]">
                  <button
                    onClick={() => setPlanZoom((z) => Math.min(z + 0.15, 1.5))}
                    className="p-1.5 hover:bg-white rounded-lg text-[#191919]"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlanZoom((z) => Math.max(z - 0.15, 0.85))}
                    className="p-1.5 hover:bg-white rounded-lg text-[#191919]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlanZoom(1)}
                    className="px-2 py-1 text-xs font-bold text-[#5e23dc] hover:bg-white rounded-lg"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Blueprint Display Canvas */}
              <div className="relative rounded-2xl bg-[#0f172a] border border-[#1e293b] p-6 text-white min-h-[380px] overflow-hidden flex flex-col justify-between">
                
                {/* Blueprint grid background */}
                <div 
                  className="w-full h-full absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none"
                />

                {/* Rooms interactive layout blocks */}
                <div 
                  className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 transition-transform duration-200"
                  style={{ transform: `scale(${planZoom})`, transformOrigin: 'top left' }}
                >
                  {activeFloorPlan?.rooms.map((room) => {
                    const isSelected = selectedRoom?.name === room.name;
                    return (
                      <div
                        key={room.name}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5e23dc]/30 border-[#66f6dd] shadow-lg ring-2 ring-[#66f6dd]/40'
                            : 'bg-slate-800/80 border-slate-700 hover:border-[#5e23dc] hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#66f6dd] mb-1">
                          <span>{room.name}</span>
                          <span className="font-mono text-white/70">{room.areaSqFt} sq.ft</span>
                        </div>
                        <div className="font-mono text-sm font-semibold text-white">
                          {room.dimensions}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {room.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Room Details Drawer */}
                {selectedRoom && (
                  <div className="relative z-10 mt-6 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#66f6dd] uppercase">Room Inspection</span>
                      <h4 className="text-sm font-bold text-white">{selectedRoom.name} ({selectedRoom.dimensions})</h4>
                      <p className="text-xs text-slate-300">{selectedRoom.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#66f6dd]">{selectedRoom.areaSqFt} Sq. Ft</span>
                      <span className="text-[11px] text-slate-400 block">Clear Carpet Space</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE EMI & AFFORDABILITY */}
          {activeTab === 'emi' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Left: Sliders */}
                <div className="space-y-5 bg-[#f8f9fd] p-5 rounded-2xl border border-[#e5e7eb]">
                  
                  {/* Loan Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-[#6b7280]">Home Loan Principal (80%)</span>
                      <span className="text-[#5e23dc] text-sm font-extrabold">{formatIndianPrice(loanPrincipal, 'Buy')}</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={property.price}
                      step={100000}
                      value={loanPrincipal}
                      onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                      <span>Min: ₹10 L</span>
                      <span>Down Payment: {formatIndianPrice(downPayment, 'Buy')}</span>
                    </div>
                  </div>

                  {/* Interest Rate Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-[#6b7280]">Annual Interest Rate</span>
                      <span className="text-[#5e23dc] text-sm font-extrabold">{interestRate}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min={6.5}
                      max={12}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                      <span>6.5% (Prime)</span>
                      <span>12.0% (Commercial)</span>
                    </div>
                  </div>

                  {/* Loan Tenure Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-[#6b7280]">Loan Tenure</span>
                      <span className="text-[#5e23dc] text-sm font-extrabold">{tenureYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                      <span>5 Years</span>
                      <span>30 Years</span>
                    </div>
                  </div>

                </div>

                {/* Right: EMI Breakdown Card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#5e23dc]/20 shadow-md text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    Estimated Monthly Payment
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#5e23dc] tracking-tight">
                    ₹{emiResult.monthlyEMI.toLocaleString('en-IN')}{' '}
                    <span className="text-sm font-semibold text-[#6b7280]">/ month</span>
                  </div>

                  {/* Visual ratio bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3 w-full bg-[#e5e7eb] rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${(emiResult.principalAmount / emiResult.totalAmountPayable) * 100}%` }}
                        className="bg-[#5e23dc]" 
                      />
                      <div 
                        style={{ width: `${(emiResult.totalInterest / emiResult.totalAmountPayable) * 100}%` }}
                        className="bg-[#00bda6]" 
                      />
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-[#6b7280]">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#5e23dc]" /> Principal ({formatIndianPrice(emiResult.principalAmount, 'Buy')})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00bda6]" /> Interest ({formatIndianPrice(emiResult.totalInterest, 'Buy')})
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e5e7eb] text-xs text-[#6b7280]">
                    Total Loan Cost: <span className="font-bold text-[#191919]">{formatIndianPrice(emiResult.totalAmountPayable, 'Buy')}</span>
                  </div>

                  <button
                    onClick={() => onContactAgent(property)}
                    className="w-full py-2.5 rounded-xl bg-[#5e23dc] hover:bg-[#4d1cb8] text-white text-xs font-bold shadow-md shadow-[#5e23dc]/20 transition-all cursor-pointer"
                  >
                    Check Pre-Approved Bank Loan Offers
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: LOCALITY & TRANSIT RADAR */}
          {activeTab === 'locality' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb] text-center">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Connectivity</span>
                  <span className="text-2xl font-extrabold text-[#5e23dc]">{property.localityInfo.connectivityScore}/10</span>
                  <span className="text-[11px] text-[#10b981] font-semibold block mt-0.5">High Speed Access</span>
                </div>
                <div className="p-4 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb] text-center">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Lifestyle & Dining</span>
                  <span className="text-2xl font-extrabold text-[#5e23dc]">{property.localityInfo.lifestyleScore}/10</span>
                  <span className="text-[11px] text-[#10b981] font-semibold block mt-0.5">Premium Hub</span>
                </div>
                <div className="p-4 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb] text-center">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Safety Index</span>
                  <span className="text-2xl font-extrabold text-[#10b981]">{property.localityInfo.safetyScore}/10</span>
                  <span className="text-[11px] text-[#6b7280] block mt-0.5">24/7 Patrolled</span>
                </div>
                <div className="p-4 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb] text-center">
                  <span className="text-[11px] font-bold text-[#6b7280] uppercase block">Environment</span>
                  <span className="text-2xl font-extrabold text-[#00bda6]">{property.localityInfo.environmentScore}/10</span>
                  <span className="text-[11px] text-[#6b7280] block mt-0.5">Green Canopy</span>
                </div>
              </div>

              {/* Transit Proximity */}
              <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] space-y-3">
                <h3 className="text-base font-bold text-[#191919]">Proximity & Distances</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9fd]">
                    <span className="w-10 h-10 rounded-lg bg-[#5e23dc]/10 text-[#5e23dc] flex items-center justify-center font-bold text-sm">
                      🚇
                    </span>
                    <div>
                      <span className="text-xs text-[#6b7280] block">Nearest Metro Station</span>
                      <span className="text-sm font-extrabold text-[#191919]">{property.localityInfo.nearestMetroDistanceKm} km</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9fd]">
                    <span className="w-10 h-10 rounded-lg bg-[#00bda6]/10 text-[#00bda6] flex items-center justify-center font-bold text-sm">
                      🏥
                    </span>
                    <div>
                      <span className="text-xs text-[#6b7280] block">Multispecialty Hospital</span>
                      <span className="text-sm font-extrabold text-[#191919]">{property.localityInfo.nearestHospitalDistanceKm} km</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9fd]">
                    <span className="w-10 h-10 rounded-lg bg-[#f43f5e]/10 text-[#f43f5e] flex items-center justify-center font-bold text-sm">
                      🏫
                    </span>
                    <div>
                      <span className="text-xs text-[#6b7280] block">International School</span>
                      <span className="text-sm font-extrabold text-[#191919]">{property.localityInfo.nearestSchoolDistanceKm} km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Fixed Footer CTA */}
        <div className="p-4 sm:px-6 py-3.5 border-t border-[#e5e7eb] bg-[#f8f9fd] flex items-center justify-between">
          <div className="hidden sm:block">
            <span className="text-xs text-[#6b7280]">Need immediate assistance?</span>
            <span className="block text-sm font-bold text-[#191919]">Call {property.agent.phone}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onBookSiteVisit(property)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#00bda6] hover:bg-[#00a38f] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
            >
              Book Site Visit
            </button>
            <button
              onClick={() => onContactAgent(property)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#5e23dc] hover:bg-[#4d1cb8] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md shadow-[#5e23dc]/20"
            >
              Contact Agent
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

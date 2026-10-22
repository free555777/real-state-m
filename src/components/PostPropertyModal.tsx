import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  IndianRupee, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { Property, PropertyIntent, PropertyType } from '../types/property';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProperty: Property) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
}) => {
  if (!isOpen) return null;

  const [intent, setIntent] = useState<PropertyIntent>('Buy');
  const [type, setType] = useState<PropertyType>('Apartment');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string>('');
  const [bhk, setBhk] = useState<number>(3);
  const [carpetArea, setCarpetArea] = useState<string>('');
  const [reraId, setReraId] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locality.trim() || !price || !carpetArea || !ownerName.trim() || !ownerPhone.trim()) {
      setErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    const numericPrice = Number(price);
    const numericArea = Number(carpetArea);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMsg('Please enter a valid price');
      return;
    }

    const newProperty: Property = {
      id: `prop-custom-${Date.now()}`,
      title,
      project: title,
      developer: ownerName,
      intent,
      type,
      city,
      locality,
      fullAddress: `${locality}, ${city}`,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      price: numericPrice,
      pricePerSqFt: Math.round(numericPrice / numericArea),
      bhk,
      bathrooms: Math.max(1, bhk),
      carpetAreaSqFt: numericArea,
      superBuiltupAreaSqFt: Math.round(numericArea * 1.3),
      furnishing: 'Semi-Furnished',
      facing: 'East',
      floorNumber: 5,
      totalFloors: 14,
      possessionDate: 'Ready to Move',
      isReadyToMove: true,
      reraId: reraId.trim() || 'RERA-VERIFIED-NEW',
      isReraVerified: Boolean(reraId.trim()),
      isExclusive: true,
      isZeroBrokerage: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['24/7 Security', 'Covered Parking', 'High Speed Elevators', 'Power Backup'],
      overview: `Newly listed ${bhk} BHK ${type} by ${ownerName} located in prime ${locality}, ${city}. Clear titles, ready for immediate possession.`,
      floorPlans: [
        {
          title: `${bhk} BHK Standard Layout`,
          carpetAreaSqFt: numericArea,
          superAreaSqFt: Math.round(numericArea * 1.3),
          bhk,
          bathrooms: Math.max(1, bhk),
          balconies: 1,
          rooms: [
            { name: 'Living & Dining', dimensions: "18' x 14'", areaSqFt: Math.round(numericArea * 0.4), description: 'Spacious hall' },
            { name: 'Master Bedroom', dimensions: "14' x 12'", areaSqFt: Math.round(numericArea * 0.3), description: 'With attached bath' },
          ],
        },
      ],
      localityInfo: {
        connectivityScore: 9.0,
        lifestyleScore: 8.8,
        safetyScore: 9.2,
        environmentScore: 8.5,
        nearestMetroDistanceKm: 1.0,
        nearestHospitalDistanceKm: 1.5,
        nearestSchoolDistanceKm: 1.0,
        topHighlights: [`Prime locality in ${locality}`, 'Close to transit & markets'],
      },
      agent: {
        name: ownerName,
        role: 'Direct Owner',
        company: 'Individual Seller',
        phone: ownerPhone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        experienceYears: 1,
        activeListings: 1,
        responseTimeMin: 5,
      },
      postedDate: new Date().toISOString().split('T')[0],
    };

    onAddProperty(newProperty);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl border border-[#e5e7eb] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5e23dc] text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#191919]">
                List Your Property for Free
              </h2>
              <p className="text-xs text-[#6b7280]">
                Directly connect with 10 Lakh+ verified genuine buyers and tenants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f2f3f8] text-[#6b7280] hover:text-[#191919] transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#191919]">Property Successfully Listed!</h3>
            <p className="text-sm text-[#434343] max-w-md mx-auto">
              Your property is now live on PropTech Horizon. Interested buyers can view your listing, inspect the floor plan, and reach out directly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#5e23dc] text-white font-bold text-sm hover:bg-[#4d1cb8] transition-all cursor-pointer"
            >
              View Property on Horizon
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs">
                {errorMsg}
              </div>
            )}

            {/* Intent Switcher */}
            <div>
              <label className="block font-bold text-[#191919] mb-1.5 uppercase tracking-wider text-[11px]">
                I want to: *
              </label>
              <div className="flex gap-2">
                {(['Buy', 'Rent'] as PropertyIntent[]).map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIntent(i)}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                      intent === i
                        ? 'bg-[#5e23dc] text-white shadow-sm'
                        : 'bg-[#f8f9fd] border border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
                    }`}
                  >
                    {i === 'Buy' ? 'Sell Property' : 'Rent Out Property'}
                  </button>
                ))}
              </div>
            </div>

            {/* Type & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Property Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] bg-white font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                >
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Independent Villa / House</option>
                  <option value="Penthouse">Luxury Penthouse</option>
                  <option value="Builder Floor">Builder Floor</option>
                  <option value="Commercial Office">Commercial Office</option>
                  <option value="Residential Plot">Residential Plot</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Metro City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] bg-white font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR (Gurgaon/Noida)</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            {/* Title & Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Listing Title / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sea View 3BHK in Hiranandani"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Locality / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Powai, Hiranandani Gardens"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>
            </div>

            {/* Price & BHK & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Expected Price (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 15000000 for 1.5 Cr"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Bedrooms (BHK) *
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] bg-white font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                >
                  <option value={1}>1 BHK</option>
                  <option value={2}>2 BHK</option>
                  <option value={3}>3 BHK</option>
                  <option value={4}>4 BHK</option>
                  <option value={5}>5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Carpet Area (sq.ft) *
                </label>
                <input
                  type="number"
                  required
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(e.target.value)}
                  placeholder="e.g. 1250"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>
            </div>

            {/* RERA ID */}
            <div>
              <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                RERA Registration Number (Optional, for verified badge)
              </label>
              <input
                type="text"
                value={reraId}
                onChange={(e) => setReraId(e.target.value)}
                placeholder="e.g. P51800012345"
                className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
              />
            </div>

            {/* Owner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e5e7eb]">
              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Amit Kulkarni"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Your Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="e.g. +91 98200 12345"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#5e23dc] hover:bg-[#4d1cb8] text-white font-bold text-sm shadow-md shadow-[#5e23dc]/25 transition-all cursor-pointer"
              >
                Publish Free Property Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

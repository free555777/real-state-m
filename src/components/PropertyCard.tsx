import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Compass, 
  Calendar, 
  PhoneCall, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Calculator,
  Share2
} from 'lucide-react';
import { Property } from '../types/property';
import { formatIndianPrice, formatArea, calculateEMI } from '../utils/propTechMath';

interface PropertyCardProps {
  property: Property;
  isShortlisted: boolean;
  onToggleShortlist: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookSiteVisit: (property: Property) => void;
  onContactAgent: (property: Property) => void;
  isHoveredOnMap?: boolean;
  onHover?: (propertyId: string | null) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isShortlisted,
  onToggleShortlist,
  onSelectProperty,
  onBookSiteVisit,
  onContactAgent,
  isHoveredOnMap,
  onHover,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Estimated EMI (80% loan at 8.5% for 20 years)
  const loanPrincipal = property.price * 0.8;
  const emiEstimate = calculateEMI(loanPrincipal, 8.5, 20);

  return (
    <div
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer ${
        isHoveredOnMap
          ? 'border-[#5e23dc] ring-2 ring-[#5e23dc]/20 shadow-[0_12px_24px_-6px_rgba(94,35,220,0.16)] -translate-y-1'
          : 'border-[#e5e7eb] hover:border-[#5e23dc]/40 hover:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(25,25,25,0.04),0_1px_4px_-1px_rgba(94,35,220,0.04)] hover:shadow-[0_12px_24px_-6px_rgba(94,35,220,0.08),0_4px_12px_-2px_rgba(25,25,25,0.04)]'
      }`}
      onClick={() => onSelectProperty(property)}
    >
      <div>
        {/* Image Container (16:10 aspect ratio) */}
        <div className="relative aspect-[16/10] bg-[#f2f3f8] overflow-hidden">
          <img
            src={property.images[currentImageIndex] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />

          {/* Top Pill Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {property.isReraVerified && (
              <span className="inline-flex items-center gap-1 bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RERA Verified</span>
              </span>
            )}
            {property.isExclusive && (
              <span className="inline-flex items-center gap-1 bg-[#f43f5e] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>Exclusive</span>
              </span>
            )}
            {property.isZeroBrokerage && (
              <span className="inline-flex items-center gap-1 bg-[#00bda6] text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-xs">
                <span>Zero Brokerage</span>
              </span>
            )}
          </div>

          {/* Top-Right Action: Shortlist Heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(property.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#191919] hover:text-[#f43f5e] transition-colors shadow-sm z-10 cursor-pointer"
            title={isShortlisted ? 'Remove from Shortlist' : 'Save Property'}
            aria-label="Save Property"
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'text-[#f43f5e] fill-[#f43f5e]' : ''}`} />
          </button>

          {/* Image Navigation Carousel Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-[#191919] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-[#191919] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Image Counter Indicator */}
              <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full z-10">
                {currentImageIndex + 1}/{property.images.length}
              </div>
            </>
          )}

          {/* Possession tag (bottom left) */}
          <div className="absolute bottom-2.5 left-3 bg-white/90 backdrop-blur-xs text-[#191919] text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs z-10 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#5e23dc]" />
            <span>{property.possessionDate}</span>
          </div>
        </div>

        {/* Card Content Zone */}
        <div className="p-4 sm:p-5">
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#191919] tracking-tight">
                {formatIndianPrice(property.price, property.intent)}
              </span>
              {property.intent !== 'Rent' && (
                <span className="text-xs text-[#6b7280] font-medium">
                  @ ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
                </span>
              )}
            </div>

            {/* Quick EMI preview for Buy */}
            {property.intent === 'Buy' && (
              <span className="text-[11px] font-semibold text-[#5e23dc] bg-[#f3f0fc] px-2 py-0.5 rounded-md">
                EMI ₹{(emiEstimate.monthlyEMI / 1000).toFixed(0)}k/mo
              </span>
            )}
          </div>

          {/* Title & Developer */}
          <h2 className="text-base font-bold text-[#191919] line-clamp-1 group-hover:text-[#5e23dc] transition-colors mb-1">
            {property.title}
          </h2>
          <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#5e23dc] shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Configuration specs row */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#f8f9fd] border border-[#e5e7eb] text-xs font-semibold text-[#434343] mb-3">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-[#5e23dc]" />
              <span>{property.bhk > 0 ? `${property.bhk} BHK` : property.type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-[#5e23dc]" />
              <span>{property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'Commercial'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-[#5e23dc]" />
              <span>{formatArea(property.carpetAreaSqFt)}</span>
            </div>
          </div>

          {/* Locality highlight snippet */}
          {property.localityInfo.topHighlights && property.localityInfo.topHighlights[0] && (
            <div className="text-[11px] text-[#6b7280] line-clamp-1 mb-1">
              ✨ <span className="text-[#191919] font-medium">{property.localityInfo.topHighlights[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 border-t border-[#e5e7eb]/60 flex items-center gap-2">
        {/* Contact Agent Button (Teal CTA #00bda6) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onContactAgent(property);
          }}
          className="flex-1 py-2 px-3 rounded-lg bg-[#00bda6] hover:bg-[#00a38f] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Contact Agent</span>
        </button>

        {/* View Details / Floor Plan Button (Outline violet) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProperty(property);
          }}
          className="flex-1 py-2 px-3 rounded-lg border border-[#5e23dc] text-[#5e23dc] hover:bg-[#f3f0fc] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Floor Plan & Specs</span>
        </button>
      </div>
    </div>
  );
};

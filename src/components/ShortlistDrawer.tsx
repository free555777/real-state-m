import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ExternalLink, 
  IndianRupee, 
  MapPin, 
  Check, 
  ArrowRight,
  Bed, 
  Maximize2,
  Calendar,
  Layers
} from 'lucide-react';
import { Property } from '../types/property';
import { formatIndianPrice, formatArea } from '../utils/propTechMath';

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedProperties: Property[];
  onRemoveShortlist: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookSiteVisit: (property: Property) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlistedProperties,
  onRemoveShortlist,
  onSelectProperty,
  onBookSiteVisit,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-extrabold text-[#191919]">
              Shortlisted Properties ({shortlistedProperties.length})
            </h2>
            <p className="text-xs text-[#6b7280]">
              Save and compare your dream homes side-by-side
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f2f3f8] text-[#6b7280] hover:text-[#191919] transition-colors cursor-pointer"
            aria-label="Close shortlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {shortlistedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#f3f0fc] text-[#5e23dc] flex items-center justify-center mx-auto text-2xl">
                🤍
              </div>
              <h3 className="text-base font-bold text-[#191919]">Your Shortlist is Empty</h3>
              <p className="text-xs text-[#6b7280] max-w-xs mx-auto">
                Click the heart icon on any property card to save and compare residences here.
              </p>
            </div>
          ) : showComparison ? (
            /* Comparison Table View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5e23dc]">
                  Side-by-Side Comparison
                </span>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-xs font-bold text-[#6b7280] hover:text-[#191919] hover:underline"
                >
                  Back to List
                </button>
              </div>

              <div className="overflow-x-auto border border-[#e5e7eb] rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8f9fd] border-b border-[#e5e7eb] text-[#6b7280] font-bold">
                    <tr>
                      <th className="p-3">Metric</th>
                      {shortlistedProperties.map((p) => (
                        <th key={p.id} className="p-3 min-w-[140px] text-[#191919] font-extrabold truncate">
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    <tr>
                      <td className="p-3 font-semibold text-[#6b7280]">Price</td>
                      {shortlistedProperties.map((p) => (
                        <td key={p.id} className="p-3 font-extrabold text-[#5e23dc]">
                          {formatIndianPrice(p.price, p.intent)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#6b7280]">Price / sq.ft</td>
                      {shortlistedProperties.map((p) => (
                        <td key={p.id} className="p-3 font-medium text-[#191919]">
                          ₹{p.pricePerSqFt.toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#6b7280]">Carpet Area</td>
                      {shortlistedProperties.map((p) => (
                        <td key={p.id} className="p-3 font-medium text-[#191919]">
                          {formatArea(p.carpetAreaSqFt)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#6b7280]">Configuration</td>
                      {shortlistedProperties.map((p) => (
                        <td key={p.id} className="p-3 font-medium text-[#191919]">
                          {p.bhk > 0 ? `${p.bhk} BHK` : p.type}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#6b7280]">Possession</td>
                      {shortlistedProperties.map((p) => (
                        <td key={p.id} className="p-3 font-medium text-[#191919]">
                          {p.possessionDate}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#6b7280]">RERA Verified</td>
                      {shortlistedProperties.map((p) => (
                        <td key={p.id} className="p-3 font-bold text-[#10b981]">
                          {p.isReraVerified ? '✓ Verified' : 'In Progress'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards List View */
            <div className="space-y-3">
              {shortlistedProperties.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-[#e5e7eb] hover:border-[#5e23dc]/40 transition-all bg-white flex gap-3 shadow-xs"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 cursor-pointer"
                    onClick={() => onSelectProperty(p)}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-sm font-extrabold text-[#191919]">
                          {formatIndianPrice(p.price, p.intent)}
                        </span>
                        <button
                          onClick={() => onRemoveShortlist(p.id)}
                          className="p-1 text-[#6b7280] hover:text-[#f43f5e] transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 
                        onClick={() => onSelectProperty(p)}
                        className="text-xs font-bold text-[#191919] truncate hover:text-[#5e23dc] cursor-pointer"
                      >
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-[#6b7280] truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#5e23dc]" />
                        <span>{p.locality}, {p.city}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#e5e7eb]/60 text-xs">
                      <button
                        onClick={() => onSelectProperty(p)}
                        className="text-[11px] font-bold text-[#5e23dc] hover:underline"
                      >
                        Inspect Specs
                      </button>
                      <span className="text-[#6b7280]">·</span>
                      <button
                        onClick={() => onBookSiteVisit(p)}
                        className="text-[11px] font-bold text-[#00bda6] hover:underline"
                      >
                        Book Visit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {shortlistedProperties.length > 0 && (
          <div className="p-4 sm:px-6 border-t border-[#e5e7eb] bg-[#f8f9fd] flex items-center justify-between gap-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex-1 py-2.5 rounded-full border border-[#5e23dc] text-[#5e23dc] font-bold text-xs hover:bg-[#f3f0fc] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{showComparison ? 'View Listings List' : 'Compare Side-by-Side'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full bg-[#5e23dc] hover:bg-[#4d1cb8] text-white font-bold text-xs shadow-md shadow-[#5e23dc]/20 transition-all cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

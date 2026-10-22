import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Compass, 
  MapPin, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  X,
  Navigation
} from 'lucide-react';
import { Property } from '../types/property';
import { formatIndianPrice } from '../utils/propTechMath';

interface InteractiveMapProps {
  properties: Property[];
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  onSelectProperty: (property: Property) => void;
  onHoverProperty: (propertyId: string | null) => void;
  currentCity: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onSelectProperty,
  onHoverProperty,
  currentCity,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [activePinPopup, setActivePinPopup] = useState<Property | null>(null);

  // Normalize lat/lng to container percentages for the visual map
  // Default center points for Indian metros
  const getCoordinatesPosition = (property: Property, index: number) => {
    // Generate deterministic scattered positions across the spatial canvas
    const basePositions: Record<string, { top: number; left: number }[]> = {
      Mumbai: [
        { top: 52, left: 38 }, // Worli
        { top: 40, left: 32 }, // Bandra West
        { top: 68, left: 45 }, // Alibaug
      ],
      Bengaluru: [
        { top: 48, left: 65 }, // Whitefield
        { top: 42, left: 45 }, // Indiranagar
      ],
      'Delhi NCR': [
        { top: 55, left: 45 }, // Golf Course Road
        { top: 35, left: 40 }, // Cyber City
      ],
      Hyderabad: [
        { top: 46, left: 42 }, // Hitec City
      ],
      Pune: [
        { top: 45, left: 52 }, // Koregaon Park
      ],
    };

    const cityCoords = basePositions[property.city];
    if (cityCoords && cityCoords.length > 0) {
      const pos = cityCoords[index % cityCoords.length];
      return {
        top: `${pos.top + ((index * 7) % 15) - 7}%`,
        left: `${pos.left + ((index * 11) % 15) - 7}%`,
      };
    }

    // Fallback deterministic spread
    const top = 30 + ((index * 23) % 45);
    const left = 25 + ((index * 29) % 55);
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="relative w-full h-[650px] lg:h-[calc(100vh-140px)] sticky top-36 bg-[#eef1f8] rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-inner select-none">
      
      {/* Map Graphic Canvas (Stylized Vector Grid or Satellite) */}
      <div 
        className={`w-full h-full transition-all duration-300 relative ${
          mapStyle === 'streets' 
            ? 'bg-[#eef2f8] bg-[radial-gradient(#cbc3d8_1px,transparent_1px)] [background-size:24px_24px]'
            : 'bg-[#1e293b]'
        }`}
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        {/* Geographic Simulated Landmark Lines (River / Coastlines / Expressways) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path
            d="M 0,220 Q 200,300 450,260 T 900,400"
            fill="none"
            stroke={mapStyle === 'streets' ? '#00bda6' : '#38bdf8'}
            strokeWidth="28"
            strokeLinecap="round"
            className="opacity-20"
          />
          <path
            d="M 150,0 Q 300,350 250,700"
            fill="none"
            stroke="#5e23dc"
            strokeWidth="4"
            strokeDasharray="8 6"
            className="opacity-30"
          />
          <path
            d="M 50,450 Q 400,480 800,380"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="4 4"
            className="opacity-40"
          />
        </svg>

        {/* Locality Cluster Watermarks */}
        <div className="absolute top-12 left-12 text-[#94a3b8]/40 font-extrabold text-2xl tracking-widest uppercase pointer-events-none">
          {currentCity !== 'All Cities' ? currentCity : 'Metro Corridor'}
        </div>
        <div className="absolute bottom-16 right-16 text-[#94a3b8]/30 font-bold text-lg tracking-wider pointer-events-none">
          Transit Line · RERA Zone
        </div>

        {/* Property Pins */}
        {properties.map((prop, idx) => {
          const pos = getCoordinatesPosition(prop, idx);
          const isSelected = selectedPropertyId === prop.id;
          const isHovered = hoveredPropertyId === prop.id;

          return (
            <div
              key={prop.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              onMouseEnter={() => onHoverProperty(prop.id)}
              onMouseLeave={() => onHoverProperty(null)}
            >
              {/* Pulsing ring on active */}
              {(isSelected || isHovered) && (
                <span className="absolute -inset-2 rounded-full bg-[#5e23dc]/30 animate-ping pointer-events-none" />
              )}

              {/* Pin Tag with Price */}
              <button
                type="button"
                onClick={() => {
                  setActivePinPopup(prop);
                  onSelectProperty(prop);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md transition-all transform cursor-pointer ${
                  isSelected || isHovered
                    ? 'bg-[#5e23dc] text-white scale-110 shadow-lg shadow-[#5e23dc]/40 ring-2 ring-white'
                    : 'bg-white text-[#191919] hover:bg-[#5e23dc] hover:text-white border border-[#e5e7eb] hover:scale-105'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>{formatIndianPrice(prop.price, prop.intent)}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-md overflow-hidden flex flex-col">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
            className="p-2 hover:bg-[#f3f0fc] text-[#191919] transition-colors cursor-pointer border-b border-[#e5e7eb]"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
            className="p-2 hover:bg-[#f3f0fc] text-[#191919] transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Map Style Toggle */}
        <button
          onClick={() => setMapStyle(mapStyle === 'streets' ? 'satellite' : 'streets')}
          className="p-2.5 bg-white rounded-xl border border-[#e5e7eb] shadow-md text-[#434343] hover:text-[#5e23dc] transition-colors cursor-pointer flex items-center justify-center"
          title="Toggle Map Style"
          aria-label="Toggle Map Style"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Reset View */}
        <button
          onClick={() => setZoomLevel(1)}
          className="p-2.5 bg-white rounded-xl border border-[#e5e7eb] shadow-md text-[#434343] hover:text-[#5e23dc] transition-colors cursor-pointer flex items-center justify-center"
          title="Center Map"
          aria-label="Center Map"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Banner (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#e5e7eb] shadow-sm flex items-center gap-3 text-[11px] font-semibold text-[#434343]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span>RERA Verified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5e23dc]" />
          <span>Active Focus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00bda6]" />
          <span>Transit Hubs</span>
        </div>
      </div>

      {/* Selected Pin Quick Preview Card */}
      {activePinPopup && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl border border-[#e5e7eb] shadow-xl p-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#10b981]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RERA Registered</span>
            </div>
            <button
              onClick={() => setActivePinPopup(null)}
              className="p-1 text-[#6b7280] hover:text-[#191919]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3">
            <img
              src={activePinPopup.images[0]}
              alt={activePinPopup.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-base font-extrabold text-[#191919]">
                {formatIndianPrice(activePinPopup.price, activePinPopup.intent)}
              </div>
              <h4 className="text-xs font-bold text-[#191919] truncate">
                {activePinPopup.title}
              </h4>
              <p className="text-[11px] text-[#6b7280] truncate">
                {activePinPopup.locality}, {activePinPopup.city}
              </p>
              <button
                onClick={() => onSelectProperty(activePinPopup)}
                className="mt-2 text-xs font-bold text-[#5e23dc] hover:underline flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export interface MapPropertyItem {
  id: string;
  title: string;
  price: string;
  priceNumeric: number;
  ratePerSqFt: string;
  locality: string;
  bhk: string;
  carpetArea: string;
  possession: string;
  image: string;
  isReraVerified: boolean;
  dealBadge?: string;
  demandBadge?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RealisticMapProps {
  properties: MapPropertyItem[];
  activePropertyId: string | null;
  onSelectProperty: (id: string) => void;
  onNavigateProduct: (propertyId?: string) => void;
  className?: string;
}

export const RealisticMap: React.FC<RealisticMapProps> = ({
  properties,
  activePropertyId,
  onSelectProperty,
  onNavigateProduct,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const tileLayerRef = useRef<any>(null);

  const [mapLayer, setMapLayer] = useState<'map' | 'transit' | 'satellite'>('map');
  const [searchAsMove, setSearchAsMove] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Active property object
  const activeProperty = properties.find((p) => p.id === activePropertyId) || null;

  // Initialize Leaflet map safely inside useEffect
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet to avoid SSR window issues
    import('leaflet').then((leafletModule) => {
      if (!isMounted || !mapContainerRef.current) return;

      const L = (leafletModule.default || leafletModule) as any;

      // Fix icon paths
      try {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      } catch (e) {
        // ignore
      }

      // If already initialized, clean up
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered at Bandra & Khar West, Mumbai
      const map = L.map(mapContainerRef.current, {
        center: [19.0645, 72.8335],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      // Realistic watermark-free cartography tiles
      const getTileUrl = (layer: 'map' | 'transit' | 'satellite') => {
        if (layer === 'satellite') {
          return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        }
        if (layer === 'transit') {
          return 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
        }
        // Esri World Street Map - realistic high-resolution street cartography with roads, street names & Arabian sea coastline
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      };

      const tileLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Add property markers with custom HTML
      const markers: Record<string, any> = {};

      properties.forEach((prop) => {
        const isActive = prop.id === activePropertyId;

        const customIcon = L.divIcon({
          className: 'realistic-marker-wrapper',
          html: `
            <div class="realistic-map-marker ${isActive ? 'active' : ''}" id="marker-${prop.id}">
              <img src="${prop.image}" alt="${prop.title}" class="marker-thumb" />
              <span class="marker-price">${prop.price}</span>
            </div>
          `,
          iconSize: [110, 32],
          iconAnchor: [55, 16],
        });

        const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], {
          icon: customIcon,
          riseOnHover: true,
        }).addTo(map);

        marker.on('click', () => {
          onSelectProperty(prop.id);
        });

        markers[prop.id] = marker;
      });

      markersRef.current = markers;
      setMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when mapLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    import('leaflet').then((leafletModule) => {
      const L = (leafletModule.default || leafletModule) as any;
      if (tileLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }

      let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      if (mapLayer === 'satellite') {
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      } else if (mapLayer === 'transit') {
        url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      }

      tileLayerRef.current = L.tileLayer(url, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    });
  }, [mapLayer]);

  // Update marker active styles when activePropertyId changes
  useEffect(() => {
    properties.forEach((prop) => {
      const el = document.getElementById(`marker-${prop.id}`);
      if (el) {
        if (prop.id === activePropertyId) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });

    // Pan map to active property if available
    if (activeProperty && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([activeProperty.coordinates.lat, activeProperty.coordinates.lng], {
        animate: true,
        duration: 0.6,
      });
    }
  }, [activePropertyId, activeProperty, properties]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className={`relative flex flex-col gap-3 ${className}`}>
      {/* Map Viewport Card */}
      <div className="w-full h-[620px] rounded-2xl overflow-hidden relative shadow-[0_4px_20px_rgba(94,35,220,0.08)] bg-[#eef2f8] border border-[#e5e7eb]">
        
        {/* Leaflet Realistic Map Container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Fallback Cartographic Graphic (rendered behind or during load) */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-[#eef2f8] flex items-center justify-center z-0">
            <div className="flex flex-col items-center gap-2 text-xs font-semibold text-[#7a7487]">
              <span className="w-6 h-6 border-2 border-[#5e23dc] border-t-transparent rounded-full animate-spin" />
              <span>Loading Realistic Mumbai Cartography...</span>
            </div>
          </div>
        )}

        {/* Floating Top Controls (Image 1 & Image 2 design) */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-auto z-20">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-full shadow-md text-[#1c1b1b] text-xs font-semibold border border-gray-200/80">
            <button
              onClick={() => setMapLayer('map')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                mapLayer === 'map' ? 'bg-[#5e23dc] text-white shadow-xs font-bold' : 'hover:bg-[#f6f3f2] text-gray-700'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapLayer('transit')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                mapLayer === 'transit' ? 'bg-[#5e23dc] text-white shadow-xs font-bold' : 'hover:bg-[#f6f3f2] text-gray-700'
              }`}
            >
              Transit
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                mapLayer === 'satellite' ? 'bg-[#5e23dc] text-white shadow-xs font-bold' : 'hover:bg-[#f6f3f2] text-gray-700'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-md text-[#1c1b1b] border border-gray-200/80">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f6f3f2] transition-colors text-[#5e23dc] font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f6f3f2] transition-colors text-[#5e23dc] font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </button>
          </div>
        </div>

        {/* Floating Active Property Preview Card (Image 1 style) */}
        {activeProperty && (
          <div className="absolute bottom-14 right-3.5 w-[265px] bg-white rounded-2xl p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.2)] border border-[#e5e7eb] pointer-events-auto z-30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="h-24 rounded-xl overflow-hidden relative mb-1.5">
              <img
                src={activeProperty.image}
                alt={activeProperty.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 bg-[#10b981] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                RERA VERIFIED
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProperty('');
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                aria-label="Close preview"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="text-xs font-bold text-[#1c1b1b] truncate">{activeProperty.title}</div>
            <div className="text-[11px] font-bold text-[#5e23dc] mt-0.5">
              {activeProperty.price} • {activeProperty.bhk}
            </div>
            <div className="text-[10px] text-[#7a7487] truncate flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {activeProperty.locality}
            </div>
            <button
              onClick={() => onNavigateProduct(activeProperty.id)}
              className="w-full mt-2 py-1.5 bg-[#5e23dc] hover:bg-[#4d1bb9] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1"
            >
              <span>View Full Listing</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Floating Bottom Status Bar (Image 1 design) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-[#1c1b1b] border border-gray-200/80 z-20 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-[11px]">Live Map Search Active</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md text-[#1c1b1b] text-xs border border-gray-200/80 z-20 pointer-events-auto">
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[11px]">
            <input
              type="checkbox"
              checked={searchAsMove}
              onChange={(e) => setSearchAsMove(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#5e23dc] rounded cursor-pointer"
            />
            <span>Search as I move</span>
          </label>
        </div>

      </div>

      {/* Neighborhood Commute & Lifestyle Score Card (Image 1 bottom card) */}
      <div className="bg-white rounded-xl p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#5e23dc] text-base">commute</span>
            Commute & Lifestyle Score
          </span>
          <span className="text-xs text-[#006b5d] font-bold">9.4 / 10 Excellent</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-[#f6f3f2] p-2 rounded-lg">
            <div className="text-sm font-extrabold text-[#5e23dc]">4 min</div>
            <div className="text-[10px] text-[#7a7487]">To Khar Station</div>
          </div>
          <div className="bg-[#f6f3f2] p-2 rounded-lg">
            <div className="text-sm font-extrabold text-[#006b5d]">12 min</div>
            <div className="text-[10px] text-[#7a7487]">Bandra-Worli Sealink</div>
          </div>
          <div className="bg-[#f6f3f2] p-2 rounded-lg">
            <div className="text-sm font-extrabold text-[#1c1b1b]">25 min</div>
            <div className="text-[10px] text-[#7a7487]">Mumbai Airport (T2)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

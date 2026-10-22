import React from 'react';
import { 
  ShieldCheck, 
  Key, 
  Percent, 
  Map as MapIcon, 
  Grid3X3, 
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';

interface FilterBarProps {
  totalResults: number;
  onlyVerified: boolean;
  onToggleVerified: () => void;
  onlyReadyToMove: boolean;
  onToggleReadyToMove: () => void;
  onlyZeroBrokerage: boolean;
  onToggleZeroBrokerage: () => void;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'area-high' | 'newest';
  onSortChange: (sort: 'recommended' | 'price-low' | 'price-high' | 'area-high' | 'newest') => void;
  viewMode: 'split' | 'grid';
  onToggleViewMode: (mode: 'split' | 'grid') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  totalResults,
  onlyVerified,
  onToggleVerified,
  onlyReadyToMove,
  onToggleReadyToMove,
  onlyZeroBrokerage,
  onToggleZeroBrokerage,
  sortBy,
  onSortChange,
  viewMode,
  onToggleViewMode,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white border-b border-[#e5e7eb] sticky top-18 z-30 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Left: Total counts & quick filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[#191919] whitespace-nowrap mr-2">
              <span className="text-[#5e23dc]">{totalResults}</span> Properties
            </span>

            {/* RERA Verified Toggle Pill */}
            <button
              onClick={onToggleVerified}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                onlyVerified
                  ? 'bg-[#f3f0fc] border-[1.5px] border-[#5e23dc] text-[#5e23dc] shadow-xs'
                  : 'bg-white border border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${onlyVerified ? 'text-[#10b981]' : 'text-[#6b7280]'}`} />
              <span>RERA Verified Only</span>
            </button>

            {/* Ready to Move Toggle Pill */}
            <button
              onClick={onToggleReadyToMove}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                onlyReadyToMove
                  ? 'bg-[#f3f0fc] border-[1.5px] border-[#5e23dc] text-[#5e23dc] shadow-xs'
                  : 'bg-white border border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#5e23dc]" />
              <span>Ready to Move</span>
            </button>

            {/* Zero Brokerage Toggle Pill */}
            <button
              onClick={onToggleZeroBrokerage}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                onlyZeroBrokerage
                  ? 'bg-[#f3f0fc] border-[1.5px] border-[#5e23dc] text-[#5e23dc] shadow-xs'
                  : 'bg-white border border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-[#00bda6]" />
              <span>Zero Brokerage</span>
            </button>

            {/* Reset Filters button if any active */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#f43f5e] hover:bg-[#ffdadb] rounded-full transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Sort & View switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5e23dc]" />
              <span className="font-semibold hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="bg-white border border-[#e5e7eb] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc] cursor-pointer"
              >
                <option value="recommended">Recommended & Verified</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="area-high">Carpet Area: Largest</option>
                <option value="newest">Recently Listed</option>
              </select>
            </div>

            {/* View Mode Switcher (Split Map vs Full Grid) */}
            <div className="flex items-center bg-[#f2f3f8] p-1 rounded-lg border border-[#e5e7eb]">
              <button
                onClick={() => onToggleViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-[#5e23dc] shadow-xs'
                    : 'text-[#434343] hover:text-[#191919]'
                }`}
                title="Split Card & Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map Split</span>
              </button>
              <button
                onClick={() => onToggleViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#5e23dc] shadow-xs'
                    : 'text-[#434343] hover:text-[#191919]'
                }`}
                title="Full Grid View"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

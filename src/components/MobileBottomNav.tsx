import React, { useState } from 'react';
import { ActivePage } from './HousingHeader';

interface MobileBottomNavProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage, planTab?: 'owner' | 'buyer') => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onNavigate,
  savedCount,
  onOpenSaved,
}) => {
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleServicesClick = () => {
    // If on homepage, smooth scroll to edge-services section; otherwise open quick services modal
    const section = document.getElementById('edge-services');
    if (activePage === 'home' && section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsServicesModalOpen(true);
    }
  };

  const handleServiceSelect = (actionType: 'loan' | 'agreement' | 'packers' | 'valuation') => {
    setIsServicesModalOpen(false);
    if (actionType === 'loan') {
      onNavigate('product');
    } else if (actionType === 'valuation') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('edge-services')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      onNavigate('search');
    }
  };

  const triggerAnimation = (name: string, callback: () => void) => {
    setPressedButton(name);
    setTimeout(() => setPressedButton(null), 250);
    callback();
  };

  return (
    <>
      {/* Fixed Mobile Bottom Navbar (Strictly hidden on sm+ devices: sm:hidden) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 py-1 flex items-center justify-around select-none safe-area-pb"
      >
        {/* 1. Search */}
        <button
          type="button"
          onClick={() => triggerAnimation('search', () => onNavigate('search'))}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 transition-all duration-200 cursor-pointer relative min-h-[52px] group ${
            pressedButton === 'search' ? 'scale-90' : 'active:scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span 
              className={`material-symbols-outlined text-[24px] text-black transition-all duration-300 ease-out ${
                activePage === 'search' 
                  ? 'scale-110 -translate-y-0.5 font-bold' 
                  : 'group-hover:-translate-y-0.5'
              }`}
            >
              search
            </span>
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 transition-colors duration-200 ${
            activePage === 'search' ? 'text-black font-extrabold' : 'text-stone-700 font-medium'
          }`}>
            Search
          </span>
          {activePage === 'search' && (
            <span className="w-1.5 h-1.5 rounded-full bg-black absolute bottom-0.5 animate-in zoom-in duration-200" />
          )}
        </button>

        {/* 2. Post Property */}
        <button
          type="button"
          onClick={() => triggerAnimation('post', () => onNavigate('post-property'))}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 transition-all duration-200 cursor-pointer relative min-h-[52px] group ${
            pressedButton === 'post' ? 'scale-90' : 'active:scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span 
              className={`material-symbols-outlined text-[24px] text-black transition-all duration-300 ease-out ${
                activePage === 'post-property' 
                  ? 'scale-110 -translate-y-0.5 font-bold' 
                  : 'group-hover:-translate-y-0.5'
              }`}
            >
              add_circle
            </span>
            {/* Sleek Minimalist Black FREE Badge */}
            <span className="absolute -top-1.5 -right-3.5 px-1.5 py-0.2 rounded-full bg-black text-white text-[7.5px] font-black uppercase tracking-wider shadow-xs ring-1 ring-white">
              FREE
            </span>
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap transition-colors duration-200 ${
            activePage === 'post-property' ? 'text-black font-extrabold' : 'text-stone-700 font-medium'
          }`}>
            Post Property
          </span>
          {activePage === 'post-property' && (
            <span className="w-1.5 h-1.5 rounded-full bg-black absolute bottom-0.5 animate-in zoom-in duration-200" />
          )}
        </button>

        {/* 3. Premium (Plans) */}
        <button
          type="button"
          onClick={() => triggerAnimation('plans', () => onNavigate('plans'))}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 transition-all duration-200 cursor-pointer relative min-h-[52px] group ${
            pressedButton === 'plans' ? 'scale-90' : 'active:scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span 
              className={`material-symbols-outlined text-[24px] text-black transition-all duration-300 ease-out ${
                activePage === 'plans' 
                  ? 'scale-110 -translate-y-0.5 font-bold' 
                  : 'group-hover:-translate-y-0.5'
              }`}
            >
              workspace_premium
            </span>
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 transition-colors duration-200 ${
            activePage === 'plans' ? 'text-black font-extrabold' : 'text-stone-700 font-medium'
          }`}>
            Premium
          </span>
          {activePage === 'plans' && (
            <span className="w-1.5 h-1.5 rounded-full bg-black absolute bottom-0.5 animate-in zoom-in duration-200" />
          )}
        </button>

        {/* 4. Services */}
        <button
          type="button"
          onClick={() => triggerAnimation('services', handleServicesClick)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 transition-all duration-200 cursor-pointer relative min-h-[52px] group ${
            pressedButton === 'services' ? 'scale-90' : 'active:scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] text-black transition-all duration-300 ease-out group-hover:-translate-y-0.5">
              home_repair_service
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 text-stone-700 font-medium">
            Services
          </span>
        </button>

        {/* 5. Saved */}
        <button
          type="button"
          onClick={() => triggerAnimation('saved', onOpenSaved)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 transition-all duration-200 cursor-pointer relative min-h-[52px] group ${
            pressedButton === 'saved' ? 'scale-90' : 'active:scale-95'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] text-black transition-all duration-300 ease-out group-hover:-translate-y-0.5">
              favorite
            </span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center shadow-xs ring-1 ring-white animate-in zoom-in duration-200">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 text-stone-700 font-medium">
            Saved
          </span>
        </button>
      </nav>

      {/* Services Quick Drawer / Modal on Mobile */}
      {isServicesModalOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end animate-in fade-in duration-200"
          onClick={() => setIsServicesModalOpen(false)}
        >
          <div 
            className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-stone-200 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-black text-xl">home_repair_service</span>
                <h3 className="text-base font-bold text-stone-900">Vindhya Edge Services</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsServicesModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <button
                type="button"
                onClick={() => handleServiceSelect('loan')}
                className="p-3.5 rounded-2xl bg-stone-50 text-left border border-stone-200 hover:border-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-black text-2xl mb-1 block">real_estate_agent</span>
                <span className="font-bold text-stone-900 block text-xs">Home Loans</span>
                <span className="text-[10px] text-stone-500">From 8.35% p.a.</span>
              </button>

              <button
                type="button"
                onClick={() => handleServiceSelect('agreement')}
                className="p-3.5 rounded-2xl bg-stone-50 text-left border border-stone-200 hover:border-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-black text-2xl mb-1 block">description</span>
                <span className="font-bold text-stone-900 block text-xs">Rent Agreement</span>
                <span className="text-[10px] text-stone-500">Doorstep delivery</span>
              </button>

              <button
                type="button"
                onClick={() => handleServiceSelect('packers')}
                className="p-3.5 rounded-2xl bg-stone-50 text-left border border-stone-200 hover:border-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-black text-2xl mb-1 block">local_shipping</span>
                <span className="font-bold text-stone-900 block text-xs">Packers &amp; Movers</span>
                <span className="text-[10px] text-stone-500">Zero damage guarantee</span>
              </button>

              <button
                type="button"
                onClick={() => handleServiceSelect('valuation')}
                className="p-3.5 rounded-2xl bg-stone-50 text-left border border-stone-200 hover:border-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-black text-2xl mb-1 block">calculate</span>
                <span className="font-bold text-stone-900 block text-xs">Price Calculator</span>
                <span className="text-[10px] text-stone-500">AI Valuation model</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

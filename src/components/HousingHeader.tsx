import React, { useState, useRef, useEffect } from 'react';

export type ActivePage = 'home' | 'search' | 'product' | 'post-property' | 'plans';

interface HousingHeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage, planTab?: 'owner' | 'buyer') => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export const HousingHeader: React.FC<HousingHeaderProps> = ({
  activePage,
  onNavigate,
  savedCount,
  onOpenSaved,
}) => {
  const [selectedCity, setSelectedCity] = useState('All India');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const loginMenuRef = useRef<HTMLDivElement>(null);

  const cities = [
    'All India',
    'Mumbai / MMR',
    'Bengaluru',
    'Delhi NCR (Gurgaon/Noida)',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setActiveNavDropdown(null);
      }
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target as Node)) {
        setIsLoginMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    {
      id: 'buyers',
      label: 'For Buyers',
      items: [
        { title: 'Buyer’s Feature', desc: 'Post requirement & unlock contacts (₹49 / 3 mo)', badge: 'OFFER', action: () => onNavigate('plans', 'buyer') },
        { title: 'Buy Ready to Move Homes', desc: 'Verified ready apartments', action: () => onNavigate('search') },
        { title: 'Luxury Apartments & Villas', desc: 'Premium gated communities', action: () => onNavigate('search') },
        { title: 'New Project Launches', desc: 'Exclusive developer launches', action: () => onNavigate('product') },
        { title: 'Verified Resale Properties', desc: 'Direct owner listings', action: () => onNavigate('search') },
        { title: 'Commercial & Retail Spaces', desc: 'Shops & Grade A offices', action: () => onNavigate('search') },
        { title: 'Home Loan EMI Calculator', desc: 'Calculate lowest EMI rates', action: () => onNavigate('home') },
      ],
    },
    {
      id: 'tenants',
      label: 'For Tenants',
      items: [
        { title: 'Rental Flats & Apartments', desc: 'Thousands of verified rentals', action: () => onNavigate('search') },
        { title: 'Furnished Homes for Rent', desc: 'Ready with furniture & appliances', action: () => onNavigate('search') },
        { title: 'PG & Co-living Spaces', desc: 'Budget & single occupancy', action: () => onNavigate('search') },
        { title: 'Commercial Office Lease', desc: 'Retail & business spaces', action: () => onNavigate('search') },
        { title: 'Online Rent Agreement', desc: 'Instant doorstep agreement', action: () => onNavigate('home') },
      ],
    },
    {
      id: 'sellers',
      label: 'For Sellers',
      items: [
        { title: 'Owner', desc: 'List property across 6 categories (₹199 / 3 mo)', badge: 'POPULAR', action: () => onNavigate('plans', 'owner') },
        { title: 'Post Property for Free', desc: 'Reach 50,000+ active buyers', badge: 'FREE', action: () => onNavigate('post-property') },
        { title: 'Seller Dashboard', desc: 'Track views & buyer enquiries', action: () => onNavigate('post-property') },
        { title: 'Free Property Valuation', desc: 'Estimate market price accurately', action: () => onNavigate('home') },
        { title: 'Owner Assistance Packages', desc: 'Dedicated RM & photoshoot', action: () => onNavigate('post-property') },
        { title: 'Find Top Verified Agents', desc: 'Connect with certified local brokers', action: () => onNavigate('search') },
      ],
    },
    {
      id: 'services',
      label: 'Services',
      items: [
        { title: 'Vindhya Edge Services', desc: 'Complete end-to-end support', action: () => onNavigate('home') },
        { title: 'Instant Home Loans', desc: 'Lowest interest rates from 8.35%', action: () => onNavigate('home') },
        { title: 'Interior Design & Renovation', desc: 'Custom interiors with warranty', action: () => onNavigate('home') },
        { title: 'Legal Title & Due Diligence', desc: 'Comprehensive property check', action: () => onNavigate('home') },
        { title: 'Packers & Movers', desc: 'Safe & hassle-free shifting', action: () => onNavigate('home') },
      ],
    },
    {
      id: 'news',
      label: 'News & Guide',
      items: [
        { title: 'Real Estate News', desc: 'Latest property market updates', action: () => onNavigate('home') },
        { title: 'Locality & Area Guides', desc: 'Price trends & neighborhood ratings', action: () => onNavigate('home') },
        { title: 'First-time Home Buyer Guide', desc: 'Step-by-step checklists & tips', action: () => onNavigate('home') },
        { title: 'Tax & RERA Advisory', desc: 'Legal guidelines & property laws', action: () => onNavigate('home') },
      ],
    },
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsOtpSent(false);
    setOtpCode('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)] border-b border-stone-200/80">
      <div className="h-16 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-1.5 xl:gap-3 flex-nowrap">
        
        {/* Left: Brand Logo & Region Selector */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Housing.com Logo matching reference screenshot */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 cursor-pointer focus:outline-none group select-none text-left flex-shrink-0"
          >
            {/* Vindhya Reality Brand Logo Badge */}
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-gradient-to-tr from-[#4500b4] via-[#5e23dc] to-[#7c3aed] flex items-center justify-center shadow-md shadow-[#5e23dc]/25 flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 6L12.5 24H19.5L27 6H21.5L16 19.5L10.5 6H5Z" fill="white" />
                <path d="M16 7L20.5 15H11.5L16 7Z" fill="#FBBF24" />
                <circle cx="16" cy="12" r="1.5" fill="#4500B4" />
              </svg>
            </div>

            {/* Wordmark VINDHYA REALITY */}
            <div className="flex items-baseline whitespace-nowrap flex-shrink-0">
              <span className="font-black text-lg sm:text-[20px] tracking-tight text-stone-900 group-hover:text-black transition-colors leading-none">
                VINDHYA
              </span>
              <span className="font-bold text-xs sm:text-[13px] tracking-tight text-[#5e23dc] ml-1 leading-none">
                REALITY
              </span>
            </div>
          </button>

          {/* Region / City Dropdown: 'All India ⌵' (Hidden on mobile preview, shown on sm+) */}
          <div className="hidden sm:block relative flex-shrink-0" ref={cityDropdownRef}>
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="inline-flex items-center gap-0.5 text-xs sm:text-[13px] font-semibold text-stone-800 hover:text-stone-950 px-1.5 sm:px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0"
            >
              <span className="whitespace-nowrap max-w-[85px] sm:max-w-none truncate">{selectedCity}</span>
              <span className="material-symbols-outlined text-base text-stone-500 font-bold transition-transform duration-200 shrink-0">
                {cityDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in duration-150">
                <div className="px-3.5 py-1.5 font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                  Select City / Region
                </div>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between cursor-pointer whitespace-nowrap ${
                      selectedCity === city
                        ? 'bg-[#f3f0fc] text-[#5e23dc] font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950 font-medium'
                    }`}
                  >
                    <span className="whitespace-nowrap">{city}</span>
                    {selectedCity === city && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5e23dc] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Center: Dropdown Navigation Links matching screenshot (Strict single line, no wrapping) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-nowrap flex-shrink-0" ref={navDropdownRef}>
          {navItems.map((nav) => {
            const isOpen = activeNavDropdown === nav.id;

            return (
              <div key={nav.id} className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveNavDropdown(isOpen ? null : nav.id)}
                  className={`inline-flex items-center gap-0.5 px-2 py-1.5 rounded-lg text-[13px] xl:text-[13.5px] transition-colors cursor-pointer select-none font-medium whitespace-nowrap flex-shrink-0 ${
                    isOpen
                      ? 'text-[#5e23dc] bg-[#f3f0fc] font-semibold'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/70'
                  }`}
                >
                  <span className="whitespace-nowrap">{nav.label}</span>
                  <span className="material-symbols-outlined text-base text-stone-500 font-bold shrink-0">
                    {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </button>

                {isOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in duration-150 space-y-0.5">
                    {nav.items.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          item.action();
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-800 group-hover:text-[#5e23dc] transition-colors whitespace-nowrap">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 bg-[#e11d48] text-white text-[9px] font-extrabold rounded uppercase tracking-wider shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="material-symbols-outlined text-stone-400 group-hover:text-[#5e23dc] text-sm group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
                          chevron_right
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Actions matching screenshot (Strict single line, no wrapping) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 flex-nowrap" ref={loginMenuRef}>
          
          {/* Mobile Only: Download App */}
          <button
            type="button"
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex sm:hidden items-center gap-1 text-xs font-bold text-[#5e23dc] bg-[#f3f0fc] hover:bg-[#ede9e8] px-2.5 py-1.5 rounded-full border border-purple-200/70 transition-all cursor-pointer shadow-2xs active:scale-95 flex-shrink-0"
            aria-label="Download App"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span className="text-[11px] font-extrabold whitespace-nowrap">App</span>
          </button>

          {/* Mobile Only: Profile Icon */}
          <button
            type="button"
            onClick={() => {
              if (isLoggedIn) {
                setIsLoginMenuOpen(!isLoginMenuOpen);
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className="w-8 h-8 flex sm:hidden rounded-full bg-[#f6f3f2] hover:bg-[#ede9e8] text-stone-800 border border-stone-200 items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 flex-shrink-0"
            aria-label="User Profile"
          >
            <span className="material-symbols-outlined text-lg text-stone-700">
              {isLoggedIn ? 'account_circle' : 'person'}
            </span>
          </button>

          {/* Desktop/Tablet Only: Download App */}
          <button
            type="button"
            onClick={() => setIsDownloadModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1 text-[13px] xl:text-[13.5px] font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 px-2 py-1.5 rounded-lg transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0"
          >
            <span className="whitespace-nowrap">Download App</span>
          </button>

          {/* Desktop/Tablet Only: Post Property with FREE Badge */}
          <button
            type="button"
            onClick={() => onNavigate('post-property')}
            className={`hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold px-2 py-1.5 rounded-lg transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
              activePage === 'post-property'
                ? 'text-[#5e23dc] bg-[#f3f0fc]'
                : 'text-stone-800 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span className="whitespace-nowrap">Post Property</span>
            <span className="px-1.5 py-0.5 rounded bg-[#ff385c] text-white text-[9px] font-black uppercase tracking-wider shrink-0">
              FREE
            </span>
          </button>

          {/* Desktop/Tablet Only: Login | ☰ Pill Button */}
          <div className="relative hidden sm:flex flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none whitespace-nowrap flex-shrink-0"
            >
              <span className="text-xs sm:text-[13px] font-bold text-stone-900 whitespace-nowrap">
                {isLoggedIn ? 'Account' : 'Login'}
              </span>
              
              {/* Vertical divider */}
              <div className="h-3.5 w-px bg-stone-300 shrink-0" />
              
              {/* Hamburger Icon */}
              <div className="flex flex-col justify-center items-center w-3.5 h-3.5 gap-1 shrink-0">
                <span className="w-3.5 h-[1.5px] bg-stone-700 rounded-full" />
                <span className="w-3.5 h-[1.5px] bg-stone-700 rounded-full" />
                <span className="w-3.5 h-[1.5px] bg-stone-700 rounded-full" />
              </div>
            </button>
          </div>

          {/* Shared Login / Profile Dropdown Menu */}
          {isLoginMenuOpen && (
            <div className="absolute right-2 sm:right-4 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2.5 z-50 text-xs animate-in fade-in duration-150">
              
              {/* User Status / Login Action */}
              <div className="px-4 py-2 border-b border-stone-100">
                {isLoggedIn ? (
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Welcome Back!</span>
                    <span className="text-stone-500 text-[11px]">+91 {loginPhone || '9876543210'}</span>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-xs transition-colors text-center cursor-pointer shadow-xs"
                    >
                      Login / Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Menu items */}
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMenuOpen(false);
                    onOpenSaved();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between text-stone-700 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-rose-500">favorite</span>
                    <span>Saved Properties</span>
                  </div>
                  {savedCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMenuOpen(false);
                    onNavigate('search');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-stone-500">search</span>
                  <span>Browse Properties</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMenuOpen(false);
                    onNavigate('post-property');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between text-stone-700 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-emerald-600">add_home</span>
                    <span>Post Property</span>
                  </div>
                  <span className="px-1.5 py-0.2 bg-[#ff385c] text-white rounded text-[9px] font-black uppercase">
                    FREE
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMenuOpen(false);
                    setIsDownloadModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-stone-500">smartphone</span>
                  <span>Download Vindhya Reality App</span>
                </button>

                <div className="border-t border-stone-100 my-1" />

                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsLoginMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 text-rose-600 font-bold cursor-pointer"
                  >
                    Logout
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Mobile Menu Button (Hamburger Drawer Toggle - Only for Tablet screens sm to lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 hidden sm:block lg:hidden cursor-pointer"
            aria-label="Toggle Tablet Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Navigation</span>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="text-xs font-bold text-[#5e23dc] hover:underline"
            >
              {isLoggedIn ? 'My Account' : 'Login / Register'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-stone-100 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-[#5e23dc]">home</span>
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('search');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-stone-100 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-[#5e23dc]">search</span>
              <span>For Buyers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('search');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-stone-100 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-[#5e23dc]">apartment</span>
              <span>For Tenants</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('post-property');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-purple-50 text-left hover:bg-purple-100 flex items-center gap-1.5 text-[#5e23dc]"
            >
              <span className="material-symbols-outlined text-base">add_home</span>
              <span>Post Property</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('plans', 'owner');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-stone-100 flex items-center gap-1.5 col-span-1"
            >
              <span className="material-symbols-outlined text-base text-[#5e23dc]">verified_user</span>
              <span>Owner (₹199)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('plans', 'buyer');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-rose-50 text-left hover:bg-rose-100 flex items-center gap-1.5 col-span-1 text-[#e11d48]"
            >
              <span className="material-symbols-outlined text-base text-[#ff385c]">local_offer</span>
              <span>Buyer’s Feature</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSaved();
              }}
              className="w-full text-left py-2 px-2 text-xs font-medium text-stone-700 flex items-center justify-between"
            >
              <span>Saved Shortlist</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold">
                {savedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsDownloadModalOpen(true);
              }}
              className="w-full text-left py-2 px-2 text-xs font-medium text-stone-700 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">smartphone</span>
              <span>Download Vindhya Reality App</span>
            </button>
          </div>
        </div>
      )}

      {/* Login / Register Dialog Modal */}
      {isLoginModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4500b4] via-[#5e23dc] to-[#7c3aed] flex items-center justify-center shadow-xs">
                  <svg viewBox="0 0 32 32" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 6L12.5 24H19.5L27 6H21.5L16 19.5L10.5 6H5Z" fill="white" />
                    <path d="M16 7L20.5 15H11.5L16 7Z" fill="#FBBF24" />
                    <circle cx="16" cy="12" r="1.5" fill="#4500B4" />
                  </svg>
                </div>
                <span className="font-extrabold text-stone-900 text-base">Login to Vindhya Reality</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="pt-4">
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className="text-xs text-stone-600">
                    Enter your mobile number to receive an instant OTP for verification.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Mobile Number
                    </label>
                    <div className="flex items-center rounded-xl border border-stone-300 px-3 py-2 focus-within:ring-2 focus-within:ring-[#5e23dc]">
                      <span className="text-xs font-bold text-stone-500 mr-2">+91</span>
                      <input 
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full text-sm text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Continue
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-xs text-stone-600">
                    OTP sent to <span className="font-bold text-stone-900">+91 {loginPhone}</span>.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Enter 4-Digit OTP
                    </label>
                    <input 
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 4821"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-bold py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Verify & Proceed
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="w-full text-center text-xs text-stone-500 hover:text-stone-800"
                  >
                    Change Number
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Housing App Modal */}
      {isDownloadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsDownloadModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => setIsDownloadModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4500b4] via-[#5e23dc] to-[#7c3aed] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#5e23dc]/30">
              <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 6L12.5 24H19.5L27 6H21.5L16 19.5L10.5 6H5Z" fill="white" />
                <path d="M16 7L20.5 15H11.5L16 7Z" fill="#FBBF24" />
                <circle cx="16" cy="12" r="1.5" fill="#4500B4" />
              </svg>
            </div>

            <h3 className="text-lg font-extrabold text-stone-900">
              Download Vindhya Reality App
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Get real-time alerts, direct owner contact numbers, and 360° virtual tours on the go.
            </p>

            {/* QR Code Container */}
            <div className="my-5 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 inline-block shadow-inner">
              <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center border border-stone-200">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-stone-900">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm0 4h4v2h-4v-2zm-4-4h2v6h-2v-6zm-2 2h2v2h-2v-2zm4-6h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                </svg>
              </div>
              <span className="text-[10px] text-stone-500 block mt-1.5 font-medium">Scan to install</span>
            </div>

            <div className="flex justify-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-bold">Google Play</span>
              <span className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-bold">App Store</span>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

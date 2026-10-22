import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  PhoneCall,
  Lock,
  Unlock,
  AlertCircle,
  FileCheck,
  Upload,
  ArrowRight,
  Sparkles,
  Building2,
  Home,
  Check,
  HelpCircle,
  UserCheck,
  CreditCard,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  Clock,
  Info
} from 'lucide-react';
import { ActivePage } from '../components/HousingHeader';
import {
  SUBSCRIPTION_PLANS,
  OWNER_CATEGORIES,
  BUYER_CATEGORIES,
  PropertyCategory,
  BuyerPropertyCategory,
  calculateSubscriptionValidity,
  validateOwnerListingData,
  validateBuyerRequirementData,
  calculateContactUnlockQuota,
  formatINR,
  OwnerListingInput,
  BuyerRequirementInput,
} from '../utils/subscriptionRules';

interface SubscriptionPageProps {
  initialPlan?: 'owner' | 'buyer';
  onNavigate: (page: ActivePage, planTab?: 'owner' | 'buyer') => void;
  onSuccessToast?: (msg: string) => void;
}

interface MockMatchedContact {
  id: string;
  name: string;
  propertyTitle: string;
  category: string;
  price: string;
  location: string;
  rawPhone: string;
  isUnlocked: boolean;
}

const INITIAL_CONTACTS: MockMatchedContact[] = [
  {
    id: 'c1',
    name: 'Rajesh Sharma',
    propertyTitle: '3 BHK Sea-View Luxury Apartment',
    category: 'Residential',
    price: '₹3.40 Cr',
    location: 'Worli Sea Face, Mumbai',
    rawPhone: '+91 98201 44821',
    isUnlocked: false,
  },
  {
    id: 'c2',
    name: 'Ananya Deshmukh',
    propertyTitle: 'Grade A Commercial Office Space 1,800 sq.ft',
    category: 'Commercial',
    price: '₹1.85 L / mo',
    location: 'BKC G-Block, Mumbai',
    rawPhone: '+91 98190 77312',
    isUnlocked: false,
  },
  {
    id: 'c3',
    name: 'Vikram & Sunita Singhal',
    propertyTitle: '2.5 Acres Clear Title Farmhouse Land',
    category: 'Farmhouse / Land',
    price: '₹85 L',
    location: 'Alibaug Waterfront, MMR',
    rawPhone: '+91 97692 11094',
    isUnlocked: false,
  },
  {
    id: 'c4',
    name: 'Sandeep Khurana',
    propertyTitle: '2 BHK Modern Highrise with Balcony',
    category: 'Residential',
    price: '₹48,000 / mo',
    location: 'Powai Lake Promenade, Mumbai',
    rawPhone: '+91 98923 66520',
    isUnlocked: false,
  },
  {
    id: 'c5',
    name: 'Meera Kulkarni',
    propertyTitle: 'Commercial Showroom on Main Road',
    category: 'Commercial',
    price: '₹4.20 Cr',
    location: 'Andheri West Link Road, Mumbai',
    rawPhone: '+91 98211 99341',
    isUnlocked: false,
  },
  {
    id: 'c6',
    name: 'Capt. Arvind Nair',
    propertyTitle: '4 BHK Duplex Penthouse with Private Terrace',
    category: 'Builder Project',
    price: '₹7.90 Cr',
    location: 'Bandra West Pali Hill, Mumbai',
    rawPhone: '+91 98330 55198',
    isUnlocked: false,
  },
];

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  initialPlan = 'owner',
  onNavigate,
  onSuccessToast,
}) => {
  const [activePlanTab, setActivePlanTab] = useState<'owner' | 'buyer'>(initialPlan);
  
  // User login simulation state
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('98765 43210');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'owner' | 'buyer' | null>(null);

  // Active Subscriptions State
  const [activeOwnerSub, setActiveOwnerSub] = useState<{
    isActive: boolean;
    validityEnd: string;
    listingTitle: string;
    category: string;
    city: string;
    price: string;
    kycStatus: 'Verified' | 'Pending Review';
  } | null>(null);

  const [activeBuyerSub, setActiveBuyerSub] = useState<{
    isActive: boolean;
    validityEnd: string;
    category: string;
    budgetRange: string;
    locality: string;
  } | null>(null);

  // Contact unlocking state
  const [purchasedContactPacks, setPurchasedContactPacks] = useState<number>(0);
  const [matchedContacts, setMatchedContacts] = useState<MockMatchedContact[]>(INITIAL_CONTACTS);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [unlockProcessing, setUnlockProcessing] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  // Contacts horizontal scroll ref
  const contactsScrollRef = useRef<HTMLDivElement>(null);
  const handleScrollContacts = (direction: 'left' | 'right') => {
    if (contactsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      contactsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Owner Onboarding Modal State
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [ownerStep, setOwnerStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [ownerForm, setOwnerForm] = useState<Partial<OwnerListingInput>>({
    propertyType: 'sale',
    category: 'Residential',
    title: '',
    city: 'Mumbai',
    locality: '',
    expectedPrice: '',
    carpetArea: '',
    bedrooms: '2 BHK',
    kycDocType: 'Aadhaar Card',
    kycDocNumber: '',
    agreeTerms: true,
  });
  const [ownerErrors, setOwnerErrors] = useState<Record<string, string>>({});
  const [ownerUploadedPhotos, setOwnerUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
  ]);
  const [ownerPaymentProcessing, setOwnerPaymentProcessing] = useState(false);

  // Buyer Requirement Modal State
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [buyerStep, setBuyerStep] = useState<1 | 2 | 3>(1);
  const [buyerForm, setBuyerForm] = useState<Partial<BuyerRequirementInput>>({
    intent: 'buy',
    category: 'Residential',
    city: 'Mumbai',
    locality: '',
    budgetMin: '5000000',
    budgetMax: '25000000',
    possessionTimeframe: 'Ready to Move',
    agreeTerms: true,
  });
  const [buyerErrors, setBuyerErrors] = useState<Record<string, string>>({});
  const [buyerPaymentProcessing, setBuyerPaymentProcessing] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setActivePlanTab(initialPlan);
    }
  }, [initialPlan]);

  const revealedCount = matchedContacts.filter((c) => c.isUnlocked).length;
  const unlockQuota = calculateContactUnlockQuota(revealedCount, purchasedContactPacks);

  // Handler for Owner CTA
  const handleOwnerClick = () => {
    if (!isUserLoggedIn) {
      setPendingAction('owner');
      setLoginModalOpen(true);
      return;
    }
    setOwnerStep(1);
    setOwnerModalOpen(true);
  };

  // Handler for Buyer CTA
  const handleBuyerClick = () => {
    if (!isUserLoggedIn) {
      setPendingAction('buyer');
      setLoginModalOpen(true);
      return;
    }
    setBuyerStep(1);
    setBuyerModalOpen(true);
  };

  // Login Complete handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserLoggedIn(true);
    setLoginModalOpen(false);
    if (onSuccessToast) {
      onSuccessToast(`Logged in successfully as +91 ${userPhone}`);
    }
    if (pendingAction === 'owner') {
      setPendingAction(null);
      setOwnerStep(1);
      setOwnerModalOpen(true);
    } else if (pendingAction === 'buyer') {
      setPendingAction(null);
      setBuyerStep(1);
      setBuyerModalOpen(true);
    }
  };

  // Owner Next Step Validation
  const handleOwnerStepNext = () => {
    if (ownerStep === 1) {
      const validation = validateOwnerListingData({
        ...ownerForm,
        kycDocType: 'TemporaryBypass',
        kycDocNumber: 'TEMP',
      });
      const errors = { ...validation.errors };
      delete errors.kycDocType;
      delete errors.kycDocNumber;

      if (Object.keys(errors).length > 0) {
        setOwnerErrors(errors);
        return;
      }
      setOwnerErrors({});
      setOwnerStep(2);
    } else if (ownerStep === 2) {
      if (ownerUploadedPhotos.length === 0) {
        setOwnerErrors({ photos: 'Please upload or keep at least 1 property photo.' });
        return;
      }
      setOwnerErrors({});
      setOwnerStep(3);
    } else if (ownerStep === 3) {
      const validation = validateOwnerListingData(ownerForm);
      if (!validation.isValid) {
        setOwnerErrors(validation.errors);
        return;
      }
      setOwnerErrors({});
      setOwnerStep(4);
    }
  };

  // Owner Checkout Simulation
  const handleOwnerPayment = () => {
    setOwnerPaymentProcessing(true);
    setTimeout(() => {
      setOwnerPaymentProcessing(false);
      const validity = calculateSubscriptionValidity(new Date(), 3);
      setActiveOwnerSub({
        isActive: true,
        validityEnd: validity.formattedExpiry,
        listingTitle: ownerForm.title || 'Premium Property',
        category: ownerForm.category || 'Residential',
        city: ownerForm.city || 'Mumbai',
        price: formatINR(Number(ownerForm.expectedPrice) || 5000000),
        kycStatus: 'Verified',
      });
      setOwnerStep(5);
      if (onSuccessToast) {
        onSuccessToast('Owner Plan activated! ₹199 paid for 3 months.');
      }
    }, 1200);
  };

  // Buyer Requirement Submit
  const handleBuyerNext = () => {
    const validation = validateBuyerRequirementData(buyerForm);
    if (!validation.isValid) {
      setBuyerErrors(validation.errors);
      return;
    }
    setBuyerErrors({});
    setBuyerStep(2);
  };

  // Buyer Checkout Simulation
  const handleBuyerPayment = () => {
    setBuyerPaymentProcessing(true);
    setTimeout(() => {
      setBuyerPaymentProcessing(false);
      const validity = calculateSubscriptionValidity(new Date(), 3);
      setActiveBuyerSub({
        isActive: true,
        validityEnd: validity.formattedExpiry,
        category: buyerForm.category || 'Residential',
        budgetRange: `${formatINR(Number(buyerForm.budgetMin))} - ${formatINR(Number(buyerForm.budgetMax))}`,
        locality: `${buyerForm.locality}, ${buyerForm.city}`,
      });
      setBuyerStep(3);
      if (onSuccessToast) {
        onSuccessToast('Buyer / Tenant Plan activated! ₹49 paid for 3 months.');
      }
    }, 1200);
  };

  // Contact Unlock Payment Simulation (Separate ₹49 transaction)
  const handleConfirmUnlockPackPayment = () => {
    setUnlockProcessing(true);
    setTimeout(() => {
      setUnlockProcessing(false);
      setPurchasedContactPacks((prev) => prev + 1);
      
      // Auto-unlock up to 3 next locked contacts
      setMatchedContacts((prev) => {
        let unlockedSoFar = 0;
        return prev.map((item) => {
          if (!item.isUnlocked && unlockedSoFar < 3) {
            unlockedSoFar++;
            return { ...item, isUnlocked: true };
          }
          return item;
        });
      });

      setUnlockSuccess(true);
      if (onSuccessToast) {
        onSuccessToast('Unlocked 3 verified owner contacts! (₹49 separate purchase)');
      }
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#fcf9f8] text-[#1c1b1b] pb-24">
      
      {/* Hero Banner with User's Uploaded Luxury Villa Skyline Asset Clearly Visible */}
      <section className="relative overflow-hidden border-b border-stone-200 min-h-[380px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/Modern_Waterfront_Skyline_with_Luxury_Villa_5e15e7f1.png"
            alt="Modern Waterfront Skyline with Luxury Villa"
            className="w-full h-full object-cover object-center"
          />
          {/* Gentle translucent soft gradient so the waterfront villa, buildings, and water are distinctly and clearly seen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/45 to-[#fcf9f8]/95" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-20 text-center">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 text-[#5e23dc] text-xs font-black shadow-sm tracking-wide uppercase mb-3">
            <Sparkles className="w-4 h-4 text-[#fdb813] fill-[#fdb813]" />
            <span>Verified PropTech Subscription Plans</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight drop-shadow-xs">
            Choose Your Plan — Transparent & Direct
          </h1>
          
          <p className="mt-2.5 text-stone-700 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-xs">
            Whether you want to list your property or post your home requirement, enjoy 100% verified connections with zero brokerage surprises.
          </p>

          {/* Quick Filter Segmented Buttons */}
          <div className="mt-6 inline-flex p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-md">
            <button
              type="button"
              onClick={() => setActivePlanTab('owner')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activePlanTab === 'owner'
                  ? 'bg-[#5e23dc] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Owner Plan (₹199 / 3 Mo)</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlanTab('buyer')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activePlanTab === 'buyer'
                  ? 'bg-[#5e23dc] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#fdb813]" />
              <span>Buyer / Tenant Plan (₹49 Launch)</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">

        {/* Active Subscriptions Dashboard Bar (if activated) */}
        {(activeOwnerSub || activeBuyerSub) && (
          <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-emerald-200/80 shadow-lg shadow-emerald-500/5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      Active Subscriptions
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {activeOwnerSub && `Owner Plan: "${activeOwnerSub.listingTitle}" (${activeOwnerSub.category}) valid until ${activeOwnerSub.validityEnd}. `}
                    {activeBuyerSub && `Buyer Plan: Requirement in ${activeBuyerSub.locality} valid until ${activeBuyerSub.validityEnd}.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('search')}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
              >
                Explore Matches
              </button>
            </div>
          </div>
        )}

        {/* TWO LARGE BALANCED PRICING CARDS: Symmetrical, equal height, same purple theme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* PLAN A: OWNER PLAN (₹199 / 3 MONTHS)                      */}
          {/* ========================================================= */}
          <div
            className={`rounded-3xl bg-white border-2 border-[#5e23dc] transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 shadow-xl hover:shadow-2xl h-full ${
              activePlanTab === 'owner' ? 'ring-4 ring-[#5e23dc]/15 shadow-2xl' : ''
            }`}
          >
            <div>
              {/* Top Pill / Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5e23dc] text-xs font-extrabold uppercase tracking-wider border border-purple-200">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Plan A — Owner Choice</span>
                </div>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  90 Days Validity
                </span>
              </div>

              {/* Plan Header */}
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {SUBSCRIPTION_PLANS.owner.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                {SUBSCRIPTION_PLANS.owner.tagline}
              </p>

              {/* Price Tag */}
              <div className="mt-5 p-4 rounded-2xl bg-[#faf8fc] border border-purple-100 flex items-baseline justify-between min-h-[88px]">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-stone-950">₹199</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-500">/ 3 months</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5e23dc] block mt-0.5">
                    Equivalent to ~₹66 / month • Complete Property Listing
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-[#5e23dc] text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                    Full Suite
                  </span>
                </div>
              </div>

              {/* Feature Checklist (Categories removed, KYC & No Token added) */}
              <div className="mt-6 space-y-3.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block mb-1">
                  Features & Workflow:
                </label>
                {SUBSCRIPTION_PLANS.owner.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#5e23dc] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                type="button"
                onClick={handleOwnerClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.99]"
              >
                <span>Continue as Owner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  KYC Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Instant Activation
                </span>
                <span>•</span>
                <span>Zero Commission</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PLAN B: BUYER / TENANT PLAN (₹49 / 3 MONTHS)              */}
          {/* ========================================================= */}
          <div
            className={`rounded-3xl bg-white border-2 border-[#5e23dc] transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 shadow-xl hover:shadow-2xl h-full ${
              activePlanTab === 'buyer' ? 'ring-4 ring-[#5e23dc]/15 shadow-2xl' : ''
            }`}
          >
            <div>
              {/* Top Pill / Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5e23dc] text-xs font-extrabold uppercase tracking-wider border border-purple-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#5e23dc]" />
                  <span>Plan B — Buyer / Tenant Plan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#5e23dc] text-white text-[10px] font-black rounded uppercase tracking-wider">
                    Launch Offer
                  </span>
                  <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-lg">
                    90 Days
                  </span>
                </div>
              </div>

              {/* Plan Header */}
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {SUBSCRIPTION_PLANS.buyer.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                {SUBSCRIPTION_PLANS.buyer.tagline}
              </p>

              {/* Price Tag with Strikethrough & Launch Offer */}
              <div className="mt-5 p-4 rounded-2xl bg-[#faf8fc] border border-purple-100 flex items-baseline justify-between min-h-[88px]">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-stone-400 line-through">
                      ₹249
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-[#5e23dc]">₹49</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-500">/ 3 months</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5e23dc] block mt-0.5">
                    Launch Offer (Save ₹200) • Post Custom Requirements
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-[#5e23dc] text-[10px] font-extrabold">
                    80% OFF
                  </span>
                </div>
              </div>

              {/* Feature Checklist (Categories removed, KYC Mandatory added) */}
              <div className="mt-6 space-y-3.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block mb-1">
                  Features & Matching:
                </label>
                {SUBSCRIPTION_PLANS.buyer.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#5e23dc] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                type="button"
                onClick={handleBuyerClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.99]"
              >
                <span>Continue as Buyer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  KYC Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-stone-400" />
                  Unlock Contacts (₹49)
                </span>
                <span>•</span>
                <span>Zero Brokerage</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE CONTACT UNLOCKING WORKFLOW SHOWCASE (Plan B Feature Demonstration) */}
        {/* ========================================================================= */}
        <section className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-stone-900 text-white text-[10px] font-black uppercase tracking-wider">
                  Live Buyer Hub
                </span>
                <span className="text-xs font-bold text-stone-500">
                  Matches & Owner Contact Unlocking
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                Verified Owner Contacts Available
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Browse verified properties matching your criteria. Unlock 3 eligible owner contacts for ₹49.
              </p>
            </div>

            {/* Quota Counter Badge, Unlock Button & Right-to-Left Scroll Controls */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-stone-400 block">Unlocked Quota</span>
                <span className="text-sm font-black text-stone-900">
                  {revealedCount} / {unlockQuota.totalUnlockedQuota} Contacts
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUnlockSuccess(false);
                  setUnlockModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>
                  {purchasedContactPacks === 0
                    ? 'Unlock 3 Contacts for ₹49'
                    : 'Unlock Next 3 Contacts (₹49)'}
                </span>
              </button>

              {/* Horizontal Scroll Arrows (Right to Left / Left to Right) */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
                <button
                  type="button"
                  onClick={() => handleScrollContacts('left')}
                  className="w-9 h-9 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Scroll Left"
                  aria-label="Scroll contacts left"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-800" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollContacts('right')}
                  className="w-9 h-9 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Scroll Right"
                  aria-label="Scroll contacts right"
                >
                  <ChevronRight className="w-5 h-5 text-stone-800" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrolling Track of Matched Owners (Scrolls Right-to-Left smoothly) */}
          <div className="relative mt-6">
            <div 
              ref={contactsScrollRef}
              className="flex gap-4.5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-300"
            >
              {matchedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="min-w-[285px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-start p-4.5 rounded-2xl border border-stone-200/90 bg-stone-50/70 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">
                        {contact.category}
                      </span>
                      <span className="font-extrabold text-[#5e23dc]">{contact.price}</span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 line-clamp-1">
                      {contact.propertyTitle}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">{contact.location}</p>

                    <div className="mt-3.5 pt-3 border-t border-stone-200/60 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-700">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-stone-900">{contact.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium">Verified Property Owner</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Status & Action */}
                  <div className="mt-4 pt-3 border-t border-stone-200/60">
                    {contact.isUnlocked ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {contact.rawPhone}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase text-emerald-700">Unlocked</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`tel:${contact.rawPhone.replace(/\s+/g, '')}`}
                            className="py-1.5 px-2 rounded-lg bg-stone-900 text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 hover:bg-stone-800 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3" />
                            Call Owner
                          </a>
                          <a
                            href={`https://wa.me/919820144821?text=Hi%20${encodeURIComponent(contact.name)},%20I%20saw%20your%20property%20listing%20on%20Vindhya%20Reality`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 px-2 rounded-lg bg-[#25D366] text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 hover:bg-[#20ba59] transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                          <Lock className="w-3.5 h-3.5 text-stone-400" />
                          <span>+91 98••• •••••</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUnlockSuccess(false);
                            setUnlockModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Unlock (₹49)
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-14 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-stone-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Everything you need to know about our plans, payments, and contact unlocking.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <h4 className="font-bold text-sm text-stone-900">
                Are the ₹49 Buyer subscription and ₹49 contact-unlock separate charges?
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Yes, absolutely. The ₹49 subscription activates your buyer requirement on the platform for 3 full months. Unlocking verified owner contacts is a separate transaction of ₹49 for every 3 contacts. There are no automatic debits or misleading unlimited claims.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <h4 className="font-bold text-sm text-stone-900">
                What property categories can I list under the Owner Plan?
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                You can list properties across 6 categories: Residential apartments & villas, Commercial offices & shops, Land parcels, Residential plots, Farmhouses, and Builder Projects.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <h4 className="font-bold text-sm text-stone-900">
                How does the KYC verification workflow work?
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Owners submit their Aadhaar, PAN, Electricity Bill, or Index II document during onboarding. Our automated system checks credentials to mark the listing as 100% Verified, giving buyers higher confidence and preventing fraudulent brokers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <h4 className="font-bold text-sm text-stone-900">
                Can I edit my listing or requirement after paying?
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Yes! Your dashboard allows updating price, photos, description, or preferred contact timings anytime during the 90 days validity period.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: OWNER ONBOARDING WORKFLOW (5 STEPS: INFO, PHOTOS, KYC, PAY, LIVE) */}
      {/* ========================================================================= */}
      {ownerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setOwnerModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5e23dc]">
                  Owner Onboarding (₹199 / 3 Months)
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-0.5">
                  {ownerStep === 1 && 'Step 1 of 4: Property Details'}
                  {ownerStep === 2 && 'Step 2 of 4: Upload Property Photos'}
                  {ownerStep === 3 && 'Step 3 of 4: KYC Verification'}
                  {ownerStep === 4 && 'Step 4 of 4: Review & Payment Checkout'}
                  {ownerStep === 5 && 'Subscription Activated!'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOwnerModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Property Info & Category */}
            {ownerStep === 1 && (
              <div className="mt-4 space-y-4">
                {/* Intent: Sale / Rent / Lease */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Listing Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sale', 'rent', 'lease'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOwnerForm({ ...ownerForm, propertyType: type })}
                        className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all cursor-pointer ${
                          ownerForm.propertyType === type
                            ? 'bg-[#5e23dc] text-white border-[#5e23dc]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        For {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category: 6 Options */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Property Category
                  </label>
                  <select
                    value={ownerForm.category}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, category: e.target.value as PropertyCategory })
                    }
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                  >
                    {OWNER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Property Title / Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury 3 BHK Skyline Apartment with Sea View"
                    value={ownerForm.title || ''}
                    onChange={(e) => setOwnerForm({ ...ownerForm, title: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                  />
                  {ownerErrors.title && (
                    <p className="text-[11px] text-rose-600 mt-1">{ownerErrors.title}</p>
                  )}
                </div>

                {/* Location City & Locality */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={ownerForm.city || ''}
                      onChange={(e) => setOwnerForm({ ...ownerForm, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Worli Sea Face"
                      value={ownerForm.locality || ''}
                      onChange={(e) => setOwnerForm({ ...ownerForm, locality: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                </div>
                {ownerErrors.locality && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{ownerErrors.locality}</p>
                )}

                {/* Expected Price & Carpet Area */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Expected Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45000000"
                      value={ownerForm.expectedPrice || ''}
                      onChange={(e) => setOwnerForm({ ...ownerForm, expectedPrice: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Carpet Area (sq.ft)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1450"
                      value={ownerForm.carpetArea || ''}
                      onChange={(e) => setOwnerForm({ ...ownerForm, carpetArea: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOwnerStepNext}
                  className="w-full mt-4 py-3 rounded-xl bg-[#5e23dc] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d1bb9] cursor-pointer"
                >
                  Continue to Photo Upload →
                </button>
              </div>
            )}

            {/* STEP 2: Photos */}
            {ownerStep === 2 && (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-stone-600">
                  Upload crisp photos of living room, bedrooms, kitchen and view to get 3x higher inquiries.
                </p>

                {/* Photo Gallery Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {ownerUploadedPhotos.map((url, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-stone-200 group h-28">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setOwnerUploadedPhotos(ownerUploadedPhotos.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full p-1 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setOwnerUploadedPhotos([
                        ...ownerUploadedPhotos,
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
                      ])
                    }
                    className="h-28 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#5e23dc] flex flex-col items-center justify-center text-stone-500 hover:text-[#5e23dc] bg-stone-50 cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-bold">+ Add Photo</span>
                  </button>
                </div>

                {ownerErrors.photos && (
                  <p className="text-[11px] text-rose-600">{ownerErrors.photos}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOwnerStep(1)}
                    className="w-1/3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleOwnerStepNext}
                    className="w-2/3 py-2.5 rounded-xl bg-[#5e23dc] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d1bb9]"
                  >
                    Continue to KYC →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: KYC Document Verification Workflow */}
            {ownerStep === 3 && (
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#5e23dc] shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-900 leading-relaxed">
                    <strong>KYC Protection:</strong> As per real estate regulations, verify that you are the rightful owner or authorized representative before listing.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Select Document Type
                  </label>
                  <select
                    value={ownerForm.kycDocType}
                    onChange={(e) => setOwnerForm({ ...ownerForm, kycDocType: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Electricity Bill">Recent Electricity / Water Utility Bill</option>
                    <option value="Index II / Sale Deed">Registered Index II / Sale Deed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Document Number / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5420 8912 3410 or PAN No."
                    value={ownerForm.kycDocNumber || ''}
                    onChange={(e) => setOwnerForm({ ...ownerForm, kycDocNumber: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                  />
                  {ownerErrors.kycDocNumber && (
                    <p className="text-[11px] text-rose-600 mt-1">{ownerErrors.kycDocNumber}</p>
                  )}
                </div>

                <div className="p-3 border border-dashed border-stone-300 rounded-xl bg-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">kyc_document_proof.pdf</span>
                      <span className="text-[10px] text-stone-500">Ready for automated verification</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Attached
                  </span>
                </div>

                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={ownerForm.agreeTerms || false}
                    onChange={(e) => setOwnerForm({ ...ownerForm, agreeTerms: e.target.checked })}
                    className="mt-1 accent-[#5e23dc]"
                  />
                  <span className="text-xs text-stone-600">
                    I confirm that I am the genuine owner/authorized representative and agree to Vindhya Reality's Terms of Listing.
                  </span>
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOwnerStep(2)}
                    className="w-1/3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleOwnerStepNext}
                    className="w-2/3 py-2.5 rounded-xl bg-[#5e23dc] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d1bb9]"
                  >
                    Proceed to Payment Checkout →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Price & Payment Checkout */}
            {ownerStep === 4 && (
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Selected Plan</span>
                    <span className="font-bold text-stone-900">Owner Plan</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Validity Period</span>
                    <span className="font-bold text-stone-900">3 Months (90 Days)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Property Category</span>
                    <span className="font-bold text-stone-900">{ownerForm.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">KYC Status</span>
                    <span className="font-bold text-emerald-700">Pre-Verified</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                    <span className="font-extrabold text-stone-900">Total Amount Payable</span>
                    <span className="font-black text-xl text-[#5e23dc]">₹199</span>
                  </div>
                </div>

                {/* Simulated Payment Methods */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Pay via UPI / Card / NetBanking
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-stone-700">
                    <div className="p-2 rounded-xl border-2 border-[#5e23dc] bg-purple-50 text-[#5e23dc]">
                      Google Pay / UPI
                    </div>
                    <div className="p-2 rounded-xl border border-stone-200 bg-stone-50">
                      Credit / Debit Card
                    </div>
                    <div className="p-2 rounded-xl border border-stone-200 bg-stone-50">
                      Net Banking
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOwnerStep(3)}
                    disabled={ownerPaymentProcessing}
                    className="w-1/3 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleOwnerPayment}
                    disabled={ownerPaymentProcessing}
                    className="w-2/3 py-3 rounded-xl bg-[#5e23dc] text-white font-black text-xs uppercase tracking-wider hover:bg-[#4d1bb9] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {ownerPaymentProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹199 & Publish Listing</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Success & Live Activation State */}
            {ownerStep === 5 && (
              <div className="mt-4 text-center space-y-4 py-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-stone-900">
                    Owner Subscription Active!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                    Your property "{ownerForm.title}" is now published and approved. It will remain active for 3 months until{' '}
                    <span className="font-bold text-stone-900">{activeOwnerSub?.validityEnd}</span>.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Listing ID:</span>
                    <span className="font-mono font-bold text-stone-900">PROP-OWNER-7894</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Approval Status:</span>
                    <span className="font-bold text-emerald-700">Approved & Live</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">KYC Badge:</span>
                    <span className="font-bold text-[#5e23dc]">100% Verified Owner</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOwnerModalOpen(false);
                    onNavigate('search');
                  }}
                  className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
                >
                  View Listings & Buyer Enquiries
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUYER / TENANT REQUIREMENT FORM & CHECKOUT (3 STEPS)             */}
      {/* ========================================================================= */}
      {buyerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setBuyerModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5e23dc]">
                  Buyer / Tenant Plan (₹49 / 3 Months)
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-0.5">
                  {buyerStep === 1 && 'Post Your Requirement'}
                  {buyerStep === 2 && 'Review Plan & Pay ₹49'}
                  {buyerStep === 3 && 'Requirement Activated!'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBuyerModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Requirement Criteria */}
            {buyerStep === 1 && (
              <div className="mt-4 space-y-4">
                {/* Intent: Buy or Rent */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBuyerForm({ ...buyerForm, intent: 'buy' })}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        buyerForm.intent === 'buy'
                          ? 'bg-[#5e23dc] text-white border-[#5e23dc]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Buy Property
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuyerForm({ ...buyerForm, intent: 'rent' })}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        buyerForm.intent === 'rent'
                          ? 'bg-[#5e23dc] text-white border-[#5e23dc]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Rent / Lease
                    </button>
                  </div>
                </div>

                {/* Category: 4 options */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Property Category
                  </label>
                  <select
                    value={buyerForm.category}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, category: e.target.value as BuyerPropertyCategory })
                    }
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                  >
                    {BUYER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={buyerForm.city || ''}
                      onChange={(e) => setBuyerForm({ ...buyerForm, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Bandra West / BKC"
                      value={buyerForm.locality || ''}
                      onChange={(e) => setBuyerForm({ ...buyerForm, locality: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                </div>
                {buyerErrors.locality && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{buyerErrors.locality}</p>
                )}

                {/* Budget Range Min - Max */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Min Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="5000000"
                      value={buyerForm.budgetMin || ''}
                      onChange={(e) => setBuyerForm({ ...buyerForm, budgetMin: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Max Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="25000000"
                      value={buyerForm.budgetMax || ''}
                      onChange={(e) => setBuyerForm({ ...buyerForm, budgetMax: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                    />
                  </div>
                </div>
                {buyerErrors.budgetMax && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{buyerErrors.budgetMax}</p>
                )}

                {/* Possession */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Preferred Possession
                  </label>
                  <select
                    value={buyerForm.possessionTimeframe}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, possessionTimeframe: e.target.value })
                    }
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc]"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Within 3 Months">Within 3 Months</option>
                    <option value="Within 6 Months">Within 6 Months</option>
                    <option value="Under Construction">Under Construction (1-2 Years)</option>
                  </select>
                </div>

                {/* Pricing Disclaimer Acknowledgement */}
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <Info className="w-3.5 h-3.5 text-[#5e23dc]" />
                    <span>Transaction Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-purple-800">
                    This ₹49 transaction activates your 3-month buyer requirement. Contact unlocks are separate transactions (3 contacts for ₹49).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBuyerNext}
                  className="w-full mt-4 py-3 rounded-xl bg-[#5e23dc] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d1bb9] cursor-pointer"
                >
                  Continue to Checkout →
                </button>
              </div>
            )}

            {/* STEP 2: Checkout & Payment */}
            {buyerStep === 2 && (
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Plan</span>
                    <span className="font-bold text-stone-900">Buyer / Tenant Plan</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Regular Price</span>
                    <span className="font-bold text-stone-400 line-through">₹249</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Launch Discount</span>
                    <span className="font-bold text-emerald-700">-₹200 (80% Off)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Validity</span>
                    <span className="font-bold text-stone-900">3 Months (90 Days)</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                    <span className="font-extrabold text-stone-900">Amount to Pay</span>
                    <span className="font-black text-xl text-[#5e23dc]">₹49</span>
                  </div>
                </div>

                {/* Simulated Payment */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Pay via UPI / Wallet
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-stone-700">
                    <div className="p-2 rounded-xl border-2 border-[#5e23dc] bg-purple-50 text-[#5e23dc]">
                      UPI / GPay / PhonePe
                    </div>
                    <div className="p-2 rounded-xl border border-stone-200 bg-stone-50">
                      Card
                    </div>
                    <div className="p-2 rounded-xl border border-stone-200 bg-stone-50">
                      Paytm
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBuyerStep(1)}
                    disabled={buyerPaymentProcessing}
                    className="w-1/3 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyerPayment}
                    disabled={buyerPaymentProcessing}
                    className="w-2/3 py-3 rounded-xl bg-[#5e23dc] text-white font-black text-xs uppercase tracking-wider hover:bg-[#4d1bb9] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {buyerPaymentProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹49 & Activate Plan</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Success State */}
            {buyerStep === 3 && (
              <div className="mt-4 text-center space-y-4 py-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-stone-900">
                    Buyer Requirement Activated!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                    Your {buyerForm.category} requirement in {buyerForm.locality}, {buyerForm.city} is live for 3 months until{' '}
                    <span className="font-bold text-stone-900">{activeBuyerSub?.validityEnd}</span>.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Requirement ID:</span>
                    <span className="font-mono font-bold text-stone-900">REQ-BUYER-3042</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Matching Status:</span>
                    <span className="font-bold text-emerald-700">6 Verified Matches Found</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBuyerModalOpen(false);
                    // scroll to matched section
                    window.scrollTo({ top: 800, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
                >
                  View Matched Owners & Unlock Contacts
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONTACT UNLOCK CHECKOUT (SEPARATE ₹49 TRANSACTION FOR 3 CONTACTS) */}
      {/* ========================================================================= */}
      {unlockModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setUnlockModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5e23dc] flex items-center justify-center font-bold">
                  <Unlock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">Unlock Owner Contacts</h3>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Separate Transaction
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnlockModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {!unlockSuccess ? (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Contact Pack Size</span>
                    <span className="font-bold text-stone-900">3 Eligible Owner Contacts</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Direct WhatsApp & Phone</span>
                    <span className="font-bold text-emerald-700">Included</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                    <span className="font-extrabold text-stone-900">Pack Amount</span>
                    <span className="font-black text-xl text-[#5e23dc]">₹49</span>
                  </div>
                </div>

                {/* Explicit Explanation */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-extrabold block text-amber-950 mb-0.5">
                    Clear Pricing Terms:
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    This ₹49 purchase unlocks 3 verified owner contacts. If you wish to unlock an additional 3 contacts later, another ₹49 transaction will apply. Contacts are not unlimited.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmUnlockPackPayment}
                  disabled={unlockProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#5e23dc] text-white font-black text-xs uppercase tracking-wider hover:bg-[#4d1bb9] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {unlockProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying ₹49 Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹49 & Unlock 3 Contacts</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-4 text-center space-y-4 py-2 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-stone-900">
                    Contacts Unlocked Successfully!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    3 owner phone numbers and direct WhatsApp links are now unmasked on your screen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUnlockModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
                >
                  View Unlocked Contacts
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: LOGIN / REGISTRATION GATEWAY (PRESERVING INTENT)                 */}
      {/* ========================================================================= */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setLoginModalOpen(false)}
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
                <span className="font-extrabold text-stone-900 text-base">
                  Sign In to Continue
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-stone-600">
                Please verify your phone number to proceed with the{' '}
                <strong className="text-stone-900">
                  {pendingAction === 'owner' ? 'Owner Plan (₹199)' : 'Buyer / Tenant Plan (₹49)'}
                </strong>
                .
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
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full text-sm text-stone-900 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Verify & Continue to Plan
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

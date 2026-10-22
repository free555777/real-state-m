/**
 * Pure business rules, validations, and pricing calculations
 * for PropTech Horizon Subscription and Contact Unlocking system.
 */

export type PropertyCategory = 
  | 'Residential' 
  | 'Commercial' 
  | 'Land' 
  | 'Plot' 
  | 'Farmhouse' 
  | 'Builder Project';

export type BuyerPropertyCategory = 
  | 'Residential' 
  | 'Commercial' 
  | 'Land' 
  | 'Plot';

export interface PlanConfig {
  id: 'owner' | 'buyer';
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  durationMonths: number;
  badge?: string;
  categories: readonly string[];
  features: string[];
  pricingClarification?: string;
}

export const OWNER_CATEGORIES: readonly PropertyCategory[] = [
  'Residential',
  'Commercial',
  'Land',
  'Plot',
  'Farmhouse',
  'Builder Project',
];

export const BUYER_CATEGORIES: readonly BuyerPropertyCategory[] = [
  'Residential',
  'Commercial',
  'Land',
  'Plot',
];

export const SUBSCRIPTION_PLANS: Record<'owner' | 'buyer', PlanConfig> = {
  owner: {
    id: 'owner',
    name: 'Owner Plan',
    tagline: 'List your property for sale, rent or lease.',
    price: 199,
    durationMonths: 3,
    categories: OWNER_CATEGORIES,
    features: [
      'Post a property listing across all 6 verified categories',
      'Upload high-resolution property photos, floor plans & details',
      'Select property type, configuration, and exact locality',
      'Edit, manage, and boost listing visibility anytime',
      'KYC: PAN/Aadhaar + Address Mandatory',
      'No Token - No Visiting',
      'Real-time listing status, enquiry alerts & 90-day validity',
    ],
  },
  buyer: {
    id: 'buyer',
    name: 'Buyer / Tenant Plan',
    tagline: 'Post your requirement and discover properties that match your needs.',
    price: 49,
    originalPrice: 249,
    durationMonths: 3,
    badge: 'Launch Offer',
    categories: BUYER_CATEGORIES,
    features: [
      'Post buy or rent requirements with custom budget & locality',
      'Select preferred location, radius, and possession timeframe',
      'Edit, pause, and manage requirements anytime',
      'KYC: PAN/Aadhaar + Address Mandatory',
      'Instant AI matching with relevant verified property listings',
      'Unlock 3 eligible owner contacts for ₹49',
      'Unlock an additional 3 eligible contacts for another ₹49',
    ],
    pricingClarification:
      'Important Pricing Clarification: The ₹49 subscription/requirement plan and ₹49 contact-unlock purchase are separate transactions. 3 eligible owner contacts can be unlocked for ₹49, and additional 3 contacts cost another ₹49. Contact access is capped per pack and never unlimited.',
  },
};

/**
 * Calculates end expiry date and days remaining given a start date and duration.
 */
export function calculateSubscriptionValidity(startDate: Date, durationMonths: number = 3) {
  const expiry = new Date(startDate);
  expiry.setMonth(expiry.getMonth() + durationMonths);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  
  const formattedExpiry = expiry.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    startDate,
    expiryDate: expiry,
    daysRemaining,
    formattedExpiry,
  };
}

/**
 * Validates owner property listing onboarding form
 */
export interface OwnerListingInput {
  propertyType: 'sale' | 'rent' | 'lease';
  category: PropertyCategory | '';
  title: string;
  city: string;
  locality: string;
  expectedPrice: number | string;
  carpetArea: number | string;
  bedrooms?: string;
  kycDocType: string;
  kycDocNumber: string;
  agreeTerms: boolean;
}

export function validateOwnerListingData(data: Partial<OwnerListingInput>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.category || !OWNER_CATEGORIES.includes(data.category as PropertyCategory)) {
    errors.category = 'Please select a valid property category.';
  }

  if (!data.propertyType) {
    errors.propertyType = 'Please select whether this is for sale, rent, or lease.';
  }

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Please enter a valid city.';
  }

  if (!data.locality || data.locality.trim().length < 2) {
    errors.locality = 'Please enter a valid locality/neighborhood.';
  }

  const priceNum = Number(data.expectedPrice);
  if (!data.expectedPrice || isNaN(priceNum) || priceNum <= 0) {
    errors.expectedPrice = 'Please enter a valid expected price/rent.';
  }

  const areaNum = Number(data.carpetArea);
  if (!data.carpetArea || isNaN(areaNum) || areaNum <= 0) {
    errors.carpetArea = 'Please enter a valid carpet/plot area in sq.ft.';
  }

  if (!data.kycDocType) {
    errors.kycDocType = 'Please select a KYC document type (Aadhaar, PAN, Electricity Bill, or Index II).';
  }

  if (!data.kycDocNumber || data.kycDocNumber.trim().length < 4) {
    errors.kycDocNumber = 'Please enter a valid KYC document reference number.';
  }

  if (!data.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms and declaration.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates buyer requirement form
 */
export interface BuyerRequirementInput {
  intent: 'buy' | 'rent';
  category: BuyerPropertyCategory | '';
  city: string;
  locality: string;
  budgetMin: number | string;
  budgetMax: number | string;
  possessionTimeframe: string;
  agreeTerms: boolean;
}

export function validateBuyerRequirementData(data: Partial<BuyerRequirementInput>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.intent) {
    errors.intent = 'Please specify if you want to Buy or Rent.';
  }

  if (!data.category || !BUYER_CATEGORIES.includes(data.category as BuyerPropertyCategory)) {
    errors.category = 'Please select a property category (Residential, Commercial, Land, Plot).';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Please enter your preferred city.';
  }

  if (!data.locality || data.locality.trim().length < 2) {
    errors.locality = 'Please enter your preferred locality.';
  }

  const min = Number(data.budgetMin);
  const max = Number(data.budgetMax);

  if (isNaN(min) || min < 0) {
    errors.budgetMin = 'Please enter a valid minimum budget.';
  }

  if (isNaN(max) || max <= 0) {
    errors.budgetMax = 'Please enter a valid maximum budget.';
  } else if (!isNaN(min) && max < min) {
    errors.budgetMax = 'Maximum budget cannot be less than minimum budget.';
  }

  if (!data.agreeTerms) {
    errors.agreeTerms = 'You must acknowledge the requirement terms and unlock policy.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Contact unlocking calculation
 * - 1 pack = 3 contacts for ₹49
 * - Each additional pack = 3 contacts for ₹49
 * - Tracks packs purchased, contacts revealed, and cost for next pack
 */
export function calculateContactUnlockQuota(revealedCount: number, purchasedPacks: number) {
  const contactsPerPack = 3;
  const costPerPack = 49;
  const totalUnlockedQuota = purchasedPacks * contactsPerPack;
  const remainingAllowance = Math.max(0, totalUnlockedQuota - revealedCount);

  return {
    purchasedPacks,
    contactsPerPack,
    costPerPack,
    totalUnlockedQuota,
    revealedCount,
    remainingAllowance,
    costForNextPack: costPerPack,
    canRevealMore: remainingAllowance > 0,
    needsNewPack: remainingAllowance === 0,
  };
}

/**
 * Format currency in Indian numbering format: e.g. ₹199, ₹49, ₹25,000, ₹1.5 Cr
 */
export function formatINR(val: number): string {
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `₹${cr} Cr`;
  }
  if (val >= 100000) {
    const l = (val / 100000).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `₹${l} L`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}
